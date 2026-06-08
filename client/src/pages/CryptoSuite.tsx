// @ts-nocheck
import { trpc } from "@/lib/trpc";
import { useState } from "react";

const COINS = [
  { symbol: "DOGE", name: "Dogecoin", icon: "🐕", color: "#C3A634" },
  { symbol: "XMR", name: "Monero", icon: "🔒", color: "#FF6600" },
  { symbol: "USDT", name: "Tether", icon: "💵", color: "#26A17B" },
  { symbol: "SHADOW", name: "ShadowCoin", icon: "👻", color: "#6B21A8" },
  { symbol: "TRUMP", name: "TrumpCoin", icon: "🇺🇸", color: "#DC2626" },
  { symbol: "SKY4444", name: "SkyCoin4444", icon: "🌌", color: "#0EA5E9" },
];

export default function CryptoSuite() {
  const [tab, setTab] = useState<"portfolio" | "staking" | "mining" | "burn" | "ico">("portfolio");
  const { data: portfolio } = trpc.crypto.getPortfolio.useQuery();
  const { data: staking } = trpc.crypto.getStakingPools.useQuery();
  const { data: mining } = trpc.crypto.getMiningPools.useQuery();
  const { data: burns } = trpc.crypto.getBurnHistory.useQuery();
  const { data: prices } = trpc.crypto.getPortfolio.useQuery();

  const stakeMutation = trpc.crypto.stake.useMutation();
  const mineMutation = trpc.crypto.startMining.useMutation();
  const burnMutation = trpc.crypto.burnTokens.useMutation();

  const tabs = [
    { id: "portfolio", label: "Portfolio", icon: "💼" },
    { id: "staking", label: "Staking", icon: "🔒" },
    { id: "mining", label: "Mining", icon: "⛏️" },
    { id: "burn", label: "Burn Portal", icon: "🔥" },
    { id: "ico", label: "ICO / Invest", icon: "🚀" },
  ] as const;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Crypto Suite</h1>
          <p className="text-muted-foreground">Stake, mine, burn, trade — all coins in one place</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">${portfolio?.totalValue.toLocaleString() || "0"}</div>
          <div className="text-sm text-emerald-500">+{portfolio?.change24h.toFixed(2) || "0"}%</div>
        </div>
      </div>

      {/* Coin Ticker */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {prices?.coins?.map((p: any) => (
          <div key={p.symbol} className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 min-w-fit">
            <span>{COINS.find(c => c.symbol === p.symbol)?.icon || "🪙"}</span>
            <span className="font-medium text-sm text-foreground">{p.symbol}</span>
            <span className="text-sm text-foreground">${p.price.toFixed(4)}</span>
            <span className={`text-xs ${p.change > 0 ? "text-emerald-500" : "text-red-500"}`}>{p.change > 0 ? "+" : ""}{p.change.toFixed(1)}%</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 rounded-lg p-1 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Portfolio */}
      {tab === "portfolio" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio?.holdings.map((h: any) => {
              const coin = COINS.find(c => c.symbol === h.symbol);
              return (
                <div key={h.symbol} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{coin?.icon || "🪙"}</span>
                    <div>
                      <div className="font-medium text-foreground">{coin?.name || h.symbol}</div>
                      <div className="text-xs text-muted-foreground">{h.symbol}</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-foreground">{h.balance.toLocaleString()} {h.symbol}</div>
                  <div className="text-sm text-muted-foreground">${h.valueUSD.toLocaleString()}</div>
                  <div className={`text-xs mt-1 ${h.change24h > 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {h.change24h > 0 ? "▲" : "▼"} {Math.abs(h.change24h).toFixed(2)}% (24h)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Staking */}
      {tab === "staking" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-sm text-muted-foreground">Total Staked</div>
              <div className="text-2xl font-bold text-foreground">${staking?.totalStaked.toLocaleString() || 0}</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-sm text-muted-foreground">Total Rewards</div>
              <div className="text-2xl font-bold text-emerald-500">${staking?.totalRewards.toLocaleString() || 0}</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-sm text-muted-foreground">Avg APY</div>
              <div className="text-2xl font-bold text-primary">{staking?.avgAPY || 0}%</div>
            </div>
          </div>
          <div className="space-y-3">
            {staking?.pools.map((pool: any) => (
              <div key={pool.coin} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{COINS.find(c => c.symbol === pool.coin)?.icon || "🪙"}</span>
                  <div>
                    <div className="font-medium text-foreground">{pool.coin} Staking</div>
                    <div className="text-sm text-muted-foreground">Lock: {pool.lockDays} days | APY: {pool.apy}%</div>
                  </div>
                </div>
                <button onClick={() => stakeMutation.mutate({ coin: pool.coin as any, amount: "100", lockPeriodDays: pool.lockDays || 30 })} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 active:scale-97 transition-all">
                  Stake
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mining */}
      {tab === "mining" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-sm text-muted-foreground">Hash Rate</div>
              <div className="text-2xl font-bold text-foreground">{mining?.hashRate || 0} MH/s</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-sm text-muted-foreground">Mined Today</div>
              <div className="text-2xl font-bold text-emerald-500">{mining?.minedToday || 0} tokens</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-sm text-muted-foreground">Pool Power</div>
              <div className="text-2xl font-bold text-primary">{mining?.poolPower || 0}%</div>
            </div>
          </div>
          <div className="space-y-3">
            {mining?.activePools.map((pool: any) => (
              <div key={pool.name} className="bg-card border border-border rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-foreground">{pool.name}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${pool.status === "mining" ? "bg-emerald-500/20 text-emerald-500" : "bg-muted text-muted-foreground"}`}>{pool.status}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${pool.progress}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{pool.miners} miners</span>
                  <span>{pool.reward} tokens/block</span>
                </div>
              </div>
            ))}
            <button onClick={() => mineMutation.mutate({ poolId: 1, hashRate: "50" })} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 active:scale-97 transition-all">
              ⛏️ Start Mining
            </button>
          </div>
        </div>
      )}

      {/* Burn Portal */}
      {tab === "burn" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">🔥</div>
            <h3 className="text-xl font-bold text-foreground">Token Burn Portal</h3>
            <p className="text-sm text-muted-foreground mt-1">Burn tokens to reduce supply and earn exclusive rewards</p>
            <div className="text-3xl font-bold text-orange-500 mt-3">{burns?.length || 0} tokens burned</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COINS.map(coin => (
              <div key={coin.symbol} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{coin.icon}</span>
                  <span className="font-medium text-foreground">{coin.symbol}</span>
                </div>
                <button onClick={() => burnMutation.mutate({ coin: coin.symbol as any, amount: "100" })} className="px-3 py-1.5 bg-orange-500/20 text-orange-500 rounded-lg text-sm font-medium hover:bg-orange-500/30 transition-all">
                  Burn 100
                </button>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Recent Burns</h4>
            {burns?.map((b: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border text-sm">
                <span className="text-muted-foreground">{b.coin}</span>
                <span className="text-orange-500 font-medium">-{b.amount.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">{new Date(b.timestamp).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ICO */}
      {tab === "ico" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-foreground">SkyCoin4444 ICO</h3>
            <p className="text-sm text-muted-foreground mt-1">Invest early in the next-generation AI-powered token</p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div><div className="text-xl font-bold text-foreground">$0.042</div><div className="text-xs text-muted-foreground">Current Price</div></div>
              <div><div className="text-xl font-bold text-foreground">$2.4M</div><div className="text-xs text-muted-foreground">Raised</div></div>
              <div><div className="text-xl font-bold text-foreground">67%</div><div className="text-xs text-muted-foreground">Sold</div></div>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden mt-4">
              <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" style={{ width: "67%" }} />
            </div>
            <button className="w-full mt-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 active:scale-97 transition-all">
              🚀 Invest Now
            </button>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <h4 className="font-medium text-foreground mb-3">Investment Tiers</h4>
            <div className="space-y-2">
              {[
                { tier: "Seed", min: "$100", bonus: "+20% tokens", lock: "12 months" },
                { tier: "Private", min: "$1,000", bonus: "+10% tokens", lock: "6 months" },
                { tier: "Public", min: "$50", bonus: "No bonus", lock: "3 months" },
              ].map(t => (
                <div key={t.tier} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="font-medium text-foreground">{t.tier}</span>
                  <span className="text-sm text-muted-foreground">Min: {t.min}</span>
                  <span className="text-sm text-primary">{t.bonus}</span>
                  <span className="text-xs text-muted-foreground">Lock: {t.lock}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
