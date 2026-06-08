import { useState } from "react";
import { Shield, Users, BarChart3, Settings, Zap, AlertTriangle, Database, Lock, Activity, TrendingUp } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { trpc } from "@/lib/trpc";
const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ANALYTICS_DATA = {
  totalRevenue: 1_240_000,
  totalUsers: 44444,
  activeUsers: 8888,
  totalTrades: 444444,
  monthlyRevenue: Array.from({ length: 12 }, (_, i) => ({ month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i], revenue: 50000 + i * 8000 })),
  revenueStreams: [{ name: "Trading Fees", value: 480000, color: "#00e5ff" }, { name: "AI Subscriptions", value: 320000, color: "#9c27b0" }, { name: "NFT Royalties", value: 240000, color: "#4caf50" }, { name: "Staking", value: 200000, color: "#ff9800" }],
};


const TABS = ["Overview","Users","Tokenomics","Moderation","System","God Mode"];
const USERS = [
  {id:1,name:"Skyler Blue",email:"skyler@shadowchat.ai",role:"admin",balance:4444444,joined:"2024-01-01"},
  {id:2,name:"Alex Rivera",email:"alex@example.com",role:"creator",balance:120000,joined:"2024-02-15"},
  {id:3,name:"Maya Chen",email:"maya@example.com",role:"user",balance:45000,joined:"2024-03-01"},
  {id:4,name:"Jordan Wells",email:"jordan@example.com",role:"user",balance:8200,joined:"2024-03-20"},
];

export default function AdminPanel() {
  const [tab, setTab] = useState("Overview");
  const [killSwitch, setKillSwitch] = useState(false);
  return (
    <div className="p-5 max-w-[1400px] space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{fontFamily:"Syne,sans-serif"}}>
            <Shield className="w-5 h-5 text-red-400"/> Admin Panel
          </h1>
          <p className="text-[11px] text-white/40">ROOT access · System control · Kill switch · Audit trails</p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded border font-mono bg-red-500/10 text-red-400 border-red-500/20">ROOT ACCESS</span>
      </div>
      <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06] flex-wrap">
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={cn("px-3 py-1.5 rounded-md text-[11px] font-medium transition-all", tab===t?"bg-red-500/20 text-red-400 border border-red-500/20":"text-white/40 hover:text-white/60")}>{t}</button>
        ))}
      </div>
      {tab==="Overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {label:"Total Users",value:"24,891",icon:Users,color:"cyan"},
              {label:"Daily Revenue",value:"$649K",icon:TrendingUp,color:"gold"},
              {label:"Active Agents",value:"14",icon:Activity,color:"purple"},
              {label:"System Health",value:"99.97%",icon:Zap,color:"green"},
            ].map(s=>(
              <div key={s.label} className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
                <div className="text-[10px] text-white/40 mb-2">{s.label}</div>
                <div className="text-2xl font-bold text-white font-mono">{s.value}</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
            <h3 className="text-[13px] font-semibold text-white mb-4">Revenue Overview</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={ANALYTICS_DATA.revenueStreams}>
                <defs><linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/><stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="month" tick={{fill:"#ffffff40",fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#ffffff40",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}K`}/>
                <Tooltip contentStyle={{background:"#0d0d1a",border:"1px solid #ffffff15",borderRadius:8,fontSize:11}}/>
                <Area type="monotone" dataKey="marketplace" stroke="#22d3ee" fill="url(#adminGrad)" strokeWidth={1.5}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      {tab==="Users" && (
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <h3 className="text-[13px] font-semibold text-white">User Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead><tr className="border-b border-white/[0.06] bg-white/[0.02]">
                {["ID","Name","Email","Role","Balance","Joined"].map(h=>(
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] text-white/30 font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-white/[0.04]">
                {USERS.map(u=>(
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-white/50 font-mono">#{u.id}</td>
                    <td className="px-4 py-3 text-white font-semibold">{u.name}</td>
                    <td className="px-4 py-3 text-white/50">{u.email}</td>
                    <td className="px-4 py-3"><span className={cn("text-[10px] px-2 py-0.5 rounded border font-mono",u.role==="admin"?"bg-red-500/10 text-red-400 border-red-500/20":u.role==="creator"?"bg-cyan-500/10 text-cyan-400 border-cyan-500/20":"bg-white/[0.06] text-white/40 border-white/[0.08]")}>{u.role}</span></td>
                    <td className="px-4 py-3 text-white font-mono">{u.balance.toLocaleString()}</td>
                    <td className="px-4 py-3 text-white/40">{u.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab==="God Mode" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
            <h3 className="text-[14px] font-bold text-red-400 flex items-center gap-2 mb-3"><AlertTriangle className="w-4 h-4"/> Emergency Controls</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div>
                  <div className="text-[12px] font-semibold text-white">System Kill Switch</div>
                  <div className="text-[10px] text-white/40">Immediately halt all transactions and AI processes</div>
                </div>
                <button onClick={()=>{setKillSwitch(p=>!p);toast[killSwitch?"success":"error"](killSwitch?"System resumed":"⚠️ KILL SWITCH ACTIVATED");}}
                  className={cn("px-4 py-2 rounded-lg border text-[12px] font-bold transition-all",killSwitch?"bg-red-500 border-red-600 text-white":"bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20")}>
                  {killSwitch?"RESUME":"ACTIVATE"}
                </button>
              </div>
              {["Freeze All Wallets","Pause Marketplace","Disable AI Agents","Lock Governance"].map(action=>(
                <div key={action} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[12px] text-white">{action}</span>
                  <button onClick={()=>toast.warning(`${action} executed`)} className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] hover:bg-amber-500/20 transition-colors">Execute</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {!["Overview","Users","God Mode"].includes(tab) && (
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-8 text-center">
          <div className="text-4xl mb-3">🔧</div>
          <div className="text-[13px] font-semibold text-white">{tab} Controls</div>
          <div className="text-[11px] text-white/40 mt-1">Full {tab.toLowerCase()} management panel — enterprise grade</div>
        </div>
      )}
    </div>
  );
}
