import React, { useState } from "react";

/**
 * Global Talent & Freelance Marketplace
 * AI-matched project collaboration and freelance services
 */

export default function TalentMarketplace() {
  const [activeCategory, setActiveCategory] = useState("all");

  const marketplaceStats = [
    { label: "Active Talents", value: "450K+", status: "Growing" },
    { label: "Open Projects", value: "12,450", status: "Active" },
    { label: "Total Earnings", value: "$125M", status: "Distributed" },
    { label: "Match Accuracy", value: "98.2%", status: "AI-Optimized" },
  ];

  const featuredProjects = [
    { id: 1, title: "Neural Interface Design", budget: "$15K - $25K", skills: ["AI", "UI/UX", "3D"], status: "Hiring" },
    { id: 2, title: "Quantum Smart Contract", budget: "$45K - $60K", skills: ["Rust", "Solidity", "Security"], status: "Hiring" },
    { id: 3, title: "Autonomous Social Feed", budget: "$10K - $15K", skills: ["React", "Node", "AI"], status: "Hiring" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Talent<span className="text-emerald-500">Market</span>
          </h1>
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            Autonomous Matching // Global Collaboration
          </p>
        </div>
        <div className="text-right">
          <button className="bg-emerald-500 text-black px-8 py-3 font-black uppercase italic tracking-tighter hover:bg-emerald-400 transition-all">
            Post Project
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {marketplaceStats.map((stat, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-slate-800 p-6 rounded-sm">
            <div className="text-xs text-slate-500 uppercase font-bold mb-2">{stat.label}</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-black">{stat.value}</div>
              <div className="text-[10px] text-emerald-500 font-bold uppercase">{stat.status}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Project Feed */}
        <div className="col-span-8">
          <h2 className="text-xl font-black uppercase tracking-widest mb-8">Featured Projects</h2>
          <div className="space-y-4">
            {featuredProjects.map((project) => (
              <div key={project.id} className="bg-slate-900/20 border-l-2 border-slate-800 p-8 flex justify-between items-center group hover:border-emerald-500 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-black uppercase italic group-hover:text-emerald-500 transition-colors">{project.title}</h3>
                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 uppercase">{project.status}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {project.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="text-[10px] font-bold bg-slate-800 text-slate-500 px-2 py-1 uppercase tracking-widest">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-slate-200 mb-1">{project.budget}</div>
                  <button className="text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-all">View Details →</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Talent Discovery */}
        <div className="col-span-4">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-emerald-500">AI Matching Engine</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-8">
              Our autonomous engine matches your project with the top 0.1% of global talent in under 60 seconds using deep skill mapping.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-full"></div>
                <div>
                  <div className="text-xs font-black uppercase italic">Top Match Found</div>
                  <div className="text-[10px] text-slate-600 font-bold uppercase">Senior AI Engineer // 99% Match</div>
                </div>
              </div>
              <button className="w-full bg-slate-800 text-white py-3 font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all">
                Run Matching Engine
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
