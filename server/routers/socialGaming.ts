/**
 * Social Gaming Router — Multiplayer games, tournaments, esports, play-to-earn
 * Inspired by Discord Activities, Steam, Roblox patterns
 */
import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const socialGamingRouter = router({
  getGames: protectedProcedure.query(async () => ({
    featured: [
      { id: "game_1", name: "Crypto Trader Tycoon", type: "strategy", players: 12345, rating: 4.8, rewards: "SKY tokens", thumbnail: "/games/trader.jpg" },
      { id: "game_2", name: "Shadow Arena", type: "battle_royale", players: 8901, rating: 4.7, rewards: "NFT weapons", thumbnail: "/games/arena.jpg" },
      { id: "game_3", name: "DeFi Kingdom Builder", type: "simulation", players: 5678, rating: 4.6, rewards: "SHADOW tokens", thumbnail: "/games/kingdom.jpg" },
      { id: "game_4", name: "AI Chess Master", type: "board", players: 3456, rating: 4.9, rewards: "XP + badges", thumbnail: "/games/chess.jpg" },
      { id: "game_5", name: "Hack The Planet", type: "puzzle", players: 2345, rating: 4.5, rewards: "Security badges", thumbnail: "/games/hack.jpg" },
      { id: "game_6", name: "NFT Card Battles", type: "card_game", players: 6789, rating: 4.7, rewards: "Rare NFT cards", thumbnail: "/games/cards.jpg" },
    ],
    categories: ["Strategy", "Battle Royale", "Simulation", "Board", "Puzzle", "Card Games", "Racing", "RPG"],
    stats: { totalPlayers: 45678, gamesPlayed: 1234567, totalRewards: 890123, activeGames: 24 },
  })),
  getMyStats: protectedProcedure.query(async () => ({
    level: 45, xp: 234567, rank: "Diamond", wins: 234, losses: 89, winRate: 72.4,
    earnings: { total: 12345, thisMonth: 2345, tokens: { SKY: 5678, SHADOW: 3456, NFTs: 12 } },
    achievements: [
      { id: "ach_1", name: "First Blood", description: "Win your first game", earned: true },
      { id: "ach_2", name: "Crypto Whale", description: "Earn 10,000 tokens from gaming", earned: true },
      { id: "ach_3", name: "Tournament Champion", description: "Win a tournament", earned: false, progress: 2, target: 1 },
    ],
    recentGames: [
      { game: "Crypto Trader Tycoon", result: "win", reward: 234, date: new Date(Date.now() - 3600000) },
      { game: "Shadow Arena", result: "loss", reward: 12, date: new Date(Date.now() - 7200000) },
      { game: "AI Chess Master", result: "win", reward: 89, date: new Date(Date.now() - 10800000) },
    ],
  })),
  getTournaments: protectedProcedure.query(async () => ({
    live: [
      { id: "tourn_1", game: "Crypto Trader Tycoon", name: "Weekly Championship", prizePool: 50000, participants: 256, myRank: 12, endsAt: new Date(Date.now() + 86400000) },
      { id: "tourn_2", game: "Shadow Arena", name: "Battle Royale Finals", prizePool: 25000, participants: 100, myRank: 5, endsAt: new Date(Date.now() + 43200000) },
    ],
    upcoming: [
      { id: "tourn_3", game: "NFT Card Battles", name: "Grand Prix", prizePool: 100000, maxParticipants: 512, startsAt: new Date(Date.now() + 604800000), entryFee: 100 },
    ],
  })),
  joinGame: protectedProcedure
    .input(z.object({ gameId: z.string(), mode: z.enum(["solo", "duo", "squad"]).default("solo") }))
    .mutation(async ({ input }) => ({
      success: true, sessionId: `session_${Date.now()}`, gameId: input.gameId, mode: input.mode,
      matchId: `match_${Date.now()}`, estimatedWait: 5, players: input.mode === "solo" ? 1 : input.mode === "duo" ? 2 : 4,
    })),
});
