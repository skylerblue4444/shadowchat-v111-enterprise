import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Cpu, Layers, Zap, Rocket, 
  Settings2, Activity, Sparkles, Plus
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignBadge, SovereignButton, SovereignHeading } from "@/components/SovereignUI";

/**
 * Feature Factory Hub
 * Autonomous manufacturing and platform feature development
 */

export default function FeatureFactoryHub() {
  const { skycoin, updateSkycoin, addActivity, addXP } = useNeuralCore();
  const [isManufacturing, setIsManufacturing] = useState(false);

  const startManufacturing = (feature: string, cost: number) => {
    if (skycoin < cost) return;
    setIsManufacturing(true);
    updateSkycoin(-cost);
    
    setTimeout(() => {
      setIsManufacturing(false);
      addActivity("FAC", `Feature Manufacturing: ${feature} complete.`);
      addXP(cost * 2);
    }, 3000);
  };

  const projects = [
    { name: "Neural Plugin v2", cost: 250, time: "3.0s", status: "Ready" },
    { name: "Sovereign SDK", cost: 500, time: "5.0s", status: "Pending" },
    { name: "AI Translation Core", cost: 150, time: "2.0s", status: "Ready" },
    { name: "Planetary Bridge", cost: 1000, time: "10.0s", status: "Researching" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <SovereignHeading 
        title="Feature Factory" 
        subtitle="Autonomous Manufacturing // Feature Prototyping // Platform Growth" 
        accent="cyan"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Factory Stats */}
        <div className="lg:col-span-4 space-y-6">
          <SovereignCard glowColor="cyan">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center">
                <Cpu className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <div className="text-[9px] text-white/30 font-black uppercase tracking-widest">Factory Status</div>
                <div className="text-xl font-black italic">{isManufacturing ? 'MANUFACTURING' : 'IDLE'}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">Active Lines</span>
                <span className="text-sm font-black italic text-cyan-400">4 / 12</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">Efficiency</span>
                <span className="text-sm font-black italic text-cyan-400">99.8%</span>
              </div>
            </div>
          </SovereignCard>

          <SovereignCard glowColor="slate">
            <h3 className="text-sm font-black uppercase italic mb-6">Resource Allocation</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/30">Compute Power</span>
                  <span className="text-cyan-400">84%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 w-[84%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/30">Neural Bandwidth</span>
                  <span className="text-cyan-400">62%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 w-[62%]" />
                </div>
              </div>
            </div>
          </SovereignCard>
        </div>

        {/* Manufacturing Lines */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <SovereignCard key={i} glowColor="cyan" className="group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                    <Layers className="w-6 h-6 text-white/30 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <SovereignBadge type={project.status === 'Ready' ? 'cyan' : 'slate'}>{project.status}</SovereignBadge>
                </div>
                <h4 className="text-lg font-black uppercase italic mb-2">{project.name}</h4>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Time: {project.time}</span>
                  <span className="text-xl font-black italic text-cyan-400">{project.cost} SKY</span>
                </div>
                <SovereignButton 
                  onClick={() => startManufacturing(project.name, project.cost)}
                  variant="primary" 
                  className="w-full py-4 text-xs"
                  disabled={isManufacturing || skycoin < project.cost || project.status !== 'Ready'}
                >
                  {isManufacturing ? 'PROCESSING...' : 'START MANUFACTURING'}
                </SovereignButton>
              </SovereignCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
