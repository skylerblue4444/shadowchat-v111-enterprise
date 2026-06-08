import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scale, Shield, Gavel, FileText, 
  CheckCircle2, AlertTriangle, Users, Cpu,
  ArrowRight, Landmark, Zap
} from "lucide-react";

/**
 * Autonomous Judicial & Arbitration Hub (AI Supreme Court)
 * Resolving disputes and enforcing smart-contract law
 */

export default function JudicialArbitrationHub() {
  const [activeCase, setActiveCase] = useState<string | null>(null);

  const stats = [
    { label: "Cases Resolved", value: "12,450", icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Active Disputes", value: "84", icon: AlertTriangle, color: "text-amber-400" },
    { label: "Arbitration Speed", value: "< 2s", icon: Zap, color: "text-cyan-400" },
    { label: "Enforcement Rate", value: "100%", icon: Shield, color: "text-purple-400" },
  ];

  const cases = [
    { id: "CASE-4444-A", title: "Smart Contract Liquidity Dispute", status: "Resolved", partyA: "User_847", partyB: "Protocol_X", verdict: "Party A Refunded" },
    { id: "CASE-4444-B", title: "Talent Marketplace Escrow Conflict", status: "In Progress", partyA: "Dev_Alpha", partyB: "Client_Beta", verdict: "Pending AI Jury" },
    { id: "CASE-4444-C", title: "Intellectual Property Infringement", status: "Resolved", partyA: "Creator_99", partyB: "Bot_22", verdict: "IP Rights Upheld" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="relative z-10 flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            AI Supreme<span className="text-emerald-500">Court</span>
          </h1>
          <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">
            Autonomous Judicial & Arbitration Hub // v1111 Law
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Judicial Sync</div>
              <div className="text-emerald-500 font-black uppercase text-sm">● Law Enforced</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Scale className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((s, i) => (
          <motion.div 
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-3xl font-black italic tracking-tighter">{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Case Monitor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Gavel className="w-4 h-4 text-emerald-500" /> Active Arbitration Docket
              </h2>
              <button className="text-[10px] bg-emerald-500 text-black px-4 py-2 rounded-lg font-black uppercase tracking-widest hover:bg-emerald-400 transition-all">
                File New Dispute
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-950/50 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Case ID</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Verdict</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {cases.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs text-emerald-500">{c.id}</td>
                      <td className="px-6 py-4 font-bold text-sm">{c.title}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${
                          c.status === "Resolved" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">{c.verdict}</td>
                      <td className="px-6 py-4">
                        <button className="text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:text-cyan-300">View Files</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" /> AI Jury Logic
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  The AI Supreme Court uses a swarm of 12 specialized legal agents to reach a consensus on all disputes. Every verdict is instantly executed via smart-contract settlement.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">
                        AI
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Swarm Consensus Active</span>
                </div>
              </div>
              <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Platform Constitution</div>
                <div className="text-xs font-mono text-emerald-500/80 space-y-1">
                  <div>1. Sovereignty of Code</div>
                  <div>2. Absolute Transparency</div>
                  <div>3. Instant Settlement</div>
                  <div>4. 4444 Standard Compliance</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-emerald-500 p-8 rounded-2xl text-black">
            <Landmark className="w-12 h-12 mb-6" />
            <h3 className="text-xl font-black uppercase italic mb-2">Legal Sovereignty</h3>
            <p className="text-xs font-bold opacity-80 uppercase tracking-widest leading-relaxed mb-6">
              ShadowChat v1111 is a self-governing digital state. All disputes are settled within the platform ecosystem.
            </p>
            <button className="w-full bg-black text-white font-black uppercase italic py-4 rounded-xl text-xs hover:bg-slate-900 transition-all">
              Platform Laws v1.1
            </button>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" /> Community Jury
            </h3>
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Top reputation holders can participate in high-stakes arbitration and earn SKYCOIN4444.
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Jury Rewards</span>
                <span className="text-emerald-500 font-bold">500 SKY / Case</span>
              </div>
              <button className="w-full border border-slate-800 text-slate-300 font-black uppercase italic py-3 rounded-xl text-[10px] hover:bg-white/5 transition-all">
                Apply for Jury Duty
              </button>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl text-center">
            <FileText className="w-10 h-10 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Smart Law Library</h3>
            <div className="text-cyan-400 font-mono text-sm font-black">1,245 Verified Rules</div>
          </div>
        </div>
      </div>
    </div>
  );
}
