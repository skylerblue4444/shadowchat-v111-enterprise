import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { FlaskConical, Play, Pause, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SandboxZone() {
  const { data: environments, refetch } = trpc.sandbox.getEnvironments.useQuery();
  const createMutation = trpc.sandbox.create.useMutation({ onSuccess: ()=>{ refetch(); toast.success("Environment created"); } });
  const runMutation = trpc.sandbox.runSimulation.useMutation({ onSuccess: (r)=>toast.success(`Simulation complete: ${r.accuracy} accuracy`) });
  const toggleMutation = trpc.sandbox.toggleStatus.useMutation({ onSuccess: ()=>refetch() });
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"ai_test"|"trading_sim"|"feature_preview"|"behavior_model">("ai_test");

  return (
    <div className="p-5 max-w-[1000px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{fontFamily:"Syne,sans-serif"}}><FlaskConical className="w-5 h-5 text-amber-400"/> Sandbox Zone</h1>
          <p className="text-[11px] text-white/40">Experimental environments, AI testing, simulations</p>
        </div>
        <button onClick={()=>setShowCreate(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 text-black hover:bg-amber-400 transition-colors flex items-center gap-1"><Plus className="w-3 h-3"/> New Environment</button>
      </div>
      {showCreate&&(
        <div className="rounded-xl border border-white/10 bg-[oklch(0.13_0.01_265)] p-4 space-y-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Environment name..." className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none"/>
          <div className="flex gap-2 flex-wrap">
            {(["ai_test","trading_sim","feature_preview","behavior_model"] as const).map(t=>(
              <button key={t} onClick={()=>setType(t)} className={cn("px-3 py-1 rounded-full text-xs transition-all",type===t?"bg-amber-500/20 text-amber-400 border border-amber-500/30":"bg-white/5 text-white/50 border border-white/10")}>{t.replace("_"," ")}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={()=>{if(name.trim()){createMutation.mutate({name,type});setShowCreate(false);setName("");}}} className="px-4 py-2 rounded-lg bg-amber-500 text-black text-sm font-medium">Create</button>
            <button onClick={()=>setShowCreate(false)} className="px-4 py-2 rounded-lg bg-white/5 text-white/60 text-sm">Cancel</button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {(!environments||environments.length===0)?(
          <div className="text-center py-16"><FlaskConical className="w-10 h-10 text-gray-600 mx-auto mb-3"/><p className="text-gray-400">No environments yet</p></div>
        ):(
          environments.map((env: any)=>(
            <div key={env.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)]">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center",env.status==="active"?"bg-green-500/20 text-green-400":"bg-white/5 text-white/30")}><FlaskConical className="w-5 h-5"/></div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-white">{env.name}</h3>
                <p className="text-[11px] text-white/40">{env.type?.replace("_"," ")} · {env.status}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>runMutation.mutate({environmentId:env.id})} className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors" title="Run"><Play className="w-4 h-4"/></button>
                <button onClick={()=>toggleMutation.mutate({environmentId:env.id})} className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors" title="Toggle"><Pause className="w-4 h-4"/></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
