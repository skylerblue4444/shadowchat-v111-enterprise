import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Navigation, Mic, Cpu, Globe, Shield, 
  Zap, Search, Command, Activity, Sparkles
} from "lucide-react";
import { Link } from "wouter";

/**
 * Neural Navigation Hub
 * Advanced UI/UX for platform-wide navigation and voice commands
 */

export default function NeuralNavigationHub() {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [recentHubs, setRecentHubs] = useState([
    { path: "/quantum-security", label: "Quantum Vault", icon: Shield },
    { path: "/legal-compliance", label: "Legal Engine", icon: Shield },
    { path: "/financial", label: "Financial Hub", icon: Zap },
  ]);

  const categories = [
    { id: "all", label: "All Hubs" },
    { id: "enterprise", label: "Enterprise" },
    { id: "gaming", label: "Gaming & Events" },
    { id: "intelligence", label: "Intelligence" },
    { id: "security", label: "Security" },
  ];

  const hubs = [
    { path: "/legal-compliance", label: "Legal Engine", category: "enterprise", icon: Shield, color: "text-emerald-400" },
    { path: "/financial", label: "Financial Hub", category: "enterprise", icon: Zap, color: "text-cyan-400" },
    { path: "/supply-chain", label: "Supply Chain", category: "enterprise", icon: Globe, color: "text-amber-400" },
    { path: "/talent-market", label: "Talent Market", category: "enterprise", icon: Activity, color: "text-purple-400" },
    { path: "/quantum-security", label: "Quantum Vault", category: "security", icon: Shield, color: "text-red-400" },
    { path: "/gaming", label: "Gaming Hub", category: "gaming", icon: Sparkles, color: "text-emerald-400" },
    { path: "/events-hub", label: "Events Hub", category: "gaming", icon: Activity, color: "text-red-400" },
    { path: "/geopolitical", label: "Geopolitical", category: "intelligence", icon: Globe, color: "text-cyan-400" },
    { path: "/research", label: "Research Lab", category: "intelligence", icon: Cpu, color: "text-purple-400" },
  ];

  const filteredHubs = activeTab === "all" ? hubs : hubs.filter(h => h.category === activeTab);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans overflow-hidden">
      {/* Background Neural Network (Visual Only) */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic mb-2">
            Neural<span className="text-emerald-500">Nav</span>
          </h1>
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            Voice-First Command Interface // v1111 Standard
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Neural Sync</div>
              <div className="text-emerald-500 font-black uppercase text-sm animate-pulse">● 100% Active</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Navigation className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Voice Bar */}
      <div className="relative z-10 max-w-4xl mx-auto mb-16">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or use voice..."
            className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-2xl px-16 py-6 text-xl font-bold focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-700"
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
          <button 
            onClick={() => setIsListening(!isListening)}
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              isListening ? "bg-red-500 text-white animate-pulse" : "bg-emerald-500 text-black hover:bg-emerald-400"
            }`}
          >
            <Mic className="w-6 h-6" />
          </button>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-2">
            <Command className="w-3 h-3" /> Try "Go to Quantum Vault"
          </span>
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-2">
            <Command className="w-3 h-3" /> Try "Rotate Encryption Keys"
          </span>
        </div>
      </div>

      {/* Categories */}
      <div className="relative z-10 flex justify-center gap-8 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`pb-2 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
              activeTab === cat.id ? "border-emerald-500 text-emerald-500" : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Recently Visited */}
      <div className="relative z-10 max-w-6xl mx-auto mb-12">
        <h2 className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-4">Recently Accessed Modules</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {recentHubs.map((hub) => (
            <Link key={hub.path} href={hub.path}>
              <div className="flex items-center gap-3 px-6 py-3 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-emerald-500 transition-all group cursor-pointer shrink-0">
                <hub.icon className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                <span className="text-xs font-bold text-slate-300 group-hover:text-white">{hub.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Hubs Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredHubs.map((hub, idx) => (
            <motion.div
              key={hub.path}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link href={hub.path}>
                <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl hover:border-emerald-500 transition-all group cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-all">
                    <hub.icon className="w-16 h-16" />
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-black transition-all`}>
                    <hub.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black uppercase italic mb-2 group-hover:text-emerald-400 transition-colors">{hub.label}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{hub.category}</span>
                    <span className="text-emerald-500 text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all">Launch Hub →</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 mt-16 text-center">
        <div className="inline-flex items-center gap-8 px-8 py-4 bg-slate-900/40 border border-slate-800 rounded-full">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">444 Voice Commands Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Neural Sync Optimized</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Enterprise v1111</span>
          </div>
        </div>
      </div>
    </div>
  );
}
