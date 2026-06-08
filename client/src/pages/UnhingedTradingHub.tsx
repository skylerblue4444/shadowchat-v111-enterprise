import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Flame, Zap, TrendingUp, TrendingDown, 
  Mic, Volume2, AlertCircle, Sparkles,
  ArrowUpRight, ArrowDownRight, Activity
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignButton, SovereignBadge, SovereignHeading } from "@/components/SovereignUI";

/**
 * Unhinged Trading Hub
 * High-stakes "Scream Trading" and raw market intensity
 */

export default function UnhingedTradingHub() {
  const { skycoin, updateSkycoin, addActivity, personality } = useNeuralCore();
  const [isScreaming, setIsScreaming] = useState(false);
  const [lastTrade, setLastTrade] = useState<{ amount: number, type: 'gain' | 'loss' } | null>(null);

  const handleScreamTrade = () => {
    setIsScreaming(true);
    
    // High-intensity trade simulation
    setTimeout(() => {
      const amount = Math.floor(Math.random() * 444);
      const isGain = Math.random() > 0.4; // Slightly favored for the user
      
      updateSkycoin(isGain ? amount : -amount);
      setLastTrade({ amount, type: isGain ? 'gain' : 'loss' });
      addActivity("FIN", `SCREAM TRADE: ${isGain ? '+' : '-'}${amount} SKY! AHHHHH!`);
      setIsScreaming(false);
    }, 1500);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isScreaming ? 'bg-rose-950/20' : 'bg-[#050505]'} text-white p-8 font-sans overflow-hidden`}>
      <SovereignHeading 
        title="Scream Trading" 
        subtitle="Unhinged Finance // Raw Market Intensity" 
        accent="rose"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* The Scream Button */}
        <SovereignCard className="lg:col-span-8 flex flex-col items-center justify-center relative overflow-hidden h-[500px]" glowColor="rose">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500/20 via-transparent to-transparent" />
          </div>
          
          <motion.div 
            animate={isScreaming ? { scale: [1, 1.1, 1], rotate: [0, 2, -2, 0] } : {}}
            transition={{ repeat: Infinity, duration: 0.1 }}
            className="relative z-10 mb-12"
          >
            <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${isScreaming ? 'bg-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.8)]' : 'bg-slate-900 border border-slate-800'}`}>
              <Mic className={`w-12 h-12 ${isScreaming ? 'text-white' : 'text-rose-500'}`} />
            </div>
          </motion.div>

          <h2 className="text-3xl font-black uppercase italic mb-4 text-center z-10">
            {isScreaming ? "SCREAMING!!!" : "READY TO TRADE?"}
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-12 text-center max-w-md z-10 leading-relaxed">
            Activate your mic and scream "BUY" or "SELL" to initiate a high-stakes unhinged trade. 
            No limits. No brakes. Just raw intensity.
          </p>

          <SovereignButton 
            onClick={handleScreamTrade} 
            variant={isScreaming ? 'danger' : 'primary'}
            className="z-10 px-12 py-6 text-lg"
            disabled={isScreaming}
          >
            {isScreaming ? "PROCESSING..." : "INITIATE SCREAM TRADE"}
          </SovereignButton>

          <AnimatePresence>
            {lastTrade && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`absolute top-12 right-12 p-6 rounded-2xl border ${lastTrade.type === 'gain' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'} z-20`}
              >
                <div className="flex items-center gap-3">
                  {lastTrade.type === 'gain' ? <ArrowUpRight className="text-emerald-500" /> : <ArrowDownRight className="text-rose-500" />}
                  <span className={`text-2xl font-black italic ${lastTrade.type === 'gain' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {lastTrade.type === 'gain' ? '+' : '-'}{lastTrade.amount} SKY
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </SovereignCard>

        {/* Intensity Stats */}
        <div className="lg:col-span-4 space-y-6">
          <SovereignCard glowColor="rose">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center">
                <Flame className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Market Heat</div>
                <div className="text-sm font-black italic">EXTREME</div>
              </div>
            </div>
            <div className="space-y-6">
              {[
                { label: "Adrenaline Level", value: isScreaming ? "99.9%" : "44.4%", color: "text-rose-400" },
                { label: "Volatility Index", value: "4,444", color: "text-amber-400" },
                { label: "Scream Decibels", value: isScreaming ? "110dB" : "0dB", color: "text-cyan-400" },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-end border-b border-slate-800 pb-2">
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</div>
                  <div className={`text-sm font-black italic ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>
          </SovereignCard>

          <SovereignCard glowColor="cyan">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Neural Pulse</div>
                <div className="text-sm font-black italic">SYNCED</div>
              </div>
            </div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
              Unhinged mode increases trade frequency by 444% while adding 100% emotional variance.
            </p>
          </SovereignCard>
        </div>
      </div>

      {/* Live Market Scream Feed */}
      <SovereignCard glowColor="slate">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black uppercase italic text-white flex items-center gap-3">
            <Volume2 className="w-6 h-6 text-slate-400" /> Live Scream Feed
          </h2>
          <SovereignBadge type="rose">Unhinged Mode Active</SovereignBadge>
        </div>
        <div className="space-y-4">
          {[
            { user: "Whale_Alpha", action: "SCREAMED BUY", amount: "+1,245 SKY", time: "1m ago" },
            { user: "Neural_Architect", action: "SCREAMED SELL", amount: "-444 SKY", time: "3m ago" },
            { user: "Sovereign_Node", action: "SCREAMED BUY", amount: "+4,444 SKY", time: "5m ago" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="text-[10px] font-black text-white italic uppercase">{item.user}</div>
                <div className="text-[9px] font-black text-rose-500 uppercase tracking-widest">{item.action}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-xs font-black italic ${item.amount.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{item.amount}</div>
                <div className="text-[9px] text-slate-600 font-mono">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </SovereignCard>
    </div>
  );
}
