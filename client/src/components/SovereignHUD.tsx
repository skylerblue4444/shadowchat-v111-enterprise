import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Shield, Brain, 
  Zap, ArrowUpCircle, Activity
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignBadge } from "@/components/SovereignUI";

/**
 * Sovereign Triple-Command HUD
 * Persistent monitoring and control for Economy, Security, and Intelligence
 */

export default function SovereignHUD() {
  const { skycoin, neuralPowerLevel, level, xp, addActivity, addXP, updateSkycoin } = useNeuralCore();

  const handleQuickUpgrade = () => {
    if (skycoin < 100) return;
    updateSkycoin(-100);
    addXP(500);
    addActivity("SYS", "Global HUD: Instant Triple-Sector Power Boost applied.");
  };

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 flex items-center gap-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] pointer-events-auto"
      >
        {/* Sector 1: Economy */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-[8px] text-white/30 font-black uppercase tracking-widest">Economy</div>
            <div className="text-xs font-black italic text-emerald-400">{skycoin.toLocaleString()} SKY</div>
          </div>
        </div>

        <div className="w-[1px] h-8 bg-white/10" />

        {/* Sector 2: Security */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <div className="text-[8px] text-white/30 font-black uppercase tracking-widest">Security</div>
            <div className="text-xs font-black italic text-rose-400">Level {level}</div>
          </div>
        </div>

        <div className="w-[1px] h-8 bg-white/10" />

        {/* Sector 3: Intelligence */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-[8px] text-white/30 font-black uppercase tracking-widest">Intelligence</div>
            <div className="text-xs font-black italic text-cyan-400">{neuralPowerLevel.toLocaleString()} PW</div>
          </div>
        </div>

        <div className="w-[1px] h-8 bg-white/10" />

        {/* Quick Upgrade Trigger */}
        <button 
          onClick={handleQuickUpgrade}
          className="flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
        >
          <div className="flex flex-col items-end">
            <div className="text-[8px] text-white/30 font-black uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Instant</div>
            <div className="text-[10px] font-black italic text-white/80">UPGRADE</div>
          </div>
          <ArrowUpCircle className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
        </button>

        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <SovereignBadge type="emerald" className="text-[8px] px-3 py-0.5">Neural_HUD_v1.1</SovereignBadge>
        </div>
      </motion.div>
    </div>
  );
}
