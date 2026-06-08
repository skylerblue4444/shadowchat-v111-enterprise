import React, { useState } from "react";

/**
 * Next-Gen Features Pack
 * Cutting-edge AI and blockchain innovations
 */

export default function NextGenFeatures() {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState("features");

  const nextGenFeatures = [
    {
      id: 1,
      name: "Quantum AI Engine",
      description: "Next-gen AI with quantum-inspired algorithms",
      category: "AI",
      status: "Beta",
      power: "1000x faster",
      users: 5000,
      accuracy: "99.9%",
    },
    {
      id: 2,
      name: "Neural Network Trading",
      description: "AI-powered trading with neural networks",
      category: "Trading",
      status: "Live",
      power: "Real-time",
      users: 12000,
      accuracy: "94.2%",
    },
    {
      id: 3,
      name: "Metaverse Integration",
      description: "Full metaverse connectivity and avatars",
      category: "Social",
      status: "Beta",
      power: "3D Worlds",
      users: 8500,
      accuracy: "N/A",
    },
    {
      id: 4,
      name: "AI-Generated Content",
      description: "Autonomous content creation and curation",
      category: "Media",
      status: "Live",
      power: "24/7 Creation",
      users: 45000,
      accuracy: "98.5%",
    },
    {
      id: 5,
      name: "Blockchain Governance",
      description: "Full on-chain governance and voting",
      category: "Governance",
      status: "Live",
      power: "Immutable",
      users: 67000,
      accuracy: "100%",
    },
    {
      id: 6,
      name: "Cross-Chain Bridge",
      description: "Multi-chain token swapping and liquidity",
      category: "DeFi",
      status: "Beta",
      power: "Multi-chain",
      users: 9800,
      accuracy: "99.8%",
    },
  ];

  const innovations = [
    { name: "Quantum Encryption", status: "✓ Deployed", impact: "Military-grade security" },
    { name: "AI Predictive Analytics", status: "✓ Live", impact: "99.9% accuracy" },
    { name: "Zero-Knowledge Proofs", status: "✓ Active", impact: "Privacy-first transactions" },
    { name: "Autonomous Agents", status: "✓ Deployed", impact: "24/7 operations" },
    { name: "Neural Interfaces", status: "🔄 Coming", impact: "Brain-computer interaction" },
    { name: "Quantum Computing", status: "🔄 Coming", impact: "Exponential speedup" },
  ];

  const roadmap = [
    { quarter: "Q3 2026", milestone: "Metaverse Launch", status: "In Progress", progress: 75 },
    { quarter: "Q4 2026", milestone: "Quantum AI Release", status: "Planned", progress: 40 },
    { quarter: "Q1 2027", milestone: "Neural Interface Beta", status: "Planned", progress: 20 },
    { quarter: "Q2 2027", milestone: "Full Automation", status: "Planned", progress: 10 },
  ];

  const stats = {
    nextGenFeatures: 6,
    activeInnovations: 4,
    betaUsers: 23300,
    liveUsers: 124000,
    futureValue: "$1,000,000,000",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🚀 Next-Gen Features Pack
        </h1>
        <p className="text-slate-400">Cutting-edge AI and blockchain innovations</p>
      </div>

      {/* Innovation Stats */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Next-Gen Features</div>
          <div className="text-2xl font-bold text-emerald-400">{stats.nextGenFeatures}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Active Innovations</div>
          <div className="text-2xl font-bold text-cyan-400">{stats.activeInnovations}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Beta Users</div>
          <div className="text-2xl font-bold text-purple-400">{(stats.betaUsers / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Live Users</div>
          <div className="text-2xl font-bold text-orange-400">{(stats.liveUsers / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Future Value</div>
          <div className="text-2xl font-bold text-green-400">{stats.futureValue}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-700">
        {["features", "innovations", "roadmap"].map((tab) => (
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
            <h2 className="text-lg font-bold mb-4 text-emerald-400">Next-Gen Features</h2>
            <div className="grid grid-cols-2 gap-4">
              {nextGenFeatures.map((feature) => (
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
                    <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                      feature.status === "Live" ? "bg-green-500/20 text-green-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {feature.status}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{feature.description}</p>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>⚡ {feature.power}</div>
                    <div>👥 {(feature.users / 1000).toFixed(0)}K users</div>
                    <div>🎯 {feature.accuracy} accuracy</div>
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
                  const feature = nextGenFeatures.find(f => f.id === selectedFeature);
                  return (
                    <>
                      <h3 className="font-bold text-lg mb-4 text-emerald-400">{feature?.name}</h3>
                      <div className="space-y-3 text-sm mb-4">
                        <div>
                          <div className="text-slate-400 mb-1">Category</div>
                          <div className="font-semibold">{feature?.category}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Status</div>
                          <div className={`font-semibold ${
                            feature?.status === "Live" ? "text-green-400" : "text-yellow-400"
                          }`}>
                            {feature?.status}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Performance</div>
                          <div className="font-semibold text-cyan-400">{feature?.power}</div>
                        </div>
                      </div>
                      <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-bold transition-all">
                        Try Feature
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

      {/* Innovations Tab */}
      {selectedTab === "innovations" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Active Innovations</h2>
          <div className="grid grid-cols-2 gap-4">
            {innovations.map((item, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                <h3 className="font-bold mb-2">{item.name}</h3>
                <p className="text-sm text-slate-400 mb-3">{item.impact}</p>
                <div className={`font-bold text-sm ${
                  item.status.includes("✓") ? "text-green-400" : "text-yellow-400"
                }`}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roadmap Tab */}
      {selectedTab === "roadmap" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Product Roadmap</h2>
          <div className="space-y-3">
            {roadmap.map((item, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold">{item.milestone}</h3>
                    <p className="text-sm text-slate-400">{item.quarter}</p>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                    item.status === "In Progress" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-slate-600/20 text-slate-400"
                  }`}>
                    {item.status}
                  </div>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 mt-2">{item.progress}% complete</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
