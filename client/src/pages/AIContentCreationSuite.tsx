import React, { useState } from "react";

/**
 * Global AI Content Creation Suite
 * Multi-agent collaborative creation for apps, websites, and media
 */

export default function AIContentCreationSuite() {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  const creationTools = [
    { id: "app", name: "App Architect", description: "Generate full-stack applications with autonomous backend/frontend." },
    { id: "web", name: "Web Weaver", description: "Design and deploy high-conversion landing pages and websites." },
    { id: "media", name: "Media Master", description: "Produce professional video, music, and cinematic art assets." },
    { id: "code", name: "Code Catalyst", description: "Optimize, debug, and refactor existing codebases autonomously." },
  ];

  const activeProjects = [
    { name: "DeFi Dashboard v2", type: "App", progress: 85, status: "Building" },
    { name: "Hope AI Brand Identity", type: "Media", progress: 45, status: "Designing" },
    { name: "Enterprise SDK Docs", type: "Web", progress: 100, status: "Live" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Creation<span className="text-emerald-500">Suite</span>
          </h1>
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            Autonomous Production // Swarm Collaboration
          </p>
        </div>
        <div className="text-right">
          <button className="bg-emerald-500 text-black px-8 py-3 font-black uppercase italic tracking-tighter hover:bg-emerald-400 transition-all">
            + New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Creation Tools */}
        <div className="col-span-8">
          <h2 className="text-xl font-black uppercase tracking-widest mb-8">Autonomous Tools</h2>
          <div className="grid grid-cols-2 gap-6">
            {creationTools.map((tool) => (
              <div key={tool.id} className="bg-slate-900/40 border border-slate-800 p-8 rounded-sm hover:border-emerald-500/50 transition-all cursor-pointer group">
                <h3 className="text-2xl font-black uppercase italic mb-2 group-hover:text-emerald-500 transition-colors">{tool.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">{tool.description}</p>
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-1 uppercase">Autonomous</span>
                  <span className="text-[10px] font-bold bg-slate-800 text-slate-500 px-2 py-1 uppercase">Multi-Agent</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Pipeline */}
        <div className="col-span-4">
          <h2 className="text-xl font-black uppercase tracking-widest mb-8">Active Pipeline</h2>
          <div className="space-y-6">
            {activeProjects.map((project, idx) => (
              <div key={idx} className="bg-slate-900/20 border-l-2 border-emerald-500 p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-sm font-black uppercase italic">{project.name}</div>
                    <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{project.type} // {project.status}</div>
                  </div>
                  <div className="text-xs font-black text-emerald-500">{project.progress}%</div>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 bg-slate-900/40 border border-slate-800 p-8 rounded-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-4">Swarm Status</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-slate-400">12 Agents Active & Synchronized</span>
            </div>
            <button className="w-full bg-slate-800 text-white py-3 font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all">
              Optimize Swarm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
