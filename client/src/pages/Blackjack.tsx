/**
 * ShadowChat Ultimate — Blackjack Dealer AI
 * Full blackjack game logic, 25 AI dealer personas,
 * SKYCOIN4444 betting, live commentary, premium casino UI.
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Coins, RefreshCw, TrendingUp, TrendingDown, Minus, Plus, Zap } from "lucide-react";

// ── Card Engine ──────────────────────────────────────────────────────────────
type Suit = "♠" | "♥" | "♦" | "♣";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
interface Card { suit: Suit; rank: Rank; hidden?: boolean; }

const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
const RANKS: Rank[] = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) for (const rank of RANKS) deck.push({ suit, rank });
  return deck.sort(() => Math.random() - 0.5);
}

function cardValue(rank: Rank): number {
  if (rank === "A") return 11;
  if (["J","Q","K"].includes(rank)) return 10;
  return parseInt(rank);
}

function handValue(cards: Card[]): number {
  let total = cards.filter(c => !c.hidden).reduce((s, c) => s + cardValue(c.rank), 0);
  let aces = cards.filter(c => !c.hidden && c.rank === "A").length;
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}

function isRed(suit: Suit) { return suit === "♥" || suit === "♦"; }

// ── 25 Dealer Personas ───────────────────────────────────────────────────────
const DEALERS = [
  { id: "classic",    name: "Classic Dealer",    emoji: "🎩", color: "#f59e0b", greeting: "Welcome to the table. Place your bet.", win: "Well played.", lose: "House wins. Try again.", bust: "Bust! Better luck next hand.", bj: "Blackjack! Outstanding." },
  { id: "shadow",     name: "Shadow Dealer",     emoji: "🌑", color: "#6366f1", greeting: "The shadows welcome you. Bet wisely.", win: "Fortune favors the bold.", lose: "Darkness claims your chips.", bust: "The void takes you.", bj: "A shadow of perfection." },
  { id: "crypto",     name: "Crypto Dealer",     emoji: "₿",  color: "#f59e0b", greeting: "WAGMI! Place your SKYCOIN bet.", win: "To the moon! 🚀", lose: "NGMI this hand. HODL your chips.", bust: "Rekt! Happens to the best.", bj: "SKYCOIN to the moon! Blackjack!" },
  { id: "vampire",    name: "Count Blackula",    emoji: "🧛", color: "#dc2626", greeting: "I vant to take your chips... Place your bet.", win: "You have escaped my grasp... this time.", lose: "Your chips are MINE!", bust: "The blood drains from your hand!", bj: "Immortal perfection! Blackjack!" },
  { id: "robot",      name: "Dealer-9000",       emoji: "🤖", color: "#94a3b8", greeting: "INITIALIZING GAME PROTOCOL. BET NOW.", win: "OUTCOME: WIN. PROBABILITY WAS 43.2%.", lose: "OUTCOME: LOSS. EXPECTED VALUE NEGATIVE.", bust: "BUST DETECTED. HAND TERMINATED.", bj: "BLACKJACK ACHIEVED. OPTIMAL OUTCOME." },
  { id: "pirate",     name: "Captain Cards",     emoji: "🏴‍☠️", color: "#92400e", greeting: "Ahoy! Bet yer doubloons, ye scallywag!", win: "Shiver me timbers, ye won!", lose: "Davy Jones takes yer chips!", bust: "Ye went overboard! Bust!", bj: "Blackjack! Hoist the Jolly Roger!" },
  { id: "witch",      name: "Madame Hex",        emoji: "🧙‍♀️", color: "#7c3aed", greeting: "The cards have spoken. Place your offering.", win: "The spell worked in your favor.", lose: "I curse your next hand too.", bust: "Your greed broke the spell. Bust!", bj: "A perfect hex! Blackjack!" },
  { id: "ninja",      name: "Shadow Ninja",      emoji: "🥷", color: "#00ff88", greeting: "...", win: "Acceptable.", lose: "Weak.", bust: "Dishonorable.", bj: "Perfect." },
  { id: "queen",      name: "Queen of Cards",    emoji: "👑", color: "#fbbf24", greeting: "You may approach my table. Bet accordingly.", win: "I permit this victory.", lose: "Off with your chips!", bust: "How embarrassing. Bust.", bj: "Even I am impressed. Blackjack!" },
  { id: "hacker",     name: "Card Hacker",       emoji: "💻", color: "#00e5ff", greeting: "I've already seen your cards. Bet anyway.", win: "You got lucky. My algorithm failed.", lose: "Exploited. As expected.", bust: "Buffer overflow. Bust.", bj: "Root access achieved. Blackjack!" },
  { id: "zen",        name: "Zen Dealer",        emoji: "☯️", color: "#a78bfa", greeting: "The cards are one with the universe. Bet.", win: "Balance is restored.", lose: "Attachment leads to suffering.", bust: "The ego busted. Not you.", bj: "Perfect harmony. Blackjack." },
  { id: "chaos",      name: "Chaos Dealer",      emoji: "⚡", color: "#ef4444", greeting: "RULES ARE MEANINGLESS! BET SOMETHING!", win: "CHAOS FAVORS YOU TODAY!", lose: "BEAUTIFUL DESTRUCTION!", bust: "GLORIOUS CHAOS! BUST!", bj: "THE UNIVERSE SCREAMS BLACKJACK!" },
  { id: "sage",       name: "Ancient Sage",      emoji: "📚", color: "#60a5fa", greeting: "In 10,000 years of dealing, I've seen it all. Bet.", win: "History records your victory.", lose: "Even sages lose sometimes.", bust: "The ancient texts predicted this bust.", bj: "In all my years... Blackjack!" },
  { id: "angel",      name: "Angel Dealer",      emoji: "👼", color: "#e0f2fe", greeting: "Heaven's table is open. Bet with grace.", win: "The angels sing for you!", lose: "A lesson in humility.", bust: "Even angels bust sometimes.", bj: "Heavenly! A perfect Blackjack!" },
  { id: "demon",      name: "Devil Dealer",      emoji: "😈", color: "#991b1b", greeting: "Sign here... I mean, place your bet.", win: "I'll collect this debt later.", lose: "Your soul AND your chips.", bust: "Deliciously terrible. Bust!", bj: "Hell freezes over. Blackjack!" },
  { id: "astronaut",  name: "Space Dealer",      emoji: "🚀", color: "#0ea5e9", greeting: "Houston, we have a card game. Bet!", win: "Mission accomplished! 🌙", lose: "Houston, we have a problem.", bust: "Lost in space. Bust!", bj: "One small card, one giant Blackjack!" },
  { id: "samurai",    name: "Samurai Dealer",    emoji: "⚔️", color: "#dc2626", greeting: "Honor demands you bet. Do so.", win: "Your blade was swift.", lose: "Defeat with honor.", bust: "Seppuku would be appropriate. Bust.", bj: "A warrior's Blackjack!" },
  { id: "detective",  name: "Card Detective",    emoji: "🔍", color: "#78716c", greeting: "I've deduced your hand already. Bet.", win: "Elementary, my dear player.", lose: "The evidence was against you.", bust: "The case is closed. Bust.", bj: "Brilliant! A Blackjack!" },
  { id: "cyberpunk",  name: "Neon Dealer",       emoji: "🦾", color: "#00ffcc", greeting: "Jacked in. Bet your creds.", win: "Chrome and glory!", lose: "Flatlined this hand.", bust: "System crash. Bust!", bj: "Netrunner's Blackjack!" },
  { id: "trader",     name: "Wall St. Dealer",   emoji: "📈", color: "#10b981", greeting: "Markets open. Place your position.", win: "Green candle! Profit taken.", lose: "Red candle. Stop loss hit.", bust: "Margin call. Bust.", bj: "All-time high! Blackjack!" },
  { id: "oracle",     name: "Oracle Dealer",     emoji: "🔮", color: "#9b59ff", greeting: "I foresaw your bet. Place it.", win: "As the oracle predicted.", lose: "I saw this coming.", bust: "Even I couldn't prevent this bust.", bj: "The prophecy is fulfilled. Blackjack!" },
  { id: "wizard",     name: "Wizard Dealer",     emoji: "🧙‍♂️", color: "#6d28d9", greeting: "A spell for luck? Place your bet.", win: "Wingardium Leviosa your chips!", lose: "The spell backfired.", bust: "Expelliarmus! Bust!", bj: "Accio Blackjack!" },
  { id: "creator",    name: "Artist Dealer",     emoji: "🎨", color: "#f59e0b", greeting: "Every hand is a masterpiece. Bet.", win: "A beautiful composition!", lose: "Abstract expressionism of loss.", bust: "Deconstructivist bust!", bj: "A Picasso of Blackjack!" },
  { id: "guardian",   name: "Shield Dealer",     emoji: "🛡️", color: "#10b981", greeting: "I protect the house. Bet carefully.", win: "My shield lowered for you.", lose: "Protected by the house.", bust: "Even shields can't help a bust.", bj: "Unbreakable Blackjack!" },
  { id: "unhinged",   name: "UNHINGED DEALER",   emoji: "🔥", color: "#ff0040", greeting: "BET EVERYTHING OR LEAVE THE TABLE NOW!!!", win: "ABSOLUTE CHAOS IN YOUR FAVOR!!!", lose: "DESTROYED. OBLITERATED. GONE.", bust: "CATASTROPHIC FAILURE. BUST. BEAUTIFUL.", bj: "THE UNIVERSE IMPLODES. BLACKJACK!!!" },
];

type GameState = "idle" | "betting" | "playing" | "dealer" | "result";
type Result = "win" | "lose" | "push" | "blackjack" | "bust";

export default function Blackjack() {
  const [dealer, setDealer] = useState(DEALERS[0]);
  const [showDealerPicker, setShowDealerPicker] = useState(false);
  const [balance, setBalance] = useState(10000);
  const [bet, setBet] = useState(100);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [message, setMessage] = useState(dealer.greeting);
  const [stats, setStats] = useState({ wins: 0, losses: 0, pushes: 0, blackjacks: 0 });

  const playerScore = handValue(playerHand);
  const dealerScore = handValue(dealerHand);

  const startGame = useCallback(() => {
    if (bet > balance) { toast.error("Insufficient SKYCOIN balance"); return; }
    const d = createDeck();
    const ph = [d.pop()!, d.pop()!];
    const dh = [d.pop()!, { ...d.pop()!, hidden: true }];
    setDeck(d);
    setPlayerHand(ph);
    setDealerHand(dh);
    setResult(null);
    setGameState("playing");
    setMessage("Your move. Hit or Stand?");

    // Check for natural blackjack
    if (handValue(ph) === 21) {
      setTimeout(() => endGame("blackjack", ph, dh, d), 500);
    }
  }, [bet, balance]);

  const hit = useCallback(() => {
    if (gameState !== "playing") return;
    const newCard = deck[0];
    const newDeck = deck.slice(1);
    const newHand = [...playerHand, newCard];
    setDeck(newDeck);
    setPlayerHand(newHand);
    const val = handValue(newHand);
    if (val > 21) {
      setMessage(dealer.bust);
      endGame("bust", newHand, dealerHand, newDeck);
    } else if (val === 21) {
      stand(newHand, newDeck);
    } else {
      setMessage(`${val}. Hit or Stand?`);
    }
  }, [gameState, deck, playerHand, dealerHand, dealer]);

  const stand = useCallback((ph = playerHand, d = deck) => {
    setGameState("dealer");
    // Reveal dealer hidden card
    const revealedDealer: Card[] = dealerHand.map(c => ({ ...c, hidden: false as boolean | undefined }));
    let currentDealer = revealedDealer;
    let currentDeck = d;

    const dealerPlay = () => {
      const dVal = handValue(currentDealer);
      if (dVal < 17) {
        const newCard = currentDeck[0];
        currentDeck = currentDeck.slice(1);
        currentDealer = [...currentDealer, { ...newCard, hidden: false as boolean | undefined }];
        setDealerHand([...currentDealer]);
        setTimeout(dealerPlay, 600);
      } else {
        const pVal = handValue(ph);
        const dFinal = handValue(currentDealer);
        let r: Result;
        if (dFinal > 21) r = "win";
        else if (pVal > dFinal) r = "win";
        else if (pVal < dFinal) r = "lose";
        else r = "push";
        endGame(r, ph, currentDealer, currentDeck);
      }
    };
    setDealerHand(revealedDealer);
    setTimeout(dealerPlay, 400);
  }, [playerHand, dealerHand, deck]);

  const endGame = (r: Result, ph: Card[], dh: Card[], d: Card[]) => {
    setResult(r);
    setGameState("result");
    setDealerHand(dh.map(c => ({ ...c, hidden: false })));

    let msg = "";
    let balanceDelta = 0;
    if (r === "blackjack") { msg = dealer.bj; balanceDelta = Math.floor(bet * 1.5); }
    else if (r === "win")  { msg = dealer.win; balanceDelta = bet; }
    else if (r === "lose" || r === "bust") { msg = r === "bust" ? dealer.bust : dealer.lose; balanceDelta = -bet; }
    else { msg = "Push — bet returned."; balanceDelta = 0; }

    setMessage(msg);
    setBalance(b => b + balanceDelta);
    setStats(s => ({
      wins: s.wins + (r === "win" || r === "blackjack" ? 1 : 0),
      losses: s.losses + (r === "lose" || r === "bust" ? 1 : 0),
      pushes: s.pushes + (r === "push" ? 1 : 0),
      blackjacks: s.blackjacks + (r === "blackjack" ? 1 : 0),
    }));

    if (r === "blackjack") toast.success(`🃏 BLACKJACK! +${Math.floor(bet*1.5)} SKY`);
    else if (r === "win")  toast.success(`✅ WIN! +${bet} SKY`);
    else if (r === "lose" || r === "bust") toast.error(`❌ ${r === "bust" ? "BUST" : "LOSS"} -${bet} SKY`);
    else toast.info("Push — bet returned");
  };

  const CHIP_VALUES = [25, 100, 500, 1000, 5000];

  const CardDisplay = ({ card, delay = 0 }: { card: Card; delay?: number }) => (
    <motion.div
      initial={{ rotateY: 90, opacity: 0, y: -20 }}
      animate={{ rotateY: 0, opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.23, 1, 0.32, 1] }}
      className="relative w-16 h-24 rounded-xl border flex flex-col items-center justify-center font-bold select-none shrink-0"
      style={card.hidden ? {
        background: "linear-gradient(135deg, #1a1a3e, #0d0d22)",
        border: "1px solid rgba(155,89,255,0.3)",
        backgroundImage: "repeating-linear-gradient(45deg, rgba(155,89,255,0.05) 0, rgba(155,89,255,0.05) 1px, transparent 0, transparent 50%)",
        backgroundSize: "8px 8px",
      } : {
        background: "rgba(255,255,255,0.97)",
        border: "1px solid rgba(255,255,255,0.3)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
      }}
    >
      {!card.hidden && (
        <>
          <div className="absolute top-1.5 left-2 text-[11px] font-bold leading-none"
            style={{ color: isRed(card.suit) ? "#dc2626" : "#1a1a2e" }}>
            {card.rank}
          </div>
          <div className="text-2xl" style={{ color: isRed(card.suit) ? "#dc2626" : "#1a1a2e" }}>
            {card.suit}
          </div>
          <div className="absolute bottom-1.5 right-2 text-[11px] font-bold leading-none rotate-180"
            style={{ color: isRed(card.suit) ? "#dc2626" : "#1a1a2e" }}>
            {card.rank}
          </div>
        </>
      )}
      {card.hidden && <div className="text-2xl">🂠</div>}
    </motion.div>
  );

  return (
    <div className="min-h-screen p-6" style={{ background: "radial-gradient(ellipse at center, #0a0a1e 0%, #050510 100%)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
              🃏 Blackjack Casino
            </h1>
            <p className="text-[11px] text-white/35 mt-0.5">SKYCOIN4444 · 25 AI Dealers · Live Commentary</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Stats */}
            <div className="hidden sm:flex gap-3">
              {[
                { label: "W", val: stats.wins, color: "#10b981" },
                { label: "L", val: stats.losses, color: "#ef4444" },
                { label: "BJ", val: stats.blackjacks, color: "#f59e0b" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-[13px] font-bold font-mono" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-[8px] text-white/25 font-mono">{s.label}</div>
                </div>
              ))}
            </div>
            {/* Balance */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border"
              style={{ background: "rgba(0,229,255,0.08)", borderColor: "rgba(0,229,255,0.2)" }}>
              <Coins className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[13px] font-bold font-mono text-cyan-400">{balance.toLocaleString()} SKY</span>
            </div>
          </div>
        </div>

        {/* Dealer Selector */}
        <div className="mb-4">
          <button
            onClick={() => setShowDealerPicker(p => !p)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border w-full transition-all"
            style={{ background: `${dealer.color}10`, borderColor: `${dealer.color}30` }}>
            <span className="text-2xl">{dealer.emoji}</span>
            <div className="text-left flex-1">
              <div className="text-[13px] font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>{dealer.name}</div>
              <div className="text-[10px] italic" style={{ color: `${dealer.color}99` }}>"{message}"</div>
            </div>
            <span className="text-[10px] font-mono text-white/30">Change Dealer ▾</span>
          </button>

          <AnimatePresence>
            {showDealerPicker && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="mt-2 p-3 rounded-2xl border border-white/[0.08] grid grid-cols-3 sm:grid-cols-5 gap-2"
                style={{ background: "rgba(10,10,28,0.97)", backdropFilter: "blur(20px)" }}>
                {DEALERS.map(d => (
                  <button key={d.id} onClick={() => { setDealer(d); setMessage(d.greeting); setShowDealerPicker(false); setGameState("idle"); }}
                    className="p-2 rounded-xl border text-center transition-all"
                    style={{
                      background: dealer.id === d.id ? `${d.color}18` : "rgba(13,13,34,0.6)",
                      borderColor: dealer.id === d.id ? `${d.color}50` : "rgba(255,255,255,0.07)",
                    }}>
                    <div className="text-xl mb-1">{d.emoji}</div>
                    <div className="text-[9px] font-bold text-white leading-tight" style={{ fontFamily: "Syne, sans-serif" }}>{d.name}</div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Table */}
        <div className="rounded-3xl border border-white/[0.08] overflow-hidden mb-4"
          style={{
            background: "radial-gradient(ellipse at center, #0d2d1a 0%, #071a0f 100%)",
            boxShadow: "0 0 60px rgba(0,0,0,0.6), inset 0 0 60px rgba(0,0,0,0.3)",
          }}>
          {/* Dealer area */}
          <div className="p-6 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-white/30 tracking-widest">DEALER</span>
              {gameState !== "idle" && gameState !== "betting" && (
                <span className="text-[12px] font-mono font-bold text-white/60">
                  {dealerHand.some(c => c.hidden) ? "?" : dealerScore}
                </span>
              )}
            </div>
            <div className="flex gap-2 min-h-[96px] items-center">
              <AnimatePresence>
                {dealerHand.map((card, i) => <CardDisplay key={i} card={card} delay={i * 0.1} />)}
              </AnimatePresence>
              {gameState === "idle" && (
                <div className="text-white/15 text-[12px] font-mono">Waiting for bets...</div>
              )}
            </div>
          </div>

          {/* Result banner */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="py-3 text-center text-[16px] font-bold"
                style={{
                  fontFamily: "Syne, sans-serif",
                  background: result === "blackjack" ? "rgba(245,158,11,0.15)"
                    : result === "win" ? "rgba(16,185,129,0.12)"
                    : result === "push" ? "rgba(100,116,139,0.12)"
                    : "rgba(239,68,68,0.12)",
                  color: result === "blackjack" ? "#f59e0b"
                    : result === "win" ? "#10b981"
                    : result === "push" ? "#94a3b8"
                    : "#ef4444",
                }}>
                {result === "blackjack" ? "🃏 BLACKJACK!"
                  : result === "win" ? "✅ YOU WIN!"
                  : result === "push" ? "🤝 PUSH"
                  : result === "bust" ? "💥 BUST!"
                  : "❌ DEALER WINS"}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Player area */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-white/30 tracking-widest">YOUR HAND</span>
              {gameState !== "idle" && (
                <span className={cn(
                  "text-[12px] font-mono font-bold",
                  playerScore > 21 ? "text-red-400" : playerScore === 21 ? "text-amber-400" : "text-white/60"
                )}>
                  {playerScore}
                </span>
              )}
            </div>
            <div className="flex gap-2 min-h-[96px] items-center">
              <AnimatePresence>
                {playerHand.map((card, i) => <CardDisplay key={i} card={card} delay={i * 0.1} />)}
              </AnimatePresence>
              {gameState === "idle" && (
                <div className="text-white/15 text-[12px] font-mono">Place your bet to start</div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="rounded-2xl border border-white/[0.08] p-4"
          style={{ background: "rgba(10,10,28,0.9)" }}>
          {/* Bet controls */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-mono text-white/30 tracking-widest shrink-0">BET</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setBet(b => Math.max(25, b - 25))}
                disabled={gameState === "playing" || gameState === "dealer"}
                className="w-7 h-7 rounded-lg border border-white/[0.1] text-white/50 hover:text-white hover:border-white/[0.2] transition-colors flex items-center justify-center disabled:opacity-30">
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-[16px] font-bold font-mono text-cyan-400 min-w-[80px] text-center">{bet.toLocaleString()}</span>
              <button onClick={() => setBet(b => Math.min(balance, b + 25))}
                disabled={gameState === "playing" || gameState === "dealer"}
                className="w-7 h-7 rounded-lg border border-white/[0.1] text-white/50 hover:text-white hover:border-white/[0.2] transition-colors flex items-center justify-center disabled:opacity-30">
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {CHIP_VALUES.map(v => (
                <button key={v} onClick={() => setBet(Math.min(balance, v))}
                  disabled={gameState === "playing" || gameState === "dealer"}
                  className="text-[10px] font-mono px-2.5 py-1 rounded-lg border border-white/[0.1] text-white/40 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors disabled:opacity-30">
                  {v >= 1000 ? `${v/1000}K` : v}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {(gameState === "idle" || gameState === "result") && (
              <motion.button whileTap={{ scale: 0.97 }} onClick={startGame}
                className="flex-1 py-3 rounded-xl font-bold text-[14px] transition-all"
                style={{
                  background: `linear-gradient(135deg, ${dealer.color}, ${dealer.color}88)`,
                  color: "#050510",
                  fontFamily: "Syne, sans-serif",
                  boxShadow: `0 4px 20px ${dealer.color}33`,
                }}>
                {gameState === "result" ? "🔄 New Hand" : "🃏 Deal"}
              </motion.button>
            )}
            {gameState === "playing" && (
              <>
                <motion.button whileTap={{ scale: 0.97 }} onClick={hit}
                  className="flex-1 py-3 rounded-xl font-bold text-[14px]"
                  style={{ background: "rgba(0,229,255,0.15)", border: "1px solid rgba(0,229,255,0.3)", color: "#00e5ff", fontFamily: "Syne, sans-serif" }}>
                  Hit
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => stand()}
                  className="flex-1 py-3 rounded-xl font-bold text-[14px]"
                  style={{ background: "rgba(155,89,255,0.15)", border: "1px solid rgba(155,89,255,0.3)", color: "#b47aff", fontFamily: "Syne, sans-serif" }}>
                  Stand
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={() => { setBet(b => Math.min(balance, b * 2)); hit(); }}
                  className="flex-1 py-3 rounded-xl font-bold text-[14px]"
                  style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b", fontFamily: "Syne, sans-serif" }}>
                  Double
                </motion.button>
              </>
            )}
            {gameState === "dealer" && (
              <div className="flex-1 py-3 rounded-xl text-center text-[13px] text-white/40 border border-white/[0.07]">
                Dealer playing...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
