import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Activity, Zap, Globe, Users, 
  Lock, Cpu, Server, BarChart3, Database,
  AlertTriangle, Settings, RefreshCw, Power
} from "lucide-react";
import { Link } from "wouter";

/**
 * Admin Infrastructure Control Center
 * Master oversight for all 11+ enterprise hubs
 */

export default function AdminControlCenter() {
  const [systemLoad, setSystemLoad] = useState(24);
  
  const stats = [
    { label: "Total AUM", value: "$2.48B", icon: Zap, color: "text-cyan-400" },
    { label: "Active Hubs", value: "11/11", icon: Server, color: "text-emerald-400" },
    { label: "Global Users", value: "8.52M", icon: Users, color: "text-purple-400" },
    { label: "Threat Level", value: "Minimal", icon: Shield, color: "text-emerald-500" },
  ];

  const hubs = [
    { id: "legal", label: "Legal Compliance", status: "Operational", load: "12%", health: "100%", path: "/legal-compliance" },
    { id: "financial", label: "Financial Hub", status: "Operational", load: "45%", health: "99.8%", path: "/financial" },
    { id: "security", label: "Quantum Vault", status: "Operational", load: "8%", health: "100%", path: "/quantum-security" },
    { id: "logistics", label: "Supply Chain", status: "Operational", load: "32%", health: "99.5%", path: "/supply-chain" },
    { id: "talent", label: "Talent Market", status: "Operational", load: "18%", health: "100%", path: "/talent-market" },
    { id: "research", label: "Research Lab", status: "Active", load: "64%", health: "100%", path: "/research" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-2">
            Infrastructure<span className="text-emerald-500">Control</span>
          </h1>
          <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">
            Master Oversight Center //Skyler Blue NOC
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all">
            <RefreshCw className="w-4 h-4" /> Reboot All Hubs
          </button>
          <button className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-red-500/20 transition-all">
            <Power className="w-4 h-4" /> Emergency Kill
          </button>
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
        {/* Main Hub Monitor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-500" /> Infrastructure Hub Monitor
              </h2>
              <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">All Systems Normal</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-950/50 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Hub Module</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Load</th>
                    <th className="px-6 py-4">Health</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {hubs.map((hub) => (
                    <tr key={hub.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-bold text-sm">{hub.label}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> {hub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">{hub.load}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">{hub.health}</td>
                      <td className="px-6 py-4">
                        <Link href={hub.path}>
                          <button className="text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:text-cyan-300">Inspect</button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-6">Security Incident Log</h3>
              <div className="space-y-4">
                {[
                  { msg: "DDoS mitigation active on API layer", time: "2m ago", level: "info" },
                  { msg: "Quantum key rotation successful", time: "14m ago", level: "success" },
                  { msg: "Unauthorized access blocked (IP: 192.x.x.x)", time: "45m ago", level: "warning" },
                ].map((log, i) => (
                  <div key={i} className="flex justify-between items-center text-[11px] border-b border-slate-800 pb-2 last:border-0">
                    <span className="text-slate-300">{log.msg}</span>
                    <span className="text-slate-600 font-mono">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-6">System Load Telemetry</h3>
              <div className="h-24 flex items-end gap-1">
                {[40, 60, 45, 80, 55, 70, 40, 90, 65, 50, 45, 60, 75, 80, 40, 55].map((h, i) => (
                  <div key={i} className="flex-1 bg-emerald-500/20 rounded-t hover:bg-emerald-500/40 transition-all" style={{ height: `${h}%` }}></div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[9px] text-slate-600 font-black uppercase">00:00</span>
                <span className="text-[9px] text-slate-600 font-black uppercase">Live System Load</span>
                <span className="text-[9px] text-slate-600 font-black uppercase">Now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <Settings className="w-4 h-4 text-cyan-400" /> Global Settings
            </h3>
            <div className="space-y-6">
              {[
                { label: "Sovereign Mode", desc: "Absolute admin override", active: true },
                { label: "Quantum Encryption", desc: "Post-quantum security", active: true },
                { label: "AI Self-Healing", desc: "Auto-fix infrastructure", active: true },
                { label: "Public Access", desc: "Enable/Disable platform", active: false },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">{s.label}</div>
                    <div className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{s.desc}</div>
                  </div>
                  <div className={`w-10 h-5 rounded-full p-1 transition-all ${s.active ? "bg-emerald-500" : "bg-slate-800"}`}>
                    <div className={`w-3 h-3 bg-white rounded-full transition-all ${s.active ? "translate-x-5" : "translate-x-0"}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-500 p-8 rounded-2xl text-black">
            <h3 className="text-sm font-black uppercase tracking-widest mb-2 italic">Protocol 4444</h3>
            <p className="text-[10px] font-bold mb-6 opacity-80 uppercase tracking-widest leading-relaxed">
              All infrastructure is currently optimized for the 4444 Standard. 100% liquidity verified.
            </p>
            <button className="w-full bg-black text-white font-black uppercase italic py-3 rounded-xl text-xs hover:bg-slate-900 transition-all">
              Run System Audit
            </button>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl text-center">
            <Activity className="w-10 h-10 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Neural Link Status</h3>
            <div className="text-emerald-500 font-mono text-sm font-black">STABLE // 14ms</div>
          </div>
        </div>
      </div>
    </div>
  );
}
