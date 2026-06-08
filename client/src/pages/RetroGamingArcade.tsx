import React, { useState } from "react";

/**
 * Retro Gaming Arcade
 * Classic high-value games from 2000 era
 */

export default function RetroGamingArcade() {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState("games");

  const games = [
    {
      id: 1,
      name: "Pixel Quest",
      description: "Classic pixel-art adventure with treasure hunting",
      year: "2000",
      maxWin: "50,000 SKY",
      rtp: "96.5%",
      plays: 245000,
      avgWin: "1,250 SKY",
      difficulty: "Medium",
      status: "Classic",
    },
    {
      id: 2,
      name: "Crypto Slots",
      description: "Retro 3-reel slots with blockchain integration",
      year: "2001",
      maxWin: "100,000 SKY",
      rtp: "95.2%",
      plays: 567000,
      avgWin: "2,500 SKY",
      difficulty: "Easy",
      status: "Legendary",
    },
    {
      id: 3,
      name: "Treasure Hunt",
      description: "Interactive treasure hunting game with real rewards",
      year: "2000",
      maxWin: "75,000 SKY",
      rtp: "94.8%",
      plays: 189000,
      avgWin: "1,875 SKY",
      difficulty: "Hard",
      status: "Classic",
    },
    {
      id: 4,
      name: "Fortune Wheel",
      description: "Spin the wheel of fortune for massive payouts",
      year: "2002",
      maxWin: "200,000 SKY",
      rtp: "93.5%",
      plays: 432000,
      avgWin: "3,200 SKY",
      difficulty: "Easy",
      status: "Legendary",
    },
    {
      id: 5,
      name: "Card Clash",
      description: "Strategic card game with high-stakes betting",
      year: "2000",
      maxWin: "150,000 SKY",
      rtp: "97.1%",
      plays: 234000,
      avgWin: "2,100 SKY",
      difficulty: "Hard",
      status: "Rare",
    },
    {
      id: 6,
      name: "Dice Dynasty",
      description: "Ancient dice game with modern blockchain twist",
      year: "2001",
      maxWin: "80,000 SKY",
      rtp: "95.9%",
      plays: 156000,
      avgWin: "1,600 SKY",
      difficulty: "Medium",
      status: "Classic",
    },
  ];

  const leaderboard = [
    { rank: 1, player: "CryptoKing", wins: 1250, totalEarnings: "2.5M SKY", streak: 45 },
    { rank: 2, player: "LuckyDragon", wins: 1089, totalEarnings: "2.1M SKY", streak: 38 },
    { rank: 3, player: "GoldenAce", wins: 987, totalEarnings: "1.8M SKY", streak: 32 },
    { rank: 4, player: "VaultMaster", wins: 856, totalEarnings: "1.6M SKY", streak: 28 },
    { rank: 5, player: "TreasureHunter", wins: 745, totalEarnings: "1.4M SKY", streak: 22 },
  ];

  const arcadeStats = {
    totalPlayed: 1824000,
    totalWon: "$45,600,000",
    avgJackpot: "45,000 SKY",
    dailyPlayers: 125000,
    weeklyTournaments: 8,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🎮 Retro Gaming Arcade
        </h1>
        <p className="text-slate-400">Classic high-value games from 2000 era</p>
      </div>

      {/* Arcade Stats */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Total Played</div>
          <div className="text-2xl font-bold text-emerald-400">{(arcadeStats.totalPlayed / 1000000).toFixed(1)}M</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Total Won</div>
          <div className="text-2xl font-bold text-cyan-400">{arcadeStats.totalWon}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Avg Jackpot</div>
          <div className="text-2xl font-bold text-purple-400">{arcadeStats.avgJackpot}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Daily Players</div>
          <div className="text-2xl font-bold text-orange-400">{(arcadeStats.dailyPlayers / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Weekly Tournaments</div>
          <div className="text-2xl font-bold text-green-400">{arcadeStats.weeklyTournaments}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-700">
        {["games", "leaderboard"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-3 font-semibold border-b-2 transition-all ${
              selectedTab === tab
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Games Tab */}
      {selectedTab === "games" && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-lg font-bold mb-4 text-emerald-400">Classic Games</h2>
            <div className="grid grid-cols-2 gap-4">
              {games.map((game) => (
                <div
                  key={game.id}
                  onClick={() => setSelectedGame(game.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedGame === game.id
                      ? "bg-emerald-500/20 border-emerald-400"
                      : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold">{game.name}</h3>
                    <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                      game.status === "Legendary" ? "bg-purple-500/20 text-purple-400" :
                      game.status === "Rare" ? "bg-blue-500/20 text-blue-400" :
                      "bg-slate-600/20 text-slate-400"
                    }`}>
                      {game.status}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{game.description}</p>
                  <div className="space-y-1 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>Max Win</span>
                      <span className="text-emerald-400 font-bold">{game.maxWin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>RTP</span>
                      <span className="text-cyan-400 font-bold">{game.rtp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plays</span>
                      <span>{(game.plays / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Details */}
          <div className="col-span-1">
            {selectedGame !== null && (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 sticky top-6">
                {(() => {
                  const game = games.find(g => g.id === selectedGame);
                  return (
                    <>
                      <h3 className="font-bold text-lg mb-4 text-emerald-400">{game?.name}</h3>
                      <div className="space-y-3 text-sm mb-4">
                        <div>
                          <div className="text-slate-400 mb-1">Year</div>
                          <div className="font-semibold">{game?.year}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Max Win</div>
                          <div className="font-semibold text-emerald-400">{game?.maxWin}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Avg Win</div>
                          <div className="font-semibold text-cyan-400">{game?.avgWin}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Difficulty</div>
                          <div className="font-semibold text-orange-400">{game?.difficulty}</div>
                        </div>
                      </div>
                      <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-bold transition-all">
                        Play Now
                      </button>
                    </>
                  );
                })()}
              </div>
            )}

            {selectedGame === null && (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 text-center">
                <p className="text-slate-400">Select a game to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {selectedTab === "leaderboard" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-emerald-400">All-Time Leaderboard</h2>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 bg-slate-900/50 border-b border-slate-700 font-semibold text-sm">
              <div>Rank</div>
              <div>Player</div>
              <div>Wins</div>
              <div>Total Earnings</div>
              <div>Win Streak</div>
            </div>
            {leaderboard.map((entry) => (
              <div key={entry.rank} className="grid grid-cols-5 gap-4 p-4 border-b border-slate-700/50 text-sm items-center">
                <div className="font-bold text-lg">
                  {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : entry.rank}
                </div>
                <div className="font-semibold">{entry.player}</div>
                <div className="text-emerald-400">{entry.wins.toLocaleString()}</div>
                <div className="text-cyan-400 font-bold">{entry.totalEarnings}</div>
                <div className="text-orange-400">{entry.streak} 🔥</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
