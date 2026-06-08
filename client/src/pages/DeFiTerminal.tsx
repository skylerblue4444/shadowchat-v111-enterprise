import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Cpu, Lock, Flame, HandHelping, 
  ArrowRightLeft, TrendingUp, Zap, Coins,
  Activity, BarChart3, Wallet
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignButton, SovereignBadge, SovereignHeading } from "@/components/SovereignUI";

/**
 * Sovereign DeFi Terminal
 * Comprehensive financial suite for Skycoin4444
 */

export default function DeFiTerminal() {
  const { skycoin, mineSkycoin, stakeSkycoin, burnSkycoin, tipSkycoin } = useNeuralCore();
  const [stakeAmount, setStakeAmount] = useState(100);
  const [burnAmount, setBurnAmount] = useState(10);
  const [tipAmount, setTipAmount] = useState(5);
  const [tipUser, setTipUser] = useState("Sovereign_Node_Alpha");

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <SovereignHeading 
        title="DeFi Terminal" 
        subtitle="Sovereign Finance // Skycoin4444 Protocol" 
        accent="cyan"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Mining Section */}
        <SovereignCard className="lg:col-span-4" glowColor="cyan">
          <div className="flex justify-between items-start mb-8">
            <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center">
              <Cpu className="w-6 h-6 text-cyan-400" />
            </div>
            <SovereignBadge type="cyan">Active</SovereignBadge>
          </div>
          <h2 className="text-xl font-black uppercase italic mb-2 text-white">Neural Mining</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8 leading-relaxed">
            Harness platform compute to generate new Skycoin4444 rewards.
          </p>
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl mb-8">
            <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1 text-center">Hash Rate</div>
            <div className="text-2xl font-black italic text-center text-cyan-400">44.4 TH/s</div>
          </div>
          <SovereignButton onClick={mineSkycoin} className="w-full" variant="primary">
            Initiate Mine
          </SovereignButton>
        </SovereignCard>

        {/* Staking Section */}
        <SovereignCard className="lg:col-span-4" glowColor="emerald">
          <div className="flex justify-between items-start mb-8">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-emerald-400" />
            </div>
            <SovereignBadge type="emerald">12.4% APY</SovereignBadge>
          </div>
          <h2 className="text-xl font-black uppercase italic mb-2 text-white">Sovereign Staking</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8 leading-relaxed">
            Lock your SKY to earn passive yield and platform governance power.
          </p>
          <div className="flex gap-4 mb-8">
            <input 
              type="number" 
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-black w-full outline-none focus:border-emerald-500 transition-all"
            />
          </div>
          <SovereignButton onClick={() => stakeSkycoin(stakeAmount)} className="w-full" variant="primary">
            Stake SKY
          </SovereignButton>
        </SovereignCard>

        {/* Burn Section */}
        <SovereignCard className="lg:col-span-4" glowColor="rose">
          <div className="flex justify-between items-start mb-8">
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-rose-400" />
            </div>
            <SovereignBadge type="rose">Deflationary</SovereignBadge>
          </div>
          <h2 className="text-xl font-black uppercase italic mb-2 text-white">Protocol Burn</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8 leading-relaxed">
            Burn SKY to increase the platform's Neural Power Level permanently.
          </p>
          <div className="flex gap-4 mb-8">
            <input 
              type="number" 
              value={burnAmount}
              onChange={(e) => setBurnAmount(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-black w-full outline-none focus:border-rose-500 transition-all"
            />
          </div>
          <SovereignButton onClick={() => burnSkycoin(burnAmount)} className="w-full" variant="danger">
            Burn SKY
          </SovereignButton>
        </SovereignCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Exchange & Trade */}
        <SovereignCard className="lg:col-span-8" glowColor="purple">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black uppercase italic text-white flex items-center gap-3">
              <ArrowRightLeft className="w-6 h-6 text-purple-400" /> Sovereign Exchange
            </h2>
            <div className="flex gap-2">
              <SovereignBadge type="purple">SKY / MNS</SovereignBadge>
              <SovereignBadge type="slate">4.44x</SovereignBadge>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl">
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">You Pay</div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black italic">100.00</span>
                  <span className="text-xs font-black text-cyan-400">SKY</span>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                  <ArrowRightLeft className="w-4 h-4 text-slate-400 rotate-90" />
                </div>
              </div>
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl">
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">You Receive</div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black italic">22.52</span>
                  <span className="text-xs font-black text-purple-400">MNS</span>
                </div>
              </div>
              <SovereignButton className="w-full" variant="secondary">Swap Assets</SovereignButton>
            </div>
            <div className="space-y-6">
              <div className="h-48 flex items-end gap-1">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="flex-1 bg-purple-500/20 border-t border-purple-500/50 rounded-t-sm" style={{ height: `${30 + Math.random() * 70}%` }} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">24h Volume</div>
                  <div className="text-sm font-black italic">1.2M SKY</div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Liquidity</div>
                  <div className="text-sm font-black italic">$450M</div>
                </div>
              </div>
            </div>
          </div>
        </SovereignCard>

        {/* Tipping Section */}
        <SovereignCard className="lg:col-span-4" glowColor="amber">
          <div className="flex justify-between items-start mb-8">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center">
              <HandHelping className="w-6 h-6 text-amber-400" />
            </div>
            <SovereignBadge type="amber">Instant</SovereignBadge>
          </div>
          <h2 className="text-xl font-black uppercase italic mb-2 text-white">Neural Tipping</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8 leading-relaxed">
            Send instant Skycoin4444 tips to other citizens across the platform.
          </p>
          <div className="space-y-4 mb-8">
            <input 
              type="text" 
              placeholder="Recipient User"
              value={tipUser}
              onChange={(e) => setTipUser(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-black w-full outline-none focus:border-amber-500 transition-all"
            />
            <input 
              type="number" 
              value={tipAmount}
              onChange={(e) => setTipAmount(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-black w-full outline-none focus:border-amber-500 transition-all"
            />
          </div>
          <SovereignButton onClick={() => tipSkycoin(tipAmount, tipUser)} className="w-full" variant="secondary">
            Send Tip
          </SovereignButton>
        </SovereignCard>
      </div>
    </div>
  );
}
