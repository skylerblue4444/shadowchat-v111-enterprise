import React, { useState } from "react";

/**
 * Legacy Feature Archive
 * Restore and preserve all classic 2000-era features
 */

export default function LegacyFeatureArchive() {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState("features");

  const legacyFeatures = [
    {
      id: 1,
      name: "Classic Chat Rooms",
      description: "Original 2000-era chat rooms with real-time messaging",
      year: "2000",
      status: "Restored",
      users: 45000,
      messages: "12.5M/day",
      rooms: 500,
    },
    {
      id: 2,
      name: "Vintage Avatar System",
      description: "Retro pixel-art avatars and customization",
      year: "2000",
      status: "Restored",
      users: 78000,
      avatars: 2500,
      customizations: "Unlimited",
    },
    {
      id: 3,
      name: "Original Quest System",
      description: "Classic quest mechanics with original rewards",
      year: "2000",
      status: "Restored",
      quests: 250,
      completion: "1.2M/week",
      rewards: "Coins, Items, Badges",
    },
    {
      id: 4,
      name: "Legacy Trading Post",
      description: "Original peer-to-peer trading system",
      year: "2001",
      status: "Restored",
      trades: "500K/day",
      items: "50K+",
      value: "$2.5M/day",
    },
    {
      id: 5,
      name: "Classic Guilds",
      description: "Original guild system with territories and wars",
      year: "2000",
      status: "Restored",
      guilds: 5000,
      members: "450K",
      territories: 1000,
    },
    {
      id: 6,
      name: "Retro Achievements",
      description: "Original achievement and badge system",
      year: "2000",
      status: "Restored",
      achievements: 500,
      earned: "125M",
      rarity: "Common to Mythic",
    },
  ];

  const restoredMechanics = [
    { mechanic: "Leveling System", description: "Original 1-100 level progression", status: "✓ Active" },
    { mechanic: "Experience Points", description: "Classic XP system with multipliers", status: "✓ Active" },
    { mechanic: "Skill Trees", description: "Original skill point allocation", status: "✓ Active" },
    { mechanic: "Crafting System", description: "Classic item crafting and recipes", status: "✓ Active" },
    { mechanic: "Pet System", description: "Original companion pets with growth", status: "✓ Active" },
    { mechanic: "Housing System", description: "Classic player housing and decoration", status: "✓ Active" },
  ];

  const classicThemes = [
    { name: "Y2K Neon", description: "Bright neon colors and retro fonts", active: true },
    { name: "Vintage Green", description: "Classic terminal green aesthetic", active: false },
    { name: "Pixel Perfect", description: "Pure pixel-art styling", active: false },
    { name: "Retro Blue", description: "Original ShadowChat blue theme", active: false },
  ];

  const stats = {
    featuresRestored: 2000,
    classicUsers: 450000,
    legacyItems: 50000,
    historicalValue: "$125,000,000",
    activeSessions: 125000,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🏛️ Legacy Feature Archive
        </h1>
        <p className="text-slate-400">Restored 2000-era features and classic mechanics</p>
      </div>

      {/* Restoration Stats */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Features Restored</div>
          <div className="text-2xl font-bold text-emerald-400">{stats.featuresRestored}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Classic Users</div>
          <div className="text-2xl font-bold text-cyan-400">{(stats.classicUsers / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Legacy Items</div>
          <div className="text-2xl font-bold text-purple-400">{(stats.legacyItems / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Historical Value</div>
          <div className="text-2xl font-bold text-orange-400">{stats.historicalValue}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Active Sessions</div>
          <div className="text-2xl font-bold text-green-400">{(stats.activeSessions / 1000).toFixed(0)}K</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-700">
        {["features", "mechanics", "themes"].map((tab) => (
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

      {/* Features Tab */}
      {selectedTab === "features" && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-lg font-bold mb-4 text-emerald-400">Restored Legacy Features</h2>
            <div className="grid grid-cols-2 gap-4">
              {legacyFeatures.map((feature) => (
                <div
                  key={feature.id}
                  onClick={() => setSelectedFeature(feature.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedFeature === feature.id
                      ? "bg-emerald-500/20 border-emerald-400"
                      : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold">{feature.name}</h3>
                    <div className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400">
                      {feature.status}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{feature.description}</p>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>📅 {feature.year}</div>
                    <div>👥 {feature.users ? `${(feature.users / 1000).toFixed(0)}K users` : ""}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Details */}
          <div className="col-span-1">
            {selectedFeature !== null && (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 sticky top-6">
                {(() => {
                  const feature = legacyFeatures.find(f => f.id === selectedFeature);
                  return (
                    <>
                      <h3 className="font-bold text-lg mb-4 text-emerald-400">{feature?.name}</h3>
                      <div className="space-y-3 text-sm mb-4">
                        <div>
                          <div className="text-slate-400 mb-1">Year Released</div>
                          <div className="font-semibold">{feature?.year}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Status</div>
                          <div className="font-semibold text-green-400">{feature?.status}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Active Users</div>
                          <div className="font-semibold text-cyan-400">{feature?.users?.toLocaleString()}</div>
                        </div>
                      </div>
                      <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-bold transition-all">
                        Access Feature
                      </button>
                    </>
                  );
                })()}
              </div>
            )}

            {selectedFeature === null && (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 text-center">
                <p className="text-slate-400">Select a feature to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mechanics Tab */}
      {selectedTab === "mechanics" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Restored Game Mechanics</h2>
          <div className="grid grid-cols-2 gap-4">
            {restoredMechanics.map((item, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                <h3 className="font-bold mb-2">{item.mechanic}</h3>
                <p className="text-sm text-slate-400 mb-3">{item.description}</p>
                <div className="text-green-400 font-bold text-sm">{item.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Themes Tab */}
      {selectedTab === "themes" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Classic UI Themes</h2>
          <div className="grid grid-cols-2 gap-4">
            {classicThemes.map((theme, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  theme.active
                    ? "bg-emerald-500/20 border-emerald-400"
                    : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                }`}
              >
                <h3 className="font-bold mb-2">{theme.name}</h3>
                <p className="text-sm text-slate-400 mb-3">{theme.description}</p>
                <button className={`w-full py-2 rounded font-bold text-sm transition-all ${
                  theme.active
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                }`}>
                  {theme.active ? "Active" : "Activate"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
