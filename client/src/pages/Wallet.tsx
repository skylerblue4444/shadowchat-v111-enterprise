import { useState, useEffect } from "react";
import { useLivePrices } from "@/hooks/useLivePrice";
import { connectPhantom, connectEVMWallet, sendSKY444, getSKY444Balance, disconnectSolanaWallet } from "@/lib/web3";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import {
  Wallet as WalletIcon, Send, ArrowDownLeft, ArrowUpRight, TrendingUp,
  TrendingDown, Copy, QrCode, Flame, Lock, Coins, RefreshCw, Plus,
  CheckCircle2, Clock, AlertCircle
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);
const generateSparkline = (points = 12, base = 100, range = 10) => Array.from({ length: points }, () => base + (Math.random() - 0.5) * range * 2);
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

const STAKING_POOLS = [
  { name: "AetherLux Vault", apy: 44, minStake: 10000, lockDays: 30, tvl: 88_000_000, active: true, color: "#22d3ee" },
  { name: "Quantum Yield", apy: 28, minStake: 5000, lockDays: 14, tvl: 42_000_000, active: true, color: "#8b5cf6" },
  { name: "Genesis Pool", apy: 12, minStake: 1000, lockDays: 7, tvl: 120_000_000, active: true, color: "#10b981" },
];

const TRANSACTIONS = [
  { id: "tx1", type: "receive", coin: "SKYCOIN", amount: 44444, from: "0xabc...def", time: "2m ago", status: "confirmed" },
  { id: "tx2", type: "trade",   coin: "BTC",     amount: 0.042, from: "Exchange",   time: "15m ago", status: "confirmed" },
  { id: "tx3", type: "stake",   coin: "SKYCOIN", amount: 100000, from: "AetherLux", time: "1h ago",  status: "confirmed" },
  { id: "tx4", type: "send",    coin: "USDT",    amount: 500,   from: "0x123...789", time: "3h ago", status: "confirmed" },
  { id: "tx5", type: "reward",  coin: "SKYCOIN", amount: 4444,  from: "Staking",    time: "6h ago",  status: "confirmed" },
  { id: "tx6", type: "receive", coin: "ETH",     amount: 2.5,   from: "0xfed...cba", time: "1d ago", status: "confirmed" },
];

const CHART_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: 120000 + Math.sin(i * 0.4) * 20000 + i * 800 + Math.random() * 5000,
}));

const TOKENS = [
  { symbol: "SKYCOIN", name: "ShadowChat Token", balance: 4444444, price: 0.044, change: 4.4, color: "#00e5ff" },
  { symbol: "BTC", name: "Bitcoin", balance: 0.42, price: 67000, change: 2.1, color: "#f7931a" },
  { symbol: "ETH", name: "Ethereum", balance: 4.4, price: 3200, change: -0.8, color: "#627eea" },
  { symbol: "SOL", name: "Solana", balance: 44, price: 180, change: 5.2, color: "#9945ff" },
  { symbol: "USDT", name: "Tether", balance: 4444, price: 1, change: 0, color: "#26a17b" },
];

function TokenRow({ token }: { token: typeof TOKENS[0] }) {
  const spark = generateSparkline(20, token.price, token.price * 0.04);
  const isUp = token.change >= 0;
  const usdValue = token.balance * token.price;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02] px-4 transition-colors">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: token.color + "33" }}>
        {token.symbol.slice(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold text-white">{token.symbol}</div>
        <div className="text-[10px] text-white/40">{token.name}</div>
      </div>
      <div className="hidden sm:block w-20">
        <svg width="80" height="28" className="overflow-visible">
          <polyline
            fill="none"
            stroke={isUp ? "#22d3ee" : "#ef4444"}
            strokeWidth="1.5"
            points={spark.map((v, i) => {
              const min = Math.min(...spark), max = Math.max(...spark), range = max - min || 1;
              return `${(i / (spark.length - 1)) * 80},${28 - ((v - min) / range) * 28}`;
            }).join(" ")}
          />
        </svg>
      </div>
      <div className="text-right">
        <div className="text-[12px] font-bold text-white font-mono">
          ${token.price >= 1000 ? (token.price / 1000).toFixed(2) + "K" : token.price.toFixed(token.price < 1 ? 4 : 2)}
        </div>
        <div className={cn("text-[10px] font-mono", isUp ? "text-green-400" : "text-red-400")}>
          {isUp ? "+" : ""}{token.change}%
        </div>
      </div>
      <div className="text-right min-w-[80px]">
        <div className="text-[12px] font-semibold text-white font-mono">
          {token.balance >= 1000000 ? (token.balance / 1000000).toFixed(2) + "M" : token.balance >= 1000 ? (token.balance / 1000).toFixed(1) + "K" : token.balance.toFixed(4)}
        </div>
        <div className="text-[10px] text-white/40">{formatCurrency(usdValue)}</div>
      </div>
    </div>
  );
}

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<"portfolio" | "send" | "receive" | "stake" | "history">("portfolio");
  const [sendCoin, setSendCoin] = useState("SKYCOIN");
  const [sendAmount, setSendAmount] = useState("");
  const [sendAddress, setSendAddress] = useState("");
  const [stakePool, setStakePool] = useState(0);
  const [stakeAmount, setStakeAmount] = useState("");
  const [showQR, setShowQR] = useState(false);
  const { prices, refetch: refetchPrices } = useLivePrices();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<"evm" | "solana" | null>(null);
  const [sky444OnChain, setSky444OnChain] = useState<string | null>(null);
  const [connectingWallet, setConnectingWallet] = useState(false);
  const displayAddress = walletAddress ?? "0xSKY4444...SHADOW...HOPE";
  const getLivePrice = (symbol: string) => {
    const idMap: Record<string,string> = { SKYCOIN: "skycoin", BTC: "bitcoin", ETH: "ethereum", SOL: "solana", DOGE: "dogecoin", USDT: "tether", TRUMP: "trump-2024" };
    const id = idMap[symbol];
    const found = prices.find(p => p.id === id);
    return found?.current_price ?? 0;
  };
  const totalUSD = TOKENS.reduce((sum, t) => {
    const lp = getLivePrice(t.symbol);
    return sum + t.balance * (lp > 0 ? lp : t.price);
  }, 0);
  const handleConnectPhantom = async () => {
    setConnectingWallet(true);
    try {
      const state = await connectPhantom();
      setWalletAddress(state.address);
      setWalletType("solana");
      toast.success("Phantom connected!");
    } catch (e: any) { toast.error(e.message); }
    finally { setConnectingWallet(false); }
  };
  const handleConnectMetaMask = async () => {
    setConnectingWallet(true);
    try {
      const state = await connectEVMWallet();
      setWalletAddress(state.address);
      setWalletType("evm");
      const bal = await getSKY444Balance(state.address!);
      setSky444OnChain(bal);
      toast.success("MetaMask connected!");
    } catch (e: any) { toast.error(e.message); }
    finally { setConnectingWallet(false); }
  };

  return (
    <div className="p-5 max-w-[1200px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase" style={{ fontFamily: 'Syne, sans-serif' }}>Capital <span className="text-cyan-400">Vault</span></h1>
          <p className="text-[10px] font-mono text-white/30 mt-1 uppercase tracking-[0.2em]">Institutional Grade Asset Management</p>
        </div>
        <div className="flex items-center gap-2">
          {!walletAddress ? (
            <>
              <button onClick={handleConnectPhantom} disabled={connectingWallet} className="px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-300 text-[10px] font-semibold hover:bg-purple-500/20 transition-colors">Phantom</button>
              <button onClick={handleConnectMetaMask} disabled={connectingWallet} className="px-3 py-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-300 text-[10px] font-semibold hover:bg-orange-500/20 transition-colors">MetaMask</button>
            </>
          ) : (
            <button onClick={() => { disconnectSolanaWallet(); setWalletAddress(null); setWalletType(null); toast.success("Disconnected"); }} className="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400/60 text-[10px] hover:text-red-400 transition-colors">Disconnect</button>
          )}
          <button onClick={() => { refetchPrices(); toast.success("Prices synced!"); }} className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-cyan-400 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Sync
          </button>
        </div>
      </div>

      {/* Total Balance Card */}
      <div className="rounded-2xl border border-white/[0.04] bg-gradient-to-br from-cyan-500/[0.05] to-transparent p-6 shadow-2xl shadow-cyan-500/5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-mono text-cyan-400/50 uppercase tracking-[0.2em] mb-2">Total Net Worth</div>
            <div className="text-5xl font-black text-white font-mono tracking-tighter">{formatCurrency(totalUSD)}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-green-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +$14,280 (11.2%) today
              </span>
              <span className="text-[10px] text-white/30">·</span>
              <span className="text-[11px] text-cyan-400">4,444,444 SKYCOIN</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/30 mb-1">Wallet Address</div>
            <div className="flex items-center gap-1.5">
              <code className="text-[10px] text-white/50 font-mono">{displayAddress.slice(0, 18)}...</code>
              <button onClick={() => { navigator.clipboard.writeText(displayAddress); toast.success("Copied!"); }} className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-cyan-400 transition-colors">
                <Copy className="w-3 h-3" />
              </button>
              <button onClick={() => setShowQR(p => !p)} className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-cyan-400 transition-colors">
                <QrCode className="w-3 h-3" />
              </button>
            </div>
            {showQR && (
              <div className="mt-2 p-2 rounded-lg bg-white inline-block">
                <QRCodeSVG value={displayAddress} size={80} />
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="walletGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="#22d3ee" fill="url(#walletGrad)" strokeWidth={1.5} dot={false} />
              <Tooltip contentStyle={{ background: '#0d0d1a', border: '1px solid #22d3ee30', borderRadius: 6, fontSize: 10 }} formatter={(v: any) => [formatCurrency(v), "Value"]} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Send", icon: Send, tab: "send" as const },
          { label: "Receive", icon: ArrowDownLeft, tab: "receive" as const },
          { label: "Stake", icon: Lock, tab: "stake" as const },
          { label: "History", icon: Clock, tab: "history" as const },
        ].map(a => (
          <button
            key={a.label}
            onClick={() => setActiveTab(a.tab)}
            className={cn(
              "flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all",
              activeTab === a.tab
                ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/70 hover:border-white/[0.12]"
            )}
          >
            <a.icon className="w-4 h-4" />
            <span className="text-[11px] font-medium">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "portfolio" && (
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-white">Token Holdings</h2>
            <span className="text-[10px] text-white/30">{TOKENS.length} assets</span>
          </div>
          {TOKENS.map(t => <TokenRow key={t.symbol} token={t} />)}
        </div>
      )}

      {activeTab === "send" && (
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-5 space-y-4">
          <h2 className="text-[13px] font-semibold text-white flex items-center gap-2"><Send className="w-4 h-4 text-cyan-400" /> Send Crypto</h2>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-white/40 mb-1.5 block">Select Token</label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {TOKENS.map(t => (
                  <button key={t.symbol} onClick={() => setSendCoin(t.symbol)}
                    className={cn("py-2 px-1 rounded-lg border text-[10px] font-mono font-bold transition-all", sendCoin === t.symbol ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-400" : "border-white/[0.07] text-white/40 hover:border-white/[0.15]")}>
                    {t.symbol}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] text-white/40 mb-1.5 block">Amount</label>
              <input value={sendAmount} onChange={e => setSendAmount(e.target.value)} type="number" placeholder="0.00"
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-cyan-500/40 font-mono" />
            </div>
            <div>
              <label className="text-[11px] text-white/40 mb-1.5 block">Recipient Address</label>
              <input value={sendAddress} onChange={e => setSendAddress(e.target.value)} placeholder="0x... or wallet address"
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-cyan-500/40 font-mono" />
            </div>
            <button
              onClick={() => { toast.success(`Sent ${sendAmount} ${sendCoin}!`); setSendAmount(""); setSendAddress(""); }}
              disabled={!sendAmount || !sendAddress}
              className="w-full py-2.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send {sendCoin}
            </button>
          </div>
        </div>
      )}

      {activeTab === "receive" && (
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-5 flex flex-col items-center gap-4">
          <h2 className="text-[13px] font-semibold text-white self-start flex items-center gap-2"><ArrowDownLeft className="w-4 h-4 text-green-400" /> Receive Crypto</h2>
          <div className="p-4 rounded-xl bg-white">
            <QRCodeSVG value={displayAddress} size={160} />
          </div>
          <div className="text-center">
            <div className="text-[11px] text-white/40 mb-1">Your Wallet Address</div>
            <code className="text-[12px] text-cyan-400 font-mono break-all">{displayAddress}</code>
          </div>
          <button onClick={() => { navigator.clipboard.writeText(displayAddress); toast.success("Address copied!"); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white text-[12px] transition-colors">
            <Copy className="w-3.5 h-3.5" /> Copy Address
          </button>
        </div>
      )}

      {activeTab === "stake" && (
        <div className="space-y-3">
          <h2 className="text-[13px] font-semibold text-white flex items-center gap-2"><Lock className="w-4 h-4 text-cyan-400" /> Staking Pools</h2>
          {STAKING_POOLS.map((pool, i) => (
            <div key={pool.name} onClick={() => setStakePool(i)}
              className={cn("rounded-xl border p-4 cursor-pointer transition-all", stakePool === i ? "border-cyan-500/30 bg-cyan-500/10" : "border-white/[0.07] bg-[oklch(0.11_0.01_265)] hover:border-white/[0.12]")}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: pool.color + "22" }}>
                    <Lock className="w-4 h-4" style={{ color: pool.color }} />
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-white">{pool.name}</div>
                    <div className="text-[10px] text-white/40">{pool.lockDays}d lock · Min {(pool.minStake / 1000).toFixed(0)}K SKYCOIN</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold font-mono" style={{ color: pool.color }}>{pool.apy}%</div>
                  <div className="text-[10px] text-white/40">APY</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-white/40">TVL: {formatCurrency(pool.tvl)}</span>
                <span className="text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Active</span>
              </div>
            </div>
          ))}
          <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4 space-y-3">
            <div className="text-[12px] font-semibold text-white">Stake in {STAKING_POOLS[stakePool].name}</div>
            <input value={stakeAmount} onChange={e => setStakeAmount(e.target.value)} type="number" placeholder="Amount of SKYCOIN"
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-cyan-500/40 font-mono" />
            <button onClick={() => { toast.success(`Staked ${stakeAmount} SKYCOIN in ${STAKING_POOLS[stakePool].name}!`); setStakeAmount(""); }}
              disabled={!stakeAmount}
              className="w-full py-2.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              Stake SKYCOIN
            </button>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <h2 className="text-[13px] font-semibold text-white">Transaction History</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {TRANSACTIONS.map(tx => {
              const isIn = ["receive", "reward"].includes(tx.type);
              return (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", isIn ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400")}>
                    {isIn ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-white capitalize">{tx.type}</div>
                    <div className="text-[10px] text-white/40">{tx.from} · {tx.time}</div>
                  </div>
                  <div className="text-right">
                    <div className={cn("text-[12px] font-bold font-mono", isIn ? "text-green-400" : "text-red-400")}>
                      {isIn ? "+" : "-"}{tx.amount >= 1000 ? (tx.amount / 1000).toFixed(1) + "K" : tx.amount} {tx.coin}
                    </div>
                    <div className="text-[10px] text-green-400 flex items-center gap-0.5 justify-end">
                      <CheckCircle2 className="w-2.5 h-2.5" /> confirmed
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
