import React from "react";
import { motion } from "framer-motion";
import { 
  Brain, Heart, Zap, Coffee, 
  Sparkles, MessageSquare, Shield,
  CheckCircle2, Star
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { PERSONALITIES, PersonalityType, getRandomResponse } from "@/lib/personality-engine";
import { SovereignCard, SovereignButton, SovereignBadge, SovereignHeading } from "@/components/SovereignUI";

/**
 * Personality Matrix Hub
 * Customize the platform's AI tone and dialogue style
 */

export default function PersonalityMatrixHub() {
  const { personality, setPersonality, addActivity, addXP } = useNeuralCore();

  const handleSetPersonality = (type: PersonalityType) => {
    setPersonality(type);
    addActivity("AI", `Neural Personality shifted to ${type.toUpperCase()}.`);
    addXP(50);
  };

  const personalityIcons = {
    elite: Shield,
    empathetic: Heart,
    sarcastic: Zap,
    casual: Coffee,
    unhinged: Sparkles
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <SovereignHeading 
        title="Personality Matrix" 
        subtitle="Neural Intelligence // Human-Centric Dialogue" 
        accent="cyan"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {(Object.keys(PERSONALITIES) as PersonalityType[]).map((type) => {
          const Icon = personalityIcons[type];
          const isActive = personality === type;
          const config = PERSONALITIES[type];

          return (
            <SovereignCard 
              key={type} 
              glowColor={isActive ? 'emerald' : 'slate'}
              className={`relative overflow-hidden cursor-pointer transition-all ${isActive ? 'border-emerald-500/50' : 'hover:border-slate-700'}`}
              onClick={() => handleSetPersonality(type)}
            >
              {isActive && (
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              )}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${isActive ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-slate-900 border border-slate-800'}`}>
                <Icon className={`w-6 h-6 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              </div>
              <h3 className="text-xl font-black uppercase italic mb-2 text-white">{type}</h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-6">
                {config.tone}
              </p>
              <SovereignBadge type={isActive ? 'emerald' : 'slate'}>
                {isActive ? 'Active' : 'Select'}
              </SovereignBadge>
            </SovereignCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Live Dialogue Preview */}
        <SovereignCard className="lg:col-span-8" glowColor="cyan">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black uppercase italic text-white flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-cyan-400" /> Dialogue Preview
            </h2>
            <SovereignBadge type="cyan">Neural Sync Live</SovereignBadge>
          </div>
          <div className="space-y-6">
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl relative">
              <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-4">AI Greeting</div>
              <p className="text-lg font-black italic text-white">
                "{getRandomResponse(personality, 'greetings')}"
              </p>
              <div className="absolute -bottom-3 right-8 px-4 py-1 bg-cyan-500 text-black text-[9px] font-black uppercase tracking-widest rounded-full">
                {personality}
              </div>
            </div>
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl relative">
              <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-4">Success Response</div>
              <p className="text-lg font-black italic text-white">
                "{getRandomResponse(personality, 'successMessages')}"
              </p>
            </div>
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl relative">
              <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-4">Error Response</div>
              <p className="text-lg font-black italic text-rose-400">
                "{getRandomResponse(personality, 'errorMessages')}"
              </p>
            </div>
          </div>
        </SovereignCard>

        {/* Intelligence Stats */}
        <SovereignCard className="lg:col-span-4" glowColor="purple">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black uppercase italic text-white flex items-center gap-3">
              <Brain className="w-6 h-6 text-purple-400" /> Intelligence Stats
            </h2>
          </div>
          <div className="space-y-8">
            {[
              { label: "Nuance Depth", value: "94.4%", color: "text-purple-400" },
              { label: "Empathy Quotient", value: personality === 'empathetic' ? "98.2%" : "45.1%", color: "text-rose-400" },
              { label: "Sarcasm Level", value: personality === 'sarcastic' ? "99.9%" : "12.4%", color: "text-amber-400" },
              { label: "Neural Clarity", value: "99.9%", color: "text-cyan-400" },
            ].map((stat, i) => (
              <div key={i} className="flex justify-between items-end border-b border-slate-800 pb-4">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</div>
                <div className={`text-xl font-black italic ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-12 p-6 bg-purple-500/5 border border-purple-500/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest text-center">Pro Tip</span>
            </div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed text-center">
              Shift to "Empathetic" mode to boost user retention by 24% or "Elite" for 100% decision precision.
            </p>
          </div>
        </SovereignCard>
      </div>
    </div>
  );
}
