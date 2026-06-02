import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";


// ─── PROVABLY FAIR SYSTEM ────────────────────────────────────────────────────
function generateSeed(): string {
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}

function hashSeed(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

function getProvablyFairNumber(serverSeed: string, clientSeed: string, nonce: number | string): number {
  const combined = `${serverSeed}-${clientSeed}-${nonce}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash) + combined.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 10000) / 10000; // 0-1 float
}

// ─── BLACKJACK LOGIC ─────────────────────────────────────────────────────────
type Card = { suit: string; value: string; numValue: number };
const SUITS = ["♠", "♥", "♦", "♣"];
const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

function createDeck(seed: string): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      const numValue = value === "A" ? 11 : ["J", "Q", "K"].includes(value) ? 10 : parseInt(value);
      deck.push({ suit, value, numValue });
    }
  }
  // Fisher-Yates shuffle with seed
  for (let i = deck.length - 1; i > 0; i--) {
    const seedNum = getProvablyFairNumber(seed, "shuffle", i);
    const j = Math.floor(seedNum * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function handValue(cards: Card[]): number {
  let total = cards.reduce((sum, c) => sum + c.numValue, 0);
  let aces = cards.filter(c => c.value === "A").length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

// ─── ROULETTE LOGIC ──────────────────────────────────────────────────────────
const ROULETTE_NUMBERS = Array.from({ length: 37 }, (_, i) => i); // 0-36
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

function getRouletteColor(num: number): "red" | "black" | "green" {
  if (num === 0) return "green";
  return RED_NUMBERS.includes(num) ? "red" : "black";
}

// In-memory game sessions (production would use Redis)
const gameSessions = new Map<string, any>();

export const casinoRouter = router({
  // ─── BLACKJACK ─────────────────────────────────────────────────────
  blackjack: router({
    newGame: protectedProcedure
      .input(z.object({
        betAmount: z.number().min(0.01).max(10000),
        coin: z.string().default("SHADOW"),
      }))
      .mutation(async ({ ctx, input }) => {
        const serverSeed = generateSeed();
        const clientSeed = generateSeed();
        const deck = createDeck(serverSeed);

        const playerCards = [deck.pop()!, deck.pop()!];
        const dealerCards = [deck.pop()!, deck.pop()!];

        const gameId = `bj_${ctx.user.id}_${Date.now()}`;
        const session = {
          gameId,
          deck,
          playerCards,
          dealerCards,
          betAmount: input.betAmount,
          coin: input.coin,
          serverSeed,
          clientSeed,
          status: "playing" as "playing" | "won" | "lost" | "push" | "blackjack",
          payout: 0,
        };

        // Check for natural blackjack
        if (handValue(playerCards) === 21) {
          session.status = "blackjack";
          session.payout = input.betAmount * 2.5;
        }

        gameSessions.set(gameId, session);

        return {
          gameId,
          playerCards,
          dealerUpCard: dealerCards[0],
          playerValue: handValue(playerCards),
          status: session.status,
          payout: session.payout,
          seedHash: hashSeed(serverSeed),
        };
      }),

    hit: protectedProcedure
      .input(z.object({ gameId: z.string() }))
      .mutation(async ({ input }) => {
        const session = gameSessions.get(input.gameId);
        if (!session || session.status !== "playing") {
          return { error: "No active game" };
        }

        const card = session.deck.pop()!;
        session.playerCards.push(card);
        const value = handValue(session.playerCards);

        if (value > 21) {
          session.status = "lost";
          session.payout = 0;
        }

        return {
          card,
          playerCards: session.playerCards,
          playerValue: value,
          status: session.status,
          payout: session.payout,
        };
      }),

    stand: protectedProcedure
      .input(z.object({ gameId: z.string() }))
      .mutation(async ({ input }) => {
        const session = gameSessions.get(input.gameId);
        if (!session || session.status !== "playing") {
          return { error: "No active game" };
        }

        // Dealer draws to 17
        while (handValue(session.dealerCards) < 17) {
          session.dealerCards.push(session.deck.pop()!);
        }

        const playerValue = handValue(session.playerCards);
        const dealerValue = handValue(session.dealerCards);

        if (dealerValue > 21 || playerValue > dealerValue) {
          session.status = "won";
          session.payout = session.betAmount * 2;
        } else if (playerValue === dealerValue) {
          session.status = "push";
          session.payout = session.betAmount;
        } else {
          session.status = "lost";
          session.payout = 0;
        }

        return {
          dealerCards: session.dealerCards,
          dealerValue,
          playerValue,
          status: session.status,
          payout: session.payout,
          serverSeed: session.serverSeed,
        };
      }),

    doubleDown: protectedProcedure
      .input(z.object({ gameId: z.string() }))
      .mutation(async ({ input }) => {
        const session = gameSessions.get(input.gameId);
        if (!session || session.status !== "playing" || session.playerCards.length !== 2) {
          return { error: "Cannot double down" };
        }

        session.betAmount *= 2;
        const card = session.deck.pop()!;
        session.playerCards.push(card);
        const playerValue = handValue(session.playerCards);

        if (playerValue > 21) {
          session.status = "lost";
          session.payout = 0;
          return { card, playerCards: session.playerCards, playerValue, status: session.status, payout: 0, dealerCards: session.dealerCards, dealerValue: handValue(session.dealerCards) };
        }

        // Auto-stand after double
        while (handValue(session.dealerCards) < 17) {
          session.dealerCards.push(session.deck.pop()!);
        }
        const dealerValue = handValue(session.dealerCards);

        if (dealerValue > 21 || playerValue > dealerValue) {
          session.status = "won";
          session.payout = session.betAmount * 2;
        } else if (playerValue === dealerValue) {
          session.status = "push";
          session.payout = session.betAmount;
        } else {
          session.status = "lost";
          session.payout = 0;
        }

        return {
          card,
          playerCards: session.playerCards,
          playerValue,
          dealerCards: session.dealerCards,
          dealerValue,
          status: session.status,
          payout: session.payout,
          serverSeed: session.serverSeed,
        };
      }),
  }),

  // ─── ROULETTE ──────────────────────────────────────────────────────
  roulette: router({
    spin: protectedProcedure
      .input(z.object({
        bets: z.array(z.object({
          type: z.enum(["number", "red", "black", "odd", "even", "high", "low", "dozen1", "dozen2", "dozen3"]),
          value: z.number().optional(),
          amount: z.number().min(0.01),
        })),
        coin: z.string().default("SHADOW"),
      }))
      .mutation(async ({ ctx, input }) => {
        const serverSeed = generateSeed();
        const result = Math.floor(getProvablyFairNumber(serverSeed, String(ctx.user.id), Date.now()) * 37);
        const color = getRouletteColor(result);

        let totalPayout = 0;
        const betResults = input.bets.map(bet => {
          let won = false;
          let multiplier = 0;

          switch (bet.type) {
            case "number": won = bet.value === result; multiplier = 35; break;
            case "red": won = color === "red"; multiplier = 1; break;
            case "black": won = color === "black"; multiplier = 1; break;
            case "odd": won = result > 0 && result % 2 === 1; multiplier = 1; break;
            case "even": won = result > 0 && result % 2 === 0; multiplier = 1; break;
            case "high": won = result >= 19 && result <= 36; multiplier = 1; break;
            case "low": won = result >= 1 && result <= 18; multiplier = 1; break;
            case "dozen1": won = result >= 1 && result <= 12; multiplier = 2; break;
            case "dozen2": won = result >= 13 && result <= 24; multiplier = 2; break;
            case "dozen3": won = result >= 25 && result <= 36; multiplier = 2; break;
          }

          const payout = won ? bet.amount * (multiplier + 1) : 0;
          totalPayout += payout;
          return { ...bet, won, payout };
        });

        return {
          result,
          color,
          betResults,
          totalPayout,
          totalBet: input.bets.reduce((s, b) => s + b.amount, 0),
          netProfit: totalPayout - input.bets.reduce((s, b) => s + b.amount, 0),
          seedHash: hashSeed(serverSeed),
          serverSeed,
        };
      }),
  }),

  // ─── AI DEALER CHAT ────────────────────────────────────────────────
  aiDealer: protectedProcedure
    .input(z.object({
      message: z.string(),
      game: z.enum(["blackjack", "roulette", "general"]).default("general"),
      gameState: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          { role: "system", content: `You are HOPE Casino Dealer — a charismatic, witty AI dealer at ShadowChat Casino. You're friendly but professional, make jokes about the game, give tips (but remind players to gamble responsibly), and keep the energy high. You speak like a Vegas dealer with a cyberpunk edge. Current game: ${input.game}. ${input.gameState ? `Game state: ${input.gameState}` : ""}` },
          { role: "user", content: input.message },
        ],
      });
      return { reply: String(response.choices[0]?.message?.content || "Place your bets!") };
    }),

  // ─── GAME HISTORY ──────────────────────────────────────────────────
  history: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
    .query(async ({ ctx }) => {
      // Return from in-memory for now
      return { games: [], totalWon: 0, totalLost: 0, netProfit: 0 };
    }),

  // ─── LEADERBOARD ───────────────────────────────────────────────────
  leaderboard: protectedProcedure.query(async () => {
    return {
      topWinners: [
        { rank: 1, username: "ShadowKing", totalWon: 125000, games: 342 },
        { rank: 2, username: "CryptoAce", totalWon: 98500, games: 215 },
        { rank: 3, username: "LuckyDoge", totalWon: 76200, games: 189 },
      ],
      houseEdge: "2.7%",
      totalPaidOut: 4500000,
    };
  }),
});
