import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { User, Star, Shield, Edit3, Activity, Cpu, TrendingUp, Users, MessageSquare, Heart } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Profile() {
  const { data: profile } = trpc.profile.getMe.useQuery();
  const { user: currentUser } = useAuth();
  if (!currentUser) return null;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser.name || '');
  const [bio, setBio] = useState("Building the future with HOPE AI × ShadowChat × SKYCOIN4444. Software Engineer. Digital Economy Architect.");
  const TABS = ["Posts","About","Digital Twin","Activity"];
  const [tab, setTab] = useState("Posts");
  return (
    <div className="p-5 max-w-[800px] mx-auto space-y-5">
      <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-purple-600/20"/>
        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-8 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xl font-bold text-white border-4 border-[oklch(0.11_0.01_265)]">
              {(currentUser as any)?.avatar || currentUser?.name?.[0] || '?'}
            </div>
            <button onClick={()=>setEditing(p=>!p)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white text-[11px] transition-colors">
              <Edit3 className="w-3.5 h-3.5"/> Edit Profile
            </button>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-bold text-white">{name}</h1>
            {(currentUser as any)?.isVerified || false && <Shield className="w-4 h-4 text-cyan-400 fill-cyan-400"/>}
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-mono">{currentUser.role.toUpperCase()}</span>
          </div>
          <div className="text-[12px] text-white/40 mb-3">{currentUser?.username || currentUser?.name?.toLowerCase().replace(' ', '') || 'user'}</div>
          {editing ? (
            <div className="space-y-2 mb-3">
              <input value={name} onChange={e=>setName(e.target.value)} className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/40"/>
              <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={2} className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/40 resize-none"/>
              <div className="flex gap-2">
                <button onClick={()=>{setEditing(false);toast.success("Profile saved!");}} className="px-4 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[11px] hover:bg-cyan-500/30 transition-colors">Save</button>
                <button onClick={()=>setEditing(false)} className="px-4 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/50 text-[11px] hover:text-white transition-colors">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="text-[12px] text-white/60 mb-3">{bio}</p>
          )}
          <div className="grid grid-cols-4 gap-3">
            {[
              {label:"Followers",value:((currentUser as any)?.followers ?? 0).toLocaleString()},
              {label:"Following",value:((currentUser as any)?.following ?? 0)},
              {label:"Reputation",value:((currentUser as any)?.reputation ?? 0).toLocaleString()},
              {label:"SKYCOIN",value:"4.44M"},
            ].map(s=>(
              <div key={s.label} className="text-center p-2 rounded-lg bg-white/[0.03]">
                <div className="text-[14px] font-bold text-white font-mono">{s.value}</div>
                <div className="text-[9px] text-white/30">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={cn("flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all",tab===t?"bg-cyan-500/20 text-cyan-400 border border-cyan-500/20":"text-white/40 hover:text-white/60")}>{t}</button>
        ))}
      </div>
      {tab==="Digital Twin" && (
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5 space-y-4">
          <h3 className="text-[13px] font-semibold text-white flex items-center gap-2"><Cpu className="w-4 h-4 text-cyan-400"/> Your Digital Twin</h3>
          <p className="text-[12px] text-white/50">HOPE AI behavioral model — AI mirror of your identity and predicted actions</p>
          {[
            {trait:"Trading Behavior",score:92,color:"#22d3ee"},
            {trait:"Social Influence",score:88,color:"#8b5cf6"},
            {trait:"Risk Tolerance",score:74,color:"#f59e0b"},
            {trait:"Creator Potential",score:96,color:"#10b981"},
            {trait:"DAO Participation",score:81,color:"#ef4444"},
          ].map(t=>(
            <div key={t.trait}>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-white/60">{t.trait}</span>
                <span className="font-mono" style={{color:t.color}}>{t.score}%</span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{width:`${t.score}%`,background:t.color}}/>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab!=="Digital Twin" && (
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-8 text-center">
          <div className="text-4xl mb-3">👤</div>
          <div className="text-[13px] font-semibold text-white">{tab}</div>
          <div className="text-[11px] text-white/40 mt-1">Your {tab.toLowerCase()} will appear here</div>
        </div>
      )}
    </div>
  );
}
