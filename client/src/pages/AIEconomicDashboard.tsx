import React, { useState } from "react";
import { economicEngine } from "../lib/economic-engine";

export default function AIEconomicDashboard() {
  const [userId] = useState("user-demo");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedGame, setSelectedGame] = useState<"slots" | "dice" | "cards" | "roulette">("slots");

  const balance = economicEngine.getBalance(userId) || economicEngine.initializeUser(userId);
  const gameStats = economicEngine.getGameStats(userId);
  const leaderboard = economicEngine.getLeaderboard("earnings", 5);

  const handlePlayGame = async () => {
    try {
      const result = await economicEngine.playGame(userId, selectedGame, 100);
      alert(`Game Result: ${result.result.toUpperCase()}! Payout: ${result.payout} coins`);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleEarnCoins = async () => {
    await economicEngine.earnCoins(userId, 50, "Daily bonus");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 sc-text-gradient-emerald">
            💰 AI Economic Dashboard
          </h1>
          <p className="text-gray-400">Earn, Spend, Gamble, Tip & Donate</p>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="sc-glass p-6 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">💰 Coins</p>
            <p className="text-3xl font-bold text-emerald-400">{balance.coins.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">Earned: {balance.totalEarned}</p>
          </div>
          <div className="sc-glass p-6 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">💳 Credits</p>
            <p className="text-3xl font-bold text-blue-400">{balance.credits}</p>
            <p className="text-xs text-gray-500 mt-2">Premium currency</p>
          </div>
          <div className="sc-glass p-6 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">💎 Gems</p>
            <p className="text-3xl font-bold text-purple-400">{balance.gems}</p>
            <p className="text-xs text-gray-500 mt-2">Rare drops</p>
          </div>
          <div className="sc-glass p-6 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">❤️ Charity</p>
            <p className="text-3xl font-bold text-red-400">{balance.totalCharityDonated}</p>
            <p className="text-xs text-gray-500 mt-2">Donated</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="sc-tabs mb-8">
          {["overview", "games", "shop", "charity", "leaderboard"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`sc-tab ${activeTab === tab ? "active" : ""}`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="sc-glass p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Your Economy</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Income Streams</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Daily Login Bonus</span>
                      <span className="text-emerald-400">+50 coins</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>AI Agent Tasks</span>
                      <span className="text-emerald-400">+100 coins</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Referral Rewards</span>
                      <span className="text-emerald-400">+25 coins</span>
                    </div>
                    <button onClick={handleEarnCoins} className="sc-btn-emerald w-full mt-4">
                      Claim Daily Bonus
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Spending Habits</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Spent</span>
                      <span className="text-red-400">{balance.totalSpent} coins</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tips Sent</span>
                      <span className="text-orange-400">{balance.totalTipped} coins</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Charity Donated</span>
                      <span className="text-purple-400">{balance.totalCharityDonated} coins</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Games Tab */}
        {activeTab === "games" && (
          <div className="space-y-6">
            <div className="sc-glass p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">🎰 Play Games</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Select Game</h3>
                  <div className="space-y-2">
                    {(["slots", "dice", "cards", "roulette"] as const).map((game) => (
                      <button
                        key={game}
                        onClick={() => setSelectedGame(game)}
                        className={`w-full p-3 rounded-lg transition-all text-left ${
                          selectedGame === game
                            ? "bg-emerald-900/30 border border-emerald-500"
                            : "bg-gray-900/30 border border-gray-700 hover:border-emerald-500/50"
                        }`}
                      >
                        <p className="font-semibold capitalize">{game}</p>
                        <p className="text-xs text-gray-400">2x multiplier on win</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Game Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Games Played</span>
                      <span className="font-bold">{gameStats.gamesPlayed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Wagered</span>
                      <span className="font-bold">{gameStats.totalWagered}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Won</span>
                      <span className="font-bold text-emerald-400">{gameStats.totalWon}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Win Rate</span>
                      <span className="font-bold">{gameStats.winRate}</span>
                    </div>
                    <button onClick={handlePlayGame} className="sc-btn-emerald w-full mt-4">
                      Play {selectedGame} (Wager 100 coins)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shop Tab */}
        {activeTab === "shop" && (
          <div className="sc-glass p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">🛒 Shop</h2>
            <p className="text-gray-400">Premium items and cosmetics coming soon</p>
          </div>
        )}

        {/* Charity Tab */}
        {activeTab === "charity" && (
          <div className="sc-glass p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">❤️ Charity</h2>
            <p className="text-gray-400">Support causes and earn karma points</p>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <div className="sc-glass p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">🏆 Top Earners</h2>
            <div className="space-y-2">
              {leaderboard.map((user, idx) => (
                <div key={user.userId} className="flex items-center justify-between p-3 bg-gray-900/30 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-emerald-400">#{idx + 1}</span>
                    <span>{user.userId}</span>
                  </div>
                  <span className="font-bold text-emerald-400">{user.totalEarned.toLocaleString()} coins</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
