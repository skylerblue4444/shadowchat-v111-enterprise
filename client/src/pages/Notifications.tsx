import { useState } from "react";
import { Bell, Heart, MessageCircle, TrendingUp, Shield, Vote, Check, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ICON_MAP: Record<string, any> = {
  like: Heart, message: MessageCircle, trade: TrendingUp, system: Shield, governance: Vote, match: Heart
};
const COLOR_MAP: Record<string, string> = {
  like: "text-red-400 bg-red-500/10", message: "text-cyan-400 bg-cyan-500/10",
  trade: "text-green-400 bg-green-500/10", system: "text-amber-400 bg-amber-500/10",
  governance: "text-purple-400 bg-purple-500/10", match: "text-pink-400 bg-pink-500/10",
};

export default function Notifications() {
  const { data: notifData, refetch } = trpc.notifications.getAll.useQuery({ limit: 50 });
  const markReadMutation = trpc.notifications.markRead.useMutation({ onSuccess: () => refetch() });
  const markAllReadMutation = trpc.notifications.markRead.useMutation({ onSuccess: () => refetch() });
  const notifications = Array.isArray(notifData) ? notifData : [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;
  const markAllRead = () => { notifications.forEach((n: any) => markReadMutation.mutate({ id: n.id })); };
  const [filter, setFilter] = useState("All");
  const FILTERS = ["All","Trades","Social","System","Governance"];
  const filtered = notifications.filter((n: any) => filter==="All" || n.type===filter.toLowerCase() || (filter==="Social"&&["like","message","match"].includes(n.type)));
  return (
    <div className="p-5 max-w-[800px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white" style={{fontFamily:"Syne,sans-serif"}}>Notifications</h1>
          <p className="text-[11px] text-white/40">{unreadCount} unread · System-wide activity feed</p>
        </div>
        <button onClick={()=>{markAllRead();toast.success("All notifications marked as read");}} className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-cyan-400 transition-colors">
          <Check className="w-3.5 h-3.5"/> Mark all read
        </button>
      </div>
      <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
        {FILTERS.map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className={cn("flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all",filter===f?"bg-cyan-500/20 text-cyan-400 border border-cyan-500/20":"text-white/40 hover:text-white/60")}>{f}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(n=>{
          const Icon = ICON_MAP[n.type] || Bell;
          const colorClass = COLOR_MAP[n.type] || "text-white/40 bg-white/[0.06]";
          return (
            <div key={n.id} className={cn("flex items-start gap-3 p-4 rounded-xl border transition-all",n.isRead?"border-white/[0.06] bg-[oklch(0.11_0.01_265)]":"border-cyan-500/20 bg-cyan-500/5")}>
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",colorClass)}>
                <Icon className="w-4 h-4"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] font-semibold text-white">{n.title}</span>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"/>}
                </div>
                <p className="text-[11px] text-white/50 mt-0.5">{n.body}</p>
                <div className="text-[10px] text-white/30 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
            </div>
          );
        })}
        {filtered.length===0 && (
          <div className="text-center py-12 text-white/30">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30"/>
            <div className="text-[13px]">No notifications</div>
          </div>
        )}
      </div>
    </div>
  );
}
