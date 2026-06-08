import React, { useState, useEffect } from "react";
import { swarmIntelligence } from "../lib/swarm-intelligence";
import { web3CryptoEngine } from "../lib/web3-crypto-engine";

export default function AI3DCommandCenter() {
  const [agents, setAgents] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [cryptoStats, setCryptoStats] = useState<any>(null);
  const [activeView, setActiveView] = useState("swarm");

  useEffect(() => {
    // Initialize swarm
    const initializedAgents = swarmIntelligence.initializeSwarm();
    setAgents(initializedAgents);

    // Get metrics
    const swarmMetrics = swarmIntelligence.getSwarmMetrics();
    setMetrics(swarmMetrics);

    // Get crypto stats
    const stats = web3CryptoEngine.getEngineStats();
    setCryptoStats(stats);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur border-b border-emerald-500/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold sc-text-gradient-emerald">🚀 AI Command Center v1111</h1>
            <p className="text-gray-400 text-sm">Swarm Intelligence • Web3 • Autonomous Evolution</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView("swarm")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeView === "swarm" ? "bg-emerald-900/50 border border-emerald-500" : "bg-gray-900/50 border border-gray-700"
              }`}
            >
              🤖 Swarm
            </button>
            <button
              onClick={() => setActiveView("crypto")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeView === "crypto" ? "bg-emerald-900/50 border border-emerald-500" : "bg-gray-900/50 border border-gray-700"
              }`}
            >
              💰 Crypto
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-8">
        {activeView === "swarm" && (
          <div className="max-w-7xl mx-auto px-4">
            {/* Swarm Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div className="sc-glass p-4 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">🤖 Total Agents</p>
                <p className="text-2xl font-bold text-emerald-400">{metrics?.totalAgents || 0}</p>
              </div>
              <div className="sc-glass p-4 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">⚡ Active</p>
                <p className="text-2xl font-bold text-blue-400">{metrics?.activeAgents || 0}</p>
              </div>
              <div className="sc-glass p-4 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">✅ Tasks Completed</p>
                <p className="text-2xl font-bold text-green-400">{metrics?.tasksCompleted || 0}</p>
              </div>
              <div className="sc-glass p-4 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">📊 Avg Efficiency</p>
                <p className="text-2xl font-bold text-purple-400">{(metrics?.avgEfficiency * 100).toFixed(0)}%</p>
              </div>
              <div className="sc-glass p-4 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">🧠 Collective IQ</p>
                <p className="text-2xl font-bold text-orange-400">{metrics?.collectiveIntelligence.toFixed(0)}</p>
              </div>
            </div>

            {/* Agent Grid */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">🤖 Agent Network</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    className={`sc-glass p-4 rounded-lg cursor-pointer transition-all hover:border-emerald-500 ${
                      selectedAgent === agent.id ? "border-emerald-500 bg-emerald-900/20" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-sm">{agent.name}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          agent.status === "active"
                            ? "bg-green-900/50 text-green-400"
                            : agent.status === "collaborating"
                            ? "bg-blue-900/50 text-blue-400"
                            : "bg-gray-900/50 text-gray-400"
                        }`}
                      >
                        {agent.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">{agent.specialization}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Capability</span>
                        <span className="font-bold text-emerald-400">{agent.capability.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Experience</span>
                        <span className="font-bold text-blue-400">{agent.experience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Performance</span>
                        <span className="font-bold text-purple-400">{(agent.performance * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Agent Details */}
            {selectedAgent && (
              <div className="sc-glass p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Agent Details: {agents.find((a) => a.id === selectedAgent)?.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {agents
                        .find((a) => a.id === selectedAgent)
                        ?.skills.map((skill: string) => (
                          <span key={skill} className="px-3 py-1 bg-emerald-900/30 border border-emerald-500/50 rounded-full text-xs">
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Last Task</h4>
                    <p className="text-gray-400">{agents.find((a) => a.id === selectedAgent)?.lastTask || "No tasks assigned yet"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === "crypto" && (
          <div className="max-w-7xl mx-auto px-4">
            {/* Crypto Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="sc-glass p-4 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">💳 Total Wallets</p>
                <p className="text-2xl font-bold text-emerald-400">{cryptoStats?.totalWallets || 0}</p>
              </div>
              <div className="sc-glass p-4 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">📊 Transactions</p>
                <p className="text-2xl font-bold text-blue-400">{cryptoStats?.totalTransactions || 0}</p>
              </div>
              <div className="sc-glass p-4 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">🎨 NFTs Minted</p>
                <p className="text-2xl font-bold text-purple-400">{cryptoStats?.totalNFTs || 0}</p>
              </div>
              <div className="sc-glass p-4 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">💰 TVL</p>
                <p className="text-2xl font-bold text-orange-400">${(cryptoStats?.totalValueLocked || 0).toFixed(0)}</p>
              </div>
            </div>

            {/* Token Info */}
            <div className="sc-glass p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">🪙 Skycoin4444 Tokenomics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-400 mb-2">Total Supply</p>
                  <p className="text-3xl font-bold text-emerald-400">{(cryptoStats?.tokenSupply.skycoin / 1e9).toFixed(1)}B</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-2">Current Price</p>
                  <p className="text-3xl font-bold text-blue-400">${cryptoStats?.tokenPrices.skycoin}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-2">Market Cap</p>
                  <p className="text-3xl font-bold text-purple-400">
                    ${((cryptoStats?.tokenSupply.skycoin || 0) * (cryptoStats?.tokenPrices.skycoin || 0) / 1e9).toFixed(1)}B
                  </p>
                </div>
              </div>
            </div>

            {/* DeFi Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="sc-glass p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">🏊 Liquidity Pools</h3>
                <p className="text-gray-400 mb-4">Active pools: {cryptoStats?.liquidityPools || 0}</p>
                <button className="sc-btn-emerald w-full">Create Pool</button>
              </div>
              <div className="sc-glass p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">🗳️ Governance</h3>
                <p className="text-gray-400 mb-4">Active proposals: {cryptoStats?.proposals || 0}</p>
                <button className="sc-btn-emerald w-full">Vote Now</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur border-t border-emerald-500/20 p-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>
            ShadowChat v1111 • Swarm Intelligence • Web3 Integration • Real-Time Analytics • Autonomous Evolution
          </p>
        </div>
      </div>
    </div>
  );
}
