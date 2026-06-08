import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, DollarSign, PieChart, Zap, 
  ArrowUpRight, Target, BarChart3, Coins,
  ShieldCheck, Briefcase
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";

/**
 * Economic Profit & Yield Hub
 * Advanced profit models and investment telemetry
 */

export default function EconomicProfitHub() {
  const { skycoin } = useNeuralCore();

  const profitModels = [
    { name: "Sovereign Staking", yield: "12.4%", risk: "Low", allocation: "45%", icon: ShieldCheck, color: "text-emerald-400" },
    { name: "AI Arbitrage Swarm", yield: "24.8%", risk: "Medium", allocation: "30%", icon: Zap, color: "text-cyan-400" },
    { name: "Marketplace Royalties", yield: "8.2%", risk: "Very Low", allocation: "15%", icon: Briefcase, color: "text-purple-400" },
    { name: "Liquidity Provision", yield: "32.1%", risk: "High", allocation: "10%", icon: Coins, color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Profit<span className="text-emerald-500">Models</span>
          </h1>
          <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">
            Economic Yield // Sovereign Profit Telemetry
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Projected Annual Profit</div>
          <div className="text-emerald-500 font-black uppercase text-xl">+$452,400.00</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Yield Performance Chart Placeholder */}
        <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black uppercase italic">Yield Performance</h2>
            <div className="flex gap-4">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                <Target className="w-3 h-3" /> Target: 15%
              </span>
              <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Actual: 19.4%
              </span>
            </div>
          </div>
          
          <div className="h-64 flex items-end gap-2 mb-8">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${20 + Math.random() * 80}%` }}
                className="flex-1 bg-emerald-500/20 border-t-2 border-emerald-500/50 rounded-t-sm"
              />
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Daily Profit", value: "+1,245 SKY", sub: "+4.4%" },
              { label: "Weekly Yield", value: "+8,715 SKY", sub: "+12.2%" },
              { label: "Monthly ROI", value: "18.4%", sub: "Above Target" },
              { label: "Total AUM", value: "$2.4B", sub: "Global Sync" },
            ].map((s, i) => (
              <div key={i} className="space-y-1">
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{s.label}</div>
                <div className="text-lg font-black italic text-white">{s.value}</div>
                <div className="text-[9px] text-emerald-500 font-bold uppercase">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Models Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Active Profit Models</h2>
          {profitModels.map((model, i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center group-hover:border-emerald-500/50 transition-all">
                  <model.icon className={`w-5 h-5 ${model.color}`} />
                </div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                  {model.yield} APY
                </span>
              </div>
              <h3 className="text-sm font-black uppercase italic mb-1">{model.name}</h3>
              <div className="flex justify-between text-[9px] text-slate-500 font-black uppercase tracking-widest">
                <span>Risk: {model.risk}</span>
                <span>Allocation: {model.allocation}</span>
              </div>
            </div>
          ))}
          <button className="w-full bg-emerald-500 text-black font-black uppercase italic py-4 rounded-xl text-xs hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10">
            Rebalance Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}
