import React from "react";
import { motion } from "framer-motion";
import { 
  ShoppingBag, Tag, ArrowUpRight, 
  Users, Zap, Shield, Globe, Search
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignBadge, SovereignButton, SovereignHeading } from "@/components/SovereignUI";

/**
 * Neural Marketplace Hub
 * P2P trading for sovereign assets and digital goods
 */

export default function NeuralMarketplace() {
  const { skycoin } = useNeuralCore();

  const listings = [
    { name: "Sovereign Node License", price: 444, seller: "Sovereign_Alpha", type: "License" },
    { name: "AI Supreme Court Seat", price: 1000, seller: "Admin_HQ", type: "Position" },
    { name: "Quantum Vault Key", price: 250, seller: "Security_Core", type: "Asset" },
    { name: "DeFi Yield Booster", price: 150, seller: "Finance_Bot", type: "Utility" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <SovereignHeading 
        title="Neural Marketplace" 
        subtitle="P2P Sovereign Assets // Digital Goods // Market Intelligence" 
        accent="emerald"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Market Stats */}
        <div className="lg:col-span-4 space-y-6">
          <SovereignCard glowColor="emerald">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-[9px] text-white/30 font-black uppercase tracking-widest">Market Volume</div>
                <div className="text-xl font-black italic">4.44M SKY</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">Active Listings</span>
                <span className="text-sm font-black italic text-emerald-400">1,245</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">Market Health</span>
                <SovereignBadge type="emerald">STABLE</SovereignBadge>
              </div>
            </div>
          </SovereignCard>

          <SovereignCard glowColor="cyan">
            <h3 className="text-sm font-black uppercase italic mb-6">Market Search</h3>
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text" 
                placeholder="Search assets..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm font-black focus:border-emerald-500/50 transition-all outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['Licenses', 'Assets', 'Utility', 'Positions'].map(tag => (
                <button key={tag} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">
                  {tag}
                </button>
              ))}
            </div>
          </SovereignCard>
        </div>

        {/* Live Listings */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listings.map((item, i) => (
              <SovereignCard key={i} glowColor="emerald" className="group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                    <Tag className="w-6 h-6 text-white/30 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <SovereignBadge type="emerald">{item.type}</SovereignBadge>
                </div>
                <h4 className="text-lg font-black uppercase italic mb-2">{item.name}</h4>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Seller: {item.seller}</span>
                  <span className="text-xl font-black italic text-emerald-400">{item.price} SKY</span>
                </div>
                <SovereignButton variant="primary" className="w-full py-4 text-xs">
                  PURCHASE ASSET
                </SovereignButton>
              </SovereignCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
