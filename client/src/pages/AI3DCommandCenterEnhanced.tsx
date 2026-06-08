import React, { useState, useEffect } from "react";

/**
 * AI 3D Command Center Enhanced
 * Immersive visualization of the swarm intelligence with real-time metrics
 */

export default function AI3DCommandCenterEnhanced() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [swarmMetrics, setSwarmMetrics] = useState({
    activeAgents: 12,
    tasksProcessing: 247,
    efficiency: 94.2,
    responseTime: 45,
    errorRate: 0.3,
  });

  const agents = [
    { id: "architect", name: "Architect", role: "System Design", status: "active", tasks: 23 },
    { id: "analyst", name: "Analyst", role: "Data Analysis", status: "active", tasks: 31 },
    { id: "optimizer", name: "Optimizer", role: "Performance", status: "active", tasks: 18 },
    { id: "guardian", name: "Guardian", role: "Security", status: "active", tasks: 15 },
    { id: "healer", name: "Healer", role: "Bug Fixes", status: "active", tasks: 22 },
    { id: "innovator", name: "Innovator", role: "Features", status: "active", tasks: 19 },
    { id: "orchestrator", name: "Orchestrator", role: "Coordination", status: "active", tasks: 28 },
    { id: "sage", name: "Sage", role: "Knowledge", status: "active", tasks: 14 },
    { id: "sentinel", name: "Sentinel", role: "Monitoring", status: "active", tasks: 25 },
    { id: "alchemist", name: "Alchemist", role: "Transformation", status: "active", tasks: 20 },
    { id: "navigator", name: "Navigator", role: "Routing", status: "active", tasks: 16 },
    { id: "catalyst", name: "Catalyst", role: "Growth", status: "active", tasks: 17 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSwarmMetrics((prev) => ({
        ...prev,
        tasksProcessing: Math.max(200, prev.tasksProcessing + Math.random() * 50 - 25),
        efficiency: Math.min(99.9, Math.max(85, prev.efficiency + (Math.random() - 0.5) * 2)),
        responseTime: Math.max(30, prev.responseTime + Math.random() * 20 - 10),
        errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 0.5)),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🤖 AI Swarm Command Center
        </h1>
        <p className="text-slate-400">Real-time monitoring of 12 autonomous agents</p>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-slate-800/50 backdrop-blur border border-emerald-500/30 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Active Agents</div>
          <div className="text-3xl font-bold text-emerald-400">{swarmMetrics.activeAgents}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-cyan-500/30 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Tasks Processing</div>
          <div className="text-3xl font-bold text-cyan-400">{swarmMetrics.tasksProcessing.toFixed(0)}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Efficiency</div>
          <div className="text-3xl font-bold text-purple-400">{swarmMetrics.efficiency.toFixed(1)}%</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-orange-500/30 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Response Time</div>
          <div className="text-3xl font-bold text-orange-400">{swarmMetrics.responseTime.toFixed(0)}ms</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-red-500/30 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Error Rate</div>
          <div className="text-3xl font-bold text-red-400">{swarmMetrics.errorRate.toFixed(2)}%</div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {agents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => setSelectedAgent(agent.id)}
            className={`cursor-pointer p-4 rounded-lg border transition-all duration-300 ${
              selectedAgent === agent.id
                ? "bg-emerald-500/20 border-emerald-400 shadow-lg shadow-emerald-500/50"
                : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/50"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-sm">{agent.name}</div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs text-slate-400 mb-2">{agent.role}</div>
            <div className="text-lg font-bold text-emerald-400">{agent.tasks} tasks</div>
          </div>
        ))}
      </div>

      {/* Selected Agent Details */}
      {selectedAgent && (
        <div className="bg-slate-800/50 backdrop-blur border border-emerald-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            {agents.find((a) => a.id === selectedAgent)?.name} Details
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-slate-400 mb-2">Current Status</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-lg font-semibold">Active</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-2">Tasks Completed</div>
              <div className="text-2xl font-bold text-emerald-400">
                {agents.find((a) => a.id === selectedAgent)?.tasks || 0}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-2">Performance</div>
              <div className="text-2xl font-bold text-cyan-400">98.5%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
