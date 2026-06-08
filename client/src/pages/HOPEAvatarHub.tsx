import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Sparkles, Mic, Volume2, 
  Settings, Zap, Shield, Heart,
  Activity, MessageSquare, Radio, Eye
} from "lucide-react";
import { SovereignCard, SovereignHeading, SovereignBadge, SovereignButton } from "../components/SovereignUI";
import { useNeuralCore } from "@/lib/neural-core-sync";

export default function HOPEAvatarHub() {
  const { personality, setPersonality, neuralPowerLevel } = useNeuralCore();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleListen = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), 3000);
      }, 2000);
    }
  };

  return (
    <div className="space-y-10 pb-24">
      <SovereignHeading 
        title="HOPE AI Avatar Hub" 
        subtitle="NEURAL_REPRESENTATION // PERSONALITY_CORE" 
        accent="emerald"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left - Personality Controls */}
        <div className="lg:col-span-4 space-y-6">
          <SovereignCard glowColor="emerald">
            <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-6 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              PERSONALITY_MATRIX
            </h3>
            <div className="space-y-3">
              {[
                { id: 'elite', label: 'ELITE_COMMAND', icon: Shield, color: 'text-cyan-400' },
                { id: 'empathetic', label: 'HUMAN_SYNC', icon: Heart, color: 'text-rose-400' },
                { id: 'sarcastic', label: 'WIT_ENGINE', icon: Sparkles, color: 'text-amber-400' },
                { id: 'unhinged', label: 'RAW_ENERGY', icon: Zap, color: 'text-red-400' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPersonality(p.id as any)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    personality === p.id 
                      ? "bg-emerald-500/10 border-emerald-500/30 shadow-lg" 
                      : "bg-white/5 border-white/5 hover:bg-white/10"
                  }`}
                >
                  <p.icon className={`w-5 h-5 ${personality === p.id ? "text-emerald-400" : "text-white/20"}`} />
                  <span className={`text-[11px] font-black tracking-widest ${personality === p.id ? "text-white" : "text-white/40"}`}>
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </SovereignCard>

          <SovereignCard glowColor="cyan">
            <h3 className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              NEURAL_STATS
            </h3>
            <div className="space-y-4">
              {[
                { label: "Nuance Depth", val: "98.4%", color: "bg-cyan-500" },
                { label: "Empathy Sync", val: "94.2%", color: "bg-rose-500" },
                { label: "Logic Stability", val: "99.9%", color: "bg-emerald-500" },
                { label: "Energy Output", val: "1200 GW", color: "bg-amber-500" },
              ].map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{s.label}</span>
                    <span className="text-[9px] font-mono text-white/60">{s.val}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: s.val }}
                      className={`h-full ${s.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SovereignCard>
        </div>

        {/* Center - Visual Avatar */}
        <div className="lg:col-span-8">
          <SovereignCard glowColor="emerald" className="h-full flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Neural Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            </div>

            {/* The Avatar Visualizer */}
            <div className="relative w-80 h-80 flex items-center justify-center mb-12">
              {/* Outer Rings */}
              <motion.div 
                animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-emerald-500/20 rounded-full border-dashed"
              />
              <motion.div 
                animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border border-cyan-500/20 rounded-full border-dashed"
              />
              
              {/* Core Visualizer */}
              <div className="relative w-48 h-48 rounded-full bg-black flex items-center justify-center overflow-hidden border-4 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                <AnimatePresence mode="wait">
                  {isSpeaking ? (
                    <motion.div 
                      key="speaking" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center gap-1"
                    >
                      {[...Array(8)].map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={{ height: [20, 80, 40, 100, 20] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                          className="w-2 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                        />
                      ))}
                    </motion.div>
                  ) : isListening ? (
                    <motion.div 
                      key="listening" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                      className="relative w-32 h-32"
                    >
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-cyan-500/20"
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-4 rounded-full border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)]"
                      />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="idle" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <Brain className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                      <div className="mt-4 text-[10px] font-black tracking-[0.3em] text-emerald-400 uppercase">STANDBY</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Orbiting Nodes */}
              {[0, 120, 240].map((angle, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-lg bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                </motion.div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex gap-6 relative z-10">
              <button 
                onClick={toggleListen}
                className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${
                  isListening 
                    ? "bg-cyan-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.5)]" 
                    : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Mic className="w-8 h-8" />
              </button>
              <button className="w-20 h-20 rounded-3xl bg-white/5 text-white/40 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all">
                <Volume2 className="w-8 h-8" />
              </button>
              <button className="w-20 h-20 rounded-3xl bg-white/5 text-white/40 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all">
                <Radio className="w-8 h-8" />
              </button>
            </div>

            <div className="mt-12 text-center space-y-2">
              <h4 className="text-xl font-black tracking-tighter text-white uppercase">HOPE_AI_NEURAL_CORE</h4>
              <p className="text-xs text-white/40 font-mono tracking-widest uppercase">
                {isListening ? "ANALYZING_INPUT..." : isSpeaking ? "SYNTHESIZING_RESPONSE..." : "AWAITING_COMMAND"}
              </p>
            </div>
          </SovereignCard>
        </div>
      </div>
    </div>
  );
}
