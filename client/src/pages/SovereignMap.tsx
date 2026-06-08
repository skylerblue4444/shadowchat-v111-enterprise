import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, Shield, Zap, Heart, 
  Trophy, Wallet, Scale, Satellite,
  Cpu, Landmark, Gavel, Crown,
  Search, Info, ArrowRight
} from "lucide-react";
import { useLocation } from "wouter";
import { SovereignHeading, SovereignBadge } from "@/components/SovereignUI";

/**
 * Interactive Sovereign Map
 * A visual "World Map" of the 15+ ShadowChat v1111 infrastructure hubs
 */

interface HubNode {
  id: string;
  name: string;
  path: string;
  icon: any;
  color: string;
  x: number;
  y: number;
  description: string;
  category: string;
}

export default function SovereignMap() {
  const [, setLocation] = useLocation();
  const [hoveredHub, setHoveredHub] = useState<HubNode | null>(null);

  const hubs: HubNode[] = [
    { id: 'sec', name: 'Quantum Vault', path: '/quantum-security', icon: Shield, color: 'text-emerald-400', x: 20, y: 30, category: 'Security', description: 'Post-quantum encryption and multi-layer sovereign security.' },
    { id: 'fin', name: 'Financial Intel', path: '/financial', icon: Wallet, color: 'text-cyan-400', x: 40, y: 25, category: 'Economy', description: 'Autonomous wealth management and global financial telemetry.' },
    { id: 'law', name: 'AI Supreme Court', path: '/judicial', icon: Scale, color: 'text-green-400', x: 60, y: 35, category: 'Judicial', description: 'Autonomous legal arbitration and smart-contract enforcement.' },
    { id: 'rec', name: 'Planetary Sync', path: '/recovery', icon: Satellite, color: 'text-blue-400', x: 80, y: 20, category: 'Infrastructure', description: 'Multi-cloud redundancy and planetary disaster recovery.' },
    { id: 'gam', name: 'Gaming Hub', path: '/gaming', icon: Trophy, color: 'text-amber-400', x: 30, y: 60, category: 'Entertainment', description: 'High-stakes puzzles and neural network challenges.' },
    { id: 'def', name: 'DeFi Terminal', path: '/defi', icon: Zap, color: 'text-cyan-500', x: 50, y: 70, category: 'Economy', description: 'Mining, staking, burning, and tipping protocols.' },
    { id: 'gov', name: 'Governance', path: '/governance-voting', icon: Globe, color: 'text-purple-400', x: 70, y: 65, category: 'Political', description: 'Democratic voting and proposal management system.' },
    { id: 'tre', name: 'Manus Treasury', path: '/treasury', icon: Landmark, color: 'text-cyan-600', x: 50, y: 45, category: 'Economy', description: 'Sovereign minting and premium currency management.' },
    { id: 'eli', name: 'Elite Club', path: '/elite-club', icon: Crown, color: 'text-yellow-500', x: 15, y: 75, category: 'Social', description: 'Exclusive membership for high-net-worth citizens.' },
    { id: 'cha', name: 'Impact Charity', path: '/charity-hub', icon: Heart, color: 'text-rose-400', x: 85, y: 80, category: 'Social', description: 'AI-verified global philanthropy and impact tracking.' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans overflow-hidden">
      <SovereignHeading 
        title="Sovereign Map" 
        subtitle="Visual Infrastructure // Planetary Command" 
        accent="emerald"
      />

      <div className="relative w-full h-[700px] bg-slate-900/10 border border-slate-800/50 rounded-[4rem] overflow-hidden backdrop-blur-3xl">
        {/* Map Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #10b981 1px, transparent 0)', backgroundSize: '40px 40px' }} 
        />
        
        {/* Connection Lines (Simplified) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <line x1="50%" y1="45%" x2="20%" y2="30%" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="50%" y1="45%" x2="40%" y2="25%" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="50%" y1="45%" x2="60%" y2="35%" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="50%" y1="45%" x2="80%" y2="20%" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="50%" y1="45%" x2="30%" y2="60%" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="50%" y1="45%" x2="50%" y2="70%" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="50%" y1="45%" x2="70%" y2="65%" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />
        </svg>

        {/* Hub Nodes */}
        {hubs.map((hub) => (
          <motion.div
            key={hub.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.2, zIndex: 50 }}
            onMouseEnter={() => setHoveredHub(hub)}
            onMouseLeave={() => setHoveredHub(null)}
            onClick={() => setLocation(hub.path)}
            className="absolute cursor-pointer group"
            style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
          >
            <div className={`w-14 h-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center shadow-2xl transition-all group-hover:border-emerald-500/50 group-hover:shadow-emerald-500/10`}>
              <hub.icon className={`w-6 h-6 ${hub.color}`} />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-black uppercase italic tracking-widest text-white bg-black/80 px-3 py-1 rounded-full border border-slate-800">
                {hub.name}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Hub Info Panel (Overlay) */}
        <AnimatePresence>
          {hoveredHub && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-12 right-12 w-80 bg-slate-950/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl pointer-events-none"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center">
                  <hoveredHub.icon className={`w-6 h-6 ${hoveredHub.color}`} />
                </div>
                <SovereignBadge type="emerald">{hoveredHub.category}</SovereignBadge>
              </div>
              <h3 className="text-xl font-black uppercase italic mb-2 text-white">{hoveredHub.name}</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed mb-6">
                {hoveredHub.description}
              </p>
              <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                Click to Teleport <ArrowRight className="w-3 h-3" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Legend */}
        <div className="absolute bottom-12 left-12 flex gap-8 bg-black/40 border border-slate-800/50 px-8 py-4 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Security</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Economy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Governance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
