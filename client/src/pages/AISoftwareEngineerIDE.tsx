import React, { useState, useEffect } from "react";
import { aiSoftwareEngineer } from "../lib/ai-software-engineer";
import { swarmIntelligence } from "../lib/swarm-intelligence";

export default function AISoftwareEngineerIDE() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [developmentLog, setDevelopmentLog] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Initialize with a demo project
    const project = aiSoftwareEngineer.createProject(
      "ShadowChat v1111 Frontend",
      "Modern React-based UI with Tailwind CSS",
      ["react", "typescript", "tailwind"]
    );

    // Assign swarm bots
    const agents = swarmIntelligence.getAllAgents();
    const botIds = agents.slice(0, 6).map((a) => a.id);
    aiSoftwareEngineer.assignBotsToProject(project.id, botIds);

    setSelectedProject(project);
    setProjects([project]);

    // Get stats
    const serviceStats = aiSoftwareEngineer.getServiceStats();
    setStats(serviceStats);
  }, []);

  const handleGenerateCode = async () => {
    if (!selectedProject) return;

    setIsGenerating(true);

    // Generate multiple files
    const files = [
      { path: "src/components/Header.tsx", language: "typescript", req: "Header component with navigation" },
      { path: "src/pages/Dashboard.tsx", language: "typescript", req: "Main dashboard page" },
      { path: "src/hooks/useAuth.ts", language: "typescript", req: "Authentication hook" },
      { path: "src/utils/api.ts", language: "typescript", req: "API client utilities" },
    ];

    for (const file of files) {
      const agents = swarmIntelligence.getAllAgents();
      const botId = agents[Math.floor(Math.random() * agents.length)].id;

      await aiSoftwareEngineer.generateCodeFile(
        selectedProject.id,
        botId,
        file.path,
        file.language,
        file.req
      );
    }

    // Run tests
    const testBotId = swarmIntelligence.getAllAgents()[0].id;
    await aiSoftwareEngineer.runTests(selectedProject.id, testBotId);

    // Update state
    const updatedProject = aiSoftwareEngineer.getAllProjects()[0];
    setSelectedProject(updatedProject);

    const log = aiSoftwareEngineer.getDevelopmentLog();
    setDevelopmentLog(log);

    const newStats = aiSoftwareEngineer.getServiceStats();
    setStats(newStats);

    setIsGenerating(false);
  };

  const handleDeploy = async () => {
    if (!selectedProject) return;

    await aiSoftwareEngineer.deployProject(selectedProject.id, "staging");

    const updatedProject = aiSoftwareEngineer.getAllProjects()[0];
    setSelectedProject(updatedProject);

    const log = aiSoftwareEngineer.getDevelopmentLog();
    setDevelopmentLog(log);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur border-b border-emerald-500/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold sc-text-gradient-emerald">💻 AI Software Engineer IDE</h1>
            <p className="text-gray-400 text-sm">12-Bot Swarm Coding • Live Development • Autonomous Testing</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleGenerateCode}
              disabled={isGenerating}
              className="sc-btn-emerald disabled:opacity-50"
            >
              {isGenerating ? "Generating..." : "🤖 Generate Code"}
            </button>
            <button onClick={handleDeploy} className="sc-btn-emerald">
              🚀 Deploy
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Project Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="sc-glass p-4 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">📁 Files</p>
              <p className="text-2xl font-bold text-emerald-400">{selectedProject?.files.length || 0}</p>
            </div>
            <div className="sc-glass p-4 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">✅ Tests Passed</p>
              <p className="text-2xl font-bold text-green-400">
                {selectedProject?.tests.reduce((sum: number, t: any) => sum + t.passed, 0) || 0}
              </p>
            </div>
            <div className="sc-glass p-4 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">📊 Coverage</p>
              <p className="text-2xl font-bold text-blue-400">
                {selectedProject?.tests[0]?.coverage.toFixed(0) || 0}%
              </p>
            </div>
            <div className="sc-glass p-4 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">🤖 Active Bots</p>
              <p className="text-2xl font-bold text-purple-400">{selectedProject?.assignedBots.length || 0}</p>
            </div>
            <div className="sc-glass p-4 rounded-lg">
              <p className="text-gray-400 text-xs mb-1">📈 Progress</p>
              <p className="text-2xl font-bold text-orange-400">{selectedProject?.progress || 0}%</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="sc-tabs mb-8">
            {["overview", "files", "tests", "bots", "log"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`sc-tab ${activeTab === tab ? "active" : ""}`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="sc-glass p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Project: {selectedProject?.name}</h2>
                <p className="text-gray-400 mb-4">{selectedProject?.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject?.stack.map((tech: string) => (
                        <span key={tech} className="px-3 py-1 bg-emerald-900/30 border border-emerald-500/50 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="font-bold text-emerald-400">{selectedProject?.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Progress:</span>
                        <span className="font-bold text-blue-400">{selectedProject?.progress}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Deployments:</span>
                        <span className="font-bold text-purple-400">{selectedProject?.deployments.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Stats */}
              <div className="sc-glass p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">IDE Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Total Projects</p>
                    <p className="text-3xl font-bold text-emerald-400">{stats?.totalProjects || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Total Files</p>
                    <p className="text-3xl font-bold text-blue-400">{stats?.totalFiles || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Completed Tasks</p>
                    <p className="text-3xl font-bold text-green-400">{stats?.completedTasks || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Avg Code Quality</p>
                    <p className="text-3xl font-bold text-purple-400">{(stats?.avgCodeQuality || 0).toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Files Tab */}
          {activeTab === "files" && (
            <div className="sc-glass p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Generated Files</h2>
              <div className="space-y-2">
                {selectedProject?.files.map((file: any) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-900/30 rounded hover:bg-gray-900/50">
                    <div className="flex-1">
                      <p className="font-semibold">{file.path}</p>
                      <p className="text-xs text-gray-400">
                        {file.lines} lines • Quality: {file.quality.toFixed(0)}% • Complexity: {file.complexity.toFixed(0)}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-emerald-900/30 border border-emerald-500/50 rounded">
                      v{file.version}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tests Tab */}
          {activeTab === "tests" && (
            <div className="sc-glass p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Test Results</h2>
              {selectedProject?.tests.map((testSuite: any) => (
                <div key={testSuite.id} className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{testSuite.name}</h3>
                    <span className="text-sm text-gray-400">{testSuite.coverage.toFixed(0)}% coverage</span>
                  </div>
                  <div className="space-y-1">
                    {testSuite.tests.map((test: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span className={test.passed ? "text-green-400" : "text-red-400"}>
                          {test.passed ? "✓" : "✗"}
                        </span>
                        <span>{test.name}</span>
                        <span className="text-gray-500">({test.duration.toFixed(0)}ms)</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bots Tab */}
          {activeTab === "bots" && (
            <div className="sc-glass p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Active Bots</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedProject?.assignedBots.map((botId: string) => (
                  <div key={botId} className="p-4 bg-gray-900/30 rounded border border-gray-700">
                    <p className="font-semibold mb-2">{botId}</p>
                    <p className="text-xs text-gray-400">Status: Active</p>
                    <p className="text-xs text-gray-400">Tasks: 4</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Log Tab */}
          {activeTab === "log" && (
            <div className="sc-glass p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Development Log</h2>
              <div className="bg-black/50 p-4 rounded font-mono text-xs space-y-1 max-h-96 overflow-y-auto">
                {developmentLog.map((log, idx) => (
                  <div key={idx} className="text-gray-400">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
