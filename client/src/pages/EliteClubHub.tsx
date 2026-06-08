import React from "react";
import { motion } from "framer-motion";
import { 
  Crown, Star, Sparkles, Zap, 
  Shield, Diamond, ArrowRight, Trophy,
  Users, Gem
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { Link } from "wouter";

/**
 * 1,000 Coin Elite Club Hub
 * Exclusive access for high-balance citizens
 */

export default function EliteClubHub() {
  const { skycoin } = useNeuralCore();
  const isElite = skycoin >= 1000;

  const eliteBenefits = [
    { title: "Sovereign Governance", desc: "Direct voting power in the AI Supreme Court.", icon: Shield },
    { title: "Priority R&D Access", desc: "First-look at autonomous innovation projects.", icon: Zap },
    { title: "Elite Staking", desc: "4.44% higher yield on all SKY holdings.", icon: Diamond },
    { title: "Global VIP Chat", desc: "Exclusive channel with the platform founders.", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans overflow-hidden relative">
      {/* Elite Background Glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/20 blur-[120px] rounded-full"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-20">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl mb-6 shadow-2xl shadow-emerald-500/10"
        >
          <Crown className="w-12 h-12 text-emerald-500" />
        </motion.div>
        <h1 className="text-6xl font-black tracking-tighter uppercase italic mb-4">
          Elite<span className="text-emerald-500">Club</span>
        </h1>
        <p className="text-slate-500 font-mono text-xs tracking-[0.4em] uppercase">
          The 1,000 Coin Sovereign Standard
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        {/* Elite Status Card */}
        <div className="lg:col-span-5">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`p-10 rounded-3xl border ${isElite ? "border-emerald-500/30 bg-emerald-500/5" : "border-slate-800 bg-slate-900/20"} backdrop-blur-xl relative overflow-hidden`}
          >
            {isElite && (
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-emerald-500 text-black rounded-full text-[10px] font-black uppercase tracking-widest">
                <Sparkles className="w-3 h-3" /> Elite Active
              </div>
            )}
            
            <h2 className="text-2xl font-black uppercase italic mb-8">Your Status</h2>
            <div className="space-y-8">
              <div>
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Current Balance</div>
                <div className="text-5xl font-black italic tracking-tighter text-white">{skycoin.toLocaleString()} <span className="text-emerald-500">SKY</span></div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-500">Progress to Elite</span>
                  <span className="text-emerald-500">{isElite ? "100%" : `${(skycoin/1000 * 100).toFixed(1)}%`}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: isElite ? "100%" : `${(skycoin/1000 * 100)}%` }}
                    className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  />
                </div>
              </div>

              <button className={`w-full py-4 rounded-xl font-black uppercase italic tracking-tighter flex items-center justify-center gap-2 transition-all ${
                isElite ? "bg-emerald-500 text-black hover:bg-emerald-400" : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}>
                {isElite ? "Access Elite Terminal" : "Need 1,000 SKY to Unlock"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Elite Benefits Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          {eliteBenefits.map((benefit, i) => (
            <motion.div 
              key={benefit.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-emerald-500/30 transition-all group"
            >
              <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:border-emerald-500/50 transition-all">
                <benefit.icon className="w-6 h-6 text-slate-500 group-hover:text-emerald-400" />
              </div>
              <h3 className="text-lg font-black uppercase italic mb-2 text-white group-hover:text-emerald-400 transition-colors">{benefit.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed uppercase tracking-wider font-bold">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Elite Activity Feed */}
      <div className="max-w-6xl mx-auto mt-20 relative z-10">
        <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">Elite Activity Stream</h2>
          <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest animate-pulse">● Live Tracking</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { user: "User_4444", action: "Staked 50,000 SKY", time: "2m ago" },
            { user: "User_9999", action: "Unlocked Diamond Tier", time: "14m ago" },
            { user: "User_0001", action: "Proposed Governance Rule", time: "45m ago" },
          ].map((act, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-500">
                  {act.user.slice(-2)}
                </div>
                <div className="text-[10px]">
                  <div className="font-black text-white">{act.user}</div>
                  <div className="text-slate-500">{act.action}</div>
                </div>
              </div>
              <span className="text-[9px] text-slate-700 font-mono">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
