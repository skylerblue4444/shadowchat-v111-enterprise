import React, { useState } from "react";

/**
 * Automated Documentation Engine
 * Open-source guides, manuals, and API documentation
 */

export default function AutomatedDocumentation() {
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState("guides");

  const guides = [
    {
      id: 1,
      title: "Getting Started with ShadowChat",
      description: "A comprehensive guide to set up and start using ShadowChat",
      category: "Beginner",
      readTime: "15 min",
      views: 45000,
      rating: 4.9,
      lastUpdated: "2 days ago",
      sections: 8,
    },
    {
      id: 2,
      title: "Trading API Integration",
      description: "Step-by-step guide to integrate the Trading API into your app",
      category: "Developer",
      readTime: "25 min",
      views: 28000,
      rating: 4.8,
      lastUpdated: "1 week ago",
      sections: 12,
    },
    {
      id: 3,
      title: "Deploying to Production",
      description: "Best practices for deploying ShadowChat to production environments",
      category: "DevOps",
      readTime: "30 min",
      views: 18500,
      rating: 4.7,
      lastUpdated: "3 days ago",
      sections: 10,
    },
    {
      id: 4,
      title: "Security Best Practices",
      description: "Essential security practices for ShadowChat applications",
      category: "Security",
      readTime: "20 min",
      views: 22000,
      rating: 4.9,
      lastUpdated: "5 days ago",
      sections: 9,
    },
  ];

  const apiDocs = [
    {
      id: 1,
      endpoint: "POST /api/trades",
      description: "Execute a new trade",
      method: "POST",
      status: "Stable",
      examples: 5,
      lastUpdated: "1 week ago",
    },
    {
      id: 2,
      endpoint: "GET /api/portfolio",
      description: "Get user portfolio details",
      method: "GET",
      status: "Stable",
      examples: 4,
      lastUpdated: "2 weeks ago",
    },
    {
      id: 3,
      endpoint: "POST /api/charity/donate",
      description: "Create a charity donation",
      method: "POST",
      status: "Stable",
      examples: 3,
      lastUpdated: "3 days ago",
    },
    {
      id: 4,
      endpoint: "GET /api/social/feed",
      description: "Get social media feed",
      method: "GET",
      status: "Beta",
      examples: 6,
      lastUpdated: "2 days ago",
    },
  ];

  const tutorials = [
    {
      id: 1,
      title: "Building Your First Bot",
      description: "Create a simple trading bot using the ShadowChat SDK",
      difficulty: "Beginner",
      duration: "45 min",
      views: 12500,
      rating: 4.8,
    },
    {
      id: 2,
      title: "Advanced Portfolio Management",
      description: "Master advanced portfolio strategies with ShadowChat",
      difficulty: "Advanced",
      duration: "90 min",
      views: 8900,
      rating: 4.7,
    },
    {
      id: 3,
      title: "Real-Time Data Streaming",
      description: "Implement real-time data streaming in your application",
      difficulty: "Intermediate",
      duration: "60 min",
      views: 6700,
      rating: 4.6,
    },
  ];

  const docStats = {
    totalDocs: 156,
    totalViews: 2450000,
    avgRating: 4.8,
    lastGenerated: "2 hours ago",
    autoUpdates: "Enabled",
    coverage: "98%",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          📚 Automated Documentation Engine
        </h1>
        <p className="text-slate-400">Comprehensive guides, APIs, and tutorials</p>
      </div>

      {/* Documentation Stats */}
      <div className="grid grid-cols-6 gap-3 mb-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Total Docs</div>
          <div className="text-2xl font-bold text-emerald-400">{docStats.totalDocs}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Total Views</div>
          <div className="text-lg font-bold text-cyan-400">{(docStats.totalViews / 1000000).toFixed(1)}M</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Avg Rating</div>
          <div className="text-2xl font-bold text-purple-400">⭐ {docStats.avgRating}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Last Generated</div>
          <div className="text-sm font-bold text-orange-400">{docStats.lastGenerated}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Auto Updates</div>
          <div className="text-sm font-bold text-green-400">{docStats.autoUpdates}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Coverage</div>
          <div className="text-2xl font-bold text-emerald-400">{docStats.coverage}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-700">
        {["guides", "apis", "tutorials"].map((tab) => (
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

      {/* Guides Tab */}
      {selectedTab === "guides" && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-lg font-bold mb-4 text-emerald-400">Documentation Guides</h2>
            <div className="space-y-3">
              {guides.map((guide) => (
                <div
                  key={guide.id}
                  onClick={() => setSelectedDoc(guide.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedDoc === guide.id
                      ? "bg-emerald-500/20 border-emerald-400"
                      : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold">{guide.title}</h3>
                    <div className="px-2 py-0.5 rounded text-xs font-bold bg-slate-700/30 text-slate-300">
                      {guide.category}
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{guide.description}</p>
                  <div className="flex gap-4 text-xs text-slate-400">
                    <span>⏱️ {guide.readTime}</span>
                    <span>👁️ {(guide.views / 1000).toFixed(0)}K views</span>
                    <span>⭐ {guide.rating}</span>
                    <span>📝 {guide.sections} sections</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guide Details */}
          <div className="col-span-1">
            {selectedDoc !== null && (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 sticky top-6">
                {(() => {
                  const guide = guides.find(g => g.id === selectedDoc);
                  return (
                    <>
                      <h3 className="font-bold text-lg mb-4 text-emerald-400">{guide?.title}</h3>
                      <div className="space-y-3 text-sm mb-4">
                        <div>
                          <div className="text-slate-400 mb-1">Category</div>
                          <div className="font-semibold">{guide?.category}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Read Time</div>
                          <div className="font-semibold text-emerald-400">{guide?.readTime}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">Last Updated</div>
                          <div className="font-semibold text-cyan-400">{guide?.lastUpdated}</div>
                        </div>
                      </div>
                      <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-bold transition-all">
                        Read Guide
                      </button>
                    </>
                  );
                })()}
              </div>
            )}

            {selectedDoc === null && (
              <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 text-center">
                <p className="text-slate-400">Select a guide to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* APIs Tab */}
      {selectedTab === "apis" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-emerald-400">API Documentation</h2>
          <div className="grid grid-cols-2 gap-4">
            {apiDocs.map((api) => (
              <div key={api.id} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-sm">{api.endpoint}</h3>
                  <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                    api.method === "GET" ? "bg-blue-500/20 text-blue-400" :
                    api.method === "POST" ? "bg-green-500/20 text-green-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {api.method}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-3">{api.description}</p>
                <div className="flex gap-3 text-xs text-slate-400">
                  <span>📚 {api.examples} examples</span>
                  <span>✓ {api.status}</span>
                  <span>🕐 {api.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tutorials Tab */}
      {selectedTab === "tutorials" && (
        <div>
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Video Tutorials</h2>
          <div className="grid grid-cols-3 gap-4">
            {tutorials.map((tutorial) => (
              <div key={tutorial.id} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
                <h3 className="font-bold mb-2">{tutorial.title}</h3>
                <p className="text-xs text-slate-400 mb-3">{tutorial.description}</p>
                <div className="space-y-2 text-xs text-slate-400 mb-3">
                  <div className="flex justify-between">
                    <span>Difficulty</span>
                    <span className="font-semibold text-emerald-400">{tutorial.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-semibold text-cyan-400">{tutorial.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Views</span>
                    <span className="font-semibold">{(tutorial.views / 1000).toFixed(0)}K</span>
                  </div>
                </div>
                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-bold text-sm transition-all">
                  Watch Tutorial
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
