import React from "react";
import { motion } from "framer-motion";
import { 
  Banknote, Landmark, TrendingUp, 
  ArrowUpRight, ShieldCheck, Globe, 
  Activity, PieChart
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignBadge, SovereignButton, SovereignHeading } from "@/components/SovereignUI";

/**
 * Sovereign Central Bank Hub
 * Monetary policy, lending, and platform revenue sharing
 */

export default function SovereignCentralBank() {
  const { skycoin } = useNeuralCore();

  const bankStats = [
    { label: "Total Reserve", value: "444.4M SKY", icon: Landmark, color: "emerald" },
    { label: "Daily Revenue", value: "124K SKY", icon: TrendingUp, color: "cyan" },
    { label: "Global APR", value: "12.4%", icon: Activity, color: "purple" },
    { label: "Market Cap", value: "$2.4B", icon: Globe, color: "emerald" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <SovereignHeading 
        title="Central Bank" 
        subtitle="Monetary Policy // Lending // Revenue Sharing // Global Reserves" 
        accent="emerald"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {bankStats.map((stat, i) => (
          <SovereignCard key={i} glowColor={stat.color as any}>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 bg-${stat.color}-500/10 border border-${stat.color}-500/20 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <SovereignBadge type={stat.color as any}>LIVE</SovereignBadge>
            </div>
            <div className="text-[9px] text-white/30 font-black uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-2xl font-black italic">{stat.value}</div>
          </SovereignCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Monetary Policy */}
        <div className="lg:col-span-8 space-y-6">
          <SovereignCard glowColor="emerald">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase italic flex items-center gap-3">
                <Banknote className="w-6 h-6 text-emerald-400" /> Monetary Policy Terminal
              </h3>
              <SovereignBadge type="emerald">ACTIVE</SovereignBadge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-2">Inflation Rate</div>
                  <div className="text-3xl font-black italic text-emerald-400">0.44%</div>
                  <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-4 leading-relaxed">
                    The platform maintains ultra-low inflation to preserve the value of Skycoin4444.
                  </p>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-2">Lending Pool</div>
                  <div className="text-3xl font-black italic text-cyan-400">44.4M SKY</div>
                  <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-4 leading-relaxed">
                    Autonomous lending protocols for high-value sovereign expansion.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl text-center">
                <PieChart className="w-32 h-32 text-emerald-400/20 mb-6" />
                <h4 className="text-lg font-black uppercase italic mb-2">Revenue Share</h4>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-6">
                  Sovereign citizens receive 4.44% of all platform revenue distributed monthly.
                </p>
                <SovereignButton variant="primary" className="px-12 py-4">CLAIM SHARE</SovereignButton>
              </div>
            </div>
          </SovereignCard>
        </div>

        {/* Bank Actions */}
        <div className="lg:col-span-4 space-y-6">
          <SovereignCard glowColor="cyan">
            <h3 className="text-sm font-black uppercase italic mb-6">Banking Services</h3>
            <div className="space-y-4">
              {[
                { label: "Apply for Loan", icon: ArrowUpRight },
                { label: "Deposit Reserves", icon: ShieldCheck },
                { label: "Policy Vote", icon: Activity },
              ].map((service, i) => (
                <div key={i} className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer group">
                  <span className="text-[10px] text-white/50 font-black uppercase tracking-widest group-hover:text-white transition-colors">{service.label}</span>
                  <service.icon className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
              ))}
            </div>
          </SovereignCard>
        </div>
      </div>
    </div>
  );
}
