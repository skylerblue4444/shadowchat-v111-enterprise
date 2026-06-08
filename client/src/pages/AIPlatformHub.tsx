import React, { useState } from "react";
import { AI_AGENTS, AIOrchestrator, AgentTask } from "../lib/ai-agents";

export default function AIPlatformHub() {
  const [selectedAgent, setSelectedAgent] = useState(AI_AGENTS[0]);
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const orchestrator = new AIOrchestrator();

  const handleSubmitTask = async () => {
    if (!taskInput.trim()) return;

    const newTask = await orchestrator.submitTask({
      agentId: selectedAgent.id,
      title: taskInput,
      description: `Task submitted to ${selectedAgent.name}`,
      status: "processing",
      priority: "medium",
    });

    setTasks([...tasks, newTask]);
    setTaskInput("");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 sc-text-gradient-emerald">
            🤖 Hope AI Platform Hub
          </h1>
          <p className="text-gray-400">12 Autonomous AI Agents • Enterprise-Grade Intelligence</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent List */}
          <div className="lg:col-span-1">
            <div className="sc-glass p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Available Agents</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {AI_AGENTS.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedAgent.id === agent.id
                        ? "bg-emerald-900/30 border border-emerald-500"
                        : "bg-gray-900/20 border border-gray-700 hover:border-emerald-500/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{agent.icon}</span>
                      <div>
                        <p className="font-semibold text-sm">{agent.name}</p>
                        <p className="text-xs text-gray-400">{agent.role}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-emerald-400">{agent.accuracy}% Accuracy</span>
                      <span className="text-gray-500">{agent.responseTime}ms</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Agent Details & Task Submission */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agent Profile */}
            <div className="sc-glass p-8 rounded-lg">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {selectedAgent.icon} {selectedAgent.name}
                  </h2>
                  <p className="text-gray-400 mb-4">{selectedAgent.description}</p>
                  <div className="flex gap-2 mb-4">
                    <span className="sc-badge-emerald">{selectedAgent.role}</span>
                    <span className="sc-badge-emerald">{selectedAgent.status}</span>
                  </div>
                </div>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-4xl"
                  style={{ backgroundColor: selectedAgent.color + "20" }}
                >
                  {selectedAgent.icon}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="sc-stat-card">
                  <p className="text-gray-400 text-sm">Accuracy</p>
                  <p className="text-2xl font-bold text-emerald-400">{selectedAgent.accuracy}%</p>
                </div>
                <div className="sc-stat-card">
                  <p className="text-gray-400 text-sm">Response Time</p>
                  <p className="text-2xl font-bold text-emerald-400">{selectedAgent.responseTime}ms</p>
                </div>
                <div className="sc-stat-card">
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {selectedAgent.status === "active" ? "🟢" : "🟡"} Active
                  </p>
                </div>
              </div>

              {/* Capabilities */}
              <div>
                <h3 className="font-semibold mb-3">Capabilities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedAgent.capabilities.map((cap, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <span className="text-emerald-400">✓</span>
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Task Submission */}
            <div className="sc-glass p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Submit Task</h3>
              <div className="space-y-4">
                <textarea
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="Describe the task for this agent..."
                  className="sc-input w-full h-24 resize-none"
                />
                <button
                  onClick={handleSubmitTask}
                  className="sc-btn-emerald w-full"
                >
                  Submit Task to {selectedAgent.name}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        {tasks.length > 0 && (
          <div className="mt-8 sc-glass p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Task Queue</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {tasks.map((task) => (
                <div key={task.id} className="bg-gray-900/30 p-3 rounded-lg text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{task.title}</p>
                      <p className="text-gray-400 text-xs">
                        {AI_AGENTS.find((a) => a.id === task.agentId)?.name}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        task.status === "completed"
                          ? "bg-emerald-900/30 text-emerald-400"
                          : "bg-blue-900/30 text-blue-400"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
