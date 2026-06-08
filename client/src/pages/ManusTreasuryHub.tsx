import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Coins, Zap, Shield, Cpu, 
  ArrowRight, RefreshCw, Landmark, Sparkles,
  TrendingUp, Activity
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";

/**
 * Manus Treasury & Mint
 * Central hub for Manus Coin (MNS) generation and management
 */

export default function ManusTreasuryHub() {
  const { manusCoin, updateManusCoin, addActivity } = useNeuralCore();
  const [isMinting, setIsMinting] = useState(false);

  const handleMint = () => {
    setIsMinting(true);
    setTimeout(() => {
      updateManusCoin(100);
      addActivity('MNS', 'Minted 100 Manus Coins via Treasury.');
      setIsMinting(false);
    }, 2000);
  };

  const metrics = [
    { label: "Total MNS Supply", value: "1,000,000", icon: Coins, color: "text-cyan-400" },
    { label: "Circulation", value: "450,000", icon: Activity, color: "text-emerald-400" },
    { label: "Burn Rate", value: "4.44%", icon: Zap, color: "text-amber-400" },
    { label: "Mint Capacity", value: "100%", icon: Cpu, color: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Manus<span className="text-cyan-400">Treasury</span>
          </h1>
          <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">
            Central Mint // Sovereign Manus Coin (MNS)
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Your MNS Balance</div>
          <div className="text-cyan-400 font-black uppercase text-xl">{manusCoin.toLocaleString()} MNS</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Minting Terminal */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-10 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Sparkles className="w-8 h-8 text-cyan-400/20" />
            </div>
            
            <h2 className="text-2xl font-black uppercase italic mb-8">Sovereign Minting Terminal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-xs text-slate-400 leading-relaxed uppercase tracking-wider font-bold">
                  Generate Manus Coins (MNS) directly into your sovereign wallet. Minting requires high-tier reputation and platform activity.
                </p>
                <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-2xl">
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Minting Progress</div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: isMinting ? "100%" : "0%" }}
                      transition={{ duration: 2 }}
                      className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleMint}
                  disabled={isMinting}
                  className="w-full bg-cyan-500 text-black font-black uppercase italic py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/10 disabled:opacity-50"
                >
                  {isMinting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>Initiate Minting <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>

              <div className="relative">
                <div className="w-48 h-48 bg-cyan-500/10 rounded-full border border-cyan-500/20 flex items-center justify-center mx-auto relative">
                  <Coins className={`w-20 h-20 text-cyan-400 ${isMinting ? "animate-bounce" : ""}`} />
                  <div className="absolute inset-0 border-4 border-dashed border-cyan-500/20 rounded-full animate-spin-slow"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {metrics.map((m, i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{m.label}</span>
                  <m.icon className={`w-4 h-4 ${m.color}`} />
                </div>
                <div className="text-2xl font-black italic tracking-tighter">{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-cyan-400" /> Treasury Laws
            </h3>
            <div className="space-y-4">
              {[
                "1 MNS = 4.44 SKYCOIN Fixed Value.",
                "Max minting limit: 1,000 MNS / day.",
                "Treasury fee: 0.44% per transaction.",
                "MNS is the only currency for God-Tier upgrades."
              ].map((law, i) => (
                <div key={i} className="flex gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1 shrink-0"></div>
                  {law}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-cyan-500 p-8 rounded-3xl text-black">
            <Shield className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-black uppercase italic mb-2 text-black">MNS Sovereignty</h3>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest leading-relaxed mb-6">
              Hold 1,000 Manus Coins to unlock the God-Tier upgrade and gain absolute control over the platform's AI swarm.
            </p>
            <button className="w-full bg-black text-white font-black uppercase italic py-3 rounded-xl text-xs hover:bg-slate-900 transition-all">
              God-Tier Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
