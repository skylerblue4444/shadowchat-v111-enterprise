/**
 * ShadowChat Ultimate — AppShell
 * Premium dark luxury sidebar: glassmorphism, Syne typography,
 * animated active states, live ticker tape, real-time stats.
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import {
  LayoutDashboard, MessageSquare, Heart, Video, ShoppingBag,
  Wallet, Brain, User, Bell, Shield, Compass, FlaskConical,
  BarChart3, Network, Vote, Clapperboard, Bot, Lock,
  CreditCard, Settings, Cpu, Server, Zap, GitBranch,
  Database, Workflow, AlertTriangle, Globe, Navigation, Flag,
  ChevronLeft, ChevronRight, Menu, X, Activity, Coins,
  TrendingUp, Trophy, Calendar, Code2, ToggleLeft, Star, Users, Spade,
  Radio, DollarSign, Share2, Sparkles, GraduationCap, Scale, Satellite,
  Crown, Gavel
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663608806484/6N4QjBq6mbsQ2KZPoCfSTe/sc_logo_glow-XgqLVfLTHinBqTAwG5gWuE.webp";

const NAV = [
  { section: "COMMAND", items: [
    { path: "/",              icon: LayoutDashboard, label: "Terminal",  badge: "LIVE", badgeType: "green" },
    { path: "/neural-nav",     icon: Navigation,      label: "Neural Nav", badge: "NEW", badgeType: "cyan" },
    { path: "/feed",          icon: MessageSquare,   label: "Global Feed" },
    { path: "/explore",       icon: Compass,         label: "Intelligence" },
    { path: "/notifications", icon: Bell,            label: "Activity",   badgeType: "count" },
  ]},
  { section: "SOCIAL & MEDIA", items: [
    { path: "/dating",         icon: Heart,          label: "Dating / Match" },
    { path: "/messages",       icon: Video,          label: "Messaging" },
    { path: "/live",           icon: Radio,          label: "Live & Video",    badge: "LIVE", badgeType: "red" },
    { path: "/creator-studio", icon: Clapperboard,   label: "Creator Studio" },
    { path: "/social-graph",   icon: Share2,         label: "Social Graph" },
    { path: "/nft",            icon: Network,        label: "NFT Gallery" },
  ]},
  { section: "COMMERCE & FINANCE", items: [
    { path: "/marketplace",   icon: ShoppingBag,     label: "Marketplace" },
    { path: "/wallet",        icon: Wallet,          label: "Wallet / Finance" },
    { path: "/exchange",      icon: CreditCard,      label: "Exchange / DEX" },
    { path: "/payments",      icon: DollarSign,      label: "Payments Hub" },
    { path: "/crypto",        icon: Coins,           label: "Crypto Suite",    badge: "NEW", badgeType: "green" },
    { path: "/tokenomics",    icon: TrendingUp,      label: "Tokenomics",      badge: "ICO", badgeType: "cyan" },
    { path: "/casino",        icon: Spade,           label: "Casino",          badge: "🎰",  badgeType: "count" },
    { path: "/gamification",  icon: Trophy,          label: "Gamification" },
  ]},
  { section: "AI & INTELLIGENCE", items: [
    { path: "/ai-core",      icon: Brain,     label: "HOPE AI Core",    badge: "AI",   badgeType: "cyan" },
    { path: "/ai-agents",    icon: Bot,       label: "AI Agent Market" },
    { path: "/digital-twin", icon: Cpu,       label: "Digital Twin" },
    { path: "/ai-ide",       icon: Code2,     label: "AI Engineer IDE", badge: "PRO",  badgeType: "cyan" },
    { path: "/dev",          icon: GitBranch, label: "Dev Workspace" },
  ]},
  { section: "ANALYTICS & DATA", items: [
    { path: "/analytics",   icon: BarChart3, label: "Analytics Hub" },
    { path: "/leaderboard", icon: Trophy,    label: "Leaderboard" },
    { path: "/data-lake",   icon: Database,  label: "Data Lake",       badge: "ENT", badgeType: "cyan" },
  ]},
  { section: "GOVERNANCE", items: [
    { path: "/governance",  icon: Vote,     label: "Governance / DAO" },
    { path: "/profile",     icon: User,     label: "Profile" },
    { path: "/security",    icon: Lock,     label: "Security Center" },
    { path: "/reputation",  icon: Activity, label: "Reputation" },
    { path: "/referrals",   icon: Users,    label: "Referrals" },
  ]},
  { section: "ENTERPRISE INFRASTRUCTURE", items: [
    { path: "/legal-compliance", icon: Shield,        label: "Legal Engine",    badge: "LAW", badgeType: "green" },
    { path: "/financial",        icon: DollarSign,     label: "Financial Hub",   badge: "BANK", badgeType: "cyan" },
    { path: "/supply-chain",     icon: Server,         label: "Supply Chain",    badge: "LOG", badgeType: "green" },
    { path: "/talent-market",    icon: Users,          label: "Talent Market",   badge: "HR",  badgeType: "cyan" },
    { path: "/quantum-security", icon: Lock,           label: "Quantum Vault",   badge: "SEC", badgeType: "red" },
    { path: "/research",         icon: FlaskConical,   label: "Research Lab",    badge: "R&D", badgeType: "purple" },
    { path: "/geopolitical",     icon: Globe,          label: "Geopolitical",    badge: "INTEL", badgeType: "cyan" },
    { path: "/workforce",        icon: Activity,       label: "Workforce",       badge: "OPS", badgeType: "green" },
    { path: "/sustainability",   icon: Zap,            label: "Sustainability",  badge: "ESG", badgeType: "green" },
    { path: "/healthcare",       icon: Heart,          label: "Healthcare",      badge: "MED", badgeType: "red" },
    { path: "/academy",          icon: GraduationCap,  label: "Academy Hub",     badge: "EDU", badgeType: "cyan" },
  ]},
  { section: "GAMING & EVENTS", items: [
    { path: "/gaming",           icon: Spade,          label: "Gaming Hub",      badge: "4444", badgeType: "green" },
    { path: "/events-hub",       icon: Calendar,       label: "Events Hub",      badge: "LIVE", badgeType: "red" },
    { path: "/blackjack",        icon: Spade,          label: "Blackjack",       badge: "🃏",   badgeType: "count" },
    { path: "/casino",           icon: Spade,          label: "Casino Hub",      badge: "🎰",   badgeType: "count" },
  ]},
  { section: "PLATFORM", items: [
    { path: "/events",        icon: Calendar,      label: "Events & Spaces" },
    { path: "/subscriptions", icon: Zap,           label: "Subscriptions" },
    { path: "/moderation",    icon: AlertTriangle, label: "Moderation Layer" },
    { path: "/api",           icon: Code2,         label: "API Ecosystem" },
    { path: "/features",      icon: ToggleLeft,    label: "Feature Flags" },
    { path: "/sandbox",        icon: FlaskConical,  label: "Sandbox Zone" },
    { path: "/skyworld",       icon: Globe,         label: "SkyWorld",        badge: "3D",  badgeType: "cyan" },
    { path: "/plugins",        icon: Database,      label: "Plugin Market",   badge: "NEW", badgeType: "green" },
    { path: "/charity",       icon: Heart,         label: "Charity",       badge: "❤️",  badgeType: "green" },
    { path: "/ico",           icon: TrendingUp,    label: "ICO Portal",    badge: "🚀",  badgeType: "count" },
    { path: "/wise-payments", icon: Globe,         label: "Wise Payments" },
    { path: "/hacking",       icon: Shield,        label: "Hacking Tools", badge: "SEC", badgeType: "cyan" },
    { path: "/legal",         icon: Vote,          label: "Legal Tools" },
    { path: "/ai-enterprise", icon: Brain,         label: "AI Enterprise", badge: "$2B", badgeType: "purple" },
    { path: "/dev-workspace-enterprise", icon: Code2, label: "Dev Workspace", badge: "PRO", badgeType: "cyan" },
    { path: "/adult",         icon: Lock,          label: "Adult Area",    badge: "18+", badgeType: "red" },
    { path: "/admin",         icon: Shield,        label: "Admin Panel",  badge: "ROOT", badgeType: "red" },
    { path: "/admin-control", icon: Shield,        label: "Admin Control", badge: "HQ",  badgeType: "purple" },
    { path: "/judicial",      icon: Scale,         label: "AI Supreme Court", badge: "LAW", badgeType: "green" },
    { path: "/recovery",      icon: Satellite,     label: "Planetary Sync", badge: "SYNC", badgeType: "cyan" },
    { path: "/elite-club",    icon: Crown,         label: "Elite Club",  badge: "VIP",  badgeType: "gold" },
    { path: "/auction-house", icon: Gavel,         label: "Auction House", badge: "LIVE", badgeType: "amber" },
    { path: "/treasury",      icon: Landmark,      label: "Manus Treasury", badge: "MINT", badgeType: "cyan" },
    { path: "/upgrade-matrix", icon: Zap,          label: "Upgrade Matrix", badge: "1000", badgeType: "emerald" },
    { path: "/profit-models",  icon: TrendingUp,   label: "Profit Models", badge: "ROI",  badgeType: "green" },
    { path: "/charity-hub",    icon: Heart,        label: "Impact Charity", badge: "GIVE", badgeType: "red" },
    { path: "/neural-xp",      icon: Trophy,       label: "Neural XP",   badge: "LVL",  badgeType: "emerald" },
    { path: "/defi",           icon: Wallet,       label: "DeFi Terminal", badge: "DEFI", badgeType: "cyan" },
    { path: "/governance-voting", icon: Vote,       label: "Governance",  badge: "VOTE", badgeType: "purple" },
    { path: "/login",         icon: Lock,          label: "Sovereign Login", badge: "SEC", badgeType: "red" },
    { path: "/settings",      icon: Settings,      label: "Settings" },
  ]},
];

const BADGE_STYLES: Record<string, string> = {
  green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  cyan:  "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  purple: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  red:   "bg-red-500/15 text-red-400 border-red-500/25",
  count: "bg-orange-500/15 text-orange-400 border-orange-500/25",
};

const TICKER_ITEMS = [
  "BTC $67.4K ▲2.1%", "ETH $3.8K ▲1.6%", "SOL $182 ▲5.3%",
  "SKYCOIN $4.44 ▲12.4%", "TRUMP $8.72 ▲18.2%", "DOGE $0.182 ▲3.7%",
  "USDT $1.00 ▲0.0%", "BNB $612 ▲0.8%", "ADA $0.48 ▲4.2%", "MATIC $0.92 ▲7.1%",
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed, unreadCount, currentUser, systemStatus, aiMode } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [liveStats, setLiveStats] = useState(systemStatus);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        activeUsers: Math.max(20000, prev.activeUsers + Math.floor((Math.random() - 0.4) * 15)),
        txPerSecond: Math.floor(4000 + Math.random() * 800),
        feedLatency: Math.floor(8 + Math.random() * 8),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  const sidebarInner = (
    <div className="flex flex-col h-full bg-[#050510] border-r border-white/5 shadow-2xl">
      {/* ── Brand ── */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-6 border-b border-white/[0.04] shrink-0",
        sidebarCollapsed && "justify-center"
      )}>
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#050510] shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="min-w-0 flex-1"
            >
              <div className="text-lg font-black text-white tracking-tighter leading-none" style={{ fontFamily: "Syne, sans-serif" }}>
                SHADOWCHAT
              </div>
              <div className="text-[9px] font-bold tracking-[0.2em] mt-1 text-emerald-400 uppercase flex flex-col gap-0.5">
                <span>HOPE AI × SKYCOIN4444</span>
                <span className="text-white/20 text-[7px] tracking-[0.1em] uppercase">Enterprise v111</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Live mini stats ── */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="px-3 py-3 border-b border-white/[0.06] grid grid-cols-3 gap-2 overflow-hidden bg-white/[0.02]"
          >
            {[
              { label: "USERS", val: `${(liveStats.activeUsers / 1000).toFixed(1)}K`, color: "text-cyan-400" },
              { label: "TPS",   val: liveStats.txPerSecond.toLocaleString(),           color: "text-amber-400" },
              { label: "HOPE",  val: `${aiMode.health}%`,                              color: "text-emerald-400" },
            ].map(s => (
              <div key={s.label} className="text-center py-1">
                <div className={cn("text-xs font-black font-mono", s.color)}>{s.val}</div>
                <div className="text-[7px] text-white/20 tracking-[0.2em] font-bold uppercase">{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4 custom-scrollbar">
        {NAV.map(({ section, items }) => (
          <div key={section} className="space-y-1">
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="px-3 mb-2 text-[9px] font-black tracking-[0.25em] text-white/20 uppercase"
                  style={{ fontFamily: "Space Mono, monospace" }}
                >
                  {section}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-1">
              {items.map((item) => {
                const active = location === item.path || (item.path !== "/" && location.startsWith(item.path));
                const badge = item.badgeType === "count"
                  ? (unreadCount > 0 ? String(unreadCount) : null)
                  : item.badge;
                return (
                  <Link key={item.path + item.label} href={item.path} onClick={() => setMobileOpen(false)}>
                    <div
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200 cursor-pointer relative overflow-hidden group",
                        sidebarCollapsed && "justify-center px-2",
                        active
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                          : "text-white/40 hover:text-white/80 hover:bg-white/[0.05] border border-transparent"
                      )}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      {active && (
                        <motion.span layoutId="activeNav" className="absolute inset-0 bg-emerald-500/5 rounded-xl" />
                      )}
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-400 rounded-r shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                      )}
                      <item.icon className={cn("w-4 h-4 shrink-0 relative z-10 group-hover:scale-110 transition-transform", active ? "text-emerald-400" : "text-white/30 group-hover:text-white/60")} />
                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex-1 truncate font-bold tracking-tight"
                            style={{ fontFamily: "Space Grotesk, sans-serif" }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {!sidebarCollapsed && badge && (
                        <span className={cn(
                          "text-[9px] px-2 py-0.5 rounded-md border font-black font-mono shrink-0 tracking-tighter shadow-sm",
                          BADGE_STYLES[item.badgeType || "cyan"]
                        )}>
                          {badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── User footer ── */}
      <div className="border-t border-white/[0.06] p-4 space-y-3 shrink-0 bg-white/[0.01]">
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-white/5 shadow-xl"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-600 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-lg shadow-emerald-500/20">
                {currentUser.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black text-white truncate uppercase tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
                  {currentUser.name}
                </div>
                <div className="text-[8px] font-black tracking-[0.2em] text-emerald-400/70 uppercase">
                  {currentUser.role} ACCESS
                </div>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="px-3 py-1">
          <div className="text-[7px] font-black text-white/10 uppercase tracking-[0.3em] leading-tight">Visionary Lead</div>
          <div className="text-sm font-black text-white/40 tracking-tighter leading-none mt-1 uppercase" style={{ fontFamily: "Syne, sans-serif" }}>Skyler Blue</div>
          <div className="text-[6px] font-bold text-white/15 uppercase tracking-[0.15em] mt-1.5 leading-relaxed">
            Innovative Information Technology Resolutions LLC
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#050510] text-white selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sidebar Desktop */}
      <aside className={cn(
        "hidden md:flex flex-col transition-all duration-300 ease-in-out shrink-0 relative z-40",
        sidebarCollapsed ? "w-20" : "w-[280px]"
      )}>
        {sidebarInner}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#050510] border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-emerald-500/50 transition-all z-50 shadow-xl"
        >
          {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header / Ticker */}
        <header className="h-14 border-b border-white/[0.04] bg-[#050510]/80 backdrop-blur-2xl flex items-center justify-between px-4 shrink-0 z-30">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 text-white/60 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Ticker Tape */}
            <div className="hidden lg:flex flex-1 overflow-hidden pointer-events-none relative group">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#050510] to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#050510] to-transparent z-10" />
              <div className="flex gap-8 animate-ticker whitespace-nowrap">
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                  <span key={i} className="text-[10px] font-black font-mono text-white/20 tracking-widest uppercase">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 pl-4 border-l border-white/[0.04]">
            <div className="hidden sm:flex flex-col items-end">
              <div className="text-[11px] font-black text-white/80 font-mono tracking-tighter uppercase">
                {time.toLocaleTimeString([], { hour12: false })}
              </div>
              <div className="text-[8px] font-black text-emerald-400 tracking-widest uppercase font-mono">
                UTC {time.getTimezoneOffset() / -60 >= 0 ? "+" : ""}{time.getTimezoneOffset() / -60}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/40 hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer">
                <Bell className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer">
                <Zap className="w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar bg-gradient-to-b from-[#050510] to-[#0a0a1a]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] z-[70] md:hidden shadow-2xl"
            >
              {sidebarInner}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-4 top-4 p-2 text-white/40 hover:text-white bg-white/5 rounded-xl border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
