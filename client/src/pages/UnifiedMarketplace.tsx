import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Cpu, Puzzle, Gavel, 
  Search, Filter, TrendingUp, Zap,
  Sparkles, Package, ShieldCheck, Heart
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignBadge, SovereignButton, SovereignHeading } from "@/components/SovereignUI";

/**
 * Unified Sovereign Marketplace
 * Merges Neural, Agent, Plugin, Auction, and Standard Marketplaces
 */

export default function UnifiedMarketplace() {
  const { skycoin, updateSkycoin, addActivity } = useNeuralCore();
  const [activeTab, setActiveTab] = useState("all");

  const categories = [
    { id: "all", label: "All Assets", icon: ShoppingBag },
    { id: "agents", label: "AI Agents", icon: Cpu },
    { id: "plugins", label: "Plugins", icon: Puzzle },
    { id: "auctions", label: "Auctions", icon: Gavel },
    { id: "artifacts", label: "Artifacts", icon: Sparkles },
  ];

  const items = [
    { id: 1, category: "agents", name: "Alpha_Trade_Bot", price: 444, rarity: "Legendary", icon: Cpu },
    { id: 2, category: "plugins", name: "Quantum_Shield_v2", price: 120, rarity: "Rare", icon: ShieldCheck },
    { id: 3, category: "auctions", name: "Sovereign_Node_001", price: 1000, rarity: "Mythic", icon: Zap },
    { id: 4, category: "artifacts", name: "Emerald_Logic_Core", price: 2500, rarity: "Exotic", icon: Sparkles },
    { id: 5, category: "agents", name: "Sentiment_Oracle", price: 150, rarity: "Uncommon", icon: Cpu },
    { id: 6, category: "plugins", name: "Auto_Charity_Module", price: 0, rarity: "Standard", icon: Heart },
  ];

  const filteredItems = activeTab === "all" ? items : items.filter(i => i.category === activeTab);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <SovereignHeading 
        title="Unified Marketplace" 
        subtitle="Sovereign Assets // AI Agents // Neural Plugins // High-Stakes Auctions" 
        accent="emerald"
      />

      {/* Market Navigation */}
      <div className="flex flex-wrap gap-4 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all ${
              activeTab === cat.id 
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH_SOVEREIGN_ASSETS..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-6 text-sm font-black outline-none focus:border-emerald-500/50 transition-all italic tracking-widest"
            />
          </div>
        </div>
        <div className="lg:col-span-4">
          <SovereignCard glowColor="emerald" className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Market Volume</span>
            </div>
            <span className="text-xl font-black italic">4.44M SKY</span>
          </SovereignCard>
        </div>
      </div>

      {/* Item Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <SovereignCard glowColor={item.rarity === 'Exotic' ? 'purple' : 'emerald'} className="group h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                    <item.icon className="w-7 h-7 text-white/30 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <SovereignBadge type={item.rarity === 'Exotic' ? 'purple' : 'emerald'}>{item.rarity}</SovereignBadge>
                </div>
                
                <h4 className="text-lg font-black uppercase italic mb-1 group-hover:text-emerald-400 transition-colors">{item.name}</h4>
                <div className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-6 italic">ID: ASSET_00{item.id}</div>
                
                <div className="mt-auto space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[9px] text-white/30 font-black uppercase tracking-widest mb-1">Price</div>
                      <div className="text-2xl font-black italic">{item.price === 0 ? 'FREE' : `${item.price} SKY`}</div>
                    </div>
                    <SovereignBadge type="slate">44 IN_STOCK</SovereignBadge>
                  </div>
                  
                  <SovereignButton 
                    onClick={() => {
                      if (skycoin >= item.price) {
                        updateSkycoin(-item.price);
                        addActivity("BUY", `Purchased ${item.name} from Marketplace.`);
                      }
                    }}
                    variant="primary" 
                    className="w-full py-5 text-[10px] font-black tracking-[0.2em]"
                    disabled={skycoin < item.price}
                  >
                    ACQUIRE_ASSET
                  </SovereignButton>
                </div>
              </SovereignCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Mystery Drop Feature */}
      <div className="mt-16">
        <SovereignCard glowColor="purple" className="relative overflow-hidden group cursor-pointer">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-all" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-purple-500/10 border border-purple-500/20 rounded-3xl flex items-center justify-center">
                <Package className="w-10 h-10 text-purple-400 animate-bounce" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase italic mb-2">Sovereign Mystery Drop</h3>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest leading-relaxed max-w-md">
                  Spend 444 SKY to unlock a random Mythic or Exotic asset. High volatility, high reward.
                </p>
              </div>
            </div>
            <SovereignButton variant="primary" className="px-12 py-6 bg-purple-500 hover:bg-purple-600 border-purple-500/20">
              OPEN_MYSTERY_DROP
            </SovereignButton>
          </div>
        </SovereignCard>
      </div>
    </div>
  );
}
