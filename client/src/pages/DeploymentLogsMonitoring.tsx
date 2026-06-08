import React, { useState } from "react";

/**
 * Real-Time Deployment Logs & Monitoring
 * Live build tracking and performance monitoring
 */

export default function DeploymentLogsMonitoring() {
  const [selectedBuild, setSelectedBuild] = useState<number | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const builds = [
    {
      id: 1,
      version: "111.0.0",
      status: "Success",
      startTime: "14:32:15",
      endTime: "14:34:49",
      duration: "2m 34s",
      platform: "Vercel",
      agent: "Architect",
      logs: [
        "[14:32:15] Starting build process...",
        "[14:32:18] Cloning repository from GitHub",
        "[14:32:25] Installing dependencies with pnpm",
        "[14:32:45] Running TypeScript compiler",
        "[14:33:02] Building with Vite",
        "[14:33:15] Optimizing production bundle",
        "[14:33:28] Running security scan",
        "[14:33:35] Deploying to Vercel CDN",
        "[14:34:49] ✓ Deployment successful! Live at https://shadowchat-v1111.vercel.app",
      ],
    },
    {
      id: 2,
      version: "110.9.9",
      status: "Success",
      startTime: "12:15:30",
      endTime: "12:21:42",
      duration: "6m 12s",
      platform: "AWS",
      agent: "Guardian",
      logs: [
        "[12:15:30] Starting AWS deployment",
        "[12:15:45] Building Docker image",
        "[12:16:30] Pushing to ECR",
        "[12:17:15] Updating ECS service",
        "[12:18:00] Running health checks",
        "[12:21:42] ✓ AWS deployment complete!",
      ],
    },
    {
      id: 3,
      version: "110.9.8",
      status: "Success",
      startTime: "10:45:00",
      endTime: "10:49:45",
      duration: "4m 45s",
      platform: "Docker",
      agent: "Innovator",
      logs: [
        "[10:45:00] Building Docker container",
        "[10:45:30] Installing dependencies",
        "[10:46:15] Running tests",
        "[10:47:00] Building production image",
        "[10:48:30] Pushing to Docker Hub",
        "[10:49:45] ✓ Docker image ready for deployment",
      ],
    },
  ];

  const metrics = {
    avgBuildTime: "4m 30s",
    successRate: "98.5%",
    totalDeployments: 156,
    failureRate: "1.5%",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          📊 Deployment Logs & Monitoring
        </h1>
        <p className="text-slate-400">Real-time build tracking and performance metrics</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Avg Build Time</div>
          <div className="text-2xl font-bold text-emerald-400">{metrics.avgBuildTime}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Success Rate</div>
          <div className="text-2xl font-bold text-green-400">{metrics.successRate}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Total Deployments</div>
          <div className="text-2xl font-bold text-cyan-400">{metrics.totalDeployments}</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Failure Rate</div>
          <div className="text-2xl font-bold text-red-400">{metrics.failureRate}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Build List */}
        <div className="col-span-1">
          <h2 className="text-lg font-bold mb-4 text-emerald-400">Recent Builds</h2>
          <div className="space-y-3">
            {builds.map((build) => (
              <div
                key={build.id}
                onClick={() => setSelectedBuild(build.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedBuild === build.id
                    ? "bg-emerald-500/20 border-emerald-400"
                    : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/30"
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-sm">v{build.version}</h3>
                  <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                    build.status === "Success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    {build.status}
                  </div>
                </div>
                <div className="text-xs text-slate-400 mb-2">
                  {build.platform} • {build.agent}
                </div>
                <div className="text-xs text-emerald-400 font-semibold">{build.duration}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Logs Viewer */}
        <div className="col-span-2">
          {selectedBuild !== null && (
            <>
              {(() => {
                const build = builds.find(b => b.id === selectedBuild);
                return (
                  <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">Build v{build?.version}</h3>
                        <div className="text-xs text-slate-400 mt-1">
                          {build?.platform} • {build?.agent} • {build?.startTime} - {build?.endTime}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded font-bold ${
                        build?.status === "Success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {build?.status}
                      </div>
                    </div>

                    {/* Logs */}
                    <div className="flex-1 overflow-y-auto p-4 bg-slate-900/30 font-mono text-sm space-y-1">
                      {build?.logs.map((log, idx) => (
                        <div key={idx} className={`${
                          log.includes("✓") ? "text-green-400" :
                          log.includes("✗") ? "text-red-400" :
                          log.includes("⚠") ? "text-yellow-400" :
                          "text-slate-300"
                        }`}>
                          {log}
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-700 flex items-center justify-between">
                      <div className="text-sm text-slate-400">
                        Duration: <span className="font-semibold text-emerald-400">{build?.duration}</span>
                      </div>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoScroll}
                          onChange={(e) => setAutoScroll(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span>Auto-scroll</span>
                      </label>
                    </div>
                  </div>
                );
              })()}
            </>
          )}

          {selectedBuild === null && (
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-12 flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-slate-400">Select a build to view logs</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performance Timeline */}
      <div className="mt-12">
        <h2 className="text-lg font-bold mb-4 text-emerald-400">Build Performance Timeline</h2>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
          <div className="space-y-4">
            {builds.map((build) => (
              <div key={build.id} className="flex items-center gap-4">
                <div className="w-24 text-sm font-semibold">v{build.version}</div>
                <div className="flex-1 bg-slate-700/50 rounded-full h-8 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      build.status === "Success" ? "bg-emerald-500" : "bg-red-500"
                    }`}
                    style={{ width: "100%" }}
                  >
                    {build.duration}
                  </div>
                </div>
                <div className="w-20 text-right text-sm text-slate-400">{build.platform}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
