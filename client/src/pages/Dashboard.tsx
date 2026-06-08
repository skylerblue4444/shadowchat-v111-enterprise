import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Brain, TrendingUp, TrendingDown, Users, Activity, Zap,
  ShoppingBag, Wallet, MessageSquare, Heart, Video, Shield,
  BarChart3, Bot, Vote, Lock, Cpu, Server, Globe, ArrowUpRight,
  AlertCircle, CheckCircle2, Clock, Coins, Flame, Star, Calendar
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);
const formatNumber = (n: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(n);
import { cn } from "@/lib/utils";
import { useLivePrices } from "@/hooks/useLivePrice";
import { useNeuralCore } from "@/lib/neural-core-sync";

const TOKENS = [
  { symbol: "SKYCOIN", name: "ShadowChat Token", balance: 4444444, price: 0.044, change: 4.4, color: "#00e5ff" },
  { symbol: "BTC", name: "Bitcoin", balance: 0.42, price: 67000, change: 2.1, color: "#f7931a" },
  { symbol: "ETH", name: "Ethereum", balance: 4.4, price: 3200, change: -0.8, color: "#627eea" },
];
const generateSparkline = (points = 12, base = 100, range = 10) => Array.from({ length: points }, () => base + (Math.random() - 0.5) * range * 2);
const ANALYTICS_DATA = {
  monthlyRevenue: Array.from({ length: 12 }, (_, i) => ({ month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i], revenue: 50000 + i * 5000, users: 1000 + i * 100 })),
  revenueStreams: [{ name: "Trading Fees", value: 480000 }, { name: "AI Subscriptions", value: 320000 }, { name: "NFT Royalties", value: 240000 }],
  moduleUsage: [{ name: "AI Core", usage: 88, color: "#00e5ff" }, { name: "Exchange", usage: 72, color: "#9c27b0" }, { name: "Social", usage: 65, color: "#4caf50" }],
};


const MODULES = [
  { path: "/legal-compliance", icon: Shield,        label: "Legal Engine",    color: "green",  stat: "100% compliant" },
  { path: "/financial",        icon: Wallet,        label: "Financial Hub",   color: "cyan",   stat: "$2.4B AUM" },
  { path: "/supply-chain",     icon: Server,        label: "Supply Chain",    color: "gold",   stat: "1,245 active" },
  { path: "/talent-market",    icon: Users,         label: "Talent Market",   color: "purple", stat: "450K+ talent" },
  { path: "/quantum-security", icon: Lock,          label: "Quantum Vault",   color: "red",    stat: "Quantum-Safe" },
  { path: "/research",         icon: FlaskConical,  label: "Research Lab",    color: "cyan",   stat: "245 projects" },
  { path: "/geopolitical",     icon: Globe,         label: "Geopolitical",    color: "gold",   stat: "195 countries" },
  { path: "/workforce",        icon: Activity,      label: "Workforce",       color: "green",  stat: "94.3% prod." },
  { path: "/sustainability",   icon: Zap,           label: "Sustainability",  color: "green",  stat: "Carbon Neg." },
  { path: "/healthcare",       icon: Heart,         label: "Healthcare",      color: "red",    stat: "99.2% acc." },
  { path: "/gaming",           icon: Coins,         label: "Gaming Hub",      color: "gold",   stat: "4444 Start" },
  { path: "/events-hub",       icon: Calendar,      label: "Events Hub",      color: "red",    stat: "LIVE Events" },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  cyan:   { bg: "bg-cyan-500/10",   text: "text-cyan-400",   border: "border-cyan-500/20",   glow: "shadow-cyan-500/20" },
  gold:   { bg: "bg-amber-500/10",  text: "text-amber-400",  border: "border-amber-500/20",  glow: "shadow-amber-500/20" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", glow: "shadow-purple-500/20" },
  red:    { bg: "bg-red-500/10",    text: "text-red-400",    border: "border-red-500/20",    glow: "shadow-red-500/20" },
  green:  { bg: "bg-green-500/10",  text: "text-green-400",  border: "border-green-500/20",  glow: "shadow-green-500/20" },
};

const ACTIVITY_LOG = [
  { id: 1, icon: TrendingUp, color: "text-green-400", msg: "BTC/USDT trade executed: +$2,400 profit", time: "2s ago" },
  { id: 2, icon: Brain,      color: "text-cyan-400",  msg: "HOPE AI: Market breakout detected — BTC", time: "14s ago" },
  { id: 3, icon: Heart,      color: "text-red-400",   msg: "New match: Alex Rivera (98% compatibility)", time: "1m ago" },
  { id: 4, icon: ShoppingBag,color: "text-purple-400",msg: "Marketplace: AI Trading Bot Pro sold (299 USDT)", time: "3m ago" },
  { id: 5, icon: Vote,       color: "text-amber-400", msg: "Governance Proposal #44 passed (68% yes)", time: "8m ago" },
  { id: 6, icon: Shield,     color: "text-green-400", msg: "Security: Suspicious login blocked from TOR", time: "12m ago" },
  { id: 7, icon: Bot,        color: "text-cyan-400",  msg: "AI Agent TradeMaster: 847 tasks completed", time: "18m ago" },
  { id: 8, icon: Coins,      color: "text-amber-400", msg: "SKYCOIN staking reward: +4,444 SKY distributed", time: "25m ago" },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 32, w = 80;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  const isUp = data[data.length - 1] >= data[0];
  const stroke = isUp ? "#22d3ee" : "#ef4444";
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline fill="none" stroke={stroke} strokeWidth="1.5" points={pts} />
    </svg>
  );
}

export default function Dashboard() {
  const { user: currentUser } = useAuth();
  const { skycoin, credits, gems, recentActivity } = useNeuralCore();
  const systemStatus = "OPERATIONAL";
  const aiMode = "oracle";
  const notifications: any[] = [];
  const { prices, loading: pricesLoading, lastUpdated } = useLivePrices();
  const getLivePrice = (id: string) => prices.find(p => p.id === id)?.current_price ?? 0;
  const getLiveChange = (id: string) => prices.find(p => p.id === id)?.price_change_percentage_24h ?? 0;
  const [liveStats, setLiveStats] = useState({
    users: 24891, tps: 4420, latency: 12, aiQueue: 7
  });
  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const t = setInterval(() => {
      setLiveStats(p => ({
        users: p.users + Math.floor((Math.random() - 0.4) * 8),
        tps: Math.floor(4000 + Math.random() * 900),
        latency: Math.floor(8 + Math.random() * 10),
        aiQueue: Math.floor(5 + Math.random() * 15),
      }));
    }, 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="p-5 space-y-5 max-w-[1600px]">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            NEURAL <span className="text-cyan-400">TELEMETRY</span>
          </h1>
          <p className="text-xs font-mono text-white/30 mt-1 uppercase tracking-[0.2em]">
            ShadowChat Mega OS — Skyler Blue Legacy NOC
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end gap-1">
            <span className="text-[9px] font-mono text-cyan-400/50 uppercase tracking-widest">System Status</span>
            <span className="text-[10px] px-3 py-1.5 rounded-lg border font-mono bg-emerald-500/5 text-emerald-400 border-emerald-500/10 flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
              OPERATIONAL
            </span>
          </div>
        </div>
      </div>

      {/* ── Sovereign Balance Core ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/40 border border-emerald-500/20 p-6 rounded-2xl shadow-lg shadow-emerald-500/5">
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Liquid Skycoin</div>
          <div className="text-4xl font-black italic tracking-tighter text-emerald-500">{skycoin.toLocaleString()} SKY</div>
          <div className="text-[9px] text-emerald-500/40 font-mono mt-2 uppercase tracking-widest">Protocol 4444 Active</div>
        </div>
        <div className="bg-slate-900/40 border border-cyan-500/20 p-6 rounded-2xl shadow-lg shadow-cyan-500/5">
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Neural Credits</div>
          <div className="text-4xl font-black italic tracking-tighter text-cyan-400">{credits.toFixed(2)}</div>
          <div className="text-[9px] text-cyan-400/40 font-mono mt-2 uppercase tracking-widest">Enterprise Tier</div>
        </div>
        <div className="bg-slate-900/40 border border-purple-500/20 p-6 rounded-2xl shadow-lg shadow-purple-500/5">
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Sovereign Gems</div>
          <div className="text-4xl font-black italic tracking-tighter text-purple-500">{gems.toFixed(1)}</div>
          <div className="text-[9px] text-purple-400/40 font-mono mt-2 uppercase tracking-widest">Rarity Level: SSS</div>
        </div>
      </div>

      {/* ── Live System Stats ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Active Users", value: formatNumber(liveStats.users), sub: "+12% vs yesterday", icon: Users, color: "cyan" },
          { label: "Transactions/s", value: liveStats.tps.toLocaleString(), sub: "Real-time TPS", icon: Zap, color: "gold" },
          { label: "AI Queue Depth", value: liveStats.aiQueue, sub: `${98}% health`, icon: Brain, color: "purple" },
          { label: "Feed Latency", value: `${liveStats.latency}ms`, sub: "P99 response", icon: Activity, color: "green" },
        ].map((s, i) => {
          const c = COLOR_MAP[s.color];
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={cn("rounded-xl border p-4 bg-[oklch(0.11_0.01_265)]", c.border)}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] text-white/40 uppercase tracking-wider">{s.label}</span>
                <div className={cn("p-1.5 rounded-lg", c.bg)}>
                  <s.icon className={cn("w-3.5 h-3.5", c.text)} />
                </div>
              </div>
              <div className={cn("text-2xl font-bold font-mono", c.text)}>{s.value}</div>
              <div className="text-[10px] text-white/30 mt-1">{s.sub}</div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Charts Row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Revenue Streams (6 months)</h2>
            <span className="text-[10px] text-cyan-400 font-mono">$649K this month</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={ANALYTICS_DATA.revenueStreams}>
              <defs>
                {[
                  { id: "gMarket", color: "#22d3ee" },
                  { id: "gTrade",  color: "#f59e0b" },
                  { id: "gCreate", color: "#8b5cf6" },
                  { id: "gStake",  color: "#10b981" },
                ].map(g => (
                  <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={g.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={g.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#ffffff40', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#ffffff40', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: '#0d0d1a', border: '1px solid #ffffff15', borderRadius: 8, fontSize: 11 }} />
              <Area type="monotone" dataKey="marketplace" stroke="#22d3ee" fill="url(#gMarket)" strokeWidth={1.5} name="Marketplace" />
              <Area type="monotone" dataKey="trading"     stroke="#f59e0b" fill="url(#gTrade)"  strokeWidth={1.5} name="Trading" />
              <Area type="monotone" dataKey="creator"     stroke="#8b5cf6" fill="url(#gCreate)" strokeWidth={1.5} name="Creator" />
              <Area type="monotone" dataKey="staking"     stroke="#10b981" fill="url(#gStake)"  strokeWidth={1.5} name="Staking" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Module usage pie */}
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
          <h2 className="text-sm font-semibold text-white mb-4">Module Usage</h2>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={ANALYTICS_DATA.moduleUsage} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value">
                {ANALYTICS_DATA.moduleUsage.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0d0d1a', border: '1px solid #ffffff15', borderRadius: 8, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {ANALYTICS_DATA.moduleUsage.map((m: any) => (
              <div key={m.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                  <span className="text-white/50">{m.name}</span>
                </div>
                <span className="text-white/70 font-mono">{m.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Token Portfolio ─────────────────────────────────────────── */}
      <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Token Portfolio</h2>
          <Link href="/wallet">
            <span className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1">
              View Wallet <ArrowUpRight className="w-3 h-3" />
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {TOKENS.map(t => {
            const idMap: Record<string,string> = { SKYCOIN: "skycoin", BTC: "bitcoin", ETH: "ethereum", SOL: "solana", DOGE: "dogecoin", USDT: "tether", TRUMP: "trump-2024" };
            const livePrice = getLivePrice(idMap[t.symbol] ?? "") || t.price;
            const liveChange = getLiveChange(idMap[t.symbol] ?? "") || t.change;
            const sparkData = generateSparkline(20, livePrice, livePrice * 0.03);
            const isUp = liveChange >= 0;
            return (
              <div key={t.symbol} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-white/[0.12] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-white/70 font-mono">{t.symbol}</span>
                  <span className={cn("text-[9px] font-mono", isUp ? "text-green-400" : "text-red-400")}>
                    {isUp ? "+" : ""}{liveChange.toFixed(2)}%
                  </span>
                </div>
                <Sparkline data={sparkData} color={t.color} />
                <div className="mt-1.5">
                  <div className="text-[11px] font-bold text-white font-mono">
                    ${livePrice >= 1000 ? (livePrice/1000).toFixed(1)+"K" : livePrice.toFixed(livePrice < 1 ? 4 : 2)}
                    {pricesLoading && <span className="text-[8px] text-white/20 ml-1">...</span>}
                  </div>
                  <div className="text-[9px] text-white/30 mt-0.5">
                    {t.balance >= 1000000 ? (t.balance/1000000).toFixed(2)+"M" : t.balance >= 1000 ? (t.balance/1000).toFixed(1)+"K" : t.balance.toFixed(2)} held
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Module Grid + Activity ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Module shortcuts */}
        <div className="lg:col-span-2 rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
          <h2 className="text-sm font-semibold text-white mb-4">All Modules</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MODULES.map((m, i) => {
              const c = COLOR_MAP[m.color];
              return (
                <Link key={m.path} href={m.path}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ scale: 1.02 }}
                    className={cn(
                      "flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all",
                      "bg-white/[0.02] hover:bg-white/[0.05]",
                      c.border
                    )}
                  >
                    <div className={cn("p-1.5 rounded-lg shrink-0", c.bg)}>
                      <m.icon className={cn("w-3.5 h-3.5", c.text)} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-white truncate">{m.label}</div>
                      <div className="text-[9px] text-white/30 truncate">{m.stat}</div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Live activity stream */}
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Live Activity</h2>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </div>
          <div className="space-y-3">
            {activityLog.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2.5"
              >
                <div className="mt-0.5 shrink-0">
                  <item.icon className={cn("w-3.5 h-3.5", item.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-white/70 leading-snug">{item.msg}</p>
                  <p className="text-[9px] text-white/30 mt-0.5">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── AI Mode Status ──────────────────────────────────────────── */}
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">HOPE AI — Active Mode: <span className="text-cyan-400 uppercase">{true}</span></div>
              <div className="text-[10px] text-white/40">Multi-agent orchestration · {7} tasks running · {44}% memory</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(['learn','navigate','scan','guard'] as const).map(mode => (
              <Link key={mode} href="/ai-core">
                <span className={cn(
                  "text-[10px] px-2.5 py-1 rounded border font-mono cursor-pointer transition-all uppercase tracking-wider",
                  mode === "learn"
                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                    : "bg-white/5 text-white/30 border-white/10 hover:border-white/20"
                )}>
                  {mode}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
