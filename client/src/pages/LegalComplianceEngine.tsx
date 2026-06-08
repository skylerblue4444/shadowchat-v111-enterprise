import React, { useState } from "react";

/**
 * Autonomous Legal & Compliance Engine
 * Automated global regulation and compliance monitoring
 */

export default function LegalComplianceEngine() {
  const [activeRegion, setActiveRegion] = useState("global");

  const complianceMetrics = [
    { label: "Global Compliance", value: "98.5%", status: "Optimal" },
    { label: "GDPR/CCPA Status", value: "Verified", status: "Secure" },
    { label: "KYC/AML Coverage", value: "100%", status: "Active" },
    { label: "Audit Readiness", value: "High", status: "Ready" },
  ];

  const legalProposals = [
    { id: 1, title: "Smart Contract Audit", status: "Passed", jurisdiction: "Global", date: "2024-06-01" },
    { id: 2, title: "Data Privacy Update", status: "Active", jurisdiction: "EU/UK", date: "2024-06-05" },
    { id: 3, title: "Crypto Regulation V2", status: "Pending", jurisdiction: "USA", date: "2024-06-10" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Legal<span className="text-emerald-500">Engine</span>
          </h1>
          <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">
            Autonomous Compliance // Global Regulation
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Legal Status</div>
          <div className="text-emerald-500 font-black uppercase text-sm animate-pulse">● Fully Compliant</div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {complianceMetrics.map((metric, idx) => (
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
        {/* Compliance Feed */}
        <div className="col-span-8">
          <h2 className="text-xl font-black uppercase tracking-widest mb-8">Regulation Monitoring</h2>
          <div className="space-y-4">
            {legalProposals.map((proposal) => (
              <div key={proposal.id} className="bg-slate-900/20 border-l-2 border-slate-800 p-6 flex justify-between items-center group hover:border-emerald-500 transition-all">
                <div>
                  <h3 className="text-lg font-black uppercase italic group-hover:text-emerald-400 transition-colors">{proposal.title}</h3>
                  <div className="flex gap-4 mt-1">
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Jurisdiction: {proposal.jurisdiction}</span>
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Date: {proposal.date}</span>
                  </div>
                </div>
                <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                  proposal.status === "Passed" ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-800 text-slate-500"
                }`}>
                  {proposal.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Vault Info */}
        <div className="col-span-4">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-sm">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-emerald-500">Compliance Vault</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-8">
              All platform data is autonomously audited every 60 seconds against global regulations including GDPR, CCPA, and MiCA.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Last Audit</span>
                <span className="text-[10px] font-black text-slate-400">45s Ago</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase">Active Audits</span>
                <span className="text-[10px] font-black text-slate-400">1,245</span>
              </div>
              <button className="w-full mt-4 bg-slate-800 text-white py-3 font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all">
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
