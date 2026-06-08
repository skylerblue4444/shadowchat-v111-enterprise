import React, { useState } from "react";

/**
 * Autonomous Research & Development Lab
 * AI-driven innovation and product development
 */

export default function ResearchLabPage() {
  const [activeProject, setActiveProject] = useState("quantum");

  const researchMetrics = [
    { label: "Active Projects", value: "245", status: "Ongoing" },
    { label: "Patents Filed", value: "1,247", status: "Approved" },
    { label: "R&D Budget", value: "$500M", status: "Allocated" },
    { label: "Innovation Index", value: "9.8/10", status: "Leading" },
  ];

  const projects = [
    { id: 1, name: "Quantum Neural Networks", status: "Phase 3", progress: 75, team: 45 },
    { id: 2, name: "Self-Healing Infrastructure", status: "Phase 2", progress: 60, team: 32 },
    { id: 3, name: "Autonomous AGI Framework", status: "Phase 4", progress: 85, team: 58 },
    { id: 4, name: "Distributed Consensus Protocol", status: "Phase 1", progress: 40, team: 28 },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Research<span className="text-emerald-500">Lab</span>
          </h1>
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            Autonomous Innovation // Next-Gen Technologies
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Innovation Status</div>
          <div className="text-emerald-500 font-black uppercase text-sm animate-pulse">● Breakthrough Phase</div>
        </div>
      </div>

      {/* Research Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {researchMetrics.map((metric, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-slate-800 p-6 rounded-sm">
            <div className="text-xs text-slate-500 uppercase font-bold mb-2">{metric.label}</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-black">{metric.value}</div>
              <div className="text-[10px] text-emerald-500 font-bold uppercase">{metric.status}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Projects Timeline */}
        <div className="col-span-8">
          <h2 className="text-xl font-black uppercase tracking-widest mb-8">Active Research Projects</h2>
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-slate-900/20 border-l-4 border-slate-800 p-8 group hover:border-emerald-500 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black uppercase italic group-hover:text-emerald-500 transition-colors">{project.name}</h3>
                    <div className="flex gap-4 mt-2">
                      <span className="text-[10px] font-bold bg-slate-800 text-slate-500 px-2 py-1 uppercase">{project.status}</span>
                      <span className="text-[10px] font-bold text-slate-600 uppercase">Team: {project.team} Scientists</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-500">{project.progress}%</div>
                    <div className="text-[10px] text-slate-600 font-bold uppercase mt-1">Complete</div>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Innovation Pipeline */}
        <div className="col-span-4">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-emerald-500">Innovation Pipeline</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-8">
              Our autonomous research engine discovers 50+ novel algorithms daily and tests them against 1,000+ real-world scenarios.
            </p>
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-sm">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Latest Breakthrough</div>
                <div className="text-sm font-black text-emerald-500">Quantum Error Correction</div>
                <div className="text-[10px] text-slate-600 font-mono mt-1">Filed: 2024-06-08</div>
              </div>
              <button className="w-full bg-slate-800 text-white py-3 font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all">
                View Patents
              </button>
              <button className="w-full bg-emerald-500 text-black py-3 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all">
                Launch Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
