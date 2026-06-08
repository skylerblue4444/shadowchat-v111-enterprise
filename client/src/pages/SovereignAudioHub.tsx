import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Volume2, VolumeX, Mic, Music, 
  Waves, Radio, Play, Pause,
  Command, Settings2, Headphones, Activity
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignButton, SovereignBadge, SovereignHeading } from "@/components/SovereignUI";

/**
 * Sovereign Audio & Voice Hub
 * Central command for neural audio, voice commands, and soundscapes
 */

export default function SovereignAudioHub() {
  const { addActivity } = useNeuralCore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSoundscape, setCurrentSoundscape] = useState("Obsidian_Ambient");
  const [sensitivity, setSensitivity] = useState(44);

  const soundscapes = [
    { id: "Obsidian_Ambient", name: "Obsidian Ambient", type: "Focus" },
    { id: "Neural_Static", name: "Neural Static", type: "Intelligence" },
    { id: "Sovereign_Pulse", name: "Sovereign Pulse", type: "Power" },
    { id: "Market_Scream", name: "Market Scream", type: "Unhinged" },
  ];

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    addActivity("AUD", `${isPlaying ? 'Paused' : 'Playing'} ${currentSoundscape}.`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans overflow-hidden">
      <SovereignHeading 
        title="Audio & Voice" 
        subtitle="Neural Soundscapes // Voice Command Calibration" 
        accent="purple"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Neural Visualizer & Playback */}
        <SovereignCard className="lg:col-span-8 flex flex-col items-center justify-center relative overflow-hidden h-[500px]" glowColor="purple">
          <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
            <div className="w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
          </div>
          
          {/* Visualizer Bars */}
          <div className="flex items-end gap-1 h-32 mb-12 relative z-10">
            {[...Array(32)].map((_, i) => (
              <motion.div
                key={i}
                animate={isPlaying ? { height: [20, Math.random() * 100 + 20, 20] } : { height: 20 }}
                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.02 }}
                className="w-2 bg-purple-500/40 rounded-t-full border-t border-purple-400"
              />
            ))}
          </div>

          <div className="text-center relative z-10 mb-12">
            <h2 className="text-3xl font-black uppercase italic mb-2">{currentSoundscape.replace('_', ' ')}</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Currently Streaming</p>
          </div>

          <div className="flex items-center gap-8 relative z-10">
            <SovereignButton onClick={togglePlayback} variant="primary" className="w-16 h-16 rounded-full flex items-center justify-center p-0">
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </SovereignButton>
          </div>
        </SovereignCard>

        {/* Audio Controls */}
        <div className="lg:col-span-4 space-y-6">
          <SovereignCard glowColor="purple">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
                <Settings2 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Voice Calibration</div>
                <div className="text-sm font-black italic">Sensitivity: {sensitivity}%</div>
              </div>
            </div>
            <div className="space-y-6">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sensitivity} 
                onChange={(e) => setSensitivity(parseInt(e.target.value))}
                className="w-full accent-purple-500 bg-slate-800 rounded-full h-1 appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-black uppercase tracking-widest">
                <span>Whisper</span>
                <span>Scream</span>
              </div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                Higher sensitivity is recommended for "Scream Trading" and high-intensity voice commands.
              </p>
            </div>
          </SovereignCard>

          <SovereignCard glowColor="cyan">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center">
                <Command className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Command Library</div>
                <div className="text-sm font-black italic">444+ Loaded</div>
              </div>
            </div>
            <SovereignButton variant="outline" className="w-full text-[10px]">View Full Library</SovereignButton>
          </SovereignCard>
        </div>
      </div>

      {/* Soundscape Selector */}
      <SovereignCard glowColor="slate">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black uppercase italic text-white flex items-center gap-3">
            <Music className="w-6 h-6 text-slate-400" /> Neural Soundscapes
          </h2>
          <SovereignBadge type="purple">Hi-Res Audio</SovereignBadge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {soundscapes.map((scape) => (
            <div 
              key={scape.id}
              onClick={() => setCurrentSoundscape(scape.id)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${currentSoundscape === scape.id ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <Radio className={`w-5 h-5 ${currentSoundscape === scape.id ? 'text-purple-400' : 'text-slate-600'}`} />
                <SovereignBadge type={currentSoundscape === scape.id ? 'purple' : 'slate'}>{scape.type}</SovereignBadge>
              </div>
              <div className="text-sm font-black italic text-white">{scape.name}</div>
            </div>
          ))}
        </div>
      </SovereignCard>
    </div>
  );
}
