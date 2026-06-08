import React, { useState, useEffect } from "react";
import { sovereignDevZone } from "../lib/sovereign-dev-zone";
import { ageVerificationSystem } from "../lib/age-verification-system";

export default function SovereignDevZoneIDE() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [ageVerified, setAgeVerified] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<string>("");
  const [availableMethods, setAvailableMethods] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Get available verification methods
    const methods = ageVerificationSystem.getAvailableMethods();
    setAvailableMethods(methods);

    // Get stats
    const devStats = sovereignDevZone.getStats();
    setStats(devStats);
  }, []);

  const handleCreateWorkspace = (rating: string) => {
    const workspace = sovereignDevZone.createWorkspace(
      "user-123",
      `Workspace - ${rating}`,
      rating as any
    );
    setWorkspaces([...workspaces, workspace]);
    setSelectedWorkspace(workspace);
  };

  const handleVerifyAge = async (methodId: string) => {
    const challenge = ageVerificationSystem.createChallenge("user-123", methodId);

    // Simulate verification
    const result = ageVerificationSystem.completeChallenge(challenge.id, 25, 95);

    setAgeVerified(result.verified);
    setVerificationMethod(methodId);
  };

  const handleCreateFile = () => {
    if (!selectedWorkspace) return;

    const file = sovereignDevZone.createFile(
      selectedWorkspace.id,
      "src/index.tsx",
      "typescript",
      'export default function App() { return <div>Hello</div>; }',
      "application/typescript"
    );

    const updated = sovereignDevZone.getWorkspace(selectedWorkspace.id);
    setSelectedWorkspace(updated);
  };

  const handleDeploy = async () => {
    if (!selectedWorkspace) return;

    const deployment = await sovereignDevZone.deployIsolated(selectedWorkspace.id, "v1.0.0");

    const updated = sovereignDevZone.getWorkspace(selectedWorkspace.id);
    setSelectedWorkspace(updated);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur border-b border-purple-500/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-purple-400">🔒 Sovereign Development Zone</h1>
            <p className="text-gray-400 text-sm">Private IDE • Encrypted Workspace • Zero Monitoring • Age-Gated Content</p>
          </div>
          <div className="flex gap-2">
            {!ageVerified && (
              <button className="px-4 py-2 bg-purple-900/50 border border-purple-500 rounded-lg hover:bg-purple-800/50">
                🔐 Verify Age
              </button>
            )}
            {ageVerified && (
              <span className="px-4 py-2 bg-green-900/50 border border-green-500 rounded-lg text-green-400">
                ✓ Age Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Age Verification Gate */}
          {!ageVerified && (
            <div className="sc-glass p-8 rounded-lg mb-8 border-2 border-purple-500/30">
              <h2 className="text-2xl font-bold mb-6">🔐 Age Verification Required</h2>
              <p className="text-gray-400 mb-6">
                This zone contains age-restricted content. Please verify your age to continue.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleVerifyAge(method.id)}
                    className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-purple-500 transition-all text-left"
                  >
                    <p className="font-semibold mb-2">{method.name}</p>
                    <p className="text-xs text-gray-400 mb-3">{method.description}</p>
                    <div className="flex justify-between text-xs">
                      <span>Trust: {method.trustLevel}%</span>
                      <span>Privacy: {method.privacyLevel}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Workspace Management */}
          {ageVerified && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="sc-glass p-4 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">🏢 Workspaces</p>
                  <p className="text-2xl font-bold text-purple-400">{stats?.totalWorkspaces || 0}</p>
                </div>
                <div className="sc-glass p-4 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">📄 Files</p>
                  <p className="text-2xl font-bold text-blue-400">{stats?.totalFiles || 0}</p>
                </div>
                <div className="sc-glass p-4 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">🚀 Deployments</p>
                  <p className="text-2xl font-bold text-green-400">{stats?.totalDeployments || 0}</p>
                </div>
                <div className="sc-glass p-4 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">📋 Access Logs</p>
                  <p className="text-2xl font-bold text-orange-400">{stats?.accessLogEntries || 0}</p>
                </div>
              </div>

              {/* Create Workspace */}
              <div className="sc-glass p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-bold mb-4">📁 Create New Workspace</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <button
                    onClick={() => handleCreateWorkspace("general")}
                    className="p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg hover:bg-blue-900/50"
                  >
                    <p className="font-semibold text-sm">General</p>
                    <p className="text-xs text-gray-400">Public content</p>
                  </button>
                  <button
                    onClick={() => handleCreateWorkspace("teen")}
                    className="p-4 bg-green-900/30 border border-green-500/50 rounded-lg hover:bg-green-900/50"
                  >
                    <p className="font-semibold text-sm">Teen (13+)</p>
                    <p className="text-xs text-gray-400">Age-gated</p>
                  </button>
                  <button
                    onClick={() => handleCreateWorkspace("mature")}
                    className="p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-lg hover:bg-yellow-900/50"
                  >
                    <p className="font-semibold text-sm">Mature (17+)</p>
                    <p className="text-xs text-gray-400">Restricted</p>
                  </button>
                  <button
                    onClick={() => handleCreateWorkspace("nsfw")}
                    className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg hover:bg-red-900/50"
                  >
                    <p className="font-semibold text-sm">NSFW (18+)</p>
                    <p className="text-xs text-gray-400">Verified only</p>
                  </button>
                  <button
                    onClick={() => handleCreateWorkspace("restricted")}
                    className="p-4 bg-purple-900/30 border border-purple-500/50 rounded-lg hover:bg-purple-900/50"
                  >
                    <p className="font-semibold text-sm">Restricted</p>
                    <p className="text-xs text-gray-400">ID required</p>
                  </button>
                </div>
              </div>

              {/* Workspace List */}
              <div className="sc-glass p-6 rounded-lg mb-8">
                <h2 className="text-2xl font-bold mb-4">📂 Your Workspaces</h2>
                <div className="space-y-2">
                  {workspaces.map((ws) => (
                    <div
                      key={ws.id}
                      onClick={() => setSelectedWorkspace(ws)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedWorkspace?.id === ws.id
                          ? "bg-purple-900/50 border border-purple-500"
                          : "bg-gray-900/30 border border-gray-700 hover:border-purple-500"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{ws.name}</p>
                          <p className="text-xs text-gray-400">
                            {ws.files.length} files • {ws.deployments.length} deployments
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            ws.contentRating === "general"
                              ? "bg-blue-900/50 text-blue-400"
                              : ws.contentRating === "teen"
                              ? "bg-green-900/50 text-green-400"
                              : ws.contentRating === "mature"
                              ? "bg-yellow-900/50 text-yellow-400"
                              : ws.contentRating === "nsfw"
                              ? "bg-red-900/50 text-red-400"
                              : "bg-purple-900/50 text-purple-400"
                          }`}
                        >
                          {ws.contentRating}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Workspace Details */}
              {selectedWorkspace && (
                <div className="sc-glass p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">{selectedWorkspace.name}</h2>
                    <div className="flex gap-2">
                      <button onClick={handleCreateFile} className="px-4 py-2 bg-blue-900/50 border border-blue-500 rounded-lg hover:bg-blue-900">
                        ➕ Add File
                      </button>
                      <button onClick={handleDeploy} className="px-4 py-2 bg-green-900/50 border border-green-500 rounded-lg hover:bg-green-900">
                        🚀 Deploy
                      </button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-4 mb-6 border-b border-gray-700">
                    {["overview", "files", "deployments", "logs"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 border-b-2 transition-all ${
                          activeTab === tab ? "border-purple-500 text-purple-400" : "border-transparent text-gray-400 hover:text-gray-300"
                        }`}
                      >
                        {tab.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {/* Overview */}
                  {activeTab === "overview" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Encryption</p>
                          <p className="font-semibold">🔐 AES-256</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Privacy Level</p>
                          <p className="font-semibold">🛡️ Maximum</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Created</p>
                          <p className="font-semibold">{new Date(selectedWorkspace.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Status</p>
                          <p className="font-semibold text-green-400">✓ Active</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Files */}
                  {activeTab === "files" && (
                    <div className="space-y-2">
                      {selectedWorkspace.files.map((file: any) => (
                        <div key={file.id} className="p-3 bg-gray-900/30 rounded">
                          <p className="font-semibold text-sm">{file.path}</p>
                          <p className="text-xs text-gray-400">{file.size} bytes • v{file.version}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Deployments */}
                  {activeTab === "deployments" && (
                    <div className="space-y-2">
                      {selectedWorkspace.deployments.map((deploy: any) => (
                        <div key={deploy.id} className="p-3 bg-gray-900/30 rounded">
                          <p className="font-semibold text-sm">{deploy.version}</p>
                          <p className="text-xs text-gray-400">{deploy.environment} • {new Date(deploy.timestamp).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Logs */}
                  {activeTab === "logs" && (
                    <div className="bg-black/50 p-4 rounded font-mono text-xs space-y-1 max-h-64 overflow-y-auto">
                      {selectedWorkspace.accessLog.map((log: any, idx: number) => (
                        <div key={idx} className="text-gray-400">
                          [{new Date(log.timestamp).toISOString()}] {log.action}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
