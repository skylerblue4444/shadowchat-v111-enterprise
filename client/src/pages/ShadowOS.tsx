import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Monitor, Cpu, Shield, Landmark, 
  Terminal, ShoppingBag, Eye, Rocket,
  Activity, Zap, Search, Bell, User,
  LayoutGrid, Settings, Power, Maximize2
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignBadge, SovereignButton } from "@/components/SovereignUI";
import { useLocation } from "wouter";

/**
 * ShadowOS Core
 * A unified, immersive operating system for the digital state.
 */

export default function ShadowOS() {
  const [, setLocation] = useLocation();
  const { skycoin, level, xp, powerLevel } = useNeuralCore();
  const [time, setTime] = useState(new Date());
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const bootTimer = setTimeout(() => setIsBooting(false), 2000);
    return () => {
      clearInterval(timer);
      clearTimeout(bootTimer);
    };
  }, []);

  const apps = [
    { name: "DeFi Terminal", icon: Landmark, path: "/defi", color: "emerald" },
    { name: "Cyber Defense", icon: Shield, path: "/cyber-defense", color: "rose" },
    { name: "Neural Market", icon: ShoppingBag, path: "/neural-market", color: "cyan" },
    { name: "Intel Agency", icon: Eye, path: "/intel-agency", color: "purple" },
    { name: "Expansion Hub", icon: Rocket, path: "/expansion", color: "amber" },
    { name: "Hacker Feed", icon: Terminal, path: "/hacker-feed", color: "emerald" },
    { name: "AI Evolution", icon: Cpu, path: "/ai-evolution", color: "cyan" },
    { name: "Upgrade Matrix", icon: LayoutGrid, path: "/upgrade-matrix", color: "purple" },
  ];

  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100] font-mono">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-emerald-500 text-sm mb-8"
        >
          {">"} INITIALIZING_SHADOW_OS_v111.0.0...
        </motion.div>
        <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5 }}
            className="h-full bg-emerald-500"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#050505] text-white font-sans overflow-hidden select-none">
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Top Taskbar */}
      <div className="absolute top-0 left-0 w-full h-12 bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.3em] text-white/50 uppercase italic">ShadowOS_Core</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-4 text-[10px] font-black tracking-widest text-white/30 uppercase">
            <span className="flex items-center gap-2"><Activity className="w-3 h-3" /> SYNC_ACTIVE</span>
            <span className="flex items-center gap-2"><Zap className="w-3 h-3" /> PWR_{powerLevel}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-[10px] font-black tracking-widest text-emerald-400 italic">
            <span>{skycoin.toLocaleString()} SKY</span>
            <div className="h-4 w-px bg-white/10" />
            <span>LVL_{level}</span>
          </div>
          <div className="text-[10px] font-black tracking-widest text-white/30">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-white/30 hover:text-white cursor-pointer transition-colors" />
            <User className="w-4 h-4 text-white/30 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      {/* Main Desktop Area */}
      <div className="absolute inset-0 pt-20 pb-24 px-12 grid grid-cols-6 lg:grid-cols-10 grid-rows-6 gap-8">
        {/* App Icons */}
        {apps.map((app, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLocation(app.path)}
            className="flex flex-col items-center gap-3 group cursor-pointer"
          >
            <div className={`w-16 h-16 bg-${app.color}-500/10 border border-${app.color}-500/20 rounded-2xl flex items-center justify-center group-hover:bg-${app.color}-500/20 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)]`}>
              <app.icon className={`w-8 h-8 text-${app.color}-400`} />
            </div>
            <span className="text-[9px] font-black tracking-widest text-white/40 uppercase group-hover:text-white transition-colors text-center">
              {app.name}
            </span>
          </motion.div>
        ))}

        {/* Live Widget: Market Pulse */}
        <div className="col-span-3 row-span-2 col-start-8">
          <SovereignCard glowColor="emerald" className="h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Market_Pulse</h3>
              <SovereignBadge type="emerald">LIVE</SovereignBadge>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-black italic">4.44M SKY</div>
                  <div className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">+12.4% VOL</div>
                </div>
                <div className="w-24 h-8 bg-emerald-500/10 rounded border border-emerald-500/20" />
              </div>
              <div className="h-24 w-full bg-white/5 rounded-xl border border-white/5 overflow-hidden flex items-end gap-1 p-2">
                {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="flex-1 bg-emerald-500/30 rounded-t-sm"
                  />
                ))}
              </div>
            </div>
          </SovereignCard>
        </div>

        {/* Live Widget: System Health */}
        <div className="col-span-3 row-span-2 col-start-8 row-start-3">
          <SovereignCard glowColor="rose" className="h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">System_Integrity</h3>
              <SovereignBadge type="rose">SECURE</SovereignBadge>
            </div>
            <div className="space-y-4">
              {[
                { label: "Quantum Shield", val: "100%", color: "text-emerald-400" },
                { label: "Neural Bandwidth", val: "84%", color: "text-cyan-400" },
                { label: "Planetary Sync", val: "99.9%", color: "text-emerald-400" },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">{stat.label}</span>
                  <span className={`text-xs font-black italic ${stat.color}`}>{stat.val}</span>
                </div>
              ))}
            </div>
          </SovereignCard>
        </div>
      </div>

      {/* Bottom Taskbar / Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 flex items-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Power className="w-6 h-6 text-black" />
          </div>
          <div className="h-8 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-2">
            {[LayoutGrid, Search, Settings, Maximize2].map((Icon, i) => (
              <div key={i} className="w-12 h-12 hover:bg-white/5 rounded-2xl flex items-center justify-center cursor-pointer transition-colors group">
                <Icon className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
