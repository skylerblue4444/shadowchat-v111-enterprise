import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ICOPortal() {
  const [investAmount, setInvestAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("USDT");
  const { data: ico } = trpc.tokenomics.getICO.useQuery();
  const buyICO = trpc.tokenomics.buyICO.useMutation({ onSuccess: (d) => toast.success(`Purchased ${d.tokensReceived.toLocaleString()} SHADOW tokens!`) });

  const currentPhase = ico?.currentPhase;
  const totalRaised = ico?.totalRaised || 0;
  const progressPercent = (totalRaised / (ico?.totalTarget || 100_000_000)) * 100;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-purple-900/30 via-black to-cyan-900/20 border border-purple-500/20 rounded-3xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="relative z-10">
          <div className="text-xs font-mono text-purple-400 mb-2 tracking-widest">INITIAL COIN OFFERING</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">SHADOW Token Sale</h1>
          <p className="text-white/50 max-w-xl">Join the future of decentralized AI-powered social economy. Early investors get the best rates and exclusive governance rights.</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><div className="text-xs text-white/40">Total Supply</div><div className="text-lg font-bold">21B SHADOW</div></div>
            <div><div className="text-xs text-white/40">Current Price</div><div className="text-lg font-bold text-emerald-400">${currentPhase?.price || "0.0033"}</div></div>
            <div><div className="text-xs text-white/40">Total Raised</div><div className="text-lg font-bold text-purple-400">${(totalRaised / 1_000_000).toFixed(1)}M</div></div>
            <div><div className="text-xs text-white/40">Investors</div><div className="text-lg font-bold text-cyan-400">{(ico?.investors || 42000).toLocaleString()}</div></div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold">Fundraising Progress</h2>
          <span className="text-sm text-emerald-400 font-mono">{progressPercent.toFixed(1)}%</span>
        </div>
        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, progressPercent)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-white/40 mt-2">
          <span>${(totalRaised / 1_000_000).toFixed(1)}M raised</span>
          <span>$100M target</span>
        </div>
      </div>

      {/* Phases */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="font-bold text-lg mb-4">Sale Phases</h2>
        <div className="space-y-3">
          {(ico?.phases || []).map((p, i) => (
            <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${p.status === "active" ? "bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20" : p.status === "completed" ? "bg-white/5 border-white/10 opacity-70" : "bg-white/3 border-white/5"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${p.status === "active" ? "bg-emerald-500 text-white" : p.status === "completed" ? "bg-white/20 text-white/60" : "bg-white/5 text-white/30"}`}>
                  {p.status === "completed" ? "✓" : i + 1}
                </div>
                <div>
                  <div className="font-bold">{p.phase}</div>
                  <div className="text-xs text-white/40">Price: ${p.price} • Allocation: {p.allocation}%</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs font-bold ${p.status === "active" ? "text-emerald-400" : p.status === "completed" ? "text-white/40" : "text-white/20"}`}>
                  {p.status === "active" ? "🟢 LIVE" : p.status === "completed" ? "Completed" : "Upcoming"}
                </div>
                <div className="text-xs text-white/40">${(p.raised / 1_000_000).toFixed(1)}M raised</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buy Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-4">Buy SHADOW Tokens</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Payment Method</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white">
                {["USDT", "BTC", "ETH", "SKY", "DOGE"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Amount (SHADOW tokens)</label>
              <input type="number" value={investAmount} onChange={e => setInvestAmount(e.target.value)} placeholder="e.g. 100000" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
            </div>
            {investAmount && currentPhase && (
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-sm">
                <div className="flex justify-between"><span className="text-white/40">Tokens:</span><span>{Number(investAmount).toLocaleString()} SHADOW</span></div>
                <div className="flex justify-between"><span className="text-white/40">Cost:</span><span className="font-bold">${(Number(investAmount) * currentPhase.price).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-white/40">Vesting:</span><span className="text-xs">25% TGE, 25% monthly x3</span></div>
              </div>
            )}
            <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold"
              onClick={() => buyICO.mutate({ amount: Number(investAmount), paymentCoin: paymentMethod })}
              disabled={buyICO.isPending || !investAmount}>
              {buyICO.isPending ? "Processing..." : "🚀 Buy SHADOW Tokens"}
            </Button>
            <p className="text-[10px] text-white/30 text-center">Min purchase: 1,000 SHADOW. KYC required for purchases over $10,000.</p>
          </div>
        </div>

        {/* Token Distribution */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-4">Token Distribution</h2>
          {ico?.tokenomics?.distribution && (
            <div className="space-y-3">
              {Object.entries(ico.tokenomics.distribution).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2">
                  <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className="text-sm font-bold text-cyan-400">{value}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-white/40">Burn Rate:</span><span>{ico?.tokenomics?.burnMechanism}</span></div>
            <div className="flex justify-between text-sm"><span className="text-white/40">Staking:</span><span>{ico?.tokenomics?.stakingRewards}</span></div>
            <div className="flex justify-between text-sm"><span className="text-white/40">Mining:</span><span>{ico?.tokenomics?.miningRewards}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
