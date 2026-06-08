import React, { useState } from "react";

/**
 * Global Information & Intelligence Center
 * Real-time platform-wide insights and system data
 */

export default function GlobalIntelligenceCenter() {
  const [activeCategory, setActiveCategory] = useState("all");

  const systemStats = [
    { label: "Total Transactions", value: "45.2M", trend: "+12%" },
    { label: "Active Swarm Tasks", value: "1,245", trend: "+5%" },
    { label: "Global Uptime", value: "99.999%", trend: "Stable" },
    { label: "Data Processed", value: "1.2PB", trend: "+25%" },
  ];

  const categories = [
    { id: "all", name: "System Wide" },
    { id: "ai", name: "AI Performance" },
    { id: "economic", name: "Economic Health" },
    { id: "social", name: "Social Reach" },
  ];

  const intelligenceLogs = [
    { id: 1, type: "AI", message: "Swarm intelligence consensus reached on Proposal #127.", time: "2m ago", priority: "High" },
    { id: 2, type: "Economic", message: "Skycoin4444 staking volume reached new ATH of 1.2B.", time: "15m ago", priority: "Critical" },
    { id: 3, type: "System", message: "Self-healing protocol successfully optimized node latency.", time: "45m ago", priority: "Medium" },
    { id: 4, type: "Social", message: "Global Social Hub reached 500K concurrent active users.", time: "1h ago", priority: "High" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Intelligence<span className="text-emerald-500">Center</span>
          </h1>
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            Global Monitoring // Real-Time Insights
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">System Status</div>
          <div className="text-emerald-500 font-black uppercase text-sm animate-pulse">● All Systems Operational</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {systemStats.map((stat, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-slate-800 p-6 rounded-sm">
            <div className="text-xs text-slate-500 uppercase font-bold mb-2">{stat.label}</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-black">{stat.value}</div>
              <div className="text-xs text-emerald-500 font-bold">{stat.trend}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-12 gap-12">
        {/* Intelligence Logs */}
        <div className="col-span-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black uppercase tracking-widest">Intelligence Feed</h2>
            <div className="flex gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeCategory === cat.id ? "text-emerald-500" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  [{cat.name}]
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {intelligenceLogs.map((log) => (
              <div key={log.id} className="bg-slate-900/20 border-l-2 border-slate-800 p-6 flex justify-between items-center group hover:border-emerald-500 transition-all">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{log.type}</span>
                    <span className="text-[10px] text-slate-600 font-mono uppercase">{log.time}</span>
                  </div>
                  <p className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{log.message}</p>
                </div>
                <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm ${
                  log.priority === "Critical" ? "bg-red-500/10 text-red-500" : "bg-slate-800 text-slate-500"
                }`}>
                  {log.priority}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Visualization (Placeholder) */}
        <div className="col-span-4">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-sm h-full flex flex-col items-center justify-center text-center">
            <div className="w-32 h-32 border-2 border-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-spin-slow">
              <div className="w-24 h-24 border-2 border-emerald-500/40 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,1)]"></div>
                </div>
              </div>
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-2">Neural Map</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">Visualizing global swarm consensus and network health across 12 decentralized nodes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
