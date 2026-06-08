import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Globe, Shield, TrendingUp, Trophy, Coins, Sparkles, Activity, Zap, ExternalLink } from "lucide-react";

const CHARITIES = [
  { id: "water", name: "Clean Water Initiative", icon: "💧", raised: 2_400_000, goal: 5_000_000, category: "Environment", impact: "12M people served" },
  { id: "education", name: "Global Education Fund", icon: "📚", raised: 8_100_000, goal: 10_000_000, category: "Education", impact: "500K students" },
  { id: "health", name: "Healthcare Access", icon: "🏥", raised: 5_600_000, goal: 8_000_000, category: "Health", impact: "3M treatments" },
  { id: "hunger", name: "Zero Hunger Project", icon: "🍞", raised: 3_200_000, goal: 6_000_000, category: "Food", impact: "45M meals" },
  { id: "climate", name: "Climate Action Now", icon: "🌍", raised: 4_800_000, goal: 7_000_000, category: "Climate", impact: "2M tons CO2 offset" },
  { id: "animals", name: "Wildlife Protection", icon: "🐾", raised: 1_900_000, goal: 3_000_000, category: "Animals", impact: "50K animals rescued" },
  { id: "tech", name: "Tech for Good", icon: "💻", raised: 6_300_000, goal: 9_000_000, category: "Technology", impact: "1M devices donated" },
  { id: "veterans", name: "Veterans Support", icon: "🎖️", raised: 2_800_000, goal: 4_000_000, category: "Veterans", impact: "200K vets helped" },
];

const GAMBLING_CHARITY = [
  { game: "Charity Roulette", description: "50% of house edge goes to selected charity", icon: "🎰", minBet: 10 },
  { game: "Donation Blackjack", description: "Win = 2x to charity, Lose = 1x to charity", icon: "🃏", minBet: 25 },
  { game: "Lucky Draw", description: "100% of ticket sales to charity pool", icon: "🎫", minBet: 5 },
  { game: "Crypto Raffle", description: "Weekly raffle — all proceeds to charity", icon: "🎲", minBet: 1 },
];

export default function Charity() {
  const [selectedCharity, setSelectedCharity] = useState(CHARITIES[0]);
  const [donationAmount, setDonationAmount] = useState("");
  const [donationCoin, setDonationCoin] = useState("SKYCOIN4444");
  const [tab, setTab] = useState<"donate" | "gamble" | "transparency" | "leaderboard">("donate");

  const handleDonate = () => {
    if (!donationAmount) return;
    toast.success(`Donated ${donationAmount} ${donationCoin} to ${selectedCharity.name}! 🎉`, {
      description: "Powered by Hope AI Transparency Protocol",
    });
    setDonationAmount("");
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto min-h-screen bg-[#050510]">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-purple-500/10 border border-white/5 p-8 md:p-12 shadow-2xl shadow-emerald-500/10">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <Sparkles className="w-32 h-32 text-emerald-400 animate-pulse" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-[0.2em] uppercase">
              <Activity className="w-3 h-3" />
              Hope AI Impact Protocol
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                SHADOWCHAT CHARITY
              </span>
            </h1>
            <p className="text-lg text-white/60 max-w-xl font-medium" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Redefining global philanthropy through decentralized intelligence and real-time impact tracking. Powered by <span className="text-cyan-400 font-bold">Skycoin4444</span>.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="text-xs text-white/40 font-mono tracking-widest uppercase">Total Ecosystem Impact</div>
              <div className="text-4xl font-black text-emerald-400 mt-1" style={{ fontFamily: "Space Mono, monospace" }}>$44,444,444</div>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-emerald-400/60 font-bold">
                <TrendingUp className="w-3 h-3" />
                +12.4% THIS MONTH
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 sticky top-4 z-50">
        {[
          { id: "donate" as const, label: "IMPACT DONATION", icon: Heart },
          { id: "gamble" as const, label: "CHARITY GAMING", icon: Zap },
          { id: "transparency" as const, label: "HOPE AI LEDGER", icon: Shield },
          { id: "leaderboard" as const, label: "VISIONARY DONORS", icon: Trophy },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold tracking-[0.15em] transition-all uppercase ${tab === t.id ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10" : "text-white/40 hover:text-white/80 hover:bg-white/5"}`}
            style={{ fontFamily: "Space Mono, monospace" }}>
            <t.icon className="w-4 h-4" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl"
        >
          {tab === "donate" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>SELECT YOUR MISSION</h2>
                  <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">8 Active Campaigns</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CHARITIES.map(c => (
                    <div key={c.id} onClick={() => setSelectedCharity(c)}
                      className={`group p-6 rounded-3xl border cursor-pointer transition-all duration-300 relative overflow-hidden ${selectedCharity.id === c.id ? "bg-emerald-500/10 border-emerald-500/40 shadow-xl shadow-emerald-500/5" : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]"}`}>
                      {selectedCharity.id === c.id && (
                        <div className="absolute top-0 right-0 p-4">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse" />
                        </div>
                      )}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-4xl bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">{c.icon}</div>
                        <div>
                          <div className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">{c.name}</div>
                          <div className="text-[10px] font-mono text-white/40 tracking-widest uppercase mt-1">{c.category}</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-[11px] font-mono font-bold">
                          <span className="text-white/40">RAISED: <span className="text-emerald-400">${(c.raised / 1_000_000).toFixed(1)}M</span></span>
                          <span className="text-cyan-400">{Math.round(c.raised / c.goal * 100)}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, c.raised / c.goal * 100)}%` }}
                            className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 rounded-full" 
                          />
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-emerald-400/80 font-bold tracking-wider">
                          <Globe className="w-3 h-3" />
                          {c.impact.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sticky top-24 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "Syne, sans-serif" }}>EXECUTE DONATION</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Asset Protocol</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["SKYCOIN4444", "SHADOW", "USDT", "BTC"].map(c => (
                          <button key={c} onClick={() => setDonationCoin(c)}
                            className={`px-3 py-3 rounded-xl text-[10px] font-bold border transition-all ${donationCoin === c ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400" : "bg-white/5 border-white/10 text-white/40 hover:text-white/60"}`}>
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Impact Quantity</label>
                      <div className="relative">
                        <input type="number" value={donationAmount} onChange={e => setDonationAmount(e.target.value)} placeholder="0.00" 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xl font-black focus:outline-none focus:border-emerald-500/50 transition-colors" />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-white/20">{donationCoin}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[100, 500, 1000, 4444].map(a => (
                        <button key={a} onClick={() => setDonationAmount(String(a))} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all tracking-tighter">+{a}</button>
                      ))}
                    </div>
                    <Button className="w-full h-16 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 text-white font-black tracking-[0.2em] rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform group" onClick={handleDonate} disabled={!donationAmount}>
                      <Heart className="w-5 h-5 mr-3 group-hover:animate-ping" />
                      INITIATE IMPACT
                    </Button>
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400/80">
                        <Shield className="w-3 h-3" />
                        HOPE AI SECURED
                      </div>
                      <p className="text-[9px] text-white/30 mt-1 leading-relaxed uppercase tracking-wider font-medium">100% On-chain verification. No intermediary fees. Instant disbursement.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "gamble" && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-white" style={{ fontFamily: "Syne, sans-serif" }}>CHARITY GAMING ENGINE</h2>
                  <p className="text-white/50 text-sm font-medium">Play for the cause. High-stakes philanthropy powered by Skycoin4444.</p>
                </div>
                <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Jackpot Pool</div>
                    <div className="text-xl font-black text-amber-400 tracking-tighter">4,444,444 SKY</div>
                  </div>
                  <Coins className="w-8 h-8 text-amber-400" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {GAMBLING_CHARITY.map(g => (
                  <div key={g.game} className="group relative bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/[0.08] transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[80px] group-hover:bg-emerald-500/20 transition-all" />
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-6">
                        <div className="text-5xl bg-[#050510] w-20 h-20 rounded-3xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform shadow-2xl">{g.icon}</div>
                        <div>
                          <div className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>{g.game}</div>
                          <div className="text-sm text-white/40 mt-1 font-medium">{g.description}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/5">
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Entry Protocol</div>
                        <div className="text-sm font-bold text-white/60">{g.minBet} SHADOW MIN</div>
                      </div>
                      <Button className="h-12 px-8 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:text-white font-bold tracking-widest rounded-xl transition-all">
                        LAUNCH GAME
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "transparency" && (
            <div className="space-y-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white" style={{ fontFamily: "Syne, sans-serif" }}>HOPE AI REAL-TIME LEDGER</h2>
                <p className="text-white/50 text-sm font-medium">Unfiltered transparency. Track every movement of the ecosystem's capital.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Raised", val: "$44.4M", color: "text-emerald-400", icon: TrendingUp },
                  { label: "Active Donors", val: "142,444", color: "text-cyan-400", icon: Users },
                  { label: "Verified Charities", val: "48", color: "text-purple-400", icon: Shield },
                  { label: "Protocol Fee", val: "0.0%", color: "text-amber-400", icon: Zap },
                ].map((s, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/5 rounded-2xl">
                        <s.icon className={cn("w-5 h-5", s.color)} />
                      </div>
                      <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest font-bold">Verified</div>
                    </div>
                    <div className="text-xs text-white/40 font-mono tracking-widest uppercase mb-1">{s.label}</div>
                    <div className={cn("text-3xl font-black tracking-tighter", s.color)} style={{ fontFamily: "Space Mono, monospace" }}>{s.val}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                  <h3 className="font-bold text-white tracking-widest uppercase text-xs font-mono">LIVE DISBURSEMENT FEED</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Real-time</span>
                  </div>
                </div>
                <div className="divide-y divide-white/5">
                  {[
                    { date: "2025-01-15", amount: "$2.4M", recipient: "Clean Water Initiative", hash: "0x44...f2e", status: "COMPLETED" },
                    { date: "2025-01-10", amount: "$1.8M", recipient: "Global Education Fund", hash: "0x8a...11b", status: "COMPLETED" },
                    { date: "2025-01-05", amount: "$3.1M", recipient: "Healthcare Access", hash: "0x3c...92d", status: "COMPLETED" },
                    { date: "2024-12-28", amount: "$900K", recipient: "Zero Hunger Project", hash: "0xef...444", status: "COMPLETED" },
                  ].map((d, i) => (
                    <div key={i} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-6">
                        <div className="text-xs font-mono text-white/20">{d.date}</div>
                        <div>
                          <div className="text-lg font-black text-white tracking-tight">${d.amount}</div>
                          <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">Recipient: <span className="text-cyan-400">{d.recipient}</span></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="hidden md:block text-right">
                          <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Hash</div>
                          <div className="text-[10px] font-mono text-white/40">{d.hash}</div>
                        </div>
                        <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black tracking-widest flex items-center gap-2">
                          <Shield className="w-3 h-3" />
                          {d.status}
                        </div>
                        <ExternalLink className="w-4 h-4 text-white/20 hover:text-white cursor-pointer transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "leaderboard" && (
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-white" style={{ fontFamily: "Syne, sans-serif" }}>VISIONARY PHILANTHROPISTS</h2>
                  <p className="text-white/50 text-sm font-medium">The elite architects of change within the ShadowChat ecosystem.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-400 tracking-[0.2em] uppercase bg-cyan-500/10 px-4 py-2 rounded-xl border border-cyan-500/20">
                  <Trophy className="w-4 h-4" />
                  Top 1% Rewards Enabled
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { rank: 1, name: "Skyler Blue", amount: "$4,444,444", badge: "DIAMOND PHILANTHROPIST", icon: "💎", color: "from-cyan-400 to-blue-600" },
                  { rank: 2, name: "CryptoWhale_44", amount: "$2,800,000", badge: "PLATINUM GIVER", icon: "⚪", color: "from-slate-300 to-slate-500" },
                  { rank: 3, name: "ShadowDAO Treasury", amount: "$2,100,000", badge: "GOLD HEART", icon: "💛", color: "from-amber-400 to-orange-600" },
                  { rank: 4, name: "Anonymous Visionary", amount: "$1,500,000", badge: "SILVER SOUL", icon: "🥈", color: "from-slate-400 to-slate-600" },
                  { rank: 5, name: "DeFi_Charity_Fund", amount: "$1,200,000", badge: "BRONZE ANGEL", icon: "🥉", color: "from-orange-400 to-red-600" },
                ].map((d, i) => (
                  <motion.div 
                    key={d.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/[0.08] transition-all duration-300"
                  >
                    <div className="text-2xl font-black text-white/20 w-12 font-mono">#{d.rank}</div>
                    <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-3xl shadow-lg", d.color)}>
                      {d.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-xl font-black text-white tracking-tight uppercase" style={{ fontFamily: "Syne, sans-serif" }}>{d.name}</div>
                      <div className="inline-flex items-center gap-2 mt-1 px-2 py-0.5 rounded-md bg-white/5 text-[9px] font-black tracking-widest text-white/40 border border-white/5 uppercase">
                        {d.badge}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-1">Impact Contributed</div>
                      <div className="text-2xl font-black text-emerald-400 tracking-tighter font-mono">{d.amount}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer Branding */}
      <div className="text-center space-y-4 pt-12 pb-20 border-t border-white/5">
        <div className="flex items-center justify-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all">
          <img src={LOGO_URL} alt="ShadowChat" className="h-8" />
          <div className="h-4 w-px bg-white/20" />
          <div className="text-lg font-black text-white tracking-tighter">HOPE AI</div>
          <div className="h-4 w-px bg-white/20" />
          <div className="text-lg font-black text-white tracking-tighter">SKYCOIN4444</div>
        </div>
        <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">Innovative Information Technology Resolutions LLC © 2026</p>
      </div>
    </div>
  );
}
