import React, { useState } from "react";

/**
 * Environmental & Sustainability Impact Hub
 * Carbon tracking, ESG compliance, and green initiatives
 */

export default function SustainabilityHub() {
  const [activeMetric, setActiveMetric] = useState("carbon");

  const sustainabilityMetrics = [
    { label: "Carbon Offset", value: "2.4M", unit: "Tons CO2e" },
    { label: "Renewable Energy", value: "98.5%", unit: "Usage" },
    { label: "ESG Score", value: "A+", unit: "Rating" },
    { label: "Impact Value", value: "$850M", unit: "Created" },
  ];

  const initiatives = [
    { name: "Solar Farm Network", status: "Active", impact: "450MW", region: "Global" },
    { name: "Ocean Cleanup Program", status: "Active", impact: "125K Tons", region: "Pacific" },
    { name: "Reforestation Initiative", status: "Active", impact: "50M Trees", region: "Amazon" },
    { name: "Circular Economy", status: "Active", impact: "95% Recycled", region: "Global" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Sustainability<span className="text-emerald-500">Hub</span>
          </h1>
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            ESG Impact // Environmental Stewardship
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Impact Status</div>
          <div className="text-emerald-500 font-black uppercase text-sm animate-pulse">● Carbon Negative</div>
        </div>
      </div>

      {/* Sustainability Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {sustainabilityMetrics.map((metric, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-slate-800 p-6 rounded-sm">
            <div className="text-xs text-slate-500 uppercase font-bold mb-2">{metric.label}</div>
            <div className="text-3xl font-black mb-1">{metric.value}</div>
            <div className="text-[10px] text-emerald-500 font-bold uppercase">{metric.unit}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Active Initiatives */}
        <div className="col-span-8">
          <h2 className="text-xl font-black uppercase tracking-widest mb-8">Active Sustainability Programs</h2>
          <div className="space-y-4">
            {initiatives.map((initiative, idx) => (
              <div key={idx} className="bg-slate-900/20 border-l-2 border-slate-800 p-6 group hover:border-emerald-500 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-black uppercase italic group-hover:text-emerald-500 transition-colors">{initiative.name}</h3>
                    <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">{initiative.region}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-3 py-1 uppercase mb-1 inline-block">{initiative.status}</div>
                    <div className="text-lg font-black text-emerald-500">{initiative.impact}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Dashboard */}
        <div className="col-span-4">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-emerald-500">Impact Analytics</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-8">
              Real-time tracking of environmental impact across 45 countries with verified carbon credits and ESG compliance.
            </p>
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-sm">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">2024 Impact</div>
                <div className="text-2xl font-black text-emerald-500">-2.4M CO2</div>
                <div className="text-[10px] text-slate-600 font-mono mt-1">Net Negative Emissions</div>
              </div>
              <button className="w-full bg-slate-800 text-white py-3 font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all">
                View Report
              </button>
              <button className="w-full bg-emerald-500 text-black py-3 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all">
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
