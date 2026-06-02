import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Tab = "portfolio" | "trade" | "stake" | "mine" | "burn" | "swap" | "ico" | "whitepaper";

export default function Tokenomics() {
  const [tab, setTab] = useState<Tab>("portfolio");
  const [swapFrom, setSwapFrom] = useState("SHADOW");
  const [swapTo, setSwapTo] = useState("USDT");
  const [swapAmount, setSwapAmount] = useState("");
  const [tradeAmount, setTradeAmount] = useState("");
  const [tradeCoin, setTradeCoin] = useState("SHADOW");
  const [tradeSide, setTradeSide] = useState<"buy" | "sell">("buy");
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakeCoin, setStakeCoin] = useState("SHADOW");
  const [stakeDays, setStakeDays] = useState(90);
  const [burnAmount, setBurnAmount] = useState("");
  const [burnCoin, setBurnCoin] = useState("SHADOW");
  const [minePool, setMinePool] = useState("shadow-core");
  const [hashPower, setHashPower] = useState(50);

  const { data: coins } = trpc.tokenomics.getCoins.useQuery();
  const { data: wallet } = trpc.tokenomics.getWallet.useQuery();
  const { data: stakingInfo } = trpc.tokenomics.getStakingInfo.useQuery();
  const { data: miningPools } = trpc.tokenomics.getMiningPools.useQuery();
  const { data: ico } = trpc.tokenomics.getICO.useQuery();
  const { data: whitepaper } = trpc.tokenomics.getWhitepaper.useQuery();
  const { data: portfolio } = trpc.tokenomics.getPortfolioAnalytics.useQuery();

  const swapMutation = trpc.tokenomics.swap.useMutation({ onSuccess: () => toast.success("Swap executed!") });
  const tradeMutation = trpc.tokenomics.trade.useMutation({ onSuccess: () => toast.success("Trade filled!") });
  const stakeMutation = trpc.tokenomics.stake.useMutation({ onSuccess: (d) => toast.success(`Staked! ${d.tier} tier, ${d.apy}% APY`) });
  const burnMutation = trpc.tokenomics.burn.useMutation({ onSuccess: () => toast.success("Tokens burned! 🔥") });
  const mineMutation = trpc.tokenomics.mine.useMutation({ onSuccess: (d) => toast.success(`Mined ${d.reward.toFixed(2)} ${d.coin}!`) });

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "portfolio", label: "Portfolio", icon: "💼" },
    { id: "trade", label: "Trade", icon: "📈" },
    { id: "swap", label: "Swap", icon: "🔄" },
    { id: "stake", label: "Stake", icon: "🥩" },
    { id: "mine", label: "Mine", icon: "⛏️" },
    { id: "burn", label: "Burn", icon: "🔥" },
    { id: "ico", label: "ICO", icon: "🚀" },
    { id: "whitepaper", label: "Whitepaper", icon: "📄" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Tokenomics & Crypto Economy
          </h1>
          <p className="text-sm text-white/50 mt-1">SHADOW • SKY • TRUMP • DOGE • BTC • USDT • MONERO</p>
        </div>
        {wallet && (
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2">
            <div className="text-xs text-white/40">Total Portfolio</div>
            <div className="text-xl font-bold text-emerald-400">${wallet.totalUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          </div>
        )}
      </div>

      {/* Coin Ticker */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {(coins?.coins || []).map((c) => (
          <div key={c.symbol} className="flex-shrink-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2 min-w-[140px]">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{c.icon}</span>
              <span className="text-xs font-bold">{c.symbol}</span>
              <span className={`text-[10px] ml-auto ${c.change24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {c.change24h >= 0 ? "▲" : "▼"}{Math.abs(c.change24h).toFixed(1)}%
              </span>
            </div>
            <div className="text-sm font-mono mt-1">${c.price < 1 ? c.price.toFixed(4) : c.price.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              tab === t.id ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-white/50 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6">
        {tab === "portfolio" && wallet && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Your Wallet</h2>
            <p className="text-xs text-emerald-400">New users start with 10,000 SHADOW + 10,000 SKY!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {wallet.balances.filter(b => b.balance > 0).map((b) => (
                <div key={b.symbol} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{b.icon}</span>
                    <div>
                      <div className="font-bold">{b.symbol}</div>
                      <div className="text-[10px] text-white/40">{b.name}</div>
                    </div>
                  </div>
                  <div className="text-lg font-mono">{b.balance.toLocaleString()}</div>
                  <div className="text-xs text-white/40">${b.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  {b.pendingRewards > 0 && (
                    <div className="text-xs text-emerald-400 mt-1">+{b.pendingRewards} pending rewards</div>
                  )}
                </div>
              ))}
            </div>
            {portfolio && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center">
                  <div className="text-xs text-white/40">Total Profit</div>
                  <div className="text-lg font-bold text-emerald-400">+${portfolio.totalProfit.toLocaleString()}</div>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 text-center">
                  <div className="text-xs text-white/40">Risk Score</div>
                  <div className="text-lg font-bold text-cyan-400">{portfolio.riskScore}/10</div>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-center">
                  <div className="text-xs text-white/40">Best</div>
                  <div className="text-lg font-bold text-purple-400">{portfolio.bestPerformer.coin} +{portfolio.bestPerformer.gain}%</div>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-center">
                  <div className="text-xs text-white/40">Diversification</div>
                  <div className="text-lg font-bold text-orange-400">{portfolio.diversificationScore}/10</div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "trade" && (
          <div className="space-y-4 max-w-md">
            <h2 className="text-lg font-bold">Trade</h2>
            <div className="flex gap-2">
              <button onClick={() => setTradeSide("buy")} className={`flex-1 py-2 rounded-lg text-sm font-bold ${tradeSide === "buy" ? "bg-emerald-500 text-white" : "bg-white/5 text-white/50"}`}>Buy</button>
              <button onClick={() => setTradeSide("sell")} className={`flex-1 py-2 rounded-lg text-sm font-bold ${tradeSide === "sell" ? "bg-red-500 text-white" : "bg-white/5 text-white/50"}`}>Sell</button>
            </div>
            <select value={tradeCoin} onChange={(e) => setTradeCoin(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white">
              {Object.keys(coins?.coins || {}).length > 0 ? coins!.coins.map(c => <option key={c.symbol} value={c.symbol}>{c.icon} {c.symbol} — ${c.price < 1 ? c.price.toFixed(4) : c.price.toLocaleString()}</option>) :
                ["SHADOW", "SKY", "TRUMP", "DOGE", "BTC", "USDT", "MONERO"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="number" value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value)} placeholder="Amount" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
            <Button className={`w-full ${tradeSide === "buy" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"}`}
              onClick={() => tradeMutation.mutate({ coin: tradeCoin, side: tradeSide, amount: Number(tradeAmount), orderType: "market" })}
              disabled={tradeMutation.isPending || !tradeAmount}>
              {tradeMutation.isPending ? "Executing..." : `${tradeSide === "buy" ? "Buy" : "Sell"} ${tradeCoin}`}
            </Button>
          </div>
        )}

        {tab === "swap" && (
          <div className="space-y-4 max-w-md">
            <h2 className="text-lg font-bold">Swap Tokens</h2>
            <div className="space-y-2">
              <label className="text-xs text-white/40">From</label>
              <div className="flex gap-2">
                <select value={swapFrom} onChange={(e) => setSwapFrom(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white">
                  {["SHADOW", "SKY", "TRUMP", "DOGE", "BTC", "USDT", "MONERO"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input type="number" value={swapAmount} onChange={(e) => setSwapAmount(e.target.value)} placeholder="Amount" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
              </div>
            </div>
            <div className="text-center text-2xl">⇅</div>
            <div className="space-y-2">
              <label className="text-xs text-white/40">To</label>
              <select value={swapTo} onChange={(e) => setSwapTo(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white">
                {["SHADOW", "SKY", "TRUMP", "DOGE", "BTC", "USDT", "MONERO"].filter(s => s !== swapFrom).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500"
              onClick={() => swapMutation.mutate({ fromCoin: swapFrom, toCoin: swapTo, amount: Number(swapAmount), slippage: 0.5 })}
              disabled={swapMutation.isPending || !swapAmount}>
              {swapMutation.isPending ? "Swapping..." : "Swap"}
            </Button>
            {swapMutation.data && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-sm">
                <div>Received: {swapMutation.data.to.amount.toFixed(4)} {swapMutation.data.to.coin}</div>
                <div className="text-xs text-white/40">Rate: 1 {swapMutation.data.from.coin} = {swapMutation.data.rate.toFixed(6)} {swapMutation.data.to.coin}</div>
              </div>
            )}
          </div>
        )}

        {tab === "stake" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Stake & Earn</h2>
            {stakingInfo && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-white/5 rounded-lg p-3 text-center"><div className="text-xs text-white/40">Total Staked</div><div className="font-bold">${(stakingInfo.totalStaked * 0.0044).toLocaleString()}</div></div>
                <div className="bg-white/5 rounded-lg p-3 text-center"><div className="text-xs text-white/40">Stakers</div><div className="font-bold">{stakingInfo.totalStakers.toLocaleString()}</div></div>
                <div className="bg-white/5 rounded-lg p-3 text-center"><div className="text-xs text-white/40">Avg APY</div><div className="font-bold text-emerald-400">{stakingInfo.averageAPY}%</div></div>
                <div className="bg-white/5 rounded-lg p-3 text-center"><div className="text-xs text-white/40">Next Reward</div><div className="font-bold text-cyan-400">~1h</div></div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
              {(stakingInfo?.tiers || []).map(t => (
                <div key={t.tier} className="bg-white/5 border border-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/10 transition-colors" onClick={() => { setStakeAmount(String(t.minStake)); setStakeDays(t.lockDays); }}>
                  <div className="font-bold text-sm">{t.tier}</div>
                  <div className="text-lg font-bold text-emerald-400">{t.apy}% APY</div>
                  <div className="text-[10px] text-white/40">Min: {t.minStake.toLocaleString()} • {t.lockDays}d</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 max-w-md">
              <select value={stakeCoin} onChange={(e) => setStakeCoin(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white">
                {["SHADOW", "SKY", "TRUMP", "DOGE"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input type="number" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} placeholder="Amount" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
              <Button className="bg-emerald-500 hover:bg-emerald-600"
                onClick={() => stakeMutation.mutate({ coin: stakeCoin, amount: Number(stakeAmount), lockDays: stakeDays })}
                disabled={stakeMutation.isPending || !stakeAmount}>
                Stake
              </Button>
            </div>
          </div>
        )}

        {tab === "mine" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Mining Pools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(miningPools?.pools || []).map(p => (
                <div key={p.id} className={`bg-white/5 border rounded-xl p-4 cursor-pointer transition-all ${minePool === p.id ? "border-cyan-500/50 bg-cyan-500/5" : "border-white/10 hover:border-white/20"}`} onClick={() => setMinePool(p.id)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">{p.coin}</span>
                    <span className="text-xs text-white/40">{p.miners} miners</span>
                  </div>
                  <div className="text-sm text-white/60">Reward: {p.reward} {p.coin}/block</div>
                  <div className="text-xs text-white/40">Hash: {p.totalHashRate} • Block: {p.blockTime}s</div>
                </div>
              ))}
            </div>
            <div className="max-w-md space-y-3">
              <label className="text-xs text-white/40">Hash Power: {hashPower}%</label>
              <input type="range" min="1" max="100" value={hashPower} onChange={(e) => setHashPower(Number(e.target.value))} className="w-full" />
              <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500"
                onClick={() => mineMutation.mutate({ poolId: minePool, hashPower })}
                disabled={mineMutation.isPending}>
                {mineMutation.isPending ? "Mining..." : `⛏️ Mine ${minePool.split("-")[0].toUpperCase()}`}
              </Button>
              {mineMutation.data && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm">
                  Mined: {mineMutation.data.reward.toFixed(4)} {mineMutation.data.coin} (Block #{mineMutation.data.blockMined})
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "burn" && (
          <div className="space-y-4 max-w-md">
            <h2 className="text-lg font-bold">🔥 Burn Tokens</h2>
            <p className="text-sm text-white/50">Burning tokens permanently removes them from circulation, increasing scarcity and value for all holders.</p>
            <select value={burnCoin} onChange={(e) => setBurnCoin(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white">
              {["SHADOW", "SKY", "TRUMP", "DOGE"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="number" value={burnAmount} onChange={(e) => setBurnAmount(e.target.value)} placeholder="Amount to burn" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
            <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500"
              onClick={() => burnMutation.mutate({ coin: burnCoin, amount: Number(burnAmount) })}
              disabled={burnMutation.isPending || !burnAmount}>
              {burnMutation.isPending ? "Burning..." : "🔥 Burn Forever"}
            </Button>
            {burnMutation.data && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm space-y-1">
                <div>Burned: {burnMutation.data.amount} {burnMutation.data.coin}</div>
                <div className="text-xs text-white/40">TX: {burnMutation.data.txHash.slice(0, 20)}...</div>
                <div className="text-xs text-white/40">Total burned: {burnMutation.data.totalBurned.toLocaleString()}</div>
              </div>
            )}
          </div>
        )}

        {tab === "ico" && ico && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">🚀 SHADOW ICO</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-center"><div className="text-xs text-white/40">Total Raised</div><div className="font-bold text-purple-400">${(ico.totalRaised / 1_000_000).toFixed(1)}M</div></div>
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 text-center"><div className="text-xs text-white/40">Investors</div><div className="font-bold text-cyan-400">{ico.investors.toLocaleString()}</div></div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center"><div className="text-xs text-white/40">Current Price</div><div className="font-bold text-emerald-400">${ico.currentPhase?.price}</div></div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-center"><div className="text-xs text-white/40">Phase</div><div className="font-bold text-orange-400">{ico.currentPhase?.phase}</div></div>
            </div>
            <div className="space-y-2">
              {ico.phases.map(p => (
                <div key={p.phase} className={`flex items-center justify-between p-3 rounded-lg border ${p.status === "active" ? "bg-emerald-500/10 border-emerald-500/30" : p.status === "completed" ? "bg-white/5 border-white/10" : "bg-white/3 border-white/5"}`}>
                  <div><span className="font-bold">{p.phase}</span> <span className="text-xs text-white/40">@ ${p.price}</span></div>
                  <div className="text-xs">{p.status === "completed" ? "✅" : p.status === "active" ? "🟢 LIVE" : "⏳"} ${(p.raised / 1_000_000).toFixed(1)}M raised</div>
                </div>
              ))}
            </div>
            <h3 className="font-bold mt-4">Token Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {Object.entries(ico.tokenomics.distribution).map(([k, v]) => (
                <div key={k} className="bg-white/5 rounded-lg p-2 text-center">
                  <div className="text-xs text-white/40 capitalize">{k.replace(/([A-Z])/g, " $1")}</div>
                  <div className="font-bold text-sm">{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "whitepaper" && whitepaper && (
          <div className="space-y-6 max-w-3xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{whitepaper.title}</h1>
              <p className="text-sm text-white/50 mt-1">{whitepaper.subtitle}</p>
              <p className="text-xs text-white/30 mt-2">Version {whitepaper.version} • {whitepaper.date} • {whitepaper.authors.join(", ")}</p>
            </div>
            {whitepaper.sections.map((s, i) => (
              <div key={i} className="space-y-2">
                <h2 className="text-lg font-bold text-cyan-400">{s.title}</h2>
                <p className="text-sm text-white/70 leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
