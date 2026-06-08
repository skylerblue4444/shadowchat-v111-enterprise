import React, { useState } from "react";

/**
 * Legacy Feature Archive Expanded
 * Deep dive into the 2000-era lost features
 */

export default function LegacyFeatureArchiveExpanded() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Features" },
    { id: "social", name: "Social & Chat" },
    { id: "gaming", name: "Classic Gaming" },
    { id: "economy", name: "Old-School Economy" },
    { id: "ui", name: "Vintage UI" },
  ];

  const features = [
    {
      id: 1,
      name: "3D Chat Bubbles",
      category: "social",
      year: "2000",
      description: "Original isometric 3D chat bubble system with custom tails and colors.",
      status: "Restored",
      popularity: "High",
    },
    {
      id: 2,
      name: "Flash Mini-Games",
      category: "gaming",
      year: "2000",
      description: "Collection of 50+ classic Flash-style mini-games (restored via Ruffle).",
      status: "Restored",
      popularity: "Legendary",
    },
    {
      id: 3,
      name: "Direct Peer Trading",
      category: "economy",
      year: "2000",
      description: "Legacy P2P item trading with the original 10-slot trade window.",
      status: "Restored",
      popularity: "Essential",
    },
    {
      id: 4,
      name: "Pixel Avatars",
      category: "ui",
      year: "2000",
      description: "The original 32x32 pixel art avatar system with 1,000+ item combinations.",
      status: "Restored",
      popularity: "Classic",
    },
    {
      id: 5,
      name: "Guestbook System",
      category: "social",
      year: "2000",
      description: "Original user profile guestbooks with stickers and signatures.",
      status: "Restored",
      popularity: "Medium",
    },
    {
      id: 6,
      name: "Raffle Tickets",
      category: "economy",
      year: "2001",
      description: "Classic daily raffle system with original prize pools.",
      status: "Restored",
      popularity: "High",
    },
    {
      id: 7,
      name: "Battle Arena v1",
      category: "gaming",
      year: "2000",
      description: "Original turn-based battle system with classic move sets.",
      status: "Restored",
      popularity: "High",
    },
    {
      id: 8,
      name: "Retro Status Icons",
      category: "ui",
      year: "2000",
      description: "Original set of 50+ pixel-art status and mood icons.",
      status: "Restored",
      popularity: "Classic",
    },
  ];

  const stats = [
    { label: "Features Restored", value: "2,000+", color: "text-emerald-400" },
    { label: "Total Assets", value: "15,000+", color: "text-cyan-400" },
    { label: "Classic Users", value: "450K", color: "text-purple-400" },
    { label: "Year Range", value: "2000-2005", color: "text-orange-400" },
  ];

  const filteredFeatures = selectedCategory === "all" 
    ? features 
    : features.filter(f => f.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-mono">
      {/* Retro Header */}
      <div className="border-4 border-double border-emerald-500 p-6 mb-8 bg-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
        <h1 className="text-5xl font-black mb-2 text-emerald-400 tracking-tighter uppercase italic">
          &lt; Legacy Archive v2.0 &gt;
        </h1>
        <p className="text-emerald-600 font-bold text-lg animate-pulse">
          // RESTORING THE GOLDEN ERA OF SHADOWCHAT // 2000-2005
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border-2 border-slate-800 p-4 text-center">
            <div className="text-xs uppercase font-bold text-slate-500 mb-1">{stat.label}</div>
            <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-sm font-bold uppercase transition-all whitespace-nowrap border-2 ${
              selectedCategory === cat.id
                ? "bg-emerald-500 border-emerald-400 text-slate-950"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:border-emerald-500/50"
            }`}
          >
            [{cat.name}]
          </button>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredFeatures.map((feature) => (
          <div
            key={feature.id}
            className="group relative bg-slate-900 border-2 border-slate-800 p-5 hover:border-emerald-500 transition-all cursor-crosshair"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-[10px] font-bold bg-slate-800 px-2 py-0.5 text-slate-400 uppercase tracking-widest">
                {feature.category}
              </div>
              <div className="text-xs font-black text-emerald-500">
                '{feature.year.slice(2)}
              </div>
            </div>
            
            <h3 className="text-xl font-black mb-2 text-slate-100 group-hover:text-emerald-400 transition-colors">
              {feature.name}
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed mb-4 h-12 overflow-hidden">
              {feature.description}
            </p>

            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <span className="text-[10px] font-bold text-emerald-600 uppercase">
                Status: {feature.status}
              </span>
              <button className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-1 hover:bg-emerald-500 hover:text-slate-950 transition-all">
                LAUNCH
              </button>
            </div>

            {/* Retro Corner Accents */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-emerald-500/20 group-hover:border-emerald-500 transition-colors"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-emerald-500/20 group-hover:border-emerald-500 transition-colors"></div>
          </div>
        ))}
      </div>

      {/* System Footer */}
      <div className="mt-12 text-center text-[10px] text-slate-700 font-bold uppercase tracking-[0.5em]">
        End of Archive // System Stable // No Data Loss Detected
      </div>
    </div>
  );
}
