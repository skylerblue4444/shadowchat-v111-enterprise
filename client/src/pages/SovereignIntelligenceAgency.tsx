import React from "react";
import { motion } from "framer-motion";
import { 
  Eye, ShieldAlert, Globe, Radio, 
  Terminal, Search, Lock, Zap
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignBadge, SovereignButton, SovereignHeading } from "@/components/SovereignUI";

/**
 * Sovereign Intelligence Agency Hub
 * Shadow intelligence, SIGINT, and global monitoring
 */

export default function SovereignIntelligenceAgency() {
  const intelFeeds = [
    { source: "SIGINT_ALPHA", msg: "Unusual neural activity detected in Sector 7", status: "Monitoring" },
    { source: "HUMINT_044", msg: "Market breakout signals confirmed by AI Oracle", status: "Verified" },
    { source: "GEO_INTEL", msg: "Planetary sync latency increasing in Asian nodes", status: "Warning" },
    { source: "NET_WATCH", msg: "DDoS attempt blocked by Sovereign Shield", status: "Intercepted" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <SovereignHeading 
        title="Intelligence Agency" 
        subtitle="Shadow Intelligence // SIGINT // Global Surveillance" 
        accent="rose"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Intel Command */}
        <div className="lg:col-span-4 space-y-6">
          <SovereignCard glowColor="rose">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <div className="text-[9px] text-white/30 font-black uppercase tracking-widest">Active Surveillance</div>
                <div className="text-xl font-black italic">195 COUNTRIES</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">Threat Level</span>
                <SovereignBadge type="rose">ELEVATED</SovereignBadge>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">Signal Clarity</span>
                <span className="text-sm font-black italic text-rose-400">99.4%</span>
              </div>
            </div>
          </SovereignCard>

          <SovereignCard glowColor="slate">
            <h3 className="text-sm font-black uppercase italic mb-6">Signal Interception</h3>
            <div className="space-y-4">
              {['SIGINT', 'HUMINT', 'GEOINT', 'OSINT'].map(type => (
                <div key={type} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer">
                  <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">{type} Feed</span>
                  <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                </div>
              ))}
            </div>
          </SovereignCard>
        </div>

        {/* Intelligence Feed */}
        <div className="lg:col-span-8 space-y-6">
          <SovereignCard glowColor="rose" className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                <Terminal className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <div className="text-[9px] text-white/30 font-black uppercase tracking-widest">Live Intel Feed</div>
                <div className="text-xl font-black italic">SHADOW_NET_LOG</div>
              </div>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {intelFeeds.map((intel, i) => (
                <div key={i} className="p-5 bg-white/5 border-l-2 border-rose-500/30 rounded-r-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] text-rose-400 font-black uppercase tracking-widest">{intel.source}</span>
                    <SovereignBadge type={intel.status === 'Intercepted' ? 'rose' : 'emerald'}>{intel.status}</SovereignBadge>
                  </div>
                  <p className="text-xs text-white/60 font-mono leading-relaxed">{intel.msg}</p>
                </div>
              ))}
            </div>
          </SovereignCard>
        </div>
      </div>
    </div>
  );
}
