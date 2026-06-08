import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Bot, Zap, Shield, TrendingUp, 
  Settings, Activity, MessageSquare, Play
} from "lucide-react";
import { useNeuralCore } from "@/lib/neural-core-sync";
import { SovereignCard, SovereignBadge, SovereignButton, SovereignHeading } from "@/components/SovereignUI";

/**
 * Autonomous Sovereign Agent (ASA) Hub
 * Management of background AI agents and automation
 */

export default function AutonomousAgentHub() {
  const { isAgentAutomationActive, addActivity } = useNeuralCore();
  const [activeTask, setActiveTask] = useState<string | null>(null);

  const agents = [
    { name: "Economic_Overseer", role: "Market Arbitrage", status: "Active", icon: TrendingUp },
    { name: "Security_Sentinel", role: "Threat Interception", status: "Active", icon: Shield },
    { name: "Resource_Drill_AI", role: "Auto-Extraction", status: "Idle", icon: Zap },
    { name: "Social_Ambassador", role: "Reputation Management", status: "Active", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <SovereignHeading 
        title="Autonomous Agents" 
        subtitle="Background AI Automation // Sovereign Task Management // Neural Companion" 
        accent="cyan"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Agent Overview */}
        <div className="lg:col-span-4 space-y-6">
          <SovereignCard glowColor="cyan">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <div className="text-[9px] text-white/30 font-black uppercase tracking-widest">Automation Engine</div>
                <div className="text-xl font-black italic">{isAgentAutomationActive ? 'OPERATIONAL' : 'OFFLINE'}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">Active Agents</span>
                <span className="text-sm font-black italic text-cyan-400">4 / 12</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/50 font-black uppercase tracking-widest">Daily Efficiency</span>
                <span className="text-sm font-black italic text-cyan-400">99.8%</span>
              </div>
            </div>
          </SovereignButton>
        </div>

        {/* Agent List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agents.map((agent, i) => (
              <SovereignCard key={i} glowColor="cyan" className="group">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                    <agent.icon className="w-6 h-6 text-white/30 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <SovereignBadge type={agent.status === 'Active' ? 'emerald' : 'slate'}>{agent.status}</SovereignBadge>
                </div>
                <h4 className="text-lg font-black uppercase italic mb-1">{agent.name}</h4>
                <div className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-6">Role: {agent.role}</div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(j => (
                      <div key={j} className={`w-1 h-3 rounded-full ${j <= 4 ? 'bg-cyan-500' : 'bg-white/10'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Logic Load: 84%</span>
                </div>
                <SovereignButton variant="outline" className="w-full py-4 text-[9px] font-black tracking-widest flex items-center justify-center gap-2">
                  <Settings className="w-3 h-3" /> CONFIGURE AGENT
                </SovereignButton>
              </SovereignCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
