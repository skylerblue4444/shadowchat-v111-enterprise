import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const [donationCoin, setDonationCoin] = useState("SHADOW");
  const [tab, setTab] = useState<"donate" | "gamble" | "transparency" | "leaderboard">("donate");

  const handleDonate = () => {
    if (!donationAmount) return;
    toast.success(`Donated ${donationAmount} ${donationCoin} to ${selectedCharity.name}! 🎉`);
    setDonationAmount("");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            ShadowChat Charity
          </h1>
          <p className="text-sm text-white/50 mt-1">Give back. Change lives. Every token counts.</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2">
          <div className="text-xs text-white/40">Total Donated</div>
          <div className="text-xl font-bold text-emerald-400">$35.1M</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: "donate" as const, label: "Donate", icon: "❤️" },
          { id: "gamble" as const, label: "Charity Gambling", icon: "🎰" },
          { id: "transparency" as const, label: "Transparency", icon: "📊" },
          { id: "leaderboard" as const, label: "Top Donors", icon: "🏆" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${tab === t.id ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6">
        {tab === "donate" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Choose a Cause</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {CHARITIES.map(c => (
                <div key={c.id} onClick={() => setSelectedCharity(c)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedCharity.id === c.id ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/5 border-white/10 hover:border-white/20"}`}>
                  <div className="text-2xl mb-2">{c.icon}</div>
                  <div className="font-bold text-sm">{c.name}</div>
                  <div className="text-xs text-white/40 mt-1">{c.category}</div>
                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] text-white/40 mb-1">
                      <span>${(c.raised / 1_000_000).toFixed(1)}M raised</span>
                      <span>{Math.round(c.raised / c.goal * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" style={{ width: `${Math.min(100, c.raised / c.goal * 100)}%` }} />
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-2">{c.impact}</div>
                </div>
              ))}
            </div>

            <div className="max-w-md space-y-3 mt-6">
              <h3 className="font-bold">Donate to: {selectedCharity.name}</h3>
              <div className="flex gap-2">
                <select value={donationCoin} onChange={e => setDonationCoin(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white">
                  {["SHADOW", "SKY", "USDT", "BTC", "DOGE"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="number" value={donationAmount} onChange={e => setDonationAmount(e.target.value)} placeholder="Amount" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
              </div>
              <div className="flex gap-2">
                {[100, 500, 1000, 5000, 10000].map(a => (
                  <button key={a} onClick={() => setDonationAmount(String(a))} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs hover:bg-white/10 transition-colors">{a.toLocaleString()}</button>
                ))}
              </div>
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500" onClick={handleDonate} disabled={!donationAmount}>
                ❤️ Donate {donationAmount ? `${donationAmount} ${donationCoin}` : ""}
              </Button>
              <p className="text-[10px] text-white/30 text-center">100% transparent. All donations tracked on-chain. Tax receipts available.</p>
            </div>
          </div>
        )}

        {tab === "gamble" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Charity Gambling</h2>
            <p className="text-sm text-white/50">Play games where proceeds go to charity. Fun + Impact.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {GAMBLING_CHARITY.map(g => (
                <div key={g.game} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{g.icon}</span>
                    <div>
                      <div className="font-bold">{g.game}</div>
                      <div className="text-xs text-white/40">{g.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-white/40">Min bet: {g.minBet} SHADOW</span>
                    <Button size="sm" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" onClick={() => toast.success(`Playing ${g.game} for charity!`)}>
                      Play for Charity
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "transparency" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Transparency Dashboard</h2>
            <p className="text-sm text-white/50">Every donation tracked. Every dollar accounted for.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white/5 rounded-lg p-3 text-center"><div className="text-xs text-white/40">Total Raised</div><div className="text-lg font-bold text-emerald-400">$35.1M</div></div>
              <div className="bg-white/5 rounded-lg p-3 text-center"><div className="text-xs text-white/40">Donors</div><div className="text-lg font-bold text-cyan-400">142K</div></div>
              <div className="bg-white/5 rounded-lg p-3 text-center"><div className="text-xs text-white/40">Charities</div><div className="text-lg font-bold text-purple-400">48</div></div>
              <div className="bg-white/5 rounded-lg p-3 text-center"><div className="text-xs text-white/40">Admin Fee</div><div className="text-lg font-bold text-orange-400">0.5%</div></div>
            </div>
            <div className="space-y-2 mt-4">
              <h3 className="font-bold text-sm">Recent Disbursements</h3>
              {[
                { date: "2025-01-15", amount: "$2.4M", recipient: "Clean Water Initiative", status: "Verified ✅" },
                { date: "2025-01-10", amount: "$1.8M", recipient: "Global Education Fund", status: "Verified ✅" },
                { date: "2025-01-05", amount: "$3.1M", recipient: "Healthcare Access", status: "Verified ✅" },
                { date: "2024-12-28", amount: "$900K", recipient: "Zero Hunger Project", status: "Verified ✅" },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div><span className="font-bold text-sm">{d.amount}</span> <span className="text-xs text-white/40">→ {d.recipient}</span></div>
                  <div className="text-xs text-emerald-400">{d.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "leaderboard" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Top Donors</h2>
            <div className="space-y-2">
              {[
                { rank: 1, name: "Skyler Blue", amount: "$4.2M", badge: "🥇 Diamond Philanthropist" },
                { rank: 2, name: "CryptoWhale_44", amount: "$2.8M", badge: "🥈 Platinum Giver" },
                { rank: 3, name: "ShadowDAO Treasury", amount: "$2.1M", badge: "🥉 Gold Heart" },
                { rank: 4, name: "Anonymous", amount: "$1.5M", badge: "Silver Soul" },
                { rank: 5, name: "DeFi_Charity_Fund", amount: "$1.2M", badge: "Bronze Angel" },
              ].map(d => (
                <div key={d.rank} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <span className="text-lg font-bold text-white/30 w-8">#{d.rank}</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{d.name}</div>
                    <div className="text-xs text-white/40">{d.badge}</div>
                  </div>
                  <div className="text-sm font-bold text-emerald-400">{d.amount}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
