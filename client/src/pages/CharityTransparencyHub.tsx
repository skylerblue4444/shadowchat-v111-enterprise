import React from "react";
import { motion } from "framer-motion";
import { 
  Heart, Globe, ShieldCheck, Activity, 
  Users, HandHelping, ArrowRight, Sparkles,
  Search, Filter
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";

/**
 * Charity Transparency Hub
 * AI-driven verification of global social impact
 */

export default function CharityTransparencyHub() {
  const { skycoin } = useNeuralCore();

  const activeCauses = [
    { id: 1, title: "Ocean Cleanup AI Swarm", target: "500,000 SKY", raised: "442,400 SKY", impact: "High", icon: Globe, color: "text-cyan-400" },
    { id: 2, title: "Global Neural Education", target: "1,000,000 SKY", raised: "850,000 SKY", impact: "Universal", icon: Users, color: "text-purple-400" },
    { id: 3, title: "Autonomous Reforestation", target: "250,000 SKY", raised: "125,000 SKY", impact: "Medium", icon: Activity, color: "text-emerald-400" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Impact<span className="text-rose-500">Charity</span>
          </h1>
          <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">
            Sovereign Philanthropy // AI Verified Impact
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Impact Value</div>
          <div className="text-rose-500 font-black uppercase text-xl">4,444,000 SKY</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Active Causes Feed */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Active Verification Stream</h2>
            <div className="flex gap-2">
              <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-rose-500/50 transition-all">
                <Filter className="w-4 h-4 text-slate-500" />
              </button>
              <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-rose-500/50 transition-all">
                <Search className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>

          {activeCauses.map((cause) => (
            <motion.div 
              key={cause.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center group hover:border-rose-500/30 transition-all"
            >
              <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-rose-500/50 transition-all">
                <cause.icon className={`w-10 h-10 ${cause.color}`} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-black uppercase italic mb-2 group-hover:text-rose-400 transition-colors">{cause.title}</h3>
                <div className="flex gap-6 mb-6">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" /> AI Verified
                  </span>
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-rose-500" /> {cause.impact} Impact
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Raised: {cause.raised}</span>
                    <span className="text-rose-500">Target: {cause.target}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>

              <button className="px-8 py-3 bg-rose-500 text-white font-black uppercase italic rounded-xl text-xs hover:bg-rose-400 transition-all shadow-lg shadow-rose-500/10">
                Donate SKY
              </button>
            </motion.div>
          ))}
        </div>

        {/* Impact Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" /> Transparency Log
            </h3>
            <div className="space-y-6">
              {[
                { msg: "Ocean Cleanup: +12.4 tons removed", time: "2m ago" },
                { msg: "Education: 1,245 new students", time: "14m ago" },
                { msg: "Reforestation: 4,444 trees planted", time: "45m ago" },
                { msg: "Charity Audit: 100% pass rate", time: "2h ago" },
              ].map((log, i) => (
                <div key={i} className="flex justify-between items-center text-[10px] border-b border-slate-800 pb-2 last:border-0">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">{log.msg}</span>
                  <span className="text-slate-600 font-mono">{log.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-rose-500 p-8 rounded-3xl text-white">
            <HandHelping className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-black uppercase italic mb-2">Global Impact</h3>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest leading-relaxed mb-6">
              Your donations are powered by Skycoin4444 and verified by the AI Supreme Court for 100% transparency.
            </p>
            <button className="w-full bg-white text-rose-500 font-black uppercase italic py-3 rounded-xl text-xs hover:bg-slate-100 transition-all">
              View Impact Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
