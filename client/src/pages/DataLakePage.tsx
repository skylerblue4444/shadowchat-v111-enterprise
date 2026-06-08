import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DataLakePage() {
  const [tab, setTab] = useState<"catalog" | "pipelines" | "quality" | "lineage">("catalog");
  const { data: catalog } = trpc.dataLake.getCatalog.useQuery();
  const { data: pipelines } = trpc.dataLake.getPipelines.useQuery();
  const { data: quality } = trpc.dataLake.getQualityMetrics.useQuery();
  const { data: lineage } = trpc.dataLake.getLineage.useQuery({ dataset: "user_events" });
  const { data: storage } = trpc.dataLake.getStorageStats.useQuery();

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Data Intelligence Lake
        </h1>
        <p className="text-sm text-white/50 mt-1">Enterprise data management • ETL pipelines • Quality monitoring • Lineage tracking</p>
      </div>

      {/* Storage Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Storage", value: storage?.totalStorage ?? "2.4 PB" },
          { label: "Used Storage", value: storage?.usedStorage ?? "1.8 PB" },
          { label: "Compression", value: storage ? `${storage.compressionRatio}x` : "4.2x" },
          { label: "Monthly Cost", value: storage?.monthlyCost ?? "$12.4K" },
        ].map(s => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className="text-xs text-white/40">{s.label}</div>
            <div className="text-lg font-bold text-indigo-400">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["catalog", "pipelines", "quality", "lineage"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${tab === t ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}>{t}</button>
        ))}
      </div>

      {/* Catalog */}
      {tab === "catalog" && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Data Catalog</h2>
          <div className="space-y-2">
            {(catalog?.datasets ?? []).map((ds: any) => (
              <div key={ds.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3 hover:bg-white/8 transition-colors">
                <div>
                  <div className="font-bold text-sm">{ds.name}</div>
                  <div className="text-xs text-white/40">{ds.type} • {ds.records?.toLocaleString()} records • {ds.size}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${ds.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{ds.status}</span>
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => toast.info(`Querying ${ds.name}...`)}>Query</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pipelines */}
      {tab === "pipelines" && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">ETL Pipelines</h2>
          <div className="space-y-2">
            {(pipelines?.pipelines ?? []).map((p: any) => (
              <div key={p.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                <div>
                  <div className="font-bold text-sm">{p.name}</div>
                  <div className="text-xs text-white/40">{p.schedule} • {p.source} → {p.destination}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${p.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' : p.status === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/50'}`}>{p.status}</span>
                  <span className="text-xs text-white/30">{p.lastRun}</span>
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-4 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30" onClick={() => toast.success("New pipeline created")}>+ Create Pipeline</Button>
        </div>
      )}

      {/* Quality */}
      {tab === "quality" && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Data Quality Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: "Completeness", value: quality?.metrics?.[0]?.completeness ?? 99.2, color: "text-emerald-400" },
              { label: "Accuracy", value: quality?.metrics?.[0]?.accuracy ?? 98.7, color: "text-cyan-400" },
              { label: "Freshness", value: quality?.metrics?.[0]?.freshness ?? 97.4, color: "text-indigo-400" },
              { label: "Consistency", value: quality?.metrics?.[0]?.consistency ?? 99.8, color: "text-purple-400" },
            ].map(m => (
              <div key={m.label} className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-xs text-white/40">{m.label}</div>
                <div className={`text-xl font-bold ${m.color}`}>{m.value}%</div>
                <div className="mt-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full" style={{ width: `${m.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {(quality?.alerts ?? []).map((a: any, i: number) => (
              <div key={i} className="flex items-center gap-2 text-sm bg-white/5 rounded-lg p-2">
                <span className={a.severity === 'critical' ? 'text-red-400' : 'text-amber-400'}>⚠️</span>
                <span className="text-white/70">{a.message}</span>
                <span className="text-xs text-white/30 ml-auto">{a.table}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lineage */}
      {tab === "lineage" && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Data Lineage</h2>
          <p className="text-sm text-white/50 mb-4">Track data flow from source to consumption — {lineage?.dataset}</p>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-emerald-400">Upstream Sources</h3>
            {(lineage?.upstream ?? []).map((n: any, i: number) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                <span className="text-lg">📥</span>
                <div className="flex-1">
                  <div className="font-bold text-sm">{n.name}</div>
                  <div className="text-xs text-white/40">{n.type} • {n.connection}</div>
                </div>
              </div>
            ))}
            <h3 className="text-sm font-semibold text-purple-400 mt-4">Downstream Consumers</h3>
            {(lineage?.downstream ?? []).map((n: any, i: number) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                <span className="text-lg">📤</span>
                <div className="flex-1">
                  <div className="font-bold text-sm">{n.name}</div>
                  <div className="text-xs text-white/40">{n.type} • {n.connection}</div>
                </div>
              </div>
            ))}
            <h3 className="text-sm font-semibold text-amber-400 mt-4">Transformations</h3>
            <div className="flex flex-wrap gap-2">
              {(lineage?.transformations ?? []).map((t: string, i: number) => (
                <span key={i} className="text-xs bg-amber-500/10 text-amber-400 px-2 py-1 rounded">{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
