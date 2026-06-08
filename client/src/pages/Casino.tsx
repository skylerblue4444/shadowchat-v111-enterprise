import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─── BLACKJACK ───────────────────────────────────────────────────────────────
function BlackjackGame() {
  const [bet, setBet] = useState(10);
  const [gameId, setGameId] = useState<string | null>(null);
  const [playerCards, setPlayerCards] = useState<any[]>([]);
  const [dealerCards, setDealerCards] = useState<any[]>([]);
  const [playerValue, setPlayerValue] = useState(0);
  const [dealerValue, setDealerValue] = useState(0);
  const [status, setStatus] = useState<string>("idle");
  const [payout, setPayout] = useState(0);
  const [dealerMsg, setDealerMsg] = useState("Place your bets! 🎰");

  const newGame = trpc.casino.blackjack.newGame.useMutation({
    onSuccess: (data) => {
      setGameId(data.gameId);
      setPlayerCards(data.playerCards);
      setDealerCards([data.dealerUpCard, { suit: "?", value: "?", numValue: 0 }]);
      setPlayerValue(data.playerValue);
      setDealerValue(0);
      setStatus(data.status);
      setPayout(data.payout);
    },
  });

  const hit = trpc.casino.blackjack.hit.useMutation({
    onSuccess: (data: any) => {
      if (data.error) return;
      setPlayerCards(data.playerCards);
      setPlayerValue(data.playerValue);
      setStatus(data.status);
      setPayout(data.payout);
    },
  });

  const stand = trpc.casino.blackjack.stand.useMutation({
    onSuccess: (data: any) => {
      if (data.error) return;
      setDealerCards(data.dealerCards);
      setDealerValue(data.dealerValue);
      setStatus(data.status);
      setPayout(data.payout);
    },
  });

  const doubleDown = trpc.casino.blackjack.doubleDown.useMutation({
    onSuccess: (data: any) => {
      if (data.error) return;
      setPlayerCards(data.playerCards);
      setPlayerValue(data.playerValue);
      if (data.dealerCards) {
        setDealerCards(data.dealerCards);
        setDealerValue(data.dealerValue);
      }
      setStatus(data.status);
      setPayout(data.payout);
    },
  });

  const aiDealer = trpc.casino.aiDealer.useMutation({
    onSuccess: (data) => setDealerMsg(data.reply),
  });

  const renderCard = (card: any, i: number) => (
    <div key={i} className="w-14 h-20 sm:w-16 sm:h-24 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-600 flex flex-col items-center justify-center shadow-lg text-lg font-bold transition-all duration-200 hover:scale-105">
      <span className={card.suit === "♥" || card.suit === "♦" ? "text-red-500" : "text-zinc-900 dark:text-white"}>
        {card.value}
      </span>
      <span className={card.suit === "♥" || card.suit === "♦" ? "text-red-500" : "text-zinc-900 dark:text-white"}>
        {card.suit}
      </span>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* AI Dealer Message */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-4">
        <p className="text-sm text-emerald-400 font-medium">🤖 AI Dealer</p>
        <p className="text-zinc-200 mt-1">{dealerMsg}</p>
      </div>

      {/* Game Table */}
      <div className="bg-gradient-to-b from-green-900/40 to-green-800/40 rounded-3xl p-6 border border-green-700/30">
        {/* Dealer Hand */}
        <div className="text-center mb-6">
          <p className="text-xs text-zinc-400 mb-2">DEALER {dealerValue > 0 ? `(${dealerValue})` : ""}</p>
          <div className="flex justify-center gap-2">
            {dealerCards.map((c, i) => renderCard(c, i))}
          </div>
        </div>

        {/* Status */}
        {status !== "idle" && status !== "playing" && (
          <div className={`text-center py-3 rounded-xl mb-4 font-bold text-lg ${
            status === "won" || status === "blackjack" ? "bg-emerald-500/20 text-emerald-400" :
            status === "lost" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
          }`}>
            {status === "blackjack" ? "🎉 BLACKJACK!" : status === "won" ? "🏆 YOU WIN!" : status === "lost" ? "💀 BUST" : "🤝 PUSH"}
            {payout > 0 && <span className="ml-2">+{payout} SHADOW</span>}
          </div>
        )}

        {/* Player Hand */}
        <div className="text-center mt-6">
          <div className="flex justify-center gap-2">
            {playerCards.map((c, i) => renderCard(c, i))}
          </div>
          <p className="text-xs text-zinc-400 mt-2">YOUR HAND ({playerValue})</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        {status === "idle" || status !== "playing" ? (
          <div className="flex items-center gap-2">
            <Input type="number" value={bet} onChange={e => setBet(Number(e.target.value))} className="w-24" min={1} />
            <Button onClick={() => { newGame.mutate({ betAmount: bet, coin: "SHADOW" }); aiDealer.mutate({ message: "New game starting!", game: "blackjack" }); }} className="bg-emerald-600 hover:bg-emerald-500">
              Deal ({bet} SHDW)
            </Button>
          </div>
        ) : (
          <>
            <Button onClick={() => hit.mutate({ gameId: gameId! })} variant="outline" className="bg-blue-600/20 border-blue-500">Hit</Button>
            <Button onClick={() => stand.mutate({ gameId: gameId! })} variant="outline" className="bg-yellow-600/20 border-yellow-500">Stand</Button>
            {playerCards.length === 2 && (
              <Button onClick={() => doubleDown.mutate({ gameId: gameId! })} variant="outline" className="bg-purple-600/20 border-purple-500">Double</Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── ROULETTE ────────────────────────────────────────────────────────────────
function RouletteGame() {
  const [betAmount, setBetAmount] = useState(5);
  const [betType, setBetType] = useState<string>("red");
  const [result, setResult] = useState<any>(null);
  const [spinning, setSpinning] = useState(false);

  const spin = trpc.casino.roulette.spin.useMutation({
    onSuccess: (data) => { setResult(data); setSpinning(false); },
  });

  const handleSpin = () => {
    setSpinning(true);
    spin.mutate({
      bets: [{ type: betType as any, amount: betAmount, value: betType === "number" ? 7 : undefined }],
      coin: "SHADOW",
    });
  };

  return (
    <div className="space-y-4">
      {/* Roulette Wheel Visual */}
      <div className="relative mx-auto w-48 h-48 rounded-full bg-gradient-to-br from-green-900 to-green-700 border-4 border-yellow-600 flex items-center justify-center shadow-2xl">
        <div className={`text-4xl font-bold transition-all duration-500 ${spinning ? "animate-pulse" : ""}`}>
          {result ? (
            <span className={result.color === "red" ? "text-red-500" : result.color === "black" ? "text-white" : "text-green-400"}>
              {result.result}
            </span>
          ) : "🎰"}
        </div>
      </div>

      {/* Bet Controls */}
      <div className="grid grid-cols-3 gap-2">
        {["red", "black", "odd", "even", "high", "low"].map(type => (
          <Button key={type} variant={betType === type ? "default" : "outline"} onClick={() => setBetType(type)}
            className={`capitalize ${type === "red" ? "border-red-500 text-red-400" : type === "black" ? "border-zinc-500" : ""}`}>
            {type}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2 justify-center">
        <Input type="number" value={betAmount} onChange={e => setBetAmount(Number(e.target.value))} className="w-24" min={1} />
        <Button onClick={handleSpin} disabled={spinning} className="bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-500 hover:to-yellow-500 px-8">
          {spinning ? "Spinning..." : "SPIN"}
        </Button>
      </div>

      {/* Result */}
      {result && (
        <div className={`text-center p-4 rounded-xl ${result.netProfit > 0 ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
          <p className="font-bold text-lg">{result.netProfit > 0 ? `🎉 Won +${result.totalPayout}` : `💀 Lost -${result.totalBet}`} SHADOW</p>
          <p className="text-xs text-zinc-400 mt-1">Result: {result.result} ({result.color})</p>
        </div>
      )}
    </div>
  );
}

// ─── MAIN CASINO PAGE ────────────────────────────────────────────────────────
export default function Casino() {
  const { data: leaderboard } = trpc.casino.leaderboard.useQuery();

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase" style={{ fontFamily: "Syne, sans-serif" }}>
            High-Stakes <span className="text-yellow-500">Arena</span>
          </h1>
          <div className="px-2 py-0.5 rounded border border-yellow-500/30 bg-yellow-500/10 text-[8px] font-mono text-yellow-500 tracking-[0.2em] uppercase">Provably Fair</div>
        </div>
        <p className="text-[10px] font-mono text-white/20 mt-2 uppercase tracking-[0.3em]">AI-Dealer • Real-Time Liquidity • Decentralized Odds</p>
      </div>

      {/* Stats Bar */}
      {leaderboard && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-zinc-400">House Edge</p>
              <p className="text-lg font-bold text-emerald-400">{leaderboard.houseEdge}</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-zinc-400">Total Paid Out</p>
              <p className="text-lg font-bold text-yellow-400">${(leaderboard.totalPaidOut / 1000000).toFixed(1)}M</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-zinc-400">#1 Winner</p>
              <p className="text-lg font-bold text-purple-400">{leaderboard.topWinners[0]?.username}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Games */}
      <Tabs defaultValue="blackjack" className="w-full">
        <TabsList className="grid grid-cols-2 w-full bg-zinc-900/50">
          <TabsTrigger value="blackjack">♠ Blackjack</TabsTrigger>
          <TabsTrigger value="roulette">🎡 Roulette</TabsTrigger>
        </TabsList>
        <TabsContent value="blackjack">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader><CardTitle>♠ Blackjack — Beat the AI Dealer</CardTitle></CardHeader>
            <CardContent><BlackjackGame /></CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="roulette">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader><CardTitle>🎡 Roulette — Spin to Win</CardTitle></CardHeader>
            <CardContent><RouletteGame /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Disclaimer */}
      <p className="text-xs text-zinc-500 text-center">
        Gambling involves risk. Play responsibly. All games are provably fair with verifiable seeds.
      </p>
    </div>
  );
}
