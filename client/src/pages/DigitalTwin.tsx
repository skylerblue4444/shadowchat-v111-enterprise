import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
export default function DigitalTwin() {
  const { data: twin } = trpc.digitalTwin.get.useQuery();
  const { data: earnings } = trpc.digitalTwin.earnings.useQuery();
  const analyzeMut = trpc.digitalTwin.analyze.useMutation();
  const simulateMut = trpc.digitalTwin.simulate.useMutation();
  return (
    <div className="p-5 max-w-[1000px] space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white" style={{fontFamily:"Syne,sans-serif"}}>Digital Twin</h1>
        <p className="text-[11px] text-white/40">AI behavioral model · Predictive identity engine · Simulation layer</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {label:"Total Users",value:"24.8K"},
          {label:"Active Now",value:"1,247"},
          {label:"Revenue",value:"$649K"},
          {label:"Score",value:"99.7%"},
        ].map(s=>(
          <div key={s.label} className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
            <div className="text-[10px] text-white/40 mb-2">{s.label}</div>
            <div className="text-xl font-bold text-white font-mono">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-8 text-center">
        <div className="text-5xl mb-4">🪞</div>
        <h2 className="text-[15px] font-bold text-white mb-2">Digital Twin</h2>
        <p className="text-[12px] text-white/50 max-w-[400px] mx-auto">AI behavioral model · Predictive identity engine · Simulation layer</p>
        <button onClick={()=>toast.info("Full Digital Twin module — enterprise grade")} className="mt-4 px-5 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[12px] hover:bg-cyan-500/30 transition-colors">
          Explore Digital Twin
        </button>
      </div>
    </div>
  );
}
