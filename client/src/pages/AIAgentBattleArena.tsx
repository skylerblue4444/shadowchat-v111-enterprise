import React, { useState, useEffect } from "react";

/**
 * AI Agent Battle Arena
 * Live battles between AI agents with betting and strategy challenges
 */

export default function AIAgentBattleArena() {
  const [selectedBattle, setSelectedBattle] = useState<number | null>(null);
  const [userBet, setUserBet] = useState(100);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [battleHistory, setBattleHistory] = useState<any[]>([]);

  const agents = [
    { id: "architect", name: "Architect", rating: 2450, wins: 342, losses: 58, avatar: "🏗️" },
    { id: "analyst", name: "Analyst", rating: 2380, wins: 318, losses: 72, avatar: "📊" },
    { id: "optimizer", name: "Optimizer", rating: 2290, wins: 285, losses: 95, avatar: "⚡" },
    { id: "guardian", name: "Guardian", rating: 2150, wins: 245, losses: 125, avatar: "🛡️" },
    { id: "healer", name: "Healer", rating: 2080, wins: 210, losses: 160, avatar: "💚" },
    { id: "innovator", name: "Innovator", rating: 2320, wins: 305, losses: 85, avatar: "🚀" },
  ];

  const upcomingBattles = [
    {
      id: 1,
      agent1: "Architect",
      agent2: "Analyst",
      challenge: "Code Optimization Challenge",
      prize: "5,000 SKY",
      bettingPool: "234,500 SKY",
      timeLeft: "2:45:30",
      odds1: 1.45,
      odds2: 1.65,
    },
    {
      id: 2,
      agent1: "Innovator",
      agent2: "Guardian",
      challenge: "Security Audit Race",
      prize: "3,500 SKY",
      bettingPool: "156,200 SKY",
      timeLeft: "5:12:15",
      odds1: 1.52,
      odds2: 1.58,
    },
    {
      id: 3,
      agent1: "Optimizer",
      agent2: "Healer",
      challenge: "Performance Tuning",
      prize: "4,000 SKY",
      bettingPool: "189,800 SKY",
      timeLeft: "8:30:45",
      odds1: 1.38,
      odds2: 1.72,
    },
  ];

  const recentResults = [
    {
      id: 1,
      winner: "Architect",
      loser: "Guardian",
      challenge: "Algorithm Design",
      margin: "3.2s",
      totalBets: "567,890 SKY",
      timestamp: "1 hour ago",
    },
    {
      id: 2,
      winner: "Analyst",
      loser: "Healer",
      challenge: "Data Analysis",
      margin: "0.8s",
      totalBets: "432,100 SKY",
      timestamp: "3 hours ago",
    },
    {
      id: 3,
      winner: "Innovator",
      loser: "Optimizer",
      challenge: "Feature Implementation",
      margin: "2.1s",
      totalBets: "678,450 SKY",
      timestamp: "6 hours ago",
    },
  ];

  const handlePlaceBet = () => {
    if (selectedAgent && selectedBattle !== null) {
      alert(`Bet placed: ${userBet} SKY on ${selectedAgent}`);
      setUserBet(100);
      setSelectedAgent(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          ⚔️ AI Agent Battle Arena
        </h1>
        <p className="text-slate-400">Watch AI agents compete and place your bets</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Upcoming Battles */}
        <div className="col-span-2">
          <h2 className="text-xl font-bold mb-4 text-emerald-400">Upcoming Battles</h2>
          <div className="space-y-4">
            {upcomingBattles.map((battle) => (
              <div
                key={battle.id}
                onClick={() => setSelectedBattle(battle.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedBattle === battle.id
                    ? "bg-emerald-500/20 border-emerald-400"
                    : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{agents.find((a) => a.name === battle.agent1)?.avatar}</div>
                    <div>
                      <div className="font-bold">{battle.agent1}</div>
                      <div className="text-xs text-slate-400">Odds: {battle.odds1}</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-400 mb-1">vs</div>
                    <div className="text-xs text-emerald-400 font-bold">{battle.timeLeft}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-bold text-right">{battle.agent2}</div>
                      <div className="text-xs text-slate-400">Odds: {battle.odds2}</div>
                    </div>
                    <div className="text-3xl">{agents.find((a) => a.name === battle.agent2)?.avatar}</div>
                  </div>
                </div>
                <div className="text-sm text-slate-300 mb-2">🎯 {battle.challenge}</div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Prize: {battle.prize}</span>
                  <span>Betting Pool: {battle.bettingPool}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Betting Panel */}
        <div className="col-span-1">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 sticky top-6">
            <h3 className="text-lg font-bold mb-4 text-emerald-400">Place Your Bet</h3>

            {selectedBattle !== null && (
              <>
                <div className="mb-4">
                  <label className="text-sm text-slate-400 mb-2 block">Select Agent</label>
                  <div className="space-y-2">
                    {[upcomingBattles[selectedBattle - 1].agent1, upcomingBattles[selectedBattle - 1].agent2].map((agent) => (
                      <button
                        key={agent}
                        onClick={() => setSelectedAgent(agent)}
                        className={`w-full p-2 rounded text-sm font-semibold transition-all ${
                          selectedAgent === agent
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {agent}
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
                    className="w-full bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="mb-4 p-3 bg-slate-700/30 rounded text-sm">
                  <div className="text-slate-400 mb-1">Potential Payout</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {(userBet * (selectedAgent === upcomingBattles[selectedBattle - 1].agent1 ? upcomingBattles[selectedBattle - 1].odds1 : upcomingBattles[selectedBattle - 1].odds2)).toFixed(0)} SKY
                  </div>
                </div>

                <button
                  onClick={handlePlaceBet}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-bold transition-all"
                >
                  Place Bet
                </button>
              </>
            )}

            {selectedBattle === null && (
              <div className="text-slate-400 text-sm">Select a battle to place your bet</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Results */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4 text-emerald-400">Recent Results</h2>
        <div className="grid grid-cols-3 gap-4">
          {recentResults.map((result) => (
            <div key={result.id} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-emerald-400">{result.winner}</div>
                <div className="text-xs text-slate-400">won</div>
                <div className="font-bold text-slate-400">{result.loser}</div>
              </div>
              <div className="text-sm text-slate-400 mb-2">{result.challenge}</div>
              <div className="text-xs text-slate-500 mb-2">Margin: {result.margin}</div>
              <div className="text-xs text-emerald-400">Total Bets: {result.totalBets}</div>
              <div className="text-xs text-slate-500 mt-2">{result.timestamp}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Rankings */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4 text-emerald-400">Agent Rankings</h2>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 bg-slate-900/50 border-b border-slate-700 font-semibold text-sm">
            <div>Rank</div>
            <div>Agent</div>
            <div>Rating</div>
            <div>W-L</div>
            <div>Win %</div>
          </div>
          {agents.map((agent, idx) => (
            <div key={agent.id} className="grid grid-cols-5 gap-4 p-4 border-b border-slate-700/50 text-sm">
              <div className="font-bold text-emerald-400">#{idx + 1}</div>
              <div className="flex items-center gap-2">
                <span>{agent.avatar}</span>
                <span>{agent.name}</span>
              </div>
              <div className="font-bold">{agent.rating}</div>
              <div>{agent.wins}-{agent.losses}</div>
              <div className="text-emerald-400">{((agent.wins / (agent.wins + agent.losses)) * 100).toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
