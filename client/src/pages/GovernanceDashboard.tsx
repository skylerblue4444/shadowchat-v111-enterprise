import React, { useState } from "react";

/**
 * Governance Dashboard
 * Decentralized platform decision-making and voting
 */

export default function GovernanceDashboard() {
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState("active");

  const proposals = [
    {
      id: 1,
      title: "Increase Staking APY to 50%",
      description: "Proposal to increase staking rewards from 45% to 50% APY",
      type: "Parameters",
      status: "Active",
      votesFor: 8450,
      votesAgainst: 1200,
      votesAbstain: 340,
      deadline: "2 days left",
      progress: 87.5,
      impact: "High",
    },
    {
      id: 2,
      title: "Launch AI Marketplace 2.0",
      description: "Deploy the next generation of the AI Marketplace with new features",
      type: "Features",
      status: "Active",
      votesFor: 6780,
      votesAgainst: 890,
      votesAbstain: 230,
      deadline: "5 days left",
      progress: 88.4,
      impact: "Critical",
    },
    {
      id: 3,
      title: "Allocate $500K to Charity Fund",
      description: "Budget allocation for Q2 2026 charity initiatives",
      type: "Budget",
      status: "Active",
      votesFor: 5600,
      votesAgainst: 2100,
      votesAbstain: 450,
      deadline: "3 days left",
      progress: 72.7,
      impact: "High",
    },
    {
      id: 4,
      title: "Implement Emergency Pause Protocol",
      description: "Add emergency pause functionality for security incidents",
      type: "Governance",
      status: "Passed",
      votesFor: 9200,
      votesAgainst: 450,
      votesAbstain: 150,
      deadline: "Passed",
      progress: 95.3,
      impact: "Critical",
    },
  ];

  const treasuryStats = {
    totalFunds: "$45,000,000",
    allocated: "$12,500,000",
    available: "$32,500,000",
    monthlyBudget: "$2,500,000",
  };

  const governanceStats = {
    totalProposals: 127,
    passedProposals: 98,
    failedProposals: 12,
    activeProposals: 3,
    totalVoters: 45000,
    avgParticipation: "68%",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🏛️ Governance Dashboard
        </h1>
        <p className="text-slate-400">Decentralized platform decision-making and voting</p>
      </div>

      {/* Treasury Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Total Treasury</div>
          <div className="text-2xl font-bold text-emerald-400">{treasuryStats.totalFunds}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Allocated</div>
          <div className="text-2xl font-bold text-cyan-400">{treasuryStats.allocated}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Available</div>
          <div className="text-2xl font-bold text-purple-400">{treasuryStats.available}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Monthly Budget</div>
          <div className="text-2xl font-bold text-orange-400">{treasuryStats.monthlyBudget}</div>
        </div>
      </div>

      {/* Governance Stats */}
      <div className="grid grid-cols-6 gap-3 mb-8">
        {[
          { label: "Total Proposals", value: governanceStats.totalProposals, color: "emerald" },
          { label: "Passed", value: governanceStats.passedProposals, color: "green" },
          { label: "Failed", value: governanceStats.failedProposals, color: "red" },
          { label: "Active", value: governanceStats.activeProposals, color: "yellow" },
          { label: "Total Voters", value: `${(governanceStats.totalVoters / 1000).toFixed(0)}K`, color: "cyan" },
          { label: "Participation", value: governanceStats.avgParticipation, color: "purple" },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">{stat.label}</div>
            <div className={`text-xl font-bold text-${stat.color}-400`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-700">
        {["active", "passed", "failed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-3 font-semibold border-b-2 transition-all ${
              selectedTab === tab
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Proposals
          </button>
        ))}
      </div>

      {/* Proposals */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <h2 className="text-lg font-bold mb-4 text-emerald-400">
            {selectedTab === "active" && "Active Proposals"}
            {selectedTab === "passed" && "Passed Proposals"}
            {selectedTab === "failed" && "Failed Proposals"}
          </h2>
          <div className="space-y-3">
            {proposals
              .filter((p) => {
                if (selectedTab === "active") return p.status === "Active";
                if (selectedTab === "passed") return p.status === "Passed";
                return p.status === "Failed";
              })
              .map((proposal) => (
                <div
                  key={proposal.id}
                  onClick={() => setSelectedProposal(proposal.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedProposal === proposal.id
                      ? "bg-emerald-500/20 border-emerald-400"
                      : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold">{proposal.title}</h3>
                    <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                      proposal.status === "Active" ? "bg-yellow-500/20 text-yellow-400" :
                      proposal.status === "Passed" ? "bg-green-500/20 text-green-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {proposal.status}
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{proposal.description}</p>
                  <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${proposal.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-400">
                    <span>✓ {proposal.votesFor.toLocaleString()} For</span>
                    <span>✗ {proposal.votesAgainst.toLocaleString()} Against</span>
                    <span>~ {proposal.votesAbstain} Abstain</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Proposal Details */}
        <div className="col-span-1">
          {selectedProposal !== null && (
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 sticky top-6">
              {(() => {
                const proposal = proposals.find(p => p.id === selectedProposal);
                return (
                  <>
                    <h3 className="font-bold text-lg mb-4 text-emerald-400">{proposal?.title}</h3>
                    <div className="space-y-3 text-sm mb-4">
                      <div>
                        <div className="text-slate-400 mb-1">Type</div>
                        <div className="font-semibold">{proposal?.type}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 mb-1">Impact</div>
                        <div className={`font-semibold ${
                          proposal?.impact === "Critical" ? "text-red-400" : "text-orange-400"
                        }`}>
                          {proposal?.impact}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 mb-1">Deadline</div>
                        <div className="font-semibold text-emerald-400">{proposal?.deadline}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 mb-1">Approval Rate</div>
                        <div className="font-semibold text-cyan-400">{proposal?.progress.toFixed(1)}%</div>
                      </div>
                    </div>
                    {proposal?.status === "Active" && (
                      <div className="space-y-2">
                        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-bold text-sm transition-all">
                          Vote For
                        </button>
                        <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-bold text-sm transition-all">
                          Vote Against
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {selectedProposal === null && (
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 text-center">
              <p className="text-slate-400">Select a proposal to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
