import React, { useState } from "react";

/**
 * Corporate Identity Hub
 * Premium "About Me" and "Company" pages for ShadowChat Enterprise
 */

export default function CorporateIdentityHub() {
  const [activeTab, setActiveTab] = useState("company");

  const companyStats = [
    { label: "Founded", value: "2024" },
    { label: "Global Users", value: "12.5M+" },
    { label: "Total Valuation", value: "$1.2B" },
    { label: "AI Workforce", value: "12 Swarm Agents" },
  ];

  const coreValues = [
    { title: "Autonomy", description: "Empowering decentralized AI ecosystems." },
    { title: "Privacy", description: "Military-grade encryption and sovereign data." },
    { title: "Innovation", description: "Pushing the boundaries of multi-modal AI." },
    { title: "Impact", description: "Global charity and community-driven growth." },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="mb-12 border-b border-slate-800 pb-8">
        <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
          Corporate<span className="text-emerald-500">Identity</span>
        </h1>
        <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
          ShadowChat Enterprise // Global Vision
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 mb-12 border-b border-slate-900">
        {["company", "about-me", "vision"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-black uppercase tracking-widest transition-all border-b-2 ${
              activeTab === tab
                ? "border-emerald-500 text-emerald-500"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Company Content */}
      {activeTab === "company" && (
        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-7">
            <h2 className="text-3xl font-black mb-6 uppercase italic">ShadowChat Enterprise</h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              ShadowChat is a world-leading autonomous AI ecosystem dedicated to decentralized finance, 
              social impact, and next-generation media. Our mission is to build the first truly 
              self-evolving digital state, powered by swarm intelligence and community governance.
            </p>
            <div className="grid grid-cols-2 gap-8">
              {coreValues.map((value, idx) => (
                <div key={idx} className="bg-slate-900/40 border border-slate-800 p-6 rounded-sm">
                  <h3 className="text-emerald-500 font-black uppercase text-sm mb-2">{value.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-5">
            <div className="bg-emerald-500 p-8 rounded-sm text-black">
              <h3 className="text-xl font-black uppercase italic mb-6">Global Performance</h3>
              <div className="space-y-6">
                {companyStats.map((stat, idx) => (
                  <div key={idx} className="flex justify-between items-end border-b border-black/10 pb-2">
                    <span className="text-xs font-bold uppercase opacity-60">{stat.label}</span>
                    <span className="text-2xl font-black tracking-tighter">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Me Content */}
      {activeTab === "about-me" && (
        <div className="max-w-4xl">
          <h2 className="text-3xl font-black mb-6 uppercase italic">The Visionary</h2>
          <div className="bg-slate-900/40 border border-slate-800 p-12 rounded-sm mb-8">
            <p className="text-xl text-slate-300 leading-relaxed italic mb-8">
              "We aren't just building software; we're architecting the future of human-AI collaboration. 
              ShadowChat is the culmination of years of research into decentralized systems and autonomous 
              intelligence. My goal is to empower every user with the tools to create, earn, and impact 
              the world through a sovereign digital platform."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-full"></div>
              <div>
                <div className="font-black uppercase tracking-widest">Founder & Lead Architect</div>
                <div className="text-xs text-slate-500 font-mono uppercase">ShadowChat Enterprise</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vision Content */}
      {activeTab === "vision" && (
        <div className="grid grid-cols-3 gap-8">
          <div className="bg-slate-900/20 border-t-2 border-emerald-500 p-8">
            <h3 className="font-black uppercase mb-4">Phase 1: Foundation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Building the core autonomous engines and swarm intelligence framework.</p>
          </div>
          <div className="bg-slate-900/20 border-t-2 border-cyan-500 p-8 opacity-60">
            <h3 className="font-black uppercase mb-4">Phase 2: Expansion</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Global media integration and cross-chain financial ecosystems.</p>
          </div>
          <div className="bg-slate-900/20 border-t-2 border-purple-500 p-8 opacity-40">
            <h3 className="font-black uppercase mb-4">Phase 3: Sovereignty</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Full decentralized statehood and self-healing infrastructure.</p>
          </div>
        </div>
      )}
    </div>
  );
}
