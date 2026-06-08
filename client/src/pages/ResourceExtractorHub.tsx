import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Pickaxe, Zap, TrendingUp, Activity, 
  Box, Database, Globe, Layers
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignBadge, SovereignButton, SovereignHeading } from "@/components/SovereignUI";

/**
 * Sovereign Resource Extractor Hub
 * Extraction of digital resources, data mining, and asset generation
 */

export default function ResourceExtractorHub() {
  const { skycoin, updateSkycoin, addActivity, addXP } = useNeuralCore();
  const [isExtracting, setIsExtracting] = useState(false);

  const startExtraction = (resource: string, cost: number) => {
    if (skycoin < cost) return;
    setIsExtracting(true);
    updateSkycoin(-cost);
    
    setTimeout(() => {
      setIsExtracting(false);
      addActivity("EXTRACT", `Resource Extracted: ${resource}. Yield: HIGH.`);
      addXP(cost * 3);
    }, 3000);
  };

  const extractionSites = [
    { name: "Neural Data Vein", cost: 100, yield: "High", icon: Database },
    { name: "Skycoin Reservoir", cost: 250, yield: "Ultra", icon: Zap },
    { name: "Sovereign Ore", cost: 150, yield: "Stable", icon: Box },
    { name: "Global Signal Stream", cost: 500, yield: "Legendary", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <SovereignHeading 
        title="Resource Extractor" 
        subtitle="Digital Resource Extraction // Data Mining // Asset Generation" 
        accent="amber"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Extraction Control */}
        <div className="lg:col-span-4 space-y-6">
          <SovereignCard glowColor="amber">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center">
                <Pickaxe className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="text-[9px] text-white/30 font-black uppercase tracking-widest">Extractor Status</div>
                <div className="text-xl font-black italic">{isExtracting ? 'EXTRACTING...' : 'IDLE'}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">Active Drills</span>
                <span className="text-sm font-black italic text-amber-400">4 / 12</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">Daily Yield</span>
                <span className="text-sm font-black italic text-amber-400">44.4K SKY</span>
              </div>
            </div>
          </SovereignCard>

          <SovereignCard glowColor="slate">
            <h3 className="text-sm font-black uppercase italic mb-6">Extraction Metrics</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/30">Drill Integrity</span>
                  <span className="text-amber-400">92%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[92%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-white/30">Neural Depth</span>
                  <span className="text-amber-400">4,444m</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[75%]" />
                </div>
              </div>
            </div>
          </SovereignCard>
        </div>

        {/* Extraction Sites */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {extractionSites.map((site, i) => (
              <SovereignCard key={i} glowColor="amber" className="group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-amber-500/10 transition-colors">
                    <site.icon className="w-6 h-6 text-white/30 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <SovereignBadge type="amber">{site.yield}</SovereignBadge>
                </div>
                <h4 className="text-lg font-black uppercase italic mb-2">{site.name}</h4>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Depth: 1,200m</span>
                  <span className="text-xl font-black italic text-amber-400">{site.cost} SKY</span>
                </div>
                <SovereignButton 
                  onClick={() => startExtraction(site.name, site.cost)}
                  variant="primary" 
                  className="w-full py-4 text-xs"
                  disabled={isExtracting || skycoin < site.cost}
                >
                  {isExtracting ? 'EXTRACTING...' : 'START EXTRACTION'}
                </SovereignButton>
              </SovereignCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
