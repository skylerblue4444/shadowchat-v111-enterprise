import React, { useState } from "react";

/**
 * Retro Hub v3.0
 * The ultimate high-value, profitable, and fun retro experience
 */

export default function RetroHub() {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("archive");

  const archiveFeatures = [
    {
      id: 1,
      name: "3D Isometric Chat",
      description: "Original 2000-era isometric chat rooms with custom bubbles.",
      profitModel: "Premium Bubbles & Room Ownership",
      value: "High",
      stats: "12.5M Msgs/Day",
    },
    {
      id: 2,
      name: "Flash Gaming Vault",
      description: "50+ classic Flash games restored with modern leaderboards.",
      profitModel: "Tournament Entry Fees & Prize Pools",
      value: "Legendary",
      stats: "450K Daily Players",
    },
    {
      id: 3,
      name: "Pixel Art Studio",
      description: "Original 32x32 avatar creator with 10,000+ item combinations.",
      profitModel: "NFT Minting & Item Marketplace",
      value: "Essential",
      stats: "78K Avatars/Week",
    },
    {
      id: 4,
      name: "Legacy Trade Post",
      description: "Original 10-slot P2P trading with historical item tracking.",
      profitModel: "Transaction Fees & Escrow Services",
      value: "Core",
      stats: "500K Trades/Day",
    },
  ];

  const profitabilityMetrics = [
    { label: "Daily Revenue", value: "$45,000", change: "+12%" },
    { label: "User Retention", value: "88%", change: "+5%" },
    { label: "Avg Spend/User", value: "$12.50", change: "+18%" },
    { label: "Marketplace Vol", value: "$2.5M", change: "+25%" },
  ];

  const funQuests = [
    { name: "Retro Explorer", reward: "500 SKY", progress: 75 },
    { name: "Pixel Master", reward: "1,000 SKY", progress: 40 },
    { name: "Trade Tycoon", reward: "2,500 SKY", progress: 10 },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Sharp Premium Header */}
      <div className="flex justify-between items-end mb-12 border-b-2 border-emerald-500/30 pb-6">
        <div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none mb-2">
            Retro<span className="text-emerald-500">Hub</span>
          </h1>
          <p className="text-emerald-500/60 font-mono text-sm tracking-[0.3em] uppercase">
            Sovereign Archive // High-Value Restoration
          </p>
        </div>
        <div className="text-right font-mono">
          <div className="text-xs text-slate-500 uppercase mb-1">Total Valuation</div>
          <div className="text-3xl font-black text-emerald-400">$125,000,000</div>
        </div>
      </div>

      {/* Profitability Dashboard */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {profitabilityMetrics.map((metric, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-slate-800 p-6 rounded-sm hover:border-emerald-500/50 transition-all group">
            <div className="text-xs text-slate-500 uppercase font-bold mb-2 group-hover:text-emerald-500 transition-colors">{metric.label}</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-black">{metric.value}</div>
              <div className="text-xs text-emerald-500 font-bold">{metric.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar Quests */}
        <div className="col-span-3 space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Active Quests</h2>
          {funQuests.map((quest, idx) => (
            <div key={idx} className="bg-slate-900/20 border-l-2 border-emerald-500 p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold">{quest.name}</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">{quest.reward}</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${quest.progress}%` }}></div>
              </div>
            </div>
          ))}
          
          <div className="pt-8">
            <div className="bg-emerald-500 p-6 rounded-sm text-black">
              <h3 className="font-black uppercase italic mb-2">Join Pro Tier</h3>
              <p className="text-xs font-bold mb-4 opacity-80">Unlock exclusive 2000-era items and 2x profit share.</p>
              <button className="w-full bg-black text-white py-2 font-black text-sm uppercase hover:bg-slate-900 transition-all">Upgrade Now</button>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="col-span-9">
          <div className="flex gap-4 mb-8">
            {["archive", "marketplace", "tournaments"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 text-sm font-black uppercase tracking-widest transition-all ${
                  activeTab === tab
                    ? "bg-emerald-500 text-black"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6">
            {archiveFeatures.map((feature) => (
              <div
                key={feature.id}
                onClick={() => setSelectedFeature(feature.id)}
                className={`p-8 border-2 transition-all cursor-pointer group ${
                  selectedFeature === feature.id
                    ? "bg-emerald-500/5 border-emerald-500"
                    : "bg-slate-900/40 border-slate-800 hover:border-emerald-500/30"
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className={`text-2xl font-black uppercase italic transition-colors ${
                    selectedFeature === feature.id ? "text-emerald-400" : "group-hover:text-emerald-400"
                  }`}>
                    {feature.name}
                  </h3>
                  <span className="text-[10px] font-bold bg-slate-800 px-2 py-1 text-slate-500 uppercase tracking-widest">
                    {feature.value} Value
                  </span>
                </div>
                
                <p className="text-sm text-slate-400 leading-relaxed mb-6 h-12 overflow-hidden">
                  {feature.description}
                </p>

                <div className="flex justify-between items-center pt-6 border-t border-slate-800/50">
                  <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    {feature.profitModel}
                  </div>
                  <div className="text-xs font-black text-slate-500">
                    {feature.stats}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer System Info */}
      <div className="mt-16 pt-8 border-t border-slate-900 flex justify-between items-center text-[10px] font-bold text-slate-700 uppercase tracking-[0.4em]">
        <div>System: Stable // Uptime: 99.99%</div>
        <div>ShadowChat v1111 // Sovereign Edition</div>
        <div>Valuation Certified by AI Guardian</div>
      </div>
    </div>
  );
}
