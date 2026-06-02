import { trpc } from "@/lib/trpc";
import { Users, UserPlus, Network, Circle } from "lucide-react";
import { toast } from "sonner";

export default function SocialGraph() {
  const { data: stats } = trpc.socialGraph.getStats.useQuery();
  const { data: followers } = trpc.socialGraph.getFollowers.useQuery({});
  const { data: following } = trpc.socialGraph.getFollowing.useQuery({});
  const { data: mutuals } = trpc.socialGraph.getMutuals.useQuery();
  const { data: circles } = trpc.socialGraph.getCircles.useQuery();

  return (
    <div className="p-5 max-w-[1000px] mx-auto space-y-5">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{fontFamily:"Syne,sans-serif"}}><Network className="w-5 h-5 text-cyan-400"/> Social Graph</h1>
            <p className="text-[11px] text-white/40">Your network, connections, influence mapping</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-[8px] font-mono text-cyan-400 tracking-[0.2em] uppercase">Nearby Active: 14</div>
            <div className="px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 text-[8px] font-mono text-purple-400 tracking-[0.2em] uppercase">Scan: ON</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          {label:"Followers",value:stats?.followers||0},
          {label:"Following",value:stats?.following||0},
          {label:"Circles",value:stats?.circles||0},
          {label:"Influence",value:stats?.influenceScore||"0"},
          {label:"Reach",value:stats?.networkReach||0},
        ].map(s=>(
          <div key={s.label} className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
            <div className="text-[10px] text-white/40 mb-1">{s.label}</div>
            <div className="text-lg font-bold text-white font-mono">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-cyan-400"/> Mutual Connections</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {(mutuals||[]).map((u: any)=>(
              <div key={u?.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] text-white font-bold">{(u?.name||"?")[0]}</div>
                <span className="text-xs text-white">{u?.name}</span>
              </div>
            ))}
            {(!mutuals||mutuals.length===0)&&<p className="text-xs text-white/30 text-center py-4">No mutual connections yet</p>}
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><UserPlus className="w-4 h-4 text-green-400"/> Followers</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {(followers||[]).map((u: any)=>(
              <div key={u?.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03]">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-[10px] text-white font-bold">{(u?.name||"?")[0]}</div>
                <span className="text-xs text-white">{u?.name}</span>
              </div>
            ))}
            {(!followers||followers.length===0)&&<p className="text-xs text-white/30 text-center py-4">No followers yet</p>}
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Circle className="w-4 h-4 text-purple-400"/> Circles</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {(circles||[]).map((c: any)=>(
              <div key={c.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03]">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-[10px] text-white font-bold">{c.name[0]}</div>
                <div><div className="text-xs text-white">{c.name}</div><div className="text-[10px] text-white/40">{c.memberCount} members</div></div>
              </div>
            ))}
            {(!circles||circles.length===0)&&<p className="text-xs text-white/30 text-center py-4">No circles created</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
