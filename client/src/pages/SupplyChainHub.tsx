import React, { useState } from "react";

/**
 * AI-Driven Supply Chain & Logistics Hub
 * Management of digital and physical goods distribution
 */

export default function SupplyChainHub() {
  const [activeTab, setActiveTab] = useState("digital");

  const logisticsMetrics = [
    { label: "Active Shipments", value: "12,450", trend: "+15%" },
    { label: "Delivery Success", value: "99.8%", trend: "Stable" },
    { label: "Inventory Vol", value: "45.2M", trend: "+8%" },
    { label: "AI Optimization", value: "94%", trend: "+12%" },
  ];

  const shipments = [
    { id: "SH-1024", item: "Quantum Node v2", status: "In Transit", destination: "Tokyo, JP", priority: "High" },
    { id: "SH-1025", item: "Enterprise SDK License", status: "Delivered", destination: "London, UK", priority: "Standard" },
    { id: "SH-1026", item: "Custom AI Agent Pack", status: "Processing", destination: "New York, US", priority: "Critical" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Logistics<span className="text-emerald-500">Hub</span>
          </h1>
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            Autonomous Supply Chain // Global Distribution
          </p>
        </div>
        <div className="text-right">
          <button className="bg-emerald-500 text-black px-8 py-3 font-black uppercase italic tracking-tighter hover:bg-emerald-400 transition-all">
            Track Shipment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {logisticsMetrics.map((metric, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-slate-800 p-6 rounded-sm">
            <div className="text-xs text-slate-500 uppercase font-bold mb-2">{metric.label}</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-black">{metric.value}</div>
              <div className="text-xs text-emerald-500 font-bold">{metric.trend}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Shipment Feed */}
        <div className="col-span-8">
          <div className="flex gap-8 mb-8 border-b border-slate-900">
            {["digital", "physical", "inventory"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
                  activeTab === tab ? "border-emerald-500 text-emerald-500" : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="bg-slate-900/20 border-l-2 border-slate-800 p-6 flex justify-between items-center group hover:border-emerald-500 transition-all">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{shipment.id}</span>
                    <span className="text-[10px] text-slate-600 font-mono uppercase">{shipment.destination}</span>
                  </div>
                  <h3 className="text-lg font-black uppercase italic group-hover:text-slate-200 transition-colors">{shipment.item}</h3>
                </div>
                <div className="text-right">
                  <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2 inline-block ${
                    shipment.status === "Delivered" ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-800 text-slate-500"
                  }`}>
                    {shipment.status}
                  </div>
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{shipment.priority} Priority</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Map (Placeholder) */}
        <div className="col-span-4">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-sm h-full flex flex-col items-center justify-center text-center">
            <div className="w-full h-48 bg-slate-800/20 relative mb-8 rounded-sm overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 border border-emerald-500/10"></div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-700 animate-pulse">Global Network Map Loading...</div>
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-2">Live Distribution</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">AI is currently optimizing 1,245 routes across 45 countries to ensure sub-24h delivery for all digital assets.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
