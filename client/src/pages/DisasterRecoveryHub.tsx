import React from "react";
import { motion } from "framer-motion";
import { 
  CloudRain, Shield, RefreshCw, Server, 
  Globe, Database, Zap, Activity, 
  HardDrive, Lock, AlertTriangle, Satellite
} from "lucide-react";

/**
 * Disaster Recovery & Planetary Redundancy Hub
 * Ensuring the platform is unkillable through multi-region distribution
 */

export default function DisasterRecoveryHub() {
  const regions = [
    { name: "AWS US-East", status: "Operational", latency: "12ms", sync: "100%" },
    { name: "GCP Europe-West", status: "Operational", latency: "45ms", sync: "100%" },
    { name: "Azure Asia-Pacific", status: "Operational", latency: "120ms", sync: "100%" },
    { name: "Sovereign Node Alpha", status: "Operational", latency: "2ms", sync: "100%" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      {/* Header */}
      <div className="relative z-10 flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Planetary<span className="text-emerald-500">Sync</span>
          </h1>
          <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">
            Disaster Recovery & Redundancy // v1111 Unkillable
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Global Redundancy</div>
              <div className="text-emerald-500 font-black uppercase text-sm">● Multi-Cloud Active</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Satellite className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Sync Monitor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" /> Data Persistence
                </h3>
                <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Secured</span>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Total Data Volume</span>
                  <span className="text-sm font-black italic">2.4 PB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Backup Frequency</span>
                  <span className="text-sm font-black italic">Every 60s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Redundancy Factor</span>
                  <span className="text-sm font-black italic text-emerald-500">12x Mirroring</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> Auto-Recovery
                </h3>
                <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Active</span>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Failover Time</span>
                  <span className="text-sm font-black italic text-cyan-400">&lt; 100ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Last Recovery Test</span>
                  <span className="text-sm font-black italic">14m ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Success Rate</span>
                  <span className="text-sm font-black italic text-emerald-500">99.999%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-500" /> Planetary Node Distribution
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-950/50 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Node Region</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Latency</th>
                    <th className="px-6 py-4">Sync State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {regions.map((r) => (
                    <tr key={r.name} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-bold text-sm">{r.name}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">{r.latency}</td>
                      <td className="px-6 py-4 font-mono text-xs text-emerald-500">{r.sync}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-500" /> Sovereign Backup
            </h3>
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Encrypted cold storage backup across 4 separate continents and 1 orbital node.
              </p>
              <button className="w-full bg-slate-950 border border-slate-800 text-white font-black uppercase italic py-4 rounded-xl text-xs hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" /> Force Global Sync
              </button>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl">
            <AlertTriangle className="w-10 h-10 text-red-500 mb-4" />
            <h3 className="text-sm font-black uppercase tracking-widest text-red-500 mb-2">Planetary Killswitch</h3>
            <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest leading-relaxed mb-6">
              In case of total planetary failure, the platform will hibernate and await orbital reactivation.
            </p>
            <button className="w-full bg-red-500 text-black font-black uppercase italic py-3 rounded-xl text-xs hover:bg-red-400 transition-all">
              Initiate Hibernation
            </button>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl text-center">
            <Activity className="w-10 h-10 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Sync Integrity</h3>
            <div className="text-emerald-500 font-mono text-sm font-black">VERIFIED // 100%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
