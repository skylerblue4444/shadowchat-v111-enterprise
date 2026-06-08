import React, { useState } from "react";

/**
 * Charity Tournaments & Gaming Coach
 * High-stakes tournaments with Hope AI coaching
 */

export default function CharityTournamentsCoach() {
  const [selectedTournament, setSelectedTournament] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState("tournaments");

  const tournaments = [
    {
      id: 1,
      name: "Mega Charity Clash",
      description: "High-stakes tournament with 100% proceeds to education",
      entryFee: "1,000 SKY",
      prizePool: "500,000 SKY",
      charity: "Education for All",
      participants: 2500,
      status: "Live",
      daysLeft: 3,
      charityPercentage: 100,
    },
    {
      id: 2,
      name: "Gaming for Good",
      description: "Weekly tournament supporting healthcare initiatives",
      entryFee: "500 SKY",
      prizePool: "250,000 SKY",
      charity: "Healthcare Access",
      participants: 1800,
      status: "Active",
      daysLeft: 5,
      charityPercentage: 75,
    },
    {
      id: 3,
      name: "Tech Tournament",
      description: "Esports-style tournament for tech education funding",
      entryFee: "2,000 SKY",
      prizePool: "1,000,000 SKY",
      charity: "Tech for Underserved",
      participants: 3200,
      status: "Upcoming",
      daysLeft: 7,
      charityPercentage: 100,
    },
  ];

  const coachingServices = [
    { name: "Hope AI Gaming Coach", specialty: "Strategy & Optimization", rating: 4.9, sessions: 12500 },
    { name: "Sage Analyst", specialty: "Risk Management", rating: 4.8, sessions: 9800 },
    { name: "Architect Strategist", specialty: "Tournament Tactics", rating: 4.7, sessions: 8900 },
    { name: "Innovator Mentor", specialty: "Advanced Techniques", rating: 4.6, sessions: 7600 },
  ];

  const leaderboard = [
    { rank: 1, player: "ProGamer2000", wins: 45, earnings: "450,000 SKY", charity: "Education" },
    { rank: 2, player: "TournamentKing", wins: 38, earnings: "380,000 SKY", charity: "Healthcare" },
    { rank: 3, player: "StrategyMaster", wins: 32, earnings: "320,000 SKY", charity: "Tech" },
    { rank: 4, player: "LuckyStrike", wins: 28, earnings: "280,000 SKY", charity: "Education" },
    { rank: 5, player: "VictorySeeker", wins: 24, earnings: "240,000 SKY", charity: "Healthcare" },
  ];

  const stats = {
    totalTournaments: 156,
    totalParticipants: 450000,
    totalCharityRaised: "$12,500,000",
    avgPrizePool: "500,000 SKY",
    coachSessions: 38900,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🏆 Charity Tournaments & Gaming Coach
        </h1>
        <p className="text-slate-400">High-stakes tournaments with Hope AI coaching</p>
      </div>

      {/* Tournament Stats */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Total Tournaments</div>
          <div className="text-2xl font-bold text-emerald-400">{stats.totalTournaments}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Total Participants</div>
          <div className="text-2xl font-bold text-cyan-400">{(stats.totalParticipants / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Charity Raised</div>
          <div className="text-2xl font-bold text-purple-400">{stats.totalCharityRaised}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Avg Prize Pool</div>
          <div className="text-2xl font-bold text-orange-400">{stats.avgPrizePool}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Coaching Sessions</div>
          <div className="text-2xl font-bold text-green-400">{(stats.coachSessions / 1000).toFixed(0)}K</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-700">
        {["tournaments", "coaching", "leaderboard"].map((tab) => (
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

      {/* Tournaments Tab */}
      {selectedTab === "tournaments" && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-lg font-bold mb-4 text-emerald-400">Active Tournaments</h2>
            <div className="space-y-3">
              {tournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  onClick={() => setSelectedTournament(tournament.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedTournament === tournament.id
                      ? "bg-emerald-500/20 border-emerald-400"
                      : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold">{tournament.name}</h3>
                    <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                      tournament.status === "Live" ? "bg-red-500/20 text-red-400" :
                      tournament.status === "Active" ? "bg-green-500/20 text-green-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {tournament.status}
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{tournament.description}</p>
                  <div className="flex gap-4 text-xs text-slate-400 mb-2">
                    <span>💰 Entry: {tournament.entryFee}</span>
                    <span>🎁 Prize: {tournament.prizePool}</span>
                    <span>👥 {tournament.participants.toLocaleString()} players</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-bold">❤️ {tournament.charityPercentage}% to {tournament.charity}</span>
                    <span className="text-slate-400">{tournament.daysLeft} days left</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tournament Details */}
          <div className="col-span-1">
            {selectedTournament !== null && (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 sticky top-6">
                {(() => {
                  const tournament = tournaments.find(t => t.id === selectedTournament);
                  return (
                    <>
                      <h3 className="font-bold text-lg mb-4 text-emerald-400">{tournament?.name}</h3>
                      <div className="space-y-3 text-sm mb-4">
                        <div>
                          <div className="text-slate-400 mb-1">Entry Fee</div>
                          <div className="font-semibold text-cyan-400">{tournament?.entryFee}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Prize Pool</div>
                          <div className="font-semibold text-emerald-400">{tournament?.prizePool}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Charity Impact</div>
                          <div className="font-semibold text-green-400">{tournament?.charityPercentage}% → {tournament?.charity}</div>
                        </div>
                      </div>
                      <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-bold transition-all">
                        Join Tournament
                      </button>
                    </>
                  );
                })()}
              </div>
            )}

            {selectedTournament === null && (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 text-center">
                <p className="text-slate-400">Select a tournament to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Coaching Tab */}
      {selectedTab === "coaching" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Hope AI Coaching Services</h2>
          <div className="grid grid-cols-2 gap-4">
            {coachingServices.map((coach, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                <h3 className="font-bold mb-2">{coach.name}</h3>
                <p className="text-sm text-slate-400 mb-3">{coach.specialty}</p>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-orange-400 font-bold">⭐ {coach.rating}</span>
                  </div>
                  <div className="text-cyan-400 font-semibold">{(coach.sessions / 1000).toFixed(0)}K sessions</div>
                </div>
                <button className="w-full mt-3 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-bold text-sm transition-all">
                  Book Session
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {selectedTab === "leaderboard" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Tournament Leaderboard</h2>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 bg-slate-900/50 border-b border-slate-700 font-semibold text-sm">
              <div>Rank</div>
              <div>Player</div>
              <div>Wins</div>
              <div>Earnings</div>
              <div>Charity</div>
            </div>
            {leaderboard.map((entry) => (
              <div key={entry.rank} className="grid grid-cols-5 gap-4 p-4 border-b border-slate-700/50 text-sm items-center">
                <div className="font-bold text-lg">
                  {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : entry.rank}
                </div>
                <div className="font-semibold">{entry.player}</div>
                <div className="text-emerald-400">{entry.wins}</div>
                <div className="text-cyan-400 font-bold">{entry.earnings}</div>
                <div className="text-green-400 text-xs">❤️ {entry.charity}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
