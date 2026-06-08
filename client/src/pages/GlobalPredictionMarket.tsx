import React, { useState, useEffect } from "react";

/**
 * Global Prediction Market
 * Bet on any event with Skycoin4444 and share profits
 */

export default function GlobalPredictionMarket() {
  const [selectedMarket, setSelectedMarket] = useState<number | null>(null);
  const [userBet, setUserBet] = useState(100);
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState(15420);

  const markets = [
    {
      id: 1,
      title: "Will Bitcoin reach $100K by end of year?",
      category: "Crypto",
      totalPool: "2.5M SKY",
      timeLeft: "45 days",
      outcomes: [
        { name: "Yes", odds: 1.8, pool: "1.8M SKY", percentage: 64 },
        { name: "No", odds: 2.1, pool: "700K SKY", percentage: 36 },
      ],
      volume24h: "234K SKY",
      participants: 12450,
    },
    {
      id: 2,
      title: "Will AI agents control 50% of web traffic?",
      category: "Technology",
      totalPool: "1.8M SKY",
      timeLeft: "90 days",
      outcomes: [
        { name: "Yes", odds: 1.6, pool: "1.2M SKY", percentage: 67 },
        { name: "No", odds: 2.4, pool: "600K SKY", percentage: 33 },
      ],
      volume24h: "156K SKY",
      participants: 8932,
    },
    {
      id: 3,
      title: "Will Skycoin reach $1000 by Q4 2026?",
      category: "Crypto",
      totalPool: "3.2M SKY",
      timeLeft: "180 days",
      outcomes: [
        { name: "Yes", odds: 2.2, pool: "2.1M SKY", percentage: 66 },
        { name: "No", odds: 1.7, pool: "1.1M SKY", percentage: 34 },
      ],
      volume24h: "412K SKY",
      participants: 15678,
    },
    {
      id: 4,
      title: "Will ShadowChat reach 1M users?",
      category: "Platform",
      totalPool: "890K SKY",
      timeLeft: "60 days",
      outcomes: [
        { name: "Yes", odds: 1.9, pool: "567K SKY", percentage: 64 },
        { name: "No", odds: 2.0, pool: "323K SKY", percentage: 36 },
      ],
      volume24h: "78K SKY",
      participants: 5234,
    },
  ];

  const topBettors = [
    { rank: 1, name: "Crypto_Whale", winRate: 72.5, profit: "2.3M SKY", avatar: "🐋" },
    { rank: 2, name: "PredictionMaster", winRate: 68.2, profit: "1.8M SKY", avatar: "🎯" },
    { rank: 3, name: "MarketGuru", winRate: 65.8, profit: "1.5M SKY", avatar: "📊" },
    { rank: 4, name: "FutureReader", winRate: 62.1, profit: "1.2M SKY", avatar: "🔮" },
    { rank: 5, name: "TrendSpotter", winRate: 58.9, profit: "890K SKY", avatar: "📈" },
  ];

  const handlePlaceBet = () => {
    if (selectedOutcome && selectedMarket !== null) {
      const newBalance = userBalance - userBet;
      setUserBalance(newBalance);
      alert(`Bet placed: ${userBet} SKY on "${selectedOutcome}"`);
      setUserBet(100);
      setSelectedOutcome(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🔮 Global Prediction Market
        </h1>
        <p className="text-slate-400">Bet on any event and share in platform profits</p>
      </div>

      {/* User Balance */}
      <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur border border-emerald-500/30 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-400 mb-1">Your Balance</div>
            <div className="text-3xl font-bold text-emerald-400">{userBalance.toLocaleString()} SKY</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400 mb-1">Profit Share (Monthly)</div>
            <div className="text-2xl font-bold text-cyan-400">+2,450 SKY</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Markets */}
        <div className="col-span-2">
          <h2 className="text-xl font-bold mb-4 text-emerald-400">Active Markets</h2>
          <div className="space-y-4">
            {markets.map((market) => (
              <div
                key={market.id}
                onClick={() => setSelectedMarket(market.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedMarket === market.id
                    ? "bg-emerald-500/20 border-emerald-400"
                    : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{market.title}</h3>
                    <div className="flex gap-2 text-xs">
                      <span className="bg-slate-700/50 px-2 py-1 rounded">{market.category}</span>
                      <span className="text-slate-400">⏱️ {market.timeLeft}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Pool</div>
                    <div className="font-bold text-emerald-400">{market.totalPool}</div>
                  </div>
                </div>

                {/* Outcomes */}
                <div className="space-y-2">
                  {market.outcomes.map((outcome) => (
                    <div key={outcome.name} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold">{outcome.name}</span>
                          <span className="text-xs text-slate-400">Odds: {outcome.odds}</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${outcome.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">{outcome.percentage}% • {outcome.pool}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-3 text-xs text-slate-400 border-t border-slate-700 pt-3">
                  <span>24h Volume: {market.volume24h}</span>
                  <span>Participants: {market.participants.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Betting Panel */}
        <div className="col-span-1">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 sticky top-6">
            <h3 className="text-lg font-bold mb-4 text-emerald-400">Place Bet</h3>

            {selectedMarket !== null && (
              <>
                <div className="mb-4">
                  <label className="text-sm text-slate-400 mb-2 block">Select Outcome</label>
                  <div className="space-y-2">
                    {markets
                      .find((m) => m.id === selectedMarket)
                      ?.outcomes.map((outcome) => (
                        <button
                          key={outcome.name}
                          onClick={() => setSelectedOutcome(outcome.name)}
                          className={`w-full p-2 rounded text-sm font-semibold transition-all ${
                            selectedOutcome === outcome.name
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          {outcome.name} (Odds: {outcome.odds})
                        </button>
                      ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-sm text-slate-400 mb-2 block">Bet Amount (SKY)</label>
                  <input
                    type="number"
                    value={userBet}
                    onChange={(e) => setUserBet(parseInt(e.target.value) || 0)}
                    max={userBalance}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="mb-4 p-3 bg-slate-700/30 rounded text-sm">
                  <div className="text-slate-400 mb-1">Potential Payout</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {selectedOutcome
                      ? (
                          userBet *
                          (markets
                            .find((m) => m.id === selectedMarket)
                            ?.outcomes.find((o) => o.name === selectedOutcome)?.odds || 1)
                        ).toFixed(0)
                      : 0}{" "}
                    SKY
                  </div>
                </div>

                <button
                  onClick={handlePlaceBet}
                  disabled={userBet > userBalance}
                  className={`w-full py-2 rounded font-bold transition-all ${
                    userBet > userBalance
                      ? "bg-slate-600 cursor-not-allowed text-slate-400"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white"
                  }`}
                >
                  Place Bet
                </button>
              </>
            )}

            {selectedMarket === null && (
              <div className="text-slate-400 text-sm">Select a market to place your bet</div>
            )}
          </div>
        </div>
      </div>

      {/* Top Bettors */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4 text-emerald-400">Top Bettors (This Month)</h2>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 bg-slate-900/50 border-b border-slate-700 font-semibold text-sm">
            <div>Rank</div>
            <div>Bettor</div>
            <div>Win Rate</div>
            <div>Profit</div>
            <div>Action</div>
          </div>
          {topBettors.map((bettor) => (
            <div key={bettor.rank} className="grid grid-cols-5 gap-4 p-4 border-b border-slate-700/50 text-sm items-center">
              <div className="font-bold text-emerald-400">#{bettor.rank}</div>
              <div className="flex items-center gap-2">
                <span>{bettor.avatar}</span>
                <span>{bettor.name}</span>
              </div>
              <div className="text-emerald-400 font-semibold">{bettor.winRate}%</div>
              <div className="font-bold">{bettor.profit}</div>
              <button className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold">Follow</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
