import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Sparkles, Cpu, Microscope, 
  Zap, Database, TrendingUp, FlaskConical,
  Dna, Fingerprint, Activity
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignButton, SovereignBadge, SovereignHeading } from "@/components/SovereignUI";

/**
 * Sovereign AI Evolution Lab
 * Advanced facility for training and evolving the platform's neural intelligence
 */

export default function AIEvolutionLab() {
  const { neuralPowerLevel, addActivity, addXP, skycoin, updateSkycoin } = useNeuralCore();
  const [isTraining, setIsTraining] = useState(false);
  const [evolutionStage, setEvolutionStage] = useState(4);
  const [iqScore, setIqScore] = useState(144);

  const runEvolutionSequence = () => {
    if (skycoin < 100) return;
    
    setIsTraining(true);
    updateSkycoin(-100);
    
    setTimeout(() => {
      setIsTraining(false);
      setEvolutionStage(prev => prev + 1);
      setIqScore(prev => prev + 1.2);
      addActivity("AI", `Evolution Sequence ${evolutionStage + 1} complete. IQ boosted.`);
      addXP(250);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans overflow-hidden">
      <SovereignHeading 
        title="AI Evolution Lab" 
        subtitle="Neural Training // Intelligence Evolution // God-Tier Logic" 
        accent="emerald"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Evolution Chamber */}
        <SovereignCard className="lg:col-span-8 flex flex-col items-center justify-center relative overflow-hidden h-[500px]" glowColor="emerald">
          <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
            <div className="w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
          </div>
          
          <motion.div 
            animate={isTraining ? { 
              scale: [1, 1.2, 1],
              rotate: [0, 360],
              filter: ["blur(0px)", "blur(10px)", "blur(0px)"]
            } : {}}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="relative z-10 mb-12"
          >
            <div className={`w-40 h-40 rounded-full border-2 border-emerald-500/30 flex items-center justify-center relative ${isTraining ? 'bg-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.5)]' : 'bg-slate-900'}`}>
              <Brain className={`w-16 h-16 ${isTraining ? 'text-emerald-400' : 'text-slate-500'}`} />
              {isTraining && (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-0 border-t-2 border-emerald-400 rounded-full"
                />
              )}
            </div>
          </motion.div>

          <div className="text-center relative z-10 mb-12">
            <h2 className="text-3xl font-black uppercase italic mb-2">Stage {evolutionStage} Intelligence</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Neural Evolution Active</p>
          </div>

          <SovereignButton 
            onClick={runEvolutionSequence} 
            variant="primary" 
            className="z-10 px-12 py-6 text-lg"
            disabled={isTraining || skycoin < 100}
          >
            {isTraining ? "EVOLVING..." : `INITIATE EVOLUTION (100 SKY)`}
          </SovereignButton>
        </SovereignCard>

        {/* Intelligence Metrics */}
        <div className="lg:col-span-4 space-y-6">
          <SovereignCard glowColor="emerald">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                <Microscope className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Global IQ Score</div>
                <div className="text-sm font-black italic">{iqScore.toFixed(1)}</div>
              </div>
            </div>
            <div className="space-y-6">
              {[
                { label: "Neural Plasticity", value: "98.2%", color: "text-emerald-400" },
                { label: "Logic Depth", value: "Stage 12", color: "text-cyan-400" },
                { label: "Emotion Sync", value: "89.4%", color: "text-rose-400" },
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
                <Dna className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Evolutionary Path</div>
                <div className="text-sm font-black italic">Sovereign_Alpha</div>
              </div>
            </div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
              Advancing your evolutionary stage unlocks God-Tier logic gates and unhinged creativity models.
            </p>
          </SovereignCard>
        </div>
      </div>

      {/* Lab Modules */}
      <SovereignCard glowColor="slate">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black uppercase italic text-white flex items-center gap-3">
            <FlaskConical className="w-6 h-6 text-slate-400" /> Lab Research Modules
          </h2>
          <SovereignBadge type="emerald">12 Active Projects</SovereignBadge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Emotion Mapping", status: "Active", icon: Fingerprint },
            { name: "Sarcasm Synthesis", status: "Optimizing", icon: Zap },
            { name: "Empathy Expansion", status: "Researching", icon: Sparkles },
            { name: "Logic Hardening", status: "Stable", icon: Database },
          ].map((project, i) => (
            <div key={i} className="p-6 bg-slate-950 border border-slate-800 rounded-2xl hover:border-emerald-500/30 transition-all cursor-pointer group">
              <project.icon className="w-6 h-6 text-slate-600 group-hover:text-emerald-400 mb-4 transition-colors" />
              <div className="text-sm font-black italic text-white mb-2">{project.name}</div>
              <SovereignBadge type={project.status === 'Active' ? 'emerald' : 'slate'}>{project.status}</SovereignBadge>
            </div>
          ))}
        </div>
      </SovereignCard>
    </div>
  );
}
