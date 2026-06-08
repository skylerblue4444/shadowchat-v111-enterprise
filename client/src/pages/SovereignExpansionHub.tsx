import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Shield, Brain, TrendingUp, 
  Activity, Globe, Cpu, Rocket,
  ArrowUpCircle, Layers, Star, Sparkles
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignButton, SovereignBadge, SovereignHeading } from "@/components/SovereignUI";

/**
 * Sovereign Expansion Hub
 * Simultaneous multi-sector upgrades and global expansion tracking
 */

export default function SovereignExpansionHub() {
  const { skycoin, updateSkycoin, addActivity, addXP, neuralPowerLevel } = useNeuralCore();
  const [isExpanding, setIsExpanding] = useState(false);
  const [expansionLevel, setExpansionLevel] = useState(1);
  const [activeUpgrades, setActiveUpgrades] = useState<string[]>([]);

  const runTripleUpgrade = () => {
    if (skycoin < 300) return;
    
    setIsExpanding(true);
    updateSkycoin(-300);
    setActiveUpgrades(['Economy', 'Security', 'Intelligence']);
    
    setTimeout(() => {
      setIsExpanding(false);
      setExpansionLevel(prev => prev + 1);
      setActiveUpgrades([]);
      addActivity("EXP", `Triple-Threat Upgrade Level ${expansionLevel + 1} complete. Global power boosted.`);
      addXP(1000);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans overflow-hidden">
      <SovereignHeading 
        title="Expansion Hub" 
        subtitle="Triple-Threat Upgrades // Global Sovereignty // Multi-Sector Growth" 
        accent="cyan"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Expansion Chamber */}
        <SovereignCard className="lg:col-span-8 flex flex-col items-center justify-center relative overflow-hidden h-[500px]" glowColor="cyan">
          <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
            <div className="w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />
          </div>
          
          <div className="flex gap-12 mb-12 relative z-10">
            {[
              { icon: TrendingUp, label: "Economy", color: "text-emerald-400", delay: 0 },
              { icon: Shield, label: "Security", color: "text-rose-400", delay: 0.2 },
              { icon: Brain, label: "Intelligence", color: "text-cyan-400", delay: 0.4 },
            ].map((pillar, i) => (
              <motion.div
                key={i}
                animate={isExpanding ? { 
                  scale: [1, 1.2, 1],
                  y: [0, -20, 0],
                  filter: ["blur(0px)", "blur(4px)", "blur(0px)"]
                } : {}}
                transition={{ repeat: Infinity, duration: 2, delay: pillar.delay }}
                className="flex flex-col items-center gap-4"
              >
                <div className={`w-24 h-24 rounded-3xl border-2 border-white/5 flex items-center justify-center relative ${isExpanding ? 'bg-white/10 shadow-[0_0_30px_rgba(34,211,238,0.3)]' : 'bg-slate-900'}`}>
                  <pillar.icon className={`w-10 h-10 ${isExpanding ? pillar.color : 'text-slate-500'}`} />
                  {isExpanding && (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute inset-0 border-t-2 border-cyan-400 rounded-3xl"
                    />
                  )}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isExpanding ? pillar.color : 'text-slate-600'}`}>
                  {pillar.label}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="text-center relative z-10 mb-12">
            <h2 className="text-3xl font-black uppercase italic mb-2">Expansion Level {expansionLevel}</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Triple-Sector Growth Active</p>
          </div>

          <SovereignButton 
            onClick={runTripleUpgrade} 
            variant="primary" 
            className="z-10 px-12 py-6 text-lg"
            disabled={isExpanding || skycoin < 300}
          >
            {isExpanding ? "EXPANDING..." : `INITIATE TRIPLE UPGRADE (300 SKY)`}
          </SovereignButton>
        </SovereignCard>

        {/* Expansion Metrics */}
        <div className="lg:col-span-4 space-y-6">
          <SovereignCard glowColor="cyan">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center">
                <Rocket className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Global Sovereignty</div>
                <div className="text-sm font-black italic">{(expansionLevel * 4.44).toFixed(1)}% Complete</div>
              </div>
            </div>
            <div className="space-y-6">
              {[
                { label: "Economy Reach", value: "Level 12", color: "text-emerald-400" },
                { label: "Security Depth", value: "Level 14", color: "text-rose-400" },
                { label: "AI IQ Boost", value: "+44.4 pts", color: "text-cyan-400" },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-end border-b border-slate-800 pb-2">
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</div>
                  <div className={`text-sm font-black italic ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>
          </SovereignCard>

          <SovereignCard glowColor="purple">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
                <Layers className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Expansion Tier</div>
                <div className="text-sm font-black italic">Planetary_Alpha</div>
              </div>
            </div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
              Triple-sector upgrades simultaneously boost your economy, security, and intelligence for maximum growth.
            </p>
          </SovereignCard>
        </div>
      </div>

      {/* Expansion Projects */}
      <SovereignCard glowColor="slate">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black uppercase italic text-white flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-slate-400" /> Global Expansion Projects
          </h2>
          <SovereignBadge type="cyan">{expansionLevel * 3} Upgrades Active</SovereignBadge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Market Dominance", status: "Active", icon: TrendingUp },
            { name: "Fortress Protocols", status: "Active", icon: Shield },
            { name: "God-Tier Logic", status: "Optimizing", icon: Brain },
            { name: "Planetary Sync", status: "Stable", icon: Globe },
          ].map((project, i) => (
            <div key={i} className="p-6 bg-slate-950 border border-slate-800 rounded-2xl hover:border-cyan-500/30 transition-all cursor-pointer group">
              <project.icon className="w-6 h-6 text-slate-600 group-hover:text-cyan-400 mb-4 transition-colors" />
              <div className="text-sm font-black italic text-white mb-2">{project.name}</div>
              <SovereignBadge type={project.status === 'Active' ? 'cyan' : 'slate'}>{project.status}</SovereignBadge>
            </div>
          ))}
        </div>
      </SovereignCard>
    </div>
  );
}
