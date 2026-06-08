import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, ShieldAlert, Cpu, Database, 
  Zap, Eye, Lock, Wifi,
  AlertTriangle, Code, Activity
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignBadge, SovereignHeading } from "@/components/SovereignUI";

/**
 * Neural Hacker Feed Hub
 * Terminal-style live data stream and shadow intelligence
 */

interface FeedItem {
  id: string;
  type: 'SIGNAL' | 'LEAK' | 'SYSTEM' | 'ENCRYPTED';
  content: string;
  timestamp: string;
  isRevealed: boolean;
}

export default function HackerFeedHub() {
  const { addActivity } = useNeuralCore();
  const [feed, setFeed] = useState<FeedItem[]>([
    { id: '1', type: 'SIGNAL', content: 'INTERCEPTED: Sovereign_Node_Alpha rebalancing liquidity pool...', timestamp: '0.2s ago', isRevealed: true },
    { id: '2', type: 'LEAK', content: 'LEAKED: Private key fragment detected in sector 7G...', timestamp: '1.5s ago', isRevealed: true },
    { id: '3', type: 'ENCRYPTED', content: '••••••••••••••••••••••••••••••••••••••••', timestamp: '3.4s ago', isRevealed: false },
    { id: '4', type: 'SYSTEM', content: 'DIAGNOSTIC: Neural Core sync at 99.998% efficiency...', timestamp: '5.2s ago', isRevealed: true },
  ]);

  const [terminalText, setTerminalText] = useState("");
  const fullText = "INITIALIZING SHADOW_FEED_v1111... ACCESSING ENCRYPTED UPLINK... BYPASSING NEURAL_FIREWALL... SUCCESS.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTerminalText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const revealItem = (id: string) => {
    setFeed(prev => prev.map(item => 
      item.id === id ? { ...item, isRevealed: true, content: item.type === 'ENCRYPTED' ? 'REVEALED: New governance proposal incoming for SKY expansion.' : item.content } : item
    ));
    addActivity("SEC", "Shadow Feed data fragment decrypted.");
  };

  return (
    <div className="min-h-screen bg-black text-[#00FF41] p-8 font-mono overflow-hidden">
      <SovereignHeading 
        title="Shadow Feed" 
        subtitle="Neural Interception // Shadow Intelligence" 
        accent="emerald"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Live Terminal Stream */}
        <SovereignCard className="lg:col-span-8 h-[600px] bg-black/80 border-[#00FF41]/20 relative overflow-hidden flex flex-col" glowColor="emerald">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="w-full h-full bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
          </div>

          <div className="flex justify-between items-center mb-6 border-b border-[#00FF41]/20 pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-bold tracking-widest uppercase">Shadow_Terminal_v1.0</span>
            </div>
            <SovereignBadge type="emerald">Live Intercept</SovereignBadge>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-4 relative z-10">
            <div className="text-xs mb-8 opacity-60 leading-relaxed">
              {terminalText}
              <span className="inline-block w-2 h-4 bg-[#00FF41] ml-1 animate-pulse" />
            </div>

            <AnimatePresence mode="popLayout">
              {feed.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 border ${item.type === 'ENCRYPTED' ? 'border-amber-500/30 bg-amber-500/5' : 'border-[#00FF41]/10 bg-[#00FF41]/5'} rounded-lg group relative overflow-hidden`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <SovereignBadge type={item.type === 'ENCRYPTED' ? 'amber' : 'emerald'}>
                        {item.type}
                      </SovereignBadge>
                      <span className="text-[10px] opacity-40 uppercase tracking-widest">{item.timestamp}</span>
                    </div>
                    {item.type === 'ENCRYPTED' && !item.isRevealed && (
                      <button 
                        onClick={() => revealItem(item.id)}
                        className="text-[9px] bg-amber-500 text-black px-3 py-1 font-black uppercase tracking-widest rounded hover:bg-amber-400 transition-colors"
                      >
                        Decrypt
                      </button>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed ${item.type === 'ENCRYPTED' && !item.isRevealed ? 'blur-sm select-none' : 'opacity-80'}`}>
                    {item.content}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </SovereignCard>

        {/* Shadow Intel Panel */}
        <div className="lg:col-span-4 space-y-6">
          <SovereignCard className="bg-black/80 border-[#00FF41]/20" glowColor="emerald">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-[#00FF41]/10 border border-[#00FF41]/20 rounded-xl flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[#00FF41]" />
              </div>
              <div>
                <div className="text-[9px] opacity-50 font-black uppercase tracking-widest">Interception Rate</div>
                <div className="text-sm font-black italic">1.2 TB/s</div>
              </div>
            </div>
            <div className="space-y-6">
              {[
                { label: "Neural Drift", value: "0.0004%", color: "text-[#00FF41]" },
                { label: "Encrypted Nodes", value: "4,444", color: "text-amber-400" },
                { label: "Signal Strength", value: "98.9%", color: "text-cyan-400" },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-end border-b border-[#00FF41]/10 pb-2">
                  <div className="text-[9px] opacity-50 font-black uppercase tracking-widest">{stat.label}</div>
                  <div className={`text-sm font-black italic ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>
          </SovereignCard>

          <SovereignCard className="bg-black/80 border-rose-500/20" glowColor="rose">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <div className="text-[9px] opacity-50 font-black uppercase tracking-widest">Shadow Alerts</div>
                <div className="text-sm font-black italic">ACTIVE</div>
              </div>
            </div>
            <p className="text-[9px] opacity-50 font-bold uppercase tracking-widest leading-relaxed">
              WARNING: High-intensity data stream detected. Monitor for neural overflow and signal degradation.
            </p>
          </SovereignCard>

          <SovereignCard className="bg-black/80 border-cyan-500/20" glowColor="cyan">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center">
                <Wifi className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-[9px] opacity-50 font-black uppercase tracking-widest">Neural Uplink</div>
                <div className="text-sm font-black italic">SECURE</div>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Activity className="w-12 h-12 text-[#00FF41] animate-pulse" />
            </div>
          </SovereignCard>
        </div>
      </div>
    </div>
  );
}
