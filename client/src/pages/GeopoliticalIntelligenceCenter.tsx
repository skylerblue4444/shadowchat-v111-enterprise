import React, { useState } from "react";

/**
 * Geopolitical & Strategic Intelligence Center
 * Real-time global intelligence and strategic insights
 */

export default function GeopoliticalIntelligenceCenter() {
  const [activeRegion, setActiveRegion] = useState("global");

  const intelligenceMetrics = [
    { label: "Active Monitors", value: "195", status: "Countries" },
    { label: "Data Sources", value: "50K+", status: "Feeds" },
    { label: "Alert Accuracy", value: "97.3%", status: "Verified" },
    { label: "Response Time", value: "<2s", status: "Real-Time" },
  ];

  const globalAlerts = [
    { id: 1, region: "Asia-Pacific", threat: "Trade Policy Shift", severity: "High", timestamp: "2024-06-08 14:32" },
    { id: 2, region: "Europe", threat: "Regulatory Update", severity: "Medium", timestamp: "2024-06-08 13:15" },
    { id: 3, region: "Americas", threat: "Market Volatility", severity: "Low", timestamp: "2024-06-08 12:45" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Geopolitical<span className="text-emerald-500">Center</span>
          </h1>
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            Strategic Intelligence // Global Monitoring
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Global Status</div>
          <div className="text-emerald-500 font-black uppercase text-sm animate-pulse">● Monitoring Active</div>
        </div>
      </div>

      {/* Intelligence Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {intelligenceMetrics.map((metric, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-slate-800 p-6 rounded-sm">
            <div className="text-xs text-slate-500 uppercase font-bold mb-2">{metric.label}</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-black">{metric.value}</div>
              <div className="text-[10px] text-emerald-500 font-bold uppercase">{metric.status}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Alert Feed */}
        <div className="col-span-8">
          <h2 className="text-xl font-black uppercase tracking-widest mb-8">Real-Time Intelligence Feed</h2>
          <div className="space-y-4">
            {globalAlerts.map((alert) => (
              <div key={alert.id} className="bg-slate-900/20 border-l-4 border-slate-800 p-6 group hover:border-emerald-500 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-black uppercase italic group-hover:text-emerald-500 transition-colors">{alert.threat}</h3>
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        alert.severity === "High" ? "bg-red-500/10 text-red-500" : alert.severity === "Medium" ? "bg-yellow-500/10 text-yellow-500" : "bg-emerald-500/10 text-emerald-500"
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{alert.region}</div>
                  </div>
                  <div className="text-[10px] text-slate-600 font-mono">{alert.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Dashboard */}
        <div className="col-span-4">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-emerald-500">Strategic Analysis</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-8">
              Real-time analysis of 195 countries across political stability, economic indicators, regulatory trends, and market opportunities.
            </p>
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-sm">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Top Opportunity</div>
                <div className="text-sm font-black text-emerald-500">Southeast Asia Expansion</div>
                <div className="text-[10px] text-slate-600 font-mono mt-1">Confidence: 94.2%</div>
              </div>
              <button className="w-full bg-slate-800 text-white py-3 font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all">
                View Analysis
              </button>
              <button className="w-full bg-emerald-500 text-black py-3 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all">
                Set Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
