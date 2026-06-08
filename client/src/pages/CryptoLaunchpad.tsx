import React, { useState } from "react";

/**
 * Crypto Launchpad & Incubator
 * Launch new projects and tokens on the ShadowChat platform
 */

export default function CryptoLaunchpad() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [investAmount, setInvestAmount] = useState(1000);

  const launchProjects = [
    {
      id: 1,
      name: "AI Token (AITI)",
      status: "Upcoming",
      launchDate: "2026-02-15",
      targetRaise: "5M USD",
      raised: "2.3M USD",
      progress: 46,
      description: "Revolutionary AI-powered token for autonomous systems",
      team: "5 members",
      minInvest: 100,
      maxInvest: 50000,
      tokenPrice: "$0.50",
      investors: 2345,
    },
    {
      id: 2,
      name: "DeFi Protocol (DEFI)",
      status: "Active",
      launchDate: "2026-01-20",
      targetRaise: "10M USD",
      raised: "8.7M USD",
      progress: 87,
      description: "Next-generation decentralized finance protocol",
      team: "8 members",
      minInvest: 50,
      maxInvest: 100000,
      tokenPrice: "$1.25",
      investors: 5678,
    },
    {
      id: 3,
      name: "Web3 Gaming (WG3)",
      status: "Upcoming",
      launchDate: "2026-03-10",
      targetRaise: "3M USD",
      raised: "1.2M USD",
      progress: 40,
      description: "Immersive Web3 gaming platform with AI NPCs",
      team: "6 members",
      minInvest: 100,
      maxInvest: 25000,
      tokenPrice: "$0.75",
      investors: 1234,
    },
  ];

  const successfulProjects = [
    { name: "Hope AI Token", raised: "12.5M USD", roi: "+340%", investors: 8934 },
    { name: "Skycoin Classic", raised: "8.2M USD", roi: "+520%", investors: 5621 },
    { name: "DeFi Swap", raised: "6.8M USD", roi: "+280%", investors: 4123 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🚀 Crypto Launchpad & Incubator
        </h1>
        <p className="text-slate-400">Launch and invest in groundbreaking crypto projects</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Projects */}
        <div className="col-span-2">
          <h2 className="text-xl font-bold mb-4 text-emerald-400">Active & Upcoming Projects</h2>
          <div className="space-y-4">
            {launchProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedProject === project.id
                    ? "bg-emerald-500/20 border-emerald-400"
                    : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{project.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{project.description}</p>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded text-xs font-bold ${
                      project.status === "Active" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"
                    }`}>
                      {project.status}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Raised: {project.raised}</span>
                    <span>Target: {project.targetRaise}</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <div className="text-slate-400">Token Price</div>
                    <div className="font-bold text-emerald-400">{project.tokenPrice}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Launch</div>
                    <div className="font-bold">{project.launchDate}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Team</div>
                    <div className="font-bold">{project.team}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Investors</div>
                    <div className="font-bold text-cyan-400">{project.investors.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Panel */}
        <div className="col-span-1">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 sticky top-6">
            <h3 className="text-lg font-bold mb-4 text-emerald-400">Invest</h3>

            {selectedProject !== null && (
              <>
                <div className="mb-4">
                  <div className="text-sm text-slate-400 mb-2">Project</div>
                  <div className="bg-slate-700/50 p-3 rounded">
                    <div className="font-bold">{launchProjects[selectedProject - 1].name}</div>
                    <div className="text-xs text-slate-400 mt-1">{launchProjects[selectedProject - 1].tokenPrice}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-sm text-slate-400 mb-2 block">Investment Amount (USD)</label>
                  <input
                    type="number"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(parseInt(e.target.value) || 0)}
                    min={launchProjects[selectedProject - 1].minInvest}
                    max={launchProjects[selectedProject - 1].maxInvest}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  />
                  <div className="text-xs text-slate-400 mt-1">
                    Min: ${launchProjects[selectedProject - 1].minInvest} | Max: ${launchProjects[selectedProject - 1].maxInvest}
                  </div>
                </div>

                <div className="mb-4 p-3 bg-slate-700/30 rounded text-sm">
                  <div className="text-slate-400 mb-1">Tokens You'll Receive</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {(investAmount / parseFloat(launchProjects[selectedProject - 1].tokenPrice.slice(1))).toFixed(0)} tokens
                  </div>
                </div>

                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-bold transition-all">
                  Invest Now
                </button>
              </>
            )}

            {selectedProject === null && (
              <div className="text-slate-400 text-sm">Select a project to invest</div>
            )}
          </div>
        </div>
      </div>

      {/* Successful Projects */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4 text-emerald-400">Successful Past Projects</h2>
        <div className="grid grid-cols-3 gap-4">
          {successfulProjects.map((project) => (
            <div key={project.name} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
              <h3 className="font-bold mb-3">{project.name}</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <div className="text-slate-400 mb-1">Total Raised</div>
                  <div className="font-bold text-emerald-400">{project.raised}</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">ROI</div>
                  <div className="font-bold text-green-400">{project.roi}</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">Investors</div>
                  <div className="font-bold">{project.investors.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
