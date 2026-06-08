import React from "react";
import { motion } from "framer-motion";
import { 
  Zap, Shield, Brain, TrendingUp, 
  Activity, Globe, Terminal, Cpu,
  LayoutGrid, Settings2, Bell, Search,
  Flame, Headphones, Vote, Map
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignBadge, SovereignButton } from "@/components/SovereignUI";
import { Link } from "wouter";

/**
 * Unified Sovereign OS Dashboard
 * The single core nerve center for the entire digital state
 */

export default function Dashboard() {
  const { skycoin, manusCoin, neuralPowerLevel, level, xp, activityLog } = useNeuralCore();

  const coreSectors = [
    { label: "DeFi Terminal", icon: TrendingUp, path: "/defi", color: "cyan", badge: "LIVE" },
    { label: "Cyber Defense", icon: Shield, path: "/cyber-defense", color: "rose", badge: "WAR" },
    { label: "AI Evolution", icon: Brain, path: "/ai-evolution", color: "emerald", badge: "EVO" },
    { label: "Hacker Feed", icon: Terminal, path: "/hacker-feed", color: "emerald", badge: "LIVE" },
    { label: "Audio Hub", icon: Headphones, path: "/audio-hub", color: "purple", badge: "HI-FI" },
    { label: "Sovereign Map", icon: Map, path: "/map", color: "emerald", badge: "LIVE" },
    { label: "Governance", icon: Vote, path: "/governance-voting", color: "purple", badge: "VOTE" },
    { label: "Scream Trade", icon: Flame, path: "/unhinged-trading", color: "rose", badge: "HOT" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header / OS Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <SovereignBadge type="emerald">Sovereign OS v1111</SovereignBadge>
            <span className="text-[10px] text-white/20 font-black tracking-[0.3em] uppercase italic">System Operational</span>
          </div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Command Center</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
            <div className="text-right">
              <div className="text-[9px] text-white/30 font-black uppercase tracking-widest">Skycoin4444</div>
              <div className="text-lg font-black italic text-emerald-400">{skycoin.toLocaleString()} SKY</div>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="text-right">
              <div className="text-[9px] text-white/30 font-black uppercase tracking-widest">Manus Coin</div>
              <div className="text-lg font-black italic text-cyan-400">{manusCoin.toLocaleString()} MNS</div>
            </div>
          </div>
          <div className="flex gap-2">
            <SovereignButton variant="outline" className="w-12 h-12 p-0 rounded-2xl"><Search className="w-5 h-5" /></SovereignButton>
            <SovereignButton variant="outline" className="w-12 h-12 p-0 rounded-2xl"><Bell className="w-5 h-5" /></SovereignButton>
            <SovereignButton variant="primary" className="w-12 h-12 p-0 rounded-2xl"><Settings2 className="w-5 h-5" /></SovereignButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Telemetry & Status */}
        <div className="lg:col-span-4 space-y-8">
          <SovereignCard glowColor="emerald">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-[9px] text-white/30 font-black uppercase tracking-widest">Neural Power</div>
                <div className="text-xl font-black italic">{neuralPowerLevel.toLocaleString()} PW</div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Sovereign Level {level}</span>
                <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">{xp} / {(level + 1) * 1000} XP</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(xp / ((level + 1) * 1000)) * 100}%` }}
                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                />
              </div>
            </div>
          </SovereignCard>

          <SovereignCard glowColor="cyan">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <div className="text-[9px] text-white/30 font-black uppercase tracking-widest">Global Sync</div>
                <div className="text-xl font-black italic">100% SECURE</div>
              </div>
            </div>
            <div className="space-y-4">
              {['Security Vault', 'DeFi Terminal', 'AI Core'].map((hub, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">{hub}</span>
                  <SovereignBadge type="emerald">ACTIVE</SovereignBadge>
                </div>
              ))}
            </div>
          </SovereignCard>
        </div>

        {/* Middle Column: Unified Sector Grid */}
        <div className="lg:col-span-5 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            {coreSectors.map((sector, i) => (
              <Link key={i} href={sector.path}>
                <SovereignCard 
                  className="cursor-pointer hover:scale-[1.02] transition-transform p-6 group h-full" 
                  glowColor={sector.color as any}
                >
                  <div className="flex justify-between items-start mb-6">
                    <sector.icon className={`w-6 h-6 text-${sector.color}-400 group-hover:scale-110 transition-transform`} />
                    <SovereignBadge type={sector.color as any}>{sector.badge}</SovereignBadge>
                  </div>
                  <div className="text-sm font-black italic uppercase tracking-tighter group-hover:text-emerald-400 transition-colors">
                    {sector.label}
                  </div>
                </SovereignCard>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column: Live Activity Feed */}
        <div className="lg:col-span-3 space-y-8">
          <SovereignCard className="h-full flex flex-col" glowColor="slate">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                <Terminal className="w-6 h-6 text-white/40" />
              </div>
              <div>
                <div className="text-[9px] text-white/30 font-black uppercase tracking-widest">Live Feed</div>
                <div className="text-xl font-black italic text-white/80">SYSTEM_LOG</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
              {activityLog.map((log, i) => (
                <div key={i} className="p-4 bg-white/5 border-l-2 border-emerald-500/30 rounded-r-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">{log.type}</span>
                    <span className="text-[8px] text-white/20 font-mono">0.4s ago</span>
                  </div>
                  <p className="text-[10px] text-white/60 font-mono leading-relaxed">{log.message}</p>
                </div>
              ))}
            </div>
          </SovereignCard>
        </div>
      </div>
    </div>
  );
}
