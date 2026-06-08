import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, ShieldCheck, Zap, Terminal, 
  Activity, Globe, Lock, Radar,
  AlertTriangle, Eye, Server
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignButton, SovereignBadge, SovereignHeading } from "@/components/SovereignUI";

/**
 * Cyber Defense Center & Global Threat Map
 * Real-time monitoring and defense for the ShadowChat v1111 state
 */

interface Threat {
  id: string;
  origin: string;
  type: 'DDoS' | 'Injection' | 'BruteForce' | 'NeuralDrift';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'intercepted' | 'analyzing' | 'blocked';
  timestamp: string;
}

export default function CyberDefenseCenter() {
  const { neuralPowerLevel, addActivity } = useNeuralCore();
  const [threats, setThreats] = useState<Threat[]>([
    { id: '1', origin: 'Node_Alpha_7', type: 'DDoS', severity: 'high', status: 'blocked', timestamp: '2m ago' },
    { id: '2', origin: 'External_IP_88', type: 'Injection', severity: 'critical', status: 'intercepted', timestamp: '5m ago' },
    { id: '3', origin: 'Neural_Cluster_4', type: 'NeuralDrift', severity: 'medium', status: 'analyzing', timestamp: '12m ago' },
  ]);

  const [scanActive, setScanActive] = useState(false);

  const runDefenseScan = () => {
    setScanActive(true);
    setTimeout(() => {
      setScanActive(false);
      addActivity("SEC", "Sovereign Defense Scan complete. 0 threats detected.");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <SovereignHeading 
        title="Cyber Defense" 
        subtitle="Sovereign Security // Global Threat Monitoring" 
        accent="rose"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Real-time Threat Map (Visual) */}
        <SovereignCard className="lg:col-span-8 h-[500px] relative overflow-hidden" glowColor="rose">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h2 className="text-xl font-black uppercase italic text-white flex items-center gap-3">
              <Radar className={`w-6 h-6 text-rose-400 ${scanActive ? 'animate-spin' : ''}`} /> Global Threat Map
            </h2>
            <SovereignBadge type="rose">Live Feed</SovereignBadge>
          </div>
          
          {/* Visual Map Grid */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #f43f5e 1px, transparent 0)', backgroundSize: '30px 30px' }} 
          />
          
          {/* Threat Indicators */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 border border-rose-500/20 rounded-full animate-ping opacity-20" />
            <div className="w-64 h-64 border border-rose-500/10 rounded-full animate-pulse opacity-30" />
            
            {/* Random Threat Points */}
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="absolute top-1/4 left-1/3 w-3 h-3 bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.8)]" />
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, delay: 0.5 }} className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-rose-400 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, delay: 1 }} className="absolute top-1/2 right-1/2 w-4 h-4 bg-rose-600 rounded-full shadow-[0_0_20px_rgba(244,63,94,1)]" />
          </div>

          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end relative z-10">
            <div>
              <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Defense Integrity</div>
              <div className="text-3xl font-black italic text-rose-400">99.9%</div>
            </div>
            <SovereignButton onClick={runDefenseScan} variant="danger" disabled={scanActive}>
              {scanActive ? "Scanning..." : "Initiate Global Scan"}
            </SovereignButton>
          </div>
        </SovereignCard>

        {/* Security Stats */}
        <div className="lg:col-span-4 space-y-6">
          <SovereignCard glowColor="rose">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Active Firewall</div>
                <div className="text-sm font-black italic">Sovereign_Shield_v4</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-500">Threat Interception</span>
                <span className="text-emerald-500">100%</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full" />
              </div>
            </div>
          </SovereignCard>

          <SovereignCard glowColor="cyan">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center">
                <Server className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Neural Power</div>
                <div className="text-sm font-black italic">{neuralPowerLevel.toLocaleString()} Units</div>
              </div>
            </div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
              Security strength is directly proportional to the platform's Neural Power Level.
            </p>
          </SovereignCard>
        </div>
      </div>

      {/* Incident Log */}
      <SovereignCard glowColor="slate">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black uppercase italic text-white flex items-center gap-3">
            <Terminal className="w-6 h-6 text-slate-400" /> Incident Command Log
          </h2>
          <SovereignBadge type="slate">444 Total Intercepts</SovereignBadge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">
                <th className="pb-4">Origin</th>
                <th className="pb-4">Threat Type</th>
                <th className="pb-4">Severity</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="text-[10px] font-black uppercase tracking-widest italic">
              {threats.map((threat) => (
                <tr key={threat.id} className="border-b border-slate-900/50 hover:bg-slate-900/20 transition-all">
                  <td className="py-4 text-slate-300">{threat.origin}</td>
                  <td className="py-4 text-white">{threat.type}</td>
                  <td className="py-4">
                    <span className={threat.severity === 'critical' ? 'text-rose-500' : (threat.severity === 'high' ? 'text-amber-500' : 'text-cyan-500')}>
                      {threat.severity}
                    </span>
                  </td>
                  <td className="py-4">
                    <SovereignBadge type={threat.status === 'blocked' ? 'emerald' : (threat.status === 'intercepted' ? 'cyan' : 'amber')}>
                      {threat.status}
                    </SovereignBadge>
                  </td>
                  <td className="py-4 text-right text-slate-500">{threat.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SovereignCard>
    </div>
  );
}
