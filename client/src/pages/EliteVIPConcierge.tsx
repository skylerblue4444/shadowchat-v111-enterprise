import React from "react";
import { motion } from "framer-motion";
import { 
  Crown, Star, ShieldCheck, Zap, 
  MessageSquare, UserCheck, Globe, 
  Sparkles
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignBadge, SovereignButton, SovereignHeading } from "@/components/SovereignUI";

/**
 * Elite VIP Concierge Hub
 * High-value services and dedicated support for top-tier citizens
 */

export default function EliteVIPConcierge() {
  const { level } = useNeuralCore();

  const services = [
    { name: "Priority AI Support", icon: MessageSquare, desc: "Instant response from the God-Tier AI Oracle." },
    { name: "Sovereign Escrow", icon: ShieldCheck, desc: "Secured high-value asset transfers with AI mediation." },
    { name: "Elite Event Access", icon: Star, desc: "Exclusive invitations to planetary-scale tournaments." },
    { name: "Global Asset Tracking", icon: Globe, desc: "Deep-dive telemetry for your entire digital portfolio." },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <SovereignHeading 
        title="VIP Concierge" 
        subtitle="Elite Services // Priority Support // Sovereign Concierge" 
        accent="purple"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* VIP Status */}
        <div className="lg:col-span-4 space-y-6">
          <SovereignCard glowColor="purple" className="py-12 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-purple-500/10 border-2 border-purple-500/30 rounded-3xl flex items-center justify-center mb-6 relative">
              <Crown className="w-12 h-12 text-purple-400" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </div>
            <h3 className="text-2xl font-black uppercase italic mb-1">VIP_Sovereign</h3>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-6">Tier: Elite_Alpha</p>
            <div className="flex gap-4">
              <SovereignBadge type="purple">LEVEL {level}</SovereignBadge>
              <SovereignBadge type="cyan">VIP_ACTIVE</SovereignBadge>
            </div>
          </SovereignCard>

          <SovereignCard glowColor="slate">
            <h3 className="text-sm font-black uppercase italic mb-6">Active Privileges</h3>
            <div className="space-y-4">
              {[
                "Instant AI Response",
                "Zero-Fee Trading",
                "Priority Governance",
                "Private Asset Forge",
              ].map(priv => (
                <div key={priv} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">{priv}</span>
                </div>
              ))}
            </div>
          </SovereignCard>
        </div>

        {/* Elite Services */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <SovereignCard key={i} glowColor="purple" className="group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
                    <service.icon className="w-6 h-6 text-white/30 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <SovereignBadge type="purple">ELITE</SovereignBadge>
                </div>
                <h4 className="text-lg font-black uppercase italic mb-2">{service.name}</h4>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed mb-6">
                  {service.desc}
                </p>
                <SovereignButton variant="outline" className="w-full py-4 text-[9px] font-black tracking-widest">
                  REQUEST SERVICE
                </SovereignButton>
              </SovereignCard>
            ))}
          </div>
          
          <SovereignCard glowColor="cyan" className="flex items-center gap-6">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-lg font-black uppercase italic mb-1">Instant VIP Onboarding</h4>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                Unlock all VIP services instantly by holding 4,444 SKY in your sovereign vault.
              </p>
            </div>
          </SovereignCard>
        </div>
      </div>
    </div>
  );
}
