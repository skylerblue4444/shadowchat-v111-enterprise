import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Zap, Shield, Brain, Globe, 
  TrendingUp, Users, Heart, Bot, Lock, 
  Activity, Sparkles, Terminal, Scale, Satellite,
  Crown, Gavel, BarChart3, Pickaxe, Lightbulb
} from "lucide-react";
import { SovereignCard, SovereignHeading, SovereignBadge } from "../components/SovereignUI";
import { useNeuralCore } from "@/lib/neural-core-sync";

// Individual Sector Components for the Prime Module
const DeFiSector = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <SovereignCard glowColor="cyan">
      <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-4">NEURAL_MINING</h4>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-black italic">44.4 SKY/hr</span>
        <button className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[10px] font-black uppercase hover:bg-cyan-500/20 transition-all">INITIATE</button>
      </div>
    </SovereignCard>
    <SovereignCard glowColor="purple">
      <h4 className="text-xs font-black uppercase tracking-widest text-purple-400 mb-4">STAKING_YIELD</h4>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-black italic">12.4% APY</span>
        <SovereignBadge type="purple">ACTIVE</SovereignBadge>
      </div>
    </SovereignCard>
  </div>
);

const SecuritySector = () => (
  <SovereignCard glowColor="red">
    <div className="flex justify-between items-center mb-6">
      <h4 className="text-xs font-black uppercase tracking-widest text-red-400">QUANTUM_VAULT_STATUS</h4>
      <SovereignBadge type="red">SECURE</SovereignBadge>
    </div>
    <div className="space-y-4">
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <div className="h-full w-[99.9%] bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]" />
      </div>
      <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">THREAT_INTERCEPTION_RATE: 100%</p>
    </div>
  </SovereignCard>
);

const AISector = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[
      { label: "IQ_LEVEL", val: "444", icon: Brain, color: "emerald" },
      { label: "SYNC_RATE", val: "99.2%", icon: Zap, color: "cyan" },
      { label: "EVO_STAGE", val: "ALPHA", icon: Sparkles, color: "purple" },
    ].map((s, i) => (
      <SovereignCard key={i} glowColor={s.color as any}>
        <s.icon className={`w-5 h-5 text-${s.color}-400 mb-2`} />
        <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">{s.label}</p>
        <h3 className="text-xl font-black italic">{s.val}</h3>
      </SovereignCard>
    ))}
  </div>
);

export default function SovereignPrime() {
  const [activeSector, setActiveSector] = useState("COMMAND");
  const { skycoinBalance, manusCoin, neuralPower } = useNeuralCore();

  const SECTORS = [
    { id: "COMMAND", icon: LayoutDashboard, color: "emerald" },
    { id: "DEFI", icon: Zap, color: "cyan" },
    { id: "SECURITY", icon: Shield, color: "red" },
    { id: "INTELLIGENCE", icon: Brain, color: "purple" },
    { id: "GLOBAL", icon: Globe, color: "blue" },
  ];

  return (
    <div className="space-y-8 pb-24">
      <SovereignHeading 
        title="Sovereign Prime" 
        subtitle="THE_ONE_MODULE // UNIFIED_COMMAND_ENVIRONMENT" 
      />

      {/* Persistent Global HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SovereignCard glowColor="emerald">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">SKYCOIN_LIQUIDITY</p>
              <h3 className="text-2xl font-black italic">{skycoinBalance.toLocaleString()} SKY</h3>
            </div>
          </div>
        </SovereignCard>
        <SovereignCard glowColor="cyan">
          <div className="flex items-center gap-4">
            <Crown className="w-6 h-6 text-cyan-400" />
            <div>
              <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">MANUS_RESERVES</p>
              <h3 className="text-2xl font-black italic">{manusCoin.toLocaleString()} MNS</h3>
            </div>
          </div>
        </SovereignCard>
        <SovereignCard glowColor="purple">
          <div className="flex items-center gap-4">
            <Zap className="w-6 h-6 text-purple-400" />
            <div>
              <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">NEURAL_POWER</p>
              <h3 className="text-2xl font-black italic">{neuralPower.toLocaleString()} PWR</h3>
            </div>
          </div>
        </SovereignCard>
      </div>

      {/* Sector Navigation */}
      <div className="flex flex-wrap gap-4 p-2 bg-white/5 border border-white/10 rounded-2xl">
        {SECTORS.map((sector) => (
          <button
            key={sector.id}
            onClick={() => setActiveSector(sector.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeSector === sector.id 
                ? `bg-${sector.color}-500/20 text-${sector.color}-400 border border-${sector.color}-500/30` 
                : "text-white/40 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            <sector.icon className="w-4 h-4" />
            {sector.id}
          </button>
        ))}
      </div>

      {/* Dynamic Sector Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSector}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {activeSector === "COMMAND" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SecuritySector />
              <SovereignCard glowColor="emerald">
                <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-6">GLOBAL_SYNC_PULSE</h4>
                <div className="flex items-center justify-center h-32">
                  <div className="relative w-24 h-24">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }} 
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl" 
                    />
                    <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-full animate-ping" />
                    <div className="absolute inset-4 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                      <Activity className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </SovereignCard>
            </div>
          )}

          {activeSector === "DEFI" && <DeFiSector />}
          {activeSector === "SECURITY" && <SecuritySector />}
          {activeSector === "INTELLIGENCE" && <AISector />}
          
          {activeSector === "GLOBAL" && (
            <SovereignCard glowColor="blue">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: "PLANETARY_NODES", val: "12,450", icon: Satellite },
                  { label: "ACTIVE_LAWS", val: "444", icon: Scale },
                  { label: "GOV_PROPOSALS", val: "12", icon: Gavel },
                  { label: "GLOBAL_IQ", val: "444", icon: Brain },
                ].map((item, i) => (
                  <div key={i} className="text-center space-y-2">
                    <item.icon className="w-6 h-6 text-blue-400 mx-auto" />
                    <h4 className="text-xl font-black italic">{item.val}</h4>
                    <p className="text-[8px] text-white/30 font-black uppercase tracking-widest">{item.label}</p>
                  </div>
                ))}
              </div>
            </SovereignCard>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Live Activity Stream (Embedded) */}
      <SovereignCard glowColor="emerald">
        <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-6">LIVE_SYSTEM_STREAM</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {[
            "NEURAL_CORE_SYNC_COMPLETED",
            "QUANTUM_VAULT_ROTATED",
            "DEFI_YIELD_REBALANCED",
            "CITIZEN_ALPHA_44_JOINED",
            "GOVERNANCE_PROPOSAL_PASSED",
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono text-white/60 tracking-tighter uppercase">{log}</span>
              <span className="ml-auto text-[8px] text-white/20 font-black uppercase">JUST_NOW</span>
            </div>
          ))}
        </div>
      </SovereignCard>
    </div>
  );
}
