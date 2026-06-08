import React, { useState } from "react";

export default function DeveloperPortal() {
  const [selectedTab, setSelectedTab] = useState("api");

  const apiDocs = [
    { endpoint: "GET /api/agents", description: "List all AI agents", rate: "1000/min" },
    { endpoint: "POST /api/tasks", description: "Submit a new task", rate: "500/min" },
    { endpoint: "GET /api/tasks/:id", description: "Get task status", rate: "5000/min" },
    { endpoint: "DELETE /api/tasks/:id", description: "Cancel a task", rate: "500/min" },
  ];

  const sdks = [
    { name: "JavaScript/TypeScript", version: "1.0.0", downloads: "125K/month" },
    { name: "Python", version: "1.0.0", downloads: "89K/month" },
    { name: "Go", version: "1.0.0", downloads: "45K/month" },
    { name: "Rust", version: "1.0.0", downloads: "32K/month" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 sc-text-gradient-emerald">
            👨‍💻 Developer Portal
          </h1>
          <p className="text-gray-400">APIs, SDKs, and documentation for ShadowChat integration</p>
        </div>

        {/* Tabs */}
        <div className="sc-tabs mb-8">
          {["api", "sdks", "docs", "webhooks"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`sc-tab ${selectedTab === tab ? "active" : ""}`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* API Documentation */}
        {selectedTab === "api" && (
          <div className="space-y-6">
            <div className="sc-glass p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">REST API Endpoints</h2>
              <div className="space-y-4">
                {apiDocs.map((api, idx) => (
                  <div key={idx} className="bg-gray-900/30 p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <code className="text-emerald-400 font-mono">{api.endpoint}</code>
                      <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded">
                        {api.rate}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{api.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="sc-glass p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Example Request</h3>
              <pre className="bg-gray-900/50 p-4 rounded text-sm overflow-x-auto">
                {`curl -X GET https://api.shadowchat.app/api/agents \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
              </pre>
            </div>
          </div>
        )}

        {/* SDKs */}
        {selectedTab === "sdks" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sdks.map((sdk, idx) => (
              <div key={idx} className="sc-glass p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">{sdk.name}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-400">
                    <span className="text-gray-500">Version:</span> {sdk.version}
                  </p>
                  <p className="text-sm text-gray-400">
                    <span className="text-gray-500">Downloads:</span> {sdk.downloads}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="sc-btn-outline flex-1 text-sm">Documentation</button>
                  <button className="sc-btn-emerald flex-1 text-sm">Install</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Documentation */}
        {selectedTab === "docs" && (
          <div className="sc-glass p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Documentation</h2>
            <div className="space-y-4">
              {[
                "Getting Started Guide",
                "Authentication & Security",
                "Rate Limiting & Quotas",
                "Error Handling",
                "Best Practices",
                "Troubleshooting",
              ].map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg hover:bg-gray-900/50 cursor-pointer">
                  <span>{doc}</span>
                  <span className="text-gray-500">→</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Webhooks */}
        {selectedTab === "webhooks" && (
          <div className="sc-glass p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Webhooks</h2>
            <p className="text-gray-400 mb-6">
              Receive real-time notifications about agent activity and task completion
            </p>
            <div className="space-y-4">
              {["task.created", "task.completed", "agent.status_changed", "error.occurred"].map(
                (event, idx) => (
                  <div key={idx} className="bg-gray-900/30 p-4 rounded-lg">
                    <p className="font-mono text-emerald-400">{event}</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
