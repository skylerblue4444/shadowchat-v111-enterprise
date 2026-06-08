import { useState } from "react";
import { Key, Webhook, Puzzle, Plus, Trash2, Copy, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

export default function APIEcosystem() {
  const { data: stats } = trpc.developer.stats.useQuery();
  const { data: apiKeys, refetch: refetchKeys } = trpc.developer.listApiKeys.useQuery();
  const { data: webhooksList, refetch: refetchWebhooks } = trpc.developer.listWebhooks.useQuery();
  const { data: pluginsList } = trpc.developer.listPlugins.useQuery({ limit: 10 });

  const createKey = trpc.developer.createApiKey.useMutation({
    onSuccess: (data) => {
      toast.success("API Key created! Copy it now — it won't be shown again.");
      navigator.clipboard.writeText(data.key);
      refetchKeys();
    },
  });
  const revokeKey = trpc.developer.revokeApiKey.useMutation({ onSuccess: () => { toast.success("Key revoked"); refetchKeys(); } });
  const createWebhook = trpc.developer.createWebhook.useMutation({ onSuccess: () => { toast.success("Webhook created"); refetchWebhooks(); } });
  const toggleWebhook = trpc.developer.toggleWebhook.useMutation({ onSuccess: () => refetchWebhooks() });
  const deleteWebhook = trpc.developer.deleteWebhook.useMutation({ onSuccess: () => { toast.success("Webhook deleted"); refetchWebhooks(); } });
  const installPlugin = trpc.developer.installPlugin.useMutation({ onSuccess: () => toast.success("Plugin installed") });

  const [tab, setTab] = useState<"keys"|"webhooks"|"plugins">("keys");
  const [newKeyName, setNewKeyName] = useState("");
  const [newWhName, setNewWhName] = useState("");
  const [newWhUrl, setNewWhUrl] = useState("");

  return (
    <div className="p-5 max-w-[1000px] space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white" style={{fontFamily:"Syne,sans-serif"}}>Developer Ecosystem</h1>
        <p className="text-[11px] text-white/40">API keys · Webhooks · Plugin marketplace · Enterprise integrations</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {label:"API Keys",value:String(stats?.apiKeys||0),icon:Key},
          {label:"Webhooks",value:String(stats?.webhooks||0),icon:Webhook},
          {label:"Plugins",value:String(stats?.plugins||0),icon:Puzzle},
          {label:"Total API Calls",value:String(stats?.totalApiCalls||0),icon:Key},
        ].map(s=>(
          <div key={s.label} className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
            <s.icon className="w-4 h-4 text-cyan-400 mb-2"/>
            <div className="text-[10px] text-white/40 mb-1">{s.label}</div>
            <div className="text-xl font-bold text-white font-mono">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04] w-fit">
        {(["keys","webhooks","plugins"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={cn("px-4 py-1.5 rounded-md text-[11px] font-medium transition-all",tab===t?"bg-cyan-500/20 text-cyan-400":"text-white/50 hover:text-white/70")}>
            {t==="keys"?"API Keys":t==="webhooks"?"Webhooks":"Plugins"}
          </button>
        ))}
      </div>

      {/* API Keys Tab */}
      {tab==="keys" && (
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <input value={newKeyName} onChange={e=>setNewKeyName(e.target.value)} placeholder="Key name (e.g. Production)"
              className="flex-1 px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-[12px] text-white placeholder:text-white/30 outline-none focus:border-cyan-500/40"/>
            <button onClick={()=>{if(newKeyName){createKey.mutate({name:newKeyName,scopes:["read","write"]});setNewKeyName("");}}}
              disabled={createKey.isPending}
              className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[11px] font-medium hover:bg-cyan-500/30 transition-colors flex items-center gap-1.5">
              {createKey.isPending?<Loader2 className="w-3 h-3 animate-spin"/>:<Plus className="w-3 h-3"/>} Create Key
            </button>
          </div>
          <div className="space-y-2">
            {apiKeys?.map(k=>(
              <div key={k.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div>
                  <div className="text-[12px] font-semibold text-white">{k.name}</div>
                  <div className="text-[10px] text-white/40 font-mono">{k.keyPrefix}••••••••••••</div>
                  <div className="text-[9px] text-white/30 mt-0.5">Scopes: {(k.scopes as string[])?.join(", ")} · {k.usageCount} calls · Rate: {k.rateLimit}/hr</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[9px] font-mono",k.isActive?"text-green-400":"text-red-400")}>{k.isActive?"ACTIVE":"REVOKED"}</span>
                  {k.isActive && <button onClick={()=>revokeKey.mutate({id:k.id})} className="text-red-400 hover:text-red-300"><Trash2 className="w-3.5 h-3.5"/></button>}
                </div>
              </div>
            ))}
            {(!apiKeys || apiKeys.length===0) && <div className="text-center py-6 text-white/30 text-[11px]">No API keys yet — create one to get started</div>}
          </div>
        </div>
      )}

      {/* Webhooks Tab */}
      {tab==="webhooks" && (
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <input value={newWhName} onChange={e=>setNewWhName(e.target.value)} placeholder="Webhook name"
              className="px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-[12px] text-white placeholder:text-white/30 outline-none focus:border-cyan-500/40 w-40"/>
            <input value={newWhUrl} onChange={e=>setNewWhUrl(e.target.value)} placeholder="https://your-endpoint.com/hook"
              className="flex-1 px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-[12px] text-white placeholder:text-white/30 outline-none focus:border-cyan-500/40"/>
            <button onClick={()=>{if(newWhName&&newWhUrl){createWebhook.mutate({name:newWhName,url:newWhUrl,events:["trade.completed","post.created"]});setNewWhName("");setNewWhUrl("");}}}
              className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[11px] font-medium hover:bg-cyan-500/30 transition-colors flex items-center gap-1.5">
              <Plus className="w-3 h-3"/> Add
            </button>
          </div>
          <div className="space-y-2">
            {webhooksList?.map(wh=>(
              <div key={wh.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div>
                  <div className="text-[12px] font-semibold text-white">{wh.name}</div>
                  <div className="text-[10px] text-white/40 font-mono truncate max-w-[300px]">{wh.url}</div>
                  <div className="text-[9px] text-white/30 mt-0.5">Events: {(wh.events as string[])?.join(", ")}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>toggleWebhook.mutate({id:wh.id})}>
                    {wh.isActive?<ToggleRight className="w-5 h-5 text-green-400"/>:<ToggleLeft className="w-5 h-5 text-white/30"/>}
                  </button>
                  <button onClick={()=>deleteWebhook.mutate({id:wh.id})} className="text-red-400 hover:text-red-300"><Trash2 className="w-3.5 h-3.5"/></button>
                </div>
              </div>
            ))}
            {(!webhooksList || webhooksList.length===0) && <div className="text-center py-6 text-white/30 text-[11px]">No webhooks configured</div>}
          </div>
        </div>
      )}

      {/* Plugins Tab */}
      {tab==="plugins" && (
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pluginsList?.map(p=>(
              <div key={p.id} className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[13px] font-semibold text-white">{p.name}</div>
                    <div className="text-[10px] text-white/40 mt-0.5">{p.description || "No description"}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{p.category}</span>
                      <span className="text-[9px] text-white/30">v{p.version} · {p.installCount} installs</span>
                    </div>
                  </div>
                  <button onClick={()=>installPlugin.mutate({pluginId:p.id})}
                    className="px-3 py-1 rounded-md bg-white/[0.06] border border-white/[0.08] text-[10px] text-white/60 hover:text-white hover:bg-white/[0.1] transition-colors">
                    Install
                  </button>
                </div>
              </div>
            ))}
            {(!pluginsList || pluginsList.length===0) && (
              <div className="col-span-2 text-center py-8 text-white/30 text-[11px]">
                <Puzzle className="w-8 h-8 mx-auto mb-2 text-white/10"/>
                No plugins published yet — be the first developer!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
