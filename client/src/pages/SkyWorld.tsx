import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const WORLDS = [
  { id: "nexus", name: "The Nexus", type: "Hub", users: 12400, icon: "🌐", desc: "Central meeting point — all factions converge here" },
  { id: "aether", name: "AetherLux Vault", type: "Finance", users: 3200, icon: "💎", desc: "DeFi staking cathedral — earn yields in immersive space" },
  { id: "arena", name: "Shadow Arena", type: "PvP", users: 8900, icon: "⚔️", desc: "Competitive gaming zone — tournaments & wagers" },
  { id: "garden", name: "Digital Garden", type: "Social", users: 5600, icon: "🌸", desc: "Peaceful social space — meditation & connection" },
  { id: "forge", name: "Creator Forge", type: "Build", users: 2100, icon: "🔨", desc: "Build your own worlds — drag & drop creation" },
  { id: "market", name: "Grand Bazaar", type: "Commerce", users: 7800, icon: "🏪", desc: "Virtual marketplace — trade NFTs & digital goods" },
  { id: "dao", name: "Governance Hall", type: "DAO", users: 1900, icon: "🏛️", desc: "Vote on platform decisions — democratic governance" },
  { id: "lab", name: "AI Research Lab", type: "Science", users: 4300, icon: "🧬", desc: "Experiment with AI models — train & deploy agents" },
];

const FACTIONS = [
  { name: "Shadow Collective", members: 45000, color: "from-purple-500 to-indigo-600", icon: "🌑" },
  { name: "Solar Alliance", members: 38000, color: "from-amber-500 to-orange-600", icon: "☀️" },
  { name: "Cyber Syndicate", members: 32000, color: "from-cyan-500 to-blue-600", icon: "⚡" },
  { name: "Nature Guardians", members: 28000, color: "from-emerald-500 to-green-600", icon: "🌿" },
];

export default function SkyWorld() {
  const [selectedWorld, setSelectedWorld] = useState(WORLDS[0]);
  const [tab, setTab] = useState<"worlds" | "factions" | "inventory" | "build">("worlds");

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="relative bg-gradient-to-br from-indigo-900/40 via-black to-purple-900/30 border border-indigo-500/20 rounded-3xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1),transparent_60%)]" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            SkyWorld
          </h1>
          <p className="text-white/50 mt-2">Immersive 3D/AR environments • DAO governance spaces • Creator-built worlds • Digital nation system</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/5 rounded-lg p-2 text-center"><div className="text-xs text-white/40">Online Now</div><div className="text-lg font-bold text-indigo-400">46.2K</div></div>
            <div className="bg-white/5 rounded-lg p-2 text-center"><div className="text-xs text-white/40">Worlds</div><div className="text-lg font-bold text-purple-400">2,847</div></div>
            <div className="bg-white/5 rounded-lg p-2 text-center"><div className="text-xs text-white/40">Factions</div><div className="text-lg font-bold text-pink-400">4</div></div>
            <div className="bg-white/5 rounded-lg p-2 text-center"><div className="text-xs text-white/40">Economy</div><div className="text-lg font-bold text-emerald-400">$8.4M</div></div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {(["worlds", "factions", "inventory", "build"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${tab === t ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}>{t}</button>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6">
        {tab === "worlds" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {WORLDS.map(w => (
              <div key={w.id} onClick={() => { setSelectedWorld(w); toast.success(`Entering ${w.name}...`); }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all cursor-pointer">
                <div className="text-3xl mb-2">{w.icon}</div>
                <div className="font-bold">{w.name}</div>
                <div className="text-xs text-white/40">{w.type} • {w.users.toLocaleString()} online</div>
                <p className="text-xs text-white/50 mt-2">{w.desc}</p>
                <Button size="sm" className="mt-3 w-full bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30">Enter World</Button>
              </div>
            ))}
          </div>
        )}

        {tab === "factions" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Digital Nations & Factions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FACTIONS.map(f => (
                <div key={f.name} className={`bg-gradient-to-br ${f.color} bg-opacity-10 border border-white/10 rounded-xl p-5`} style={{ background: `linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6))` }}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{f.icon}</span>
                    <div>
                      <div className="font-bold text-lg">{f.name}</div>
                      <div className="text-xs text-white/50">{f.members.toLocaleString()} members</div>
                    </div>
                  </div>
                  <Button size="sm" className="mt-3" onClick={() => toast.success(`Joined ${f.name}!`)}>Join Faction</Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "inventory" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Your Inventory</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["🗡️ Shadow Blade", "🛡️ Aether Shield", "🏠 Virtual Plot #442", "👑 Crown of Governance", "🎭 Rare Avatar Skin", "💍 NFT Ring #0044", "🚀 Starship Alpha", "📜 Land Deed"].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 text-center hover:bg-white/8 cursor-pointer">
                  <div className="text-2xl mb-1">{item.split(" ")[0]}</div>
                  <div className="text-xs font-medium">{item.split(" ").slice(1).join(" ")}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "build" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">World Builder</h2>
            <p className="text-sm text-white/50">Create your own immersive environments. Drag & drop 3D assets, set rules, invite others.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {["Terrain Editor", "Asset Library", "Physics Engine", "Lighting Studio", "Sound Design", "NPC Creator"].map(tool => (
                <div key={tool} className="bg-white/5 border border-white/10 rounded-lg p-4 text-center hover:bg-indigo-500/10 cursor-pointer transition-colors" onClick={() => toast.info(`${tool} — Opening...`)}>
                  <div className="font-bold text-sm">{tool}</div>
                </div>
              ))}
            </div>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500" onClick={() => toast.success("New world created! Start building.")}>
              + Create New World
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
