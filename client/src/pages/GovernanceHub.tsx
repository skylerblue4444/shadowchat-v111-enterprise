import React, { useState } from "react";

export default function GovernanceHub() {
  const [selectedProposal, setSelectedProposal] = useState(0);

  const proposals = [
    {
      id: 1,
      title: "Increase AI Agent Deployment Limit",
      status: "active",
      votes: { yes: 7234, no: 1456 },
      votingEnds: "2026-06-15",
      description: "Proposal to increase the maximum number of deployable AI agents from 12 to 50",
    },
    {
      id: 2,
      title: "Implement Dynamic Fee Structure",
      status: "active",
      votes: { yes: 5678, no: 2345 },
      votingEnds: "2026-06-18",
      description: "Adjust transaction fees based on network congestion",
    },
    {
      id: 3,
      title: "Launch Community Treasury",
      status: "passed",
      votes: { yes: 8901, no: 234 },
      votingEnds: "2026-06-10",
      description: "Allocate 5% of platform revenue to community-driven initiatives",
    },
  ];

  const currentProposal = proposals[selectedProposal];
  const totalVotes = currentProposal.votes.yes + currentProposal.votes.no;
  const yesPercentage = (currentProposal.votes.yes / totalVotes) * 100;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 sc-text-gradient-emerald">
            ⚖️ Governance Hub
          </h1>
          <p className="text-gray-400">Decentralized governance and community voting</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Proposals List */}
          <div className="lg:col-span-1">
            <div className="sc-glass p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Active Proposals</h2>
              <div className="space-y-2">
                {proposals.map((proposal, idx) => (
                  <button
                    key={proposal.id}
                    onClick={() => setSelectedProposal(idx)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedProposal === idx
                        ? "bg-emerald-900/30 border border-emerald-500"
                        : "bg-gray-900/20 border border-gray-700 hover:border-emerald-500/50"
                    }`}
                  >
                    <p className="font-semibold text-sm line-clamp-2">{proposal.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          proposal.status === "active"
                            ? "bg-blue-900/30 text-blue-400"
                            : "bg-emerald-900/30 text-emerald-400"
                        }`}
                      >
                        {proposal.status}
                      </span>
                      <span className="text-xs text-gray-500">{proposal.votes.yes + proposal.votes.no} votes</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Proposal Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Proposal Info */}
            <div className="sc-glass p-8 rounded-lg">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{currentProposal.title}</h2>
                <p className="text-gray-400 mb-4">{currentProposal.description}</p>
                <div className="flex gap-4">
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      currentProposal.status === "active"
                        ? "bg-blue-900/30 text-blue-400"
                        : "bg-emerald-900/30 text-emerald-400"
                    }`}
                  >
                    {currentProposal.status}
                  </span>
                  <span className="text-gray-400 text-sm">
                    Voting ends: {currentProposal.votingEnds}
                  </span>
                </div>
              </div>

              {/* Voting Results */}
              <div>
                <h3 className="font-bold mb-4">Voting Results</h3>
                <div className="space-y-4">
                  {/* Yes Votes */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Yes</span>
                      <span className="text-sm font-bold text-emerald-400">{yesPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-900/30 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{ width: `${yesPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{currentProposal.votes.yes.toLocaleString()} votes</p>
                  </div>

                  {/* No Votes */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">No</span>
                      <span className="text-sm font-bold text-red-400">{(100 - yesPercentage).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-900/30 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-red-500 h-full transition-all"
                        style={{ width: `${100 - yesPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{currentProposal.votes.no.toLocaleString()} votes</p>
                  </div>
                </div>

                {/* Total Votes */}
                <div className="mt-6 p-4 bg-gray-900/30 rounded">
                  <p className="text-gray-400 text-sm">Total Votes</p>
                  <p className="text-2xl font-bold text-emerald-400">{totalVotes.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Voting Action */}
            {currentProposal.status === "active" && (
              <div className="sc-glass p-6 rounded-lg">
                <h3 className="font-bold mb-4">Cast Your Vote</h3>
                <div className="flex gap-4">
                  <button className="sc-btn-emerald flex-1">Vote Yes</button>
                  <button className="sc-btn-outline flex-1">Vote No</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Governance Stats */}
        <div className="mt-8 sc-glass p-6 rounded-lg">
          <h3 className="font-bold mb-6">Governance Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-900/30 p-4 rounded">
              <p className="text-gray-400 text-sm">Total Proposals</p>
              <p className="text-3xl font-bold text-emerald-400">247</p>
            </div>
            <div className="bg-gray-900/30 p-4 rounded">
              <p className="text-gray-400 text-sm">Passed</p>
              <p className="text-3xl font-bold text-emerald-400">198</p>
            </div>
            <div className="bg-gray-900/30 p-4 rounded">
              <p className="text-gray-400 text-sm">Active Voters</p>
              <p className="text-3xl font-bold text-emerald-400">12.4K</p>
            </div>
            <div className="bg-gray-900/30 p-4 rounded">
              <p className="text-gray-400 text-sm">Avg Participation</p>
              <p className="text-3xl font-bold text-emerald-400">67.8%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
