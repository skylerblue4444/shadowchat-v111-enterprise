import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Shield, Cpu, Sparkles, 
  Layers, Code, Activity, Globe,
  CheckCircle2, Lock, TrendingUp, Search
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";

/**
 * Sovereign Upgrade Matrix
 * A 1,000-point manifest of platform-wide infrastructure upgrades
 */

interface Upgrade {
  id: number;
  category: 'UI' | 'SEC' | 'FIN' | 'INF' | 'AI';
  title: string;
  points: number;
  status: 'ACTIVE' | 'PENDING' | 'OPTIMIZING';
}

export default function UpgradeMatrix() {
  const { skycoin, addActivity } = useNeuralCore();
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  // Generating a sample of the 1,000 upgrades manifest
  const upgrades: Upgrade[] = Array.from({ length: 1000 }, (_, i) => {
    const categories: Upgrade['category'][] = ['UI', 'SEC', 'FIN', 'INF', 'AI'];
    const cat = categories[i % 5];
    const titles = {
      UI: ["Glassmorphic Refraction", "Neural Transition v4", "Obsidian Depth Mapping", "Emerald Glow Synthesis", "Fluid Motion Core"],
      SEC: ["Quantum Key Rotation", "Biometric Neural Sync", "Threat Vector Isolation", "Sovereign Audit Log", "Post-Quantum Shield"],
      FIN: ["Liquidity Pool Alpha", "SKY/MNS Bridge", "Sovereign Minting v2", "Whale Tier Governance", "Economic Engine Optimization"],
      INF: ["Planetary Sync v2", "Disaster Recovery Alpha", "Legal Compliance Swarm", "Workforce Telemetry", "Supply Chain Oracle"],
      AI: ["Neural Swarm Intelligence", "Autonomous R&D Agent", "Geopolitical Alert v4", "AI Supreme Court Logic", "Predictive Market Oracle"]
    };
    
    return {
      id: i + 1,
      category: cat,
      title: `${titles[cat][i % 5]} #${Math.floor(i/5) + 1}`,
      points: Math.floor(Math.random() * 5) + 1,
      status: i < 444 ? 'ACTIVE' : (i < 777 ? 'OPTIMIZING' : 'PENDING')
    };
  });

  const filteredUpgrades = upgrades.filter(u => 
    (filter === "ALL" || u.category === filter) &&
    u.title.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total Upgrades", value: "1,000", color: "text-white" },
    { label: "Active Points", value: "4,444", color: "text-emerald-500" },
    { label: "Optimization", value: "94.3%", color: "text-cyan-400" },
    { label: "Sovereign Tier", value: "SSS", color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Upgrade<span className="text-emerald-500">Matrix</span>
          </h1>
          <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">
            1,000-Point Sovereign Infrastructure Manifest
          </p>
        </div>
        <div className="flex gap-4">
          {stats.map((s, i) => (
            <div key={i} className="text-right border-l border-slate-800 pl-4">
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{s.label}</div>
              <div className={`font-black uppercase text-xl ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Search 1,000 upgrades..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/40 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-emerald-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 p-1 bg-slate-900/40 border border-slate-800 rounded-xl">
          {["ALL", "UI", "SEC", "FIN", "INF", "AI"].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === cat ? "bg-emerald-500 text-black" : "text-slate-500 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredUpgrades.map((upgrade) => (
          <motion.div 
            key={upgrade.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900/20 border border-slate-800/50 p-4 rounded-xl hover:border-emerald-500/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-3">
              <span className={`text-[9px] font-black px-2 py-1 rounded bg-slate-800 text-slate-400 group-hover:text-emerald-400 transition-colors`}>
                {upgrade.category}
              </span>
              <span className={`text-[9px] font-black ${
                upgrade.status === 'ACTIVE' ? "text-emerald-500" : (upgrade.status === 'OPTIMIZING' ? "text-cyan-400" : "text-slate-600")
              }`}>
                {upgrade.status}
              </span>
            </div>
            <h3 className="text-xs font-bold text-slate-200 mb-1 truncate">{upgrade.title}</h3>
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-slate-600 font-mono">ID: #{upgrade.id.toString().padStart(4, '0')}</span>
              <span className="text-[10px] text-emerald-500/50 font-black">+{upgrade.points} PTS</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-12 p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
            <Zap className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase italic text-white">Sovereign Expansion Active</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">1,000 upgrades integrated across 15+ infrastructure hubs.</p>
          </div>
        </div>
        <button className="bg-emerald-500 text-black px-10 py-4 font-black uppercase italic rounded-xl text-sm hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10">
          Sync Global Matrix
        </button>
      </div>
    </div>
  );
}
