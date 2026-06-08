import React from "react";
import { motion } from "framer-motion";
import { 
  Globe, TrendingUp, ArrowUpRight, 
  BarChart3, Zap, Shield, Activity, 
  RefreshCcw
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignBadge, SovereignButton, SovereignHeading } from "@/components/SovereignUI";

/**
 * Global Trade Terminal Hub
 * Real-time trading, global market access, and arbitrage
 */

export default function GlobalTradeTerminal() {
  const marketData = [
    { pair: "SKY / MNS", price: "4.44", change: "+1.2%", status: "UP" },
    { pair: "MNS / USD", price: "124.50", change: "-0.4%", status: "DOWN" },
    { pair: "SKY / BTC", price: "0.00044", change: "+4.4%", status: "UP" },
    { pair: "SOV / SKY", price: "44.40", change: "+2.1%", status: "UP" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <SovereignHeading 
        title="Trade Terminal" 
        subtitle="Global Market Access // Real-Time Trading // Arbitrage Engine" 
        accent="cyan"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Market Overview */}
        <div className="lg:col-span-8 space-y-6">
          <SovereignCard glowColor="cyan">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase italic flex items-center gap-3">
                <Globe className="w-6 h-6 text-cyan-400" /> Global Market Pulse
              </h3>
              <SovereignBadge type="cyan">LIVE</SovereignBadge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {marketData.map((data, i) => (
                <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/30 transition-all">
                  <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">{data.pair}</div>
                  <div className="text-xl font-black italic mb-2">{data.price}</div>
                  <div className={`text-[10px] font-black uppercase tracking-widest ${data.status === 'UP' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {data.change} {data.status}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 h-48 w-full bg-white/5 rounded-2xl border border-white/5 overflow-hidden flex items-end gap-1 p-4">
              {[60, 40, 80, 50, 90, 70, 45, 85, 95, 65, 55, 75, 85, 95, 100].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className="flex-1 bg-cyan-500/20 rounded-t-sm"
                />
              ))}
            </div>
          </SovereignCard>
        </div>

        {/* Trade Controls */}
        <div className="lg:col-span-4 space-y-6">
          <SovereignCard glowColor="cyan">
            <h3 className="text-sm font-black uppercase italic mb-6">Trade Controls</h3>
            <div className="space-y-4 mb-8">
              <div className="space-y-2">
                <label className="text-[9px] text-white/30 font-black uppercase tracking-widest">Amount (SKY)</label>
                <input type="text" placeholder="100.00" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-sm font-black outline-none focus:border-cyan-500/50 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] text-white/30 font-black uppercase tracking-widest">Asset Pair</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-sm font-black outline-none focus:border-cyan-500/50 transition-all appearance-none">
                  <option>SKY / MNS</option>
                  <option>MNS / USD</option>
                  <option>SOV / SKY</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SovereignButton variant="primary" className="py-4 bg-emerald-500 hover:bg-emerald-600 border-emerald-500/20">BUY</SovereignButton>
              <SovereignButton variant="primary" className="py-4 bg-rose-500 hover:bg-rose-600 border-rose-500/20">SELL</SovereignButton>
            </div>
          </SovereignCard>

          <SovereignCard glowColor="slate">
            <div className="flex items-center gap-4 mb-4">
              <RefreshCcw className="w-5 h-5 text-cyan-400" />
              <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Arbitrage Engine</span>
            </div>
            <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
              Scanning 44 global markets for price discrepancies. Current efficiency: 99.4%.
            </p>
          </SovereignCard>
        </div>
      </div>
    </div>
  );
}
