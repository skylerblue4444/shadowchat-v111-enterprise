import React, { useState } from "react";

/**
 * Financial & Banking Intelligence Hub
 * Autonomous financial analysis, trading, and wealth management
 */

export default function FinancialIntelligenceHub() {
  const [activeAsset, setActiveAsset] = useState("crypto");

  const portfolioMetrics = [
    { label: "Total AUM", value: "$2.4B", change: "+18.5%" },
    { label: "Daily Volume", value: "$450M", change: "+12.3%" },
    { label: "Avg ROI", value: "42.7%", change: "+5.2%" },
    { label: "Risk Score", value: "Low", change: "Stable" },
  ];

  const assetClasses = [
    { name: "Cryptocurrency", value: "$850M", allocation: "35%", performance: "+156%" },
    { name: "Equities", value: "$720M", allocation: "30%", performance: "+18%" },
    { name: "Bonds", value: "$480M", allocation: "20%", performance: "+8%" },
    { name: "Commodities", value: "$350M", allocation: "15%", performance: "+12%" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Financial<span className="text-emerald-500">Hub</span>
          </h1>
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            Autonomous Wealth Management // AI Trading
          </p>
        </div>
        <div className="text-right">
          <button className="bg-emerald-500 text-black px-8 py-3 font-black uppercase italic tracking-tighter hover:bg-emerald-400 transition-all">
            Trade Now
          </button>
        </div>
      </div>

      {/* Portfolio Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {portfolioMetrics.map((metric, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-slate-800 p-6 rounded-sm">
            <div className="text-xs text-slate-500 uppercase font-bold mb-2">{metric.label}</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-black">{metric.value}</div>
              <div className={`text-xs font-bold uppercase ${metric.change.includes("+") ? "text-emerald-500" : "text-slate-500"}`}>
                {metric.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Asset Allocation */}
        <div className="col-span-8">
          <h2 className="text-xl font-black uppercase tracking-widest mb-8">Portfolio Allocation</h2>
          <div className="space-y-4">
            {assetClasses.map((asset, idx) => (
              <div key={idx} className="bg-slate-900/20 border-l-2 border-slate-800 p-6 group hover:border-emerald-500 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-black uppercase italic group-hover:text-emerald-500 transition-colors">{asset.name}</h3>
                    <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">{asset.value}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-500 mb-1">{asset.allocation}</div>
                    <div className="text-[10px] font-bold text-emerald-500 uppercase">{asset.performance}</div>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: asset.allocation }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trading Dashboard */}
        <div className="col-span-4">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-emerald-500">AI Trading Engine</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-8">
              Our autonomous trading system executes 10,000+ trades per second with 94.2% win rate across all asset classes.
            </p>
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-sm">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Next Trade Signal</div>
                <div className="text-sm font-black text-emerald-500">BUY ETH/USD</div>
                <div className="text-[10px] text-slate-600 font-mono mt-1">Confidence: 98.7%</div>
              </div>
              <button className="w-full bg-slate-800 text-white py-3 font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all">
                View Signals
              </button>
              <button className="w-full bg-emerald-500 text-black py-3 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all">
                Execute Trade
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
