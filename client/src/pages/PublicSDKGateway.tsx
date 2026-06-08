import React, { useState } from "react";

/**
 * Public SDK & API Gateway
 * Third-party developer integration and API management
 */

export default function PublicSDKGateway() {
  const [selectedAPI, setSelectedAPI] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState("apis");
  const [copiedKey, setCopiedKey] = useState(false);

  const apis = [
    {
      id: 1,
      name: "Trading API",
      description: "Execute trades, manage portfolios, and analyze markets",
      endpoints: 12,
      rateLimit: "1000 req/min",
      status: "Production",
      version: "v2.1.0",
      calls: "2.3M/month",
      documentation: "https://docs.shadowchat.io/trading",
    },
    {
      id: 2,
      name: "Charity API",
      description: "Create campaigns, track donations, and manage impact",
      endpoints: 8,
      rateLimit: "500 req/min",
      status: "Production",
      version: "v1.5.0",
      calls: "890K/month",
      documentation: "https://docs.shadowchat.io/charity",
    },
    {
      id: 3,
      name: "Social API",
      description: "Post, comment, follow, and manage social interactions",
      endpoints: 15,
      rateLimit: "2000 req/min",
      status: "Production",
      version: "v3.0.0",
      calls: "5.6M/month",
      documentation: "https://docs.shadowchat.io/social",
    },
    {
      id: 4,
      name: "Gaming API",
      description: "Integrate games, track scores, and manage tournaments",
      endpoints: 10,
      rateLimit: "1500 req/min",
      status: "Beta",
      version: "v1.0.0-beta",
      calls: "450K/month",
      documentation: "https://docs.shadowchat.io/gaming",
    },
  ];

  const sdkLibraries = [
    { name: "JavaScript/TypeScript", language: "npm install @shadowchat/sdk", downloads: "245K/month" },
    { name: "Python", language: "pip install shadowchat-sdk", downloads: "189K/month" },
    { name: "Go", language: "go get github.com/shadowchat/sdk-go", downloads: "156K/month" },
    { name: "Java", language: "maven central: com.shadowchat:sdk", downloads: "134K/month" },
    { name: "Rust", language: "cargo add shadowchat-sdk", downloads: "98K/month" },
  ];

  const developers = [
    { name: "Alex Chen", apps: 3, apiCalls: "1.2M", status: "Active", tier: "Pro" },
    { name: "Sarah Johnson", apps: 5, apiCalls: "2.8M", status: "Active", tier: "Enterprise" },
    { name: "Marcus Williams", apps: 2, apiCalls: "450K", status: "Active", tier: "Starter" },
    { name: "Emma Rodriguez", apps: 4, apiCalls: "1.9M", status: "Active", tier: "Pro" },
  ];

  const apiKey = "sk_live_[REDACTED_FOR_SECURITY]";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🔌 Public SDK & API Gateway
        </h1>
        <p className="text-slate-400">Build on top of ShadowChat with our powerful APIs</p>
      </div>

      {/* API Key */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-400 mb-1">Your API Key</div>
            <div className="font-mono text-sm text-emerald-400">{apiKey}</div>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(apiKey);
              setCopiedKey(true);
              setTimeout(() => setCopiedKey(false), 2000);
            }}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded font-bold transition-all"
          >
            {copiedKey ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-700">
        {["apis", "sdks", "developers"].map((tab) => (
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

      {/* APIs Tab */}
      {selectedTab === "apis" && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-lg font-bold mb-4 text-emerald-400">Available APIs</h2>
            <div className="space-y-3">
              {apis.map((api) => (
                <div
                  key={api.id}
                  onClick={() => setSelectedAPI(api.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedAPI === api.id
                      ? "bg-emerald-500/20 border-emerald-400"
                      : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold">{api.name}</h3>
                    <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                      api.status === "Production" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {api.status}
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{api.description}</p>
                  <div className="flex gap-4 text-xs text-slate-400">
                    <span>📍 {api.endpoints} endpoints</span>
                    <span>⚡ {api.rateLimit}</span>
                    <span>📊 {api.calls}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API Details */}
          <div className="col-span-1">
            {selectedAPI !== null && (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 sticky top-6">
                {(() => {
                  const api = apis.find(a => a.id === selectedAPI);
                  return (
                    <>
                      <h3 className="font-bold text-lg mb-4 text-emerald-400">{api?.name}</h3>
                      <div className="space-y-3 text-sm mb-4">
                        <div>
                          <div className="text-slate-400 mb-1">Version</div>
                          <div className="font-semibold">{api?.version}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Rate Limit</div>
                          <div className="font-semibold text-emerald-400">{api?.rateLimit}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Monthly Calls</div>
                          <div className="font-semibold text-cyan-400">{api?.calls}</div>
                        </div>
                      </div>
                      <a
                        href={api?.documentation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-bold text-center block transition-all"
                      >
                        View Docs
                      </a>
                    </>
                  );
                })()}
              </div>
            )}

            {selectedAPI === null && (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 text-center">
                <p className="text-slate-400">Select an API to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SDKs Tab */}
      {selectedTab === "sdks" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Official SDKs</h2>
          <div className="grid grid-cols-2 gap-4">
            {sdkLibraries.map((sdk) => (
              <div key={sdk.name} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                <h3 className="font-bold mb-2">{sdk.name}</h3>
                <div className="bg-slate-900/50 rounded p-2 mb-3 font-mono text-xs text-emerald-400 overflow-x-auto">
                  {sdk.language}
                </div>
                <div className="text-sm text-slate-400">
                  📊 {sdk.downloads} downloads
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Developers Tab */}
      {selectedTab === "developers" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Top Developers</h2>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 bg-slate-900/50 border-b border-slate-700 font-semibold text-sm">
              <div>Developer</div>
              <div>Apps</div>
              <div>API Calls</div>
              <div>Status</div>
              <div>Tier</div>
            </div>
            {developers.map((dev) => (
              <div key={dev.name} className="grid grid-cols-5 gap-4 p-4 border-b border-slate-700/50 text-sm items-center">
                <div className="font-semibold">{dev.name}</div>
                <div>{dev.apps}</div>
                <div className="text-cyan-400">{dev.apiCalls}</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>{dev.status}</span>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${
                  dev.tier === "Enterprise" ? "bg-purple-500/20 text-purple-400" :
                  dev.tier === "Pro" ? "bg-emerald-500/20 text-emerald-400" :
                  "bg-blue-500/20 text-blue-400"
                }`}>
                  {dev.tier}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
