import React, { useState } from "react";

/**
 * Hope AI Voice Commands
 * Hands-free interaction with voice recognition and natural language processing
 */

export default function HopeAIVoiceCommands() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [selectedTab, setSelectedTab] = useState("commands");

  const voiceCommands = [
    {
      category: "Charity",
      commands: [
        { voice: "Hope, donate 100 coins to education", action: "Donate 100 SKY to Education Fund", result: "✓ Donated" },
        { voice: "Hope, show charity impact", action: "Display Charity Dashboard", result: "✓ Showing" },
        { voice: "Hope, what's my charity score?", action: "Get Charity Reputation", result: "Score: 850" },
        { voice: "Hope, create fundraiser for healthcare", action: "Launch Healthcare Campaign", result: "✓ Created" },
      ],
    },
    {
      category: "Trading",
      commands: [
        { voice: "Hope, buy 10 Skycoin at market price", action: "Execute Market Buy", result: "✓ Executed" },
        { voice: "Hope, show my portfolio", action: "Display Portfolio", result: "✓ Showing" },
        { voice: "Hope, set stop loss at 50 dollars", action: "Set Stop Loss", result: "✓ Set" },
        { voice: "Hope, what's the market sentiment?", action: "Analyze Market", result: "Bullish 72%" },
      ],
    },
    {
      category: "Gaming",
      commands: [
        { voice: "Hope, play blackjack with 50 coins", action: "Start Game", result: "✓ Started" },
        { voice: "Hope, spin the roulette wheel", action: "Spin Roulette", result: "Red 7 - Won 100!" },
        { voice: "Hope, show my game stats", action: "Display Stats", result: "✓ Showing" },
        { voice: "Hope, join the battle arena", action: "Enter Battle Arena", result: "✓ Joined" },
      ],
    },
    {
      category: "Social",
      commands: [
        { voice: "Hope, send 50 coins to Alex", action: "Transfer Coins", result: "✓ Sent" },
        { voice: "Hope, post on my social feed", action: "Create Post", result: "✓ Posted" },
        { voice: "Hope, show trending topics", action: "Display Trends", result: "✓ Showing" },
        { voice: "Hope, connect with Sarah", action: "Send Connection", result: "✓ Sent" },
      ],
    },
  ];

  const charityProtocol = {
    totalDonated: "$2,450,000",
    activeProjects: 12,
    beneficiaries: "45,000+",
    impact: "Lives Changed: 45,000+",
    campaigns: [
      { name: "Education Fund", raised: "$450,000", goal: "$500,000", progress: 90, beneficiaries: 8500 },
      { name: "Healthcare Initiative", raised: "$380,000", goal: "$400,000", progress: 95, beneficiaries: 12000 },
      { name: "Clean Water Project", raised: "$220,000", goal: "$300,000", progress: 73, beneficiaries: 15000 },
      { name: "Tech for All", raised: "$180,000", goal: "$250,000", progress: 72, beneficiaries: 9500 },
    ],
  };

  const handleVoiceCommand = () => {
    setIsListening(!isListening);
    if (isListening) {
      setTranscript("Hope, show my charity impact...");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🎤 Hope AI Voice Commands
        </h1>
        <p className="text-slate-400">Hands-free interaction with natural language processing</p>
      </div>

      {/* Voice Input */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-8 mb-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={handleVoiceCommand}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold transition-all ${
              isListening
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {isListening ? "⏹" : "🎤"}
          </button>
          <div className="flex-1">
            <div className="text-sm text-slate-400 mb-2">
              {isListening ? "Listening..." : "Click to speak"}
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4 min-h-12">
              <p className="text-lg font-semibold text-emerald-400">
                {transcript || "Say a command..."}
              </p>
            </div>
          </div>
        </div>

        {/* Suggested Commands */}
        <div className="grid grid-cols-4 gap-3">
          {[
            "Hope, show my balance",
            "Hope, donate 100 coins",
            "Hope, play blackjack",
            "Hope, send coins to Alex",
          ].map((cmd) => (
            <button
              key={cmd}
              onClick={() => setTranscript(cmd)}
              className="bg-slate-700/30 hover:bg-slate-600/30 border border-slate-600 rounded-lg p-2 text-xs font-semibold transition-all"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-700">
        {["commands", "charity"].map((tab) => (
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

      {/* Commands Tab */}
      {selectedTab === "commands" && (
        <div className="space-y-6">
          {voiceCommands.map((category) => (
            <div key={category.category}>
              <h2 className="text-lg font-bold mb-3 text-emerald-400">{category.category} Commands</h2>
              <div className="grid grid-cols-2 gap-3">
                {category.commands.map((cmd, idx) => (
                  <div key={idx} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                    <div className="text-sm font-semibold mb-2 text-cyan-400">"{cmd.voice}"</div>
                    <div className="text-xs text-slate-400 mb-2">{cmd.action}</div>
                    <div className="text-xs text-emerald-400 font-bold">{cmd.result}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charity Tab */}
      {selectedTab === "charity" && (
        <div className="space-y-6">
          {/* Charity Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Total Donated</div>
              <div className="text-2xl font-bold text-emerald-400">{charityProtocol.totalDonated}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Active Projects</div>
              <div className="text-2xl font-bold text-cyan-400">{charityProtocol.activeProjects}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Beneficiaries</div>
              <div className="text-2xl font-bold text-purple-400">{charityProtocol.beneficiaries}</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">Impact</div>
              <div className="text-lg font-bold text-orange-400">{charityProtocol.impact}</div>
            </div>
          </div>

          {/* Active Campaigns */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-emerald-400">Active Campaigns</h3>
            <div className="space-y-3">
              {charityProtocol.campaigns.map((campaign) => (
                <div key={campaign.name} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">{campaign.name}</h4>
                    <div className="text-sm text-emerald-400 font-semibold">{campaign.progress}%</div>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${campaign.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{campaign.raised} / {campaign.goal}</span>
                    <span>👥 {campaign.beneficiaries.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
