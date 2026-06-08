import React, { useState } from "react";
import { AI_AGENTS } from "../lib/ai-agents";

export default function AIAgentMarketplace() {
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"accuracy" | "speed" | "name">("accuracy");

  const specializations = Array.from(
    new Set(AI_AGENTS.flatMap((agent) => agent.specialization))
  );

  let filteredAgents = AI_AGENTS;
  if (selectedSpecialization) {
    filteredAgents = AI_AGENTS.filter((agent) =>
      agent.specialization.includes(selectedSpecialization)
    );
  }

  filteredAgents.sort((a, b) => {
    switch (sortBy) {
      case "accuracy":
        return b.accuracy - a.accuracy;
      case "speed":
        return a.responseTime - b.responseTime;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 sc-text-gradient-emerald">
            🛒 AI Agent Marketplace
          </h1>
          <p className="text-gray-400">Deploy, manage, and scale 12 autonomous AI agents</p>
        </div>

        {/* Filters */}
        <div className="sc-glass p-6 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Specialization Filter */}
            <div>
              <label className="sc-label block mb-3">Filter by Specialization</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSpecialization(null)}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    selectedSpecialization === null
                      ? "bg-emerald-500/30 border border-emerald-500 text-emerald-400"
                      : "bg-gray-900/30 border border-gray-700 text-gray-400 hover:border-emerald-500/50"
                  }`}
                >
                  All
                </button>
                {specializations.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialization(spec)}
                    className={`px-3 py-1 rounded text-sm transition-all ${
                      selectedSpecialization === spec
                        ? "bg-emerald-500/30 border border-emerald-500 text-emerald-400"
                        : "bg-gray-900/30 border border-gray-700 text-gray-400 hover:border-emerald-500/50"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="sc-label block mb-3">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="sc-input w-full"
              >
                <option value="accuracy">Highest Accuracy</option>
                <option value="speed">Fastest Response</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <div key={agent.id} className="sc-glass p-6 rounded-lg hover:border-emerald-500/50 transition-all">
              {/* Agent Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">{agent.icon}</span>
                    <div>
                      <h3 className="font-bold text-lg">{agent.name}</h3>
                      <p className="text-xs text-gray-400">{agent.role}</p>
                    </div>
                  </div>
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: agent.color + "20" }}
                >
                  {agent.icon}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 mb-4">{agent.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-900/30 p-2 rounded">
                  <p className="text-xs text-gray-400">Accuracy</p>
                  <p className="font-bold text-emerald-400">{agent.accuracy}%</p>
                </div>
                <div className="bg-gray-900/30 p-2 rounded">
                  <p className="text-xs text-gray-400">Response</p>
                  <p className="font-bold text-emerald-400">{agent.responseTime}ms</p>
                </div>
              </div>

              {/* Specializations */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Specializations:</p>
                <div className="flex flex-wrap gap-1">
                  {agent.specialization.slice(0, 3).map((spec, idx) => (
                    <span key={idx} className="sc-badge-emerald text-xs">
                      {spec}
                    </span>
                  ))}
                  {agent.specialization.length > 3 && (
                    <span className="text-xs text-gray-500">+{agent.specialization.length - 3}</span>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span className="text-sm text-emerald-400">{agent.status}</span>
                </div>
                <span className="text-xs text-gray-500">{agent.knowledgeBase}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="sc-btn-outline flex-1 text-sm">View Details</button>
                <button className="sc-btn-emerald flex-1 text-sm">Deploy</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 sc-glass p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Total Agents</p>
              <p className="text-3xl font-bold text-emerald-400">{AI_AGENTS.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-3xl font-bold text-emerald-400">
                {AI_AGENTS.filter((a) => a.status === "active").length}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg Accuracy</p>
              <p className="text-3xl font-bold text-emerald-400">
                {(AI_AGENTS.reduce((sum, a) => sum + a.accuracy, 0) / AI_AGENTS.length).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg Response</p>
              <p className="text-3xl font-bold text-emerald-400">
                {Math.round(AI_AGENTS.reduce((sum, a) => sum + a.responseTime, 0) / AI_AGENTS.length)}ms
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
