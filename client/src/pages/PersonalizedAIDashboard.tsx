import React, { useState, useEffect } from "react";

/**
 * Personalized AI Dashboard
 * Adaptive layout based on user behavior and preferences
 */

export default function PersonalizedAIDashboard() {
  const [userProfile, setUserProfile] = useState({
    name: "Skyler",
    level: 12,
    reputation: 8750,
    balance: 15420,
    preferences: {
      theme: "dark",
      focus: "trading",
    },
  });

  const [adaptiveWidgets, setAdaptiveWidgets] = useState([
    { id: "portfolio", title: "Portfolio", icon: "💰", value: "$24,580", trend: "+12.5%" },
    { id: "quests", title: "Active Quests", icon: "🎯", value: "5/10", trend: "3 completed" },
    { id: "social", title: "Social Score", icon: "👥", value: "8,750", trend: "+245 today" },
    { id: "ai-agents", title: "AI Agents", icon: "🤖", value: "12/12", trend: "All active" },
  ]);

  const [recommendations, setRecommendations] = useState([
    { id: 1, title: "Trending Quest: Master Trader", description: "Earn 500 SKY by completing 10 trades", icon: "📈" },
    { id: 2, title: "New Bot Available", description: "Trading Bot v2.0 - 30% improved accuracy", icon: "🚀" },
    { id: 3, title: "Charity Campaign", description: "Help fund education in 5 countries", icon: "💚" },
  ]);

  useEffect(() => {
    // Simulate adaptive behavior based on user activity
    const interval = setInterval(() => {
      setAdaptiveWidgets((prev) =>
        prev.map((widget) => ({
          ...widget,
          value: widget.id === "portfolio" ? `$${(Math.random() * 30000 + 15000).toFixed(0)}` : widget.value,
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* User Header */}
      <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur border border-emerald-500/30 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, {userProfile.name}! 👋</h1>
            <p className="text-slate-400">Level {userProfile.level} • Reputation: {userProfile.reputation.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-400 mb-1">{userProfile.balance.toLocaleString()} SKY</div>
            <div className="text-sm text-slate-400">Your Balance</div>
          </div>
        </div>
      </div>

      {/* Adaptive Widgets */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {adaptiveWidgets.map((widget) => (
          <div
            key={widget.id}
            className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 hover:border-emerald-500/50 transition-all cursor-pointer"
          >
            <div className="text-3xl mb-2">{widget.icon}</div>
            <div className="text-sm text-slate-400 mb-1">{widget.title}</div>
            <div className="text-2xl font-bold mb-1">{widget.value}</div>
            <div className="text-xs text-emerald-400">{widget.trend}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="col-span-2">
          <h2 className="text-xl font-bold mb-4 text-emerald-400">Your Activity</h2>
          <div className="space-y-3">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">🎯</div>
                <div>
                  <div className="font-semibold">Quest Completed: Explorer</div>
                  <div className="text-sm text-slate-400">+250 SKY • 30 minutes ago</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">💰</div>
                <div>
                  <div className="font-semibold">Portfolio Update: +$2,450</div>
                  <div className="text-sm text-slate-400">Trading gains • 1 hour ago</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">🤖</div>
                <div>
                  <div className="font-semibold">AI Agent Deployed: Analyst Bot</div>
                  <div className="text-sm text-slate-400">Now monitoring markets • 2 hours ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4 text-emerald-400">For You</h2>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 hover:border-emerald-500/50 transition-all cursor-pointer"
              >
                <div className="text-2xl mb-2">{rec.icon}</div>
                <div className="font-semibold text-sm mb-1">{rec.title}</div>
                <div className="text-xs text-slate-400">{rec.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
