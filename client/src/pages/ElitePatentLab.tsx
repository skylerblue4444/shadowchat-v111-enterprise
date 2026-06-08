import React from "react";
import { motion } from "framer-motion";
import { 
  FileText, Lightbulb, ShieldCheck, 
  Zap, Brain, Globe, Activity, Rocket
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignBadge, SovereignButton, SovereignHeading } from "@/components/SovereignUI";

/**
 * Elite R&D Patent Lab Hub
 * Research, development, and patenting of sovereign technologies
 */

export default function ElitePatentLab() {
  const patents = [
    { name: "Neural Sync v4.4", id: "PAT-001-NS", status: "Patented", type: "Logic" },
    { name: "Sovereign Shield", id: "PAT-044-SS", status: "Active", type: "Security" },
    { name: "Skycoin Mint v2", id: "PAT-111-SM", status: "Patented", type: "Finance" },
    { name: "Planetary Sync", id: "PAT-444-PS", status: "Pending", type: "Infra" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <SovereignHeading 
        title="Patent Lab" 
        subtitle="R&D Intelligence // Technology Patenting // Innovation Hub" 
        accent="purple"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Lab Stats */}
        <div className="lg:col-span-4 space-y-6">
          <SovereignCard glowColor="purple">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-[9px] text-white/30 font-black uppercase tracking-widest">Active Patents</div>
                <div className="text-xl font-black italic">1,247 FILED</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">IP Value</span>
                <span className="text-sm font-black italic text-purple-400">444M SKY</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">R&D Stage</span>
                <SovereignBadge type="purple">ALPHA_4</SovereignBadge>
              </div>
            </div>
          </SovereignCard>

          <SovereignCard glowColor="slate">
            <h3 className="text-sm font-black uppercase italic mb-6">Research Sectors</h3>
            <div className="space-y-4">
              {[
                { label: "Neural Logic", val: "94%" },
                { label: "Quantum Crypto", val: "82%" },
                { label: "Global Infra", val: "67%" },
              ].map(sector => (
                <div key={sector.label} className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                    <span className="text-white/30">{sector.label}</span>
                    <span className="text-purple-400">{sector.val}</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: sector.val }} />
                  </div>
                </div>
              ))}
            </div>
          </SovereignCard>
        </div>

        {/* Patent Registry */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {patents.map((patent, i) => (
              <SovereignCard key={i} glowColor="purple" className="group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
                    <FileText className="w-6 h-6 text-white/30 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <SovereignBadge type={patent.status === 'Patented' ? 'purple' : 'slate'}>{patent.status}</SovereignBadge>
                </div>
                <h4 className="text-lg font-black uppercase italic mb-1">{patent.name}</h4>
                <div className="text-[10px] text-white/20 font-mono mb-6">{patent.id}</div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Sector: {patent.type}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <SovereignButton variant="outline" className="w-full py-4 text-[9px] font-black tracking-widest">
                  VIEW PATENT DETAILS
                </SovereignButton>
              </SovereignCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
