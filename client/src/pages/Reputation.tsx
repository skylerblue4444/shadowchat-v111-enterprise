import { toast } from "sonner";
export default function Reputation() {
  return (
    <div className="p-5 max-w-[1000px] space-y-5">
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase" style={{ fontFamily: "Syne, sans-serif" }}>
            Trust <span className="text-emerald-400">Protocol</span>
          </h1>
          <div className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-[8px] font-mono text-emerald-400 tracking-[0.2em] uppercase">Karma System</div>
        </div>
        <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em] mt-1">Behavioral Credibility & Identity Verification Engine</span>
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
        <div className="text-5xl mb-4">⭐</div>
        <h2 className="text-[15px] font-bold text-white mb-2">Reputation Engine</h2>
        <p className="text-[12px] text-white/50 max-w-[400px] mx-auto">Trust scores · Karma system · Behavioral credibility</p>
        <button onClick={()=>toast.info("Full Reputation Engine module — enterprise grade")} className="mt-4 px-5 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[12px] hover:bg-cyan-500/30 transition-colors">
          Explore Reputation Engine
        </button>
      </div>
    </div>
  );
}
