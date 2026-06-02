import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PluginMarketplace() {
  const [tab, setTab] = useState<"browse" | "installed" | "publish" | "stats">("browse");
  const [search, setSearch] = useState("");
  const { data: browseData, isLoading } = trpc.pluginMarketplace.browse.useQuery({ search: search || undefined });
  const { data: devStats } = trpc.pluginMarketplace.devStats.useQuery();
  const installMut = trpc.pluginMarketplace.install.useMutation({ onSuccess: () => toast.success("Plugin installed!") });
  const uninstallMut = trpc.pluginMarketplace.uninstall.useMutation({ onSuccess: () => toast.success("Plugin uninstalled") });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Plugin Marketplace
        </h1>
        <p className="text-sm text-white/50 mt-1">App Store for AI workers • Developer ecosystem • Revenue sharing</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Plugins", value: devStats?.totalPlugins ?? 0 },
          { label: "Total Downloads", value: (devStats?.totalDownloads ?? 0).toLocaleString() },
          { label: "Avg Rating", value: devStats?.averageRating?.toFixed(1) ?? "4.6" },
          { label: "Active Devs", value: (devStats?.activeDevs ?? 0).toLocaleString() },
        ].map(s => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className="text-xs text-white/40">{s.label}</div>
            <div className="text-lg font-bold text-emerald-400">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["browse", "installed", "publish", "stats"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${tab === t ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}>{t}</button>
        ))}
      </div>

      {/* Search */}
      {tab === "browse" && (
        <input
          type="text"
          placeholder="Search plugins..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/40"
        />
      )}

      {/* Browse */}
      {tab === "browse" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <div className="col-span-4 text-center py-12 text-white/30">Loading plugins...</div>
          ) : (
            browseData?.plugins.map(p => (
              <div key={p.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-emerald-500/20 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <div className="font-bold text-sm">{p.name}</div>
                    <div className="text-xs text-white/40">by {p.author}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50 mb-3">
                  <span>⭐ {p.rating.toFixed(1)}</span>
                  <span>•</span>
                  <span>{p.downloads.toLocaleString()} downloads</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400">{p.price === 0 ? "FREE" : `$${p.price}`}</span>
                  {p.installed ? (
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => uninstallMut.mutate({ pluginId: p.id })}>Uninstall</Button>
                  ) : (
                    <Button size="sm" className="text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30" onClick={() => installMut.mutate({ pluginId: p.id })}>Install</Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Installed */}
      {tab === "installed" && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Installed Plugins</h2>
          <div className="space-y-3">
            {browseData?.plugins.filter(p => p.installed).map(p => (
              <div key={p.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{p.icon}</span>
                  <div>
                    <div className="font-bold text-sm">{p.name}</div>
                    <div className="text-xs text-white/40">v{p.version} • {p.category}</div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs" onClick={() => uninstallMut.mutate({ pluginId: p.id })}>Remove</Button>
              </div>
            ))}
            {(!browseData?.plugins.filter(p => p.installed).length) && (
              <div className="text-center py-8 text-white/30">No plugins installed yet</div>
            )}
          </div>
        </div>
      )}

      {/* Publish */}
      {tab === "publish" && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Publish a Plugin</h2>
          <p className="text-sm text-white/50 mb-4">Share your creation with the community. 70% revenue share for developers.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Plugin Name", "Description", "Category", "Version", "Price (USD)", "Source URL"].map(field => (
              <div key={field}>
                <label className="text-xs text-white/40 mb-1 block">{field}</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/40" placeholder={field} />
              </div>
            ))}
          </div>
          <Button className="mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500" onClick={() => toast.success("Plugin submitted for review!")}>
            Submit for Review
          </Button>
        </div>
      )}

      {/* Stats */}
      {tab === "stats" && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Developer Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4 text-center"><div className="text-xs text-white/40">Total Revenue</div><div className="text-xl font-bold text-emerald-400">${((devStats?.totalRevenue ?? 0) / 1000000).toFixed(1)}M</div></div>
            <div className="bg-white/5 rounded-lg p-4 text-center"><div className="text-xs text-white/40">Pending Reviews</div><div className="text-xl font-bold text-amber-400">{devStats?.pendingReviews ?? 0}</div></div>
            <div className="bg-white/5 rounded-lg p-4 text-center"><div className="text-xs text-white/40">Active Developers</div><div className="text-xl font-bold text-cyan-400">{(devStats?.activeDevs ?? 0).toLocaleString()}</div></div>
          </div>
        </div>
      )}
    </div>
  );
}
