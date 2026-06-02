import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BarChart3, TrendingUp, Users, DollarSign, Activity, Eye, Heart, Share2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);
const formatNumber = (n: number) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(n);
import { cn } from "@/lib/utils";

const ANALYTICS_DATA = {
  monthlyRevenue: Array.from({ length: 12 }, (_, i) => ({ month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i], revenue: 50000 + i * 8000, users: 1000 + i * 150 })),
  dailyUsers: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, users: 800 + i * 30 + Math.floor(Math.random() * 100) })),
  moduleUsage: [{ name: "AI Core", usage: 88, color: "#00e5ff", value: 88 }, { name: "Exchange", usage: 72, color: "#9c27b0", value: 72 }, { name: "Social", usage: 65, color: "#4caf50", value: 65 }, { name: "Marketplace", usage: 44, color: "#ff9800", value: 44 }, { name: "Governance", usage: 38, color: "#f44336", value: 38 }],
  revenueStreams: [{ name: "Trading Fees", value: 480000, color: "#00e5ff" }, { name: "AI Subscriptions", value: 320000, color: "#9c27b0" }, { name: "NFT Royalties", value: 240000, color: "#4caf50" }, { name: "Staking", value: 200000, color: "#ff9800" }],
  totalRevenue: 1_240_000,
  totalUsers: 44444,
  activeUsers: 8888,
  totalTrades: 444444,
};


const TABS = ["Overview", "Revenue", "Users", "Content", "AI Insights"];

export default function Analytics() {
  const [tab, setTab] = useState("Overview");
  return (
    <div className="p-5 max-w-[1400px] space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase" style={{ fontFamily: "Syne, sans-serif" }}>
              Intelligence <span className="text-amber-400">Suite</span>
            </h1>
            <div className="px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-[8px] font-mono text-amber-400 tracking-[0.2em] uppercase">BI Console</div>
          </div>
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em] mt-1">Enterprise Data Warehouse & Real-Time Event Tracking</span>
        </div>
        <span className="text-[10px] px-2 py-1 rounded border font-mono bg-green-500/10 text-green-400 border-green-500/20">LIVE DATA</span>
      </div>
      <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={cn("flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all", tab===t?"bg-cyan-500/20 text-cyan-400 border border-cyan-500/20":"text-white/40 hover:text-white/60")}>{t}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {label:"Daily Active Users",value:"24.8K",change:"+12%",icon:Users,color:"cyan"},
          {label:"Total Revenue",value:"$649K",change:"+28%",icon:DollarSign,color:"gold"},
          {label:"Feed Impressions",value:"8.4M",change:"+44%",icon:Eye,color:"purple"},
          {label:"Engagement Rate",value:"18.7%",change:"+3.2%",icon:Heart,color:"green"},
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
            <div className="text-[10px] text-white/40 mb-2">{s.label}</div>
            <div className="text-2xl font-bold text-white font-mono">{s.value}</div>
            <div className="text-[10px] text-green-400 mt-1">{s.change} vs last week</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
          <h3 className="text-[13px] font-semibold text-white mb-4">Daily Users & Revenue</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ANALYTICS_DATA.dailyUsers}>
              <XAxis dataKey="date" tick={{fill:"#ffffff40",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#ffffff40",fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"#0d0d1a",border:"1px solid #ffffff15",borderRadius:8,fontSize:11}}/>
              <Bar dataKey="users" fill="#22d3ee" opacity={0.8} radius={[3,3,0,0]}/>
              <Bar dataKey="revenue" fill="#f59e0b" opacity={0.8} radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
          <h3 className="text-[13px] font-semibold text-white mb-4">Revenue Streams (6 months)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={ANALYTICS_DATA.revenueStreams}>
              <defs>
                {[["gM","#22d3ee"],["gT","#f59e0b"],["gC","#8b5cf6"],["gS","#10b981"]].map(([id,c])=>(
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={c} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="month" tick={{fill:"#ffffff40",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#ffffff40",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}K`}/>
              <Tooltip contentStyle={{background:"#0d0d1a",border:"1px solid #ffffff15",borderRadius:8,fontSize:11}}/>
              <Area type="monotone" dataKey="marketplace" stroke="#22d3ee" fill="url(#gM)" strokeWidth={1.5} name="Marketplace"/>
              <Area type="monotone" dataKey="trading" stroke="#f59e0b" fill="url(#gT)" strokeWidth={1.5} name="Trading"/>
              <Area type="monotone" dataKey="creator" stroke="#8b5cf6" fill="url(#gC)" strokeWidth={1.5} name="Creator"/>
              <Area type="monotone" dataKey="staking" stroke="#10b981" fill="url(#gS)" strokeWidth={1.5} name="Staking"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
        <h3 className="text-[13px] font-semibold text-white mb-4">Module Usage Distribution</h3>
        <div className="flex items-center gap-8">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie data={ANALYTICS_DATA.moduleUsage} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                {ANALYTICS_DATA.moduleUsage.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip contentStyle={{background:"#0d0d1a",border:"1px solid #ffffff15",borderRadius:8,fontSize:11}}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 grid grid-cols-2 gap-2">
            {ANALYTICS_DATA.moduleUsage.map(m=>(
              <div key={m.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{background:m.color}}/>
                <span className="text-[11px] text-white/60">{m.name}</span>
                <span className="ml-auto text-[11px] font-mono text-white/80">{m.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
