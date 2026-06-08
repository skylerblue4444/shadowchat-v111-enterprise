import React, { useState } from "react";

/**
 * Legacy Charity Model
 * Direct peer-to-peer giving and autonomous impact tracking
 */

export default function LegacyCharityModel() {
  const [selectedCause, setSelectedCause] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState("causes");

  const causes = [
    {
      id: 1,
      name: "Education for All",
      description: "Direct funding for student scholarships and school supplies",
      category: "Education",
      raised: "$2,450,000",
      goal: "$3,000,000",
      progress: 81.7,
      donors: 12500,
      beneficiaries: 8500,
      impact: "Students Educated",
      status: "Active",
    },
    {
      id: 2,
      name: "Clean Water Initiative",
      description: "Build wells and water systems in underserved communities",
      category: "Health",
      raised: "$1,890,000",
      goal: "$2,500,000",
      progress: 75.6,
      donors: 9800,
      beneficiaries: 45000,
      impact: "People with Clean Water",
      status: "Active",
    },
    {
      id: 3,
      name: "Healthcare Access",
      description: "Provide medical care and supplies to remote areas",
      category: "Healthcare",
      raised: "$3,200,000",
      goal: "$4,000,000",
      progress: 80,
      donors: 15600,
      beneficiaries: 32000,
      impact: "Lives Saved",
      status: "Active",
    },
    {
      id: 4,
      name: "Tech for Underserved",
      description: "Distribute computers and internet access to students",
      category: "Technology",
      raised: "$1,450,000",
      goal: "$2,000,000",
      progress: 72.5,
      donors: 8900,
      beneficiaries: 12500,
      impact: "Students Connected",
      status: "Active",
    },
  ];

  const directDonors = [
    { name: "Alice Chen", amount: "50,000 SKY", date: "2 hours ago", cause: "Education for All", impact: "50 students" },
    { name: "Marcus Johnson", amount: "100,000 SKY", date: "4 hours ago", cause: "Healthcare Access", impact: "200 lives" },
    { name: "Sarah Williams", amount: "75,000 SKY", date: "1 day ago", cause: "Clean Water Initiative", impact: "5,000 people" },
    { name: "James Lee", amount: "60,000 SKY", date: "2 days ago", cause: "Tech for Underserved", impact: "100 students" },
  ];

  const impactTracking = {
    totalDonated: "$8,990,000",
    totalBeneficiaries: "98,000+",
    averageDonation: "12,500 SKY",
    donorsActive: 47000,
    causesActive: 4,
    impactScore: 9.8,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          ❤️ Legacy Charity Model
        </h1>
        <p className="text-slate-400">Direct peer-to-peer giving with autonomous impact tracking</p>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-6 gap-3 mb-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Total Donated</div>
          <div className="text-lg font-bold text-emerald-400">{impactTracking.totalDonated}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Beneficiaries</div>
          <div className="text-lg font-bold text-cyan-400">{impactTracking.totalBeneficiaries}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Avg Donation</div>
          <div className="text-lg font-bold text-purple-400">{impactTracking.averageDonation}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Active Donors</div>
          <div className="text-lg font-bold text-orange-400">{(impactTracking.donorsActive / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Active Causes</div>
          <div className="text-lg font-bold text-green-400">{impactTracking.causesActive}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Impact Score</div>
          <div className="text-lg font-bold text-red-400">⭐ {impactTracking.impactScore}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-700">
        {["causes", "donors", "tracking"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-3 font-semibold border-b-2 transition-all ${
              selectedTab === tab
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Causes Tab */}
      {selectedTab === "causes" && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-lg font-bold mb-4 text-emerald-400">Active Causes</h2>
            <div className="space-y-3">
              {causes.map((cause) => (
                <div
                  key={cause.id}
                  onClick={() => setSelectedCause(cause.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedCause === cause.id
                      ? "bg-emerald-500/20 border-emerald-400"
                      : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold">{cause.name}</h3>
                    <div className="px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400">
                      {cause.status}
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{cause.description}</p>
                  <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${cause.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-400">
                    <span>💰 {cause.raised} / {cause.goal}</span>
                    <span>👥 {cause.donors.toLocaleString()} donors</span>
                    <span>🎯 {cause.beneficiaries.toLocaleString()} beneficiaries</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cause Details */}
          <div className="col-span-1">
            {selectedCause !== null && (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 sticky top-6">
                {(() => {
                  const cause = causes.find(c => c.id === selectedCause);
                  return (
                    <>
                      <h3 className="font-bold text-lg mb-4 text-emerald-400">{cause?.name}</h3>
                      <div className="space-y-3 text-sm mb-4">
                        <div>
                          <div className="text-slate-400 mb-1">Category</div>
                          <div className="font-semibold">{cause?.category}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Progress</div>
                          <div className="font-semibold text-emerald-400">{cause?.progress.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Impact</div>
                          <div className="font-semibold text-cyan-400">{cause?.beneficiaries.toLocaleString()} {cause?.impact}</div>
                        </div>
                      </div>
                      <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-bold transition-all">
                        Donate Now
                      </button>
                    </>
                  );
                })()}
              </div>
            )}

            {selectedCause === null && (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 text-center">
                <p className="text-slate-400">Select a cause to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Donors Tab */}
      {selectedTab === "donors" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Recent Direct Donations</h2>
          <div className="space-y-3">
            {directDonors.map((donor, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold">{donor.name}</h3>
                  <div className="text-emerald-400 font-bold">{donor.amount}</div>
                </div>
                <p className="text-sm text-slate-400 mb-2">→ {donor.cause}</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{donor.date}</span>
                  <span className="text-green-400 font-bold">✓ {donor.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tracking Tab */}
      {selectedTab === "tracking" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Autonomous Impact Tracking</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { metric: "Real-Time Tracking", value: "✓ Enabled", color: "green" },
              { metric: "Beneficiary Verification", value: "98% Verified", color: "emerald" },
              { metric: "Fund Allocation", value: "100% Transparent", color: "cyan" },
              { metric: "Impact Reports", value: "Weekly Updates", color: "purple" },
              { metric: "Donor Feedback", value: "4.9★ Avg Rating", color: "orange" },
              { metric: "Fraud Detection", value: "AI-Powered", color: "red" },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-2">{item.metric}</div>
                <div className={`text-lg font-bold text-${item.color}-400`}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
