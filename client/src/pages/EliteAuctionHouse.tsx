import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gavel, Clock, Trophy, Zap, 
  ArrowRight, Shield, Star, Sparkles,
  TrendingUp, DollarSign
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";

/**
 * Elite Auction House
 * High-stakes bidding for sovereign assets
 */

export default function EliteAuctionHouse() {
  const { skycoin, updateSkycoin, addActivity } = useNeuralCore();
  const [activeAuction, setActiveAuction] = useState<number | null>(null);

  const auctions = [
    { id: 1, title: "Sovereign Node Alpha License", currentBid: 50000, timeLeft: "14h 22m", bids: 42, icon: Shield, color: "text-emerald-400" },
    { id: 2, title: "AI Supreme Court Seat #4", currentBid: 125000, timeLeft: "2h 45m", bids: 89, icon: Gavel, color: "text-cyan-400" },
    { id: 3, title: "Quantum Vault Genesis Key", currentBid: 250000, timeLeft: "44m 12s", bids: 124, icon: Zap, color: "text-amber-400" },
  ];

  const handleBid = (amount: number, title: string) => {
    if (skycoin >= amount) {
      updateSkycoin(-amount);
      addActivity('AUC', `Placed bid of ${amount} SKY on ${title}`);
      alert(`Bid placed successfully on ${title}!`);
    } else {
      alert("Insufficient SKY for this bid.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Elite<span className="text-amber-500">Auction</span>
          </h1>
          <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">
            High-Stakes Sovereign Asset Bidding
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Your Liquidity</div>
          <div className="text-emerald-500 font-black uppercase text-xl">{skycoin.toLocaleString()} SKY</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Auction Feed */}
        <div className="lg:col-span-8 space-y-8">
          {auctions.map((auction) => (
            <motion.div 
              key={auction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center group hover:border-amber-500/30 transition-all"
            >
              <div className="w-24 h-24 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-amber-500/50 transition-all">
                <auction.icon className={`w-10 h-10 ${auction.color}`} />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-black uppercase italic mb-2 group-hover:text-amber-400 transition-colors">{auction.title}</h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {auction.timeLeft}
                  </span>
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {auction.bids} Bids
                  </span>
                </div>
              </div>

              <div className="shrink-0 text-center md:text-right">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Current Bid</div>
                <div className="text-3xl font-black italic tracking-tighter text-amber-500 mb-4">{auction.currentBid.toLocaleString()} SKY</div>
                <button 
                  onClick={() => handleBid(auction.currentBid + 1000, auction.title)}
                  className="px-8 py-3 bg-amber-500 text-black font-black uppercase italic rounded-xl text-xs hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
                >
                  Place Bid
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" /> Auction Rules
            </h3>
            <div className="space-y-4">
              {[
                "All bids are final and non-refundable.",
                "10% bid increase minimum required.",
                "Winners receive sovereign NFT licenses.",
                "Escrow managed by AI Supreme Court."
              ].map((rule, i) => (
                <div key={i} className="flex gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1 shrink-0"></div>
                  {rule}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-500 p-8 rounded-3xl text-black">
            <Sparkles className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-black uppercase italic mb-2 text-black">Whale Status</h3>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest leading-relaxed mb-6">
              Participate in high-stakes auctions to increase your platform reputation and unlock Whale-tier governance.
            </p>
            <button className="w-full bg-black text-white font-black uppercase italic py-3 rounded-xl text-xs hover:bg-slate-900 transition-all">
              Whale Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
