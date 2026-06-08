import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, PieChart, Activity, DollarSign, Globe, Sparkles, BarChart3 } from "lucide-react";
import { SovereignCard, SovereignHeading, SovereignBadge } from "../components/SovereignUI";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

/**
 * Sovereign Valuation & Pulse Hub
 * Tracks the 'True Value' of the digital state and live citizen activity
 */

const DATA = [
  { name: "JAN", value: 444 },
  { name: "FEB", value: 888 },
  { name: "MAR", value: 1444 },
  { name: "APR", value: 2444 },
  { name: "MAY", value: 3888 },
  { name: "JUN", value: 4444 },
];

const ICO_DATA = [
  { name: "PHASE 1", value: 100, fill: "#10b981" },
  { name: "PHASE 2", value: 250, fill: "#06b6d4" },
  { name: "PHASE 3", value: 450, fill: "#8b5cf6" },
  { name: "PHASE 4", value: 850, fill: "#f43f5e" },
];

export default function SovereignValuationHub() {
  const { skycoinBalance, manusCoin, activityLog } = useNeuralCore();

  return (
    <div className="space-y-12 pb-24">
      <SovereignHeading 
        title="Sovereign Valuation & Pulse" 
        subtitle="TRUE_VALUE_OF_THE_DIGITAL_STATE // LIVE_TELEMETRY" 
      />

      {/* High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "PLANETARY_MARKET_CAP", value: "$4.44B", icon: Globe, color: "emerald" },
          { label: "TOTAL_AUM", value: "$2.4B", icon: DollarSign, color: "cyan" },
          { label: "ICO_VALUATION", value: "44.4M SKY", icon: TrendingUp, color: "purple" },
          { label: "ACTIVE_CITIZENS", value: "8.5M", icon: Users, color: "rose" },
        ].map((stat, i) => (
          <SovereignCard key={i} glowColor={stat.color as any}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-${stat.color}-500/10 border border-${stat.color}-500/20 rounded-2xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
              </div>
              <div>
                <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-black italic">{stat.value}</h3>
              </div>
            </div>
          </SovereignCard>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SovereignCard glowColor="cyan">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black uppercase italic flex items-center gap-3">
              <Activity className="w-5 h-5 text-cyan-400" /> GROWTH_VELOCITY
            </h3>
            <SovereignBadge type="cyan">REAL_TIME</SovereignBadge>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#000", border: "1px solid #ffffff10", borderRadius: "12px", fontSize: "10px" }}
                  itemStyle={{ color: "#06b6d4" }}
                />
                <Area type="monotone" dataKey="value" stroke="#06b6d4" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SovereignCard>

        <SovereignCard glowColor="purple">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black uppercase italic flex items-center gap-3">
              <PieChart className="w-5 h-5 text-purple-400" /> ICO_PHASE_DISTRIBUTION
            </h3>
            <SovereignBadge type="purple">LIVE_SALE</SovereignBadge>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ICO_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#000", border: "1px solid #ffffff10", borderRadius: "12px", fontSize: "10px" }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SovereignCard>
      </div>

      {/* Live Citizen Feed */}
      <SovereignCard glowColor="emerald">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-black uppercase italic flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400" /> LIVE_CITIZEN_REGISTRY
          </h3>
          <SovereignBadge type="green">NEW_SIGN_UPS</SovereignBadge>
        </div>
        <div className="space-y-4">
          {[
            { user: "Sovereign_Alpha_44", time: "2s ago", action: "JUST_JOINED_THE_STATE" },
            { user: "Neural_Architect", time: "15s ago", action: "MINTED_1000_MNS" },
            { user: "Sky_Walker_88", time: "1m ago", action: "ACTIVATED_QUANTUM_VAULT" },
            { user: "Digital_Ghost", time: "3m ago", action: "WON_100_SKY_IN_PUZZLE" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 transition-all">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-black italic">{item.user}</h4>
                  <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">{item.action}</p>
                </div>
              </div>
              <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">{item.time}</span>
            </div>
          ))}
        </div>
      </SovereignCard>
    </div>
  );
}
