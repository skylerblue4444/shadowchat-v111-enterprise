import React from "react";
import { motion } from "framer-motion";
import { 
  Heart, Globe, Zap, Activity, 
  ShieldCheck, TrendingUp, Users, Gift
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignBadge, SovereignButton, SovereignHeading } from "@/components/SovereignUI";

/**
 * Sovereign Philanthropy Hub
 * Central command for engineered charity and social impact
 */

export default function PhilanthropyHub() {
  const { skycoin, charityImpact, neuralPowerLevel, updateSkycoin, addActivity } = useNeuralCore();

  const causes = [
    { name: "Ocean Cleanup AI", impact: "High", goal: "1.0M SKY", raised: "444K SKY", icon: Globe },
    { name: "Global Reforestation", impact: "Critical", goal: "2.5M SKY", raised: "1.2M SKY", icon: Heart },
    { name: "Neural Education", impact: "Legendary", goal: "500K SKY", raised: "44K SKY", icon: Users },
    { name: "Disaster Recovery", impact: "Emergency", goal: "10M SKY", raised: "2.4M SKY", icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <SovereignHeading 
        title="Philanthropy Engine" 
        subtitle="Engineered Charity // Automatic Diversion // Social Impact Telemetry" 
        accent="rose"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Impact Telemetry */}
        <div className="lg:col-span-4 space-y-6">
          <SovereignCard glowColor="rose">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <div className="text-[9px] text-white/30 font-black uppercase tracking-widest">Global Impact</div>
                <div className="text-xl font-black italic">{charityImpact.toLocaleString()} SKY</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">Diversion Rate</span>
                <SovereignBadge type="rose">4.44%</SovereignBadge>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">Power Boost</span>
                <span className="text-sm font-black italic text-rose-400">+{Math.floor(charityImpact * 2)} PWR</span>
              </div>
            </div>
          </SovereignCard>

          <SovereignCard glowColor="slate">
            <h3 className="text-sm font-black uppercase italic mb-6">Impact Velocity</h3>
            <div className="h-32 w-full bg-white/5 rounded-2xl border border-white/5 overflow-hidden flex items-end gap-1 p-4">
              {[30, 60, 45, 80, 50, 90, 70, 40, 85, 95, 65, 55].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className="flex-1 bg-rose-500/20 rounded-t-sm"
                />
              ))}
            </div>
          </SovereignCard>
        </div>

        {/* Active Causes */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {causes.map((cause, i) => (
              <SovereignCard key={i} glowColor="rose" className="group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-rose-500/10 transition-colors">
                    <cause.icon className="w-6 h-6 text-white/30 group-hover:text-rose-400 transition-colors" />
                  </div>
                  <SovereignBadge type="rose">{cause.impact}</SovereignBadge>
                </div>
                <h4 className="text-lg font-black uppercase italic mb-2">{cause.name}</h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Progress</span>
                  <span className="text-[10px] text-rose-400 font-black uppercase tracking-widest">{cause.raised} / {cause.goal}</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-rose-500 w-[44%]" />
                </div>
                <SovereignButton 
                  onClick={() => {
                    if (skycoin >= 100) {
                      updateSkycoin(-100, true);
                      addActivity("GIVE", `Donated 100 SKY to ${cause.name}.`);
                    }
                  }}
                  variant="outline" 
                  className="w-full py-4 text-[9px] font-black tracking-widest"
                  disabled={skycoin < 100}
                >
                  DONATE 100 SKY
                </SovereignButton>
              </SovereignCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
