import React, { useState } from "react";
import { useNeuralCore } from "@/lib/neural-core-sync";

/**
 * High-Stakes Gaming & Puzzle Hub
 * Earn Skycoin4444 through skill-based challenges and puzzles
 */

export default function GamingPuzzleHub() {
  const [activeGame, setActiveGame] = useState("all");
  const { skycoin, updateSkycoin, addActivity } = useNeuralCore();

  const handlePlay = (amount: number, game: string) => {
    updateSkycoin(amount);
    addActivity('GAM', `Earned ${amount} SKY in ${game}!`);
  };

  const gamingMetrics = [
    { label: "Active Players", value: "1.2M", status: "High" },
    { label: "Daily Payouts", value: "4.5M", status: "Skycoin4444" },
    { label: "Jackpot Pool", value: "10M", status: "Skycoin4444" },
    { label: "Win Rate", value: "34.2%", status: "Competitive" },
  ];

  const games = [
    { id: 1, name: "Quantum Puzzle Solver", reward: "500 - 5,000", difficulty: "Hard", category: "Puzzle" },
    { id: 2, name: "Skycoin Run", reward: "100 - 1,000", difficulty: "Medium", category: "Action" },
    { id: 3, name: "Neural Network Challenge", reward: "2,000 - 10,000", difficulty: "Expert", category: "Puzzle" },
    { id: 4, name: "Blockchain Miner Game", reward: "50 - 500", difficulty: "Easy", category: "Simulation" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Gaming<span className="text-emerald-500">Hub</span>
          </h1>
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            High-Stakes Puzzles // Earn Skycoin4444
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Your Balance</div>
          <div className="text-emerald-500 font-black uppercase text-xl">{skycoin.toLocaleString()} SKY</div>
        </div>
      </div>

      {/* Gaming Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {gamingMetrics.map((metric, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-slate-800 p-6 rounded-sm">
            <div className="text-xs text-slate-500 uppercase font-bold mb-2">{metric.label}</div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-black">{metric.value}</div>
              <div className="text-[10px] text-emerald-500 font-bold uppercase">{metric.status}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Game Feed */}
        <div className="col-span-8">
          <h2 className="text-xl font-black uppercase tracking-widest mb-8">Available Challenges</h2>
          <div className="space-y-4">
            {games.map((game) => (
              <div key={game.id} className="bg-slate-900/20 border-l-4 border-slate-800 p-8 flex justify-between items-center group hover:border-emerald-500 transition-all">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-black uppercase italic group-hover:text-emerald-500 transition-colors">{game.name}</h3>
                    <span className="text-[10px] font-bold bg-slate-800 text-slate-500 px-2 py-1 uppercase tracking-widest">{game.category}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Difficulty: {game.difficulty}</span>
                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Reward: {game.reward} SKY</span>
                  </div>
                </div>
                <button 
                  onClick={() => handlePlay(500, game.name)}
                  className="bg-emerald-500 text-black px-6 py-2 font-black uppercase italic tracking-tighter hover:bg-emerald-400 transition-all"
                >
                  Play Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Leaderboard */}
        <div className="col-span-4">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-emerald-500">Top Earners</h3>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-500">#0{i}</span>
                    <span className="text-xs font-black uppercase italic">User_{4444 + i}</span>
                  </div>
                  <span className="text-xs font-black text-emerald-500">{10000 - i * 1000} SKY</span>
                </div>
              ))}
              <button className="w-full bg-slate-800 text-white py-3 font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all">
                View Full Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
