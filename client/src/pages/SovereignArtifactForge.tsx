import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, Hammer, Gem, Star, 
  Zap, Shield, Brain, TrendingUp
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignBadge, SovereignButton, SovereignHeading } from "@/components/SovereignUI";

/**
 * Sovereign Artifact Forge
 * Minting and forging of ultra-rare, high-value digital artifacts
 */

export default function SovereignArtifactForge() {
  const { skycoin, updateSkycoin, addActivity, addXP } = useNeuralCore();
  const [isForging, setIsForging] = useState(false);

  const forgeArtifact = (name: string, cost: number) => {
    if (skycoin < cost) return;
    setIsForging(true);
    updateSkycoin(-cost);
    
    setTimeout(() => {
      setIsForging(false);
      addActivity("FORGE", `Artifact Forged: ${name}. Rarity Level: LEGENDARY.`);
      addXP(cost * 5);
    }, 4000);
  };

  const artifactTemplates = [
    { name: "Sovereign Crown", cost: 1000, rarity: "Legendary", icon: Star },
    { name: "Neural Blade", cost: 500, rarity: "Epic", icon: Zap },
    { name: "Sovereign Aegis", cost: 750, rarity: "Epic", icon: Shield },
    { name: "God-Tier Logic Core", cost: 2500, rarity: "Mythic", icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans overflow-hidden">
      <SovereignHeading 
        title="Artifact Forge" 
        subtitle="Forge Ultra-Rare Assets // High-Value Minting // Digital Sovereignty" 
        accent="purple"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Forge Chamber */}
        <SovereignCard className="lg:col-span-8 flex flex-col items-center justify-center relative overflow-hidden h-[500px]" glowColor="purple">
          <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
            <div className="w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
          </div>
          
          <div className="relative z-10 mb-12">
            <motion.div
              animate={isForging ? { 
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0],
                filter: ["brightness(1)", "brightness(2)", "brightness(1)"]
              } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-32 h-32 bg-purple-500/10 border-2 border-purple-500/30 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.2)]"
            >
              <Hammer className={`w-16 h-16 ${isForging ? 'text-purple-400' : 'text-slate-600'}`} />
            </motion.div>
            {isForging && (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute -inset-4 border-t-2 border-purple-400 rounded-full"
              />
            )}
          </div>

          <div className="text-center relative z-10 mb-12">
            <h2 className="text-3xl font-black uppercase italic mb-2">{isForging ? 'FORGING ARTIFACT...' : 'FORGE IDLE'}</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">High-Value Asset Minting Active</p>
          </div>

          <div className="flex gap-4 relative z-10">
            <SovereignBadge type="purple">RARITY: MYTHIC</SovereignBadge>
            <SovereignBadge type="cyan">VALUE: 4,444+ SKY</SovereignBadge>
          </div>
        </SovereignCard>

        {/* Forge Metrics */}
        <div className="lg:col-span-4 space-y-6">
          <SovereignCard glowColor="purple">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
                <Gem className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Total Value Forged</div>
                <div className="text-sm font-black italic">12.4M SKY</div>
              </div>
            </div>
            <div className="space-y-6">
              {[
                { label: "Legendary Rate", value: "4.44%", color: "text-purple-400" },
                { label: "Mythic Success", value: "0.44%", color: "text-rose-400" },
                { label: "Forge Efficiency", value: "99.9%", color: "text-emerald-400" },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-end border-b border-slate-800 pb-2">
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</div>
                  <div className={`text-sm font-black italic ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>
          </SovereignCard>

          <SovereignCard glowColor="slate">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Forge Status</div>
                <div className="text-sm font-black italic">SOVEREIGN_READY</div>
              </div>
            </div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
              Forging artifacts creates unique, high-value assets that can be traded or staked for massive yield.
            </p>
          </SovereignCard>
        </div>
      </div>

      {/* Artifact Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {artifactTemplates.map((template, i) => (
          <SovereignCard key={i} glowColor="purple" className="group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
                <template.icon className="w-6 h-6 text-white/30 group-hover:text-purple-400 transition-colors" />
              </div>
              <SovereignBadge type={template.rarity === 'Mythic' ? 'rose' : 'purple'}>{template.rarity}</SovereignBadge>
            </div>
            <h4 className="text-lg font-black uppercase italic mb-2">{template.name}</h4>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Success: 12%</span>
              <span className="text-xl font-black italic text-purple-400">{template.cost} SKY</span>
            </div>
            <SovereignButton 
              onClick={() => forgeArtifact(template.name, template.cost)}
              variant="primary" 
              className="w-full py-4 text-xs"
              disabled={isForging || skycoin < template.cost}
            >
              {isForging ? 'FORGING...' : 'START FORGE'}
            </SovereignButton>
          </SovereignCard>
        ))}
      </div>
    </div>
  );
}
