import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Code2, GitBranch, Play, Save, Zap, FileText, Terminal } from "lucide-react";

export default function DevWorkspaceEnterprise() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [command, setCommand] = useState("");

  const createProjectMutation = trpc.devWorkspaceEnterprise.createProject.useMutation();
  const getFileTreeQuery = trpc.devWorkspaceEnterprise.getFileTree.useQuery(
    { projectId: projectId || "" },
    { enabled: !!projectId }
  );
  const readFileQuery = trpc.devWorkspaceEnterprise.readFile.useQuery(
    { projectId: projectId || "", filePath: selectedFile || "" },
    { enabled: !!projectId && !!selectedFile }
  );
  const saveFileMutation = trpc.devWorkspaceEnterprise.saveFile.useMutation();
  const aiSuggestQuery = trpc.devWorkspaceEnterprise.aiSuggestImprovement.useQuery(
    { code, focusArea: "performance" },
    { enabled: code.length > 0 }
  );
  const deployMutation = trpc.devWorkspaceEnterprise.deployPreview.useMutation();
  const runTestsMutation = trpc.devWorkspaceEnterprise.runTests.useMutation();
  const executeCommandMutation = trpc.devWorkspaceEnterprise.executeTerminalCommand.useMutation();

  const handleCreateProject = async (template: string) => {
    const result = await createProjectMutation.mutateAsync({
      name: `project-${Date.now()}`,
      template: template as any,
    });
    setProjectId(result.projectId);
  };

  const handleSaveFile = async () => {
    if (!projectId || !selectedFile) return;
    await saveFileMutation.mutateAsync({
      projectId,
      filePath: selectedFile,
      content: code,
    });
  };

  const handleDeploy = async () => {
    if (!projectId) return;
    await deployMutation.mutateAsync({ projectId });
  };

  const handleRunTests = async () => {
    if (!projectId) return;
    await runTestsMutation.mutateAsync({ projectId });
  };

  const handleExecuteCommand = async () => {
    if (!projectId) return;
    await executeCommandMutation.mutateAsync({
      projectId,
      command,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Code2 className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold">Enterprise Dev Workspace</h1>
          </div>
          <p className="text-muted-foreground">
            Professional development environment with AI pair programming, Monaco editor, and git integration
          </p>
        </div>

        {/* Project Selection */}
        {!projectId ? (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["react", "node", "python", "rust", "solidity", "nextjs", "vite"].map((template) => (
                <Button
                  key={template}
                  onClick={() => handleCreateProject(template)}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                >
                  <Code2 className="w-5 h-5" />
                  <span className="capitalize">{template}</span>
                </Button>
              ))}
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleSaveFile} variant="default" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleRunTests} variant="secondary" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Run Tests
              </Button>
              <Button onClick={handleDeploy} variant="secondary" size="sm">
                <Zap className="w-4 h-4 mr-2" />
                Deploy Preview
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* File Tree */}
              <Card className="p-4 lg:col-span-1">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Files
                </h3>
                <div className="space-y-2">
                  {getFileTreeQuery.data?.files?.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFile(file.path)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                        selectedFile === file.path
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      {file.name}
                      {file.type === "folder" && " 📁"}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Editor & AI Panel */}
              <div className="lg:col-span-3 space-y-6">
                {/* Monaco Editor Simulation */}
                <Card className="p-4">
                  <h3 className="font-bold mb-4">Editor</h3>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-64 p-4 bg-muted text-foreground font-mono text-sm rounded border border-border"
                    placeholder="// Your code here..."
                  />
                </Card>

                {/* AI Suggestions */}
                {aiSuggestQuery.data && (
                  <Card className="p-4 bg-muted">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" />
                      AI Suggestions
                    </h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {aiSuggestQuery.data.suggestions}
                    </p>
                  </Card>
                )}

                {/* Terminal */}
                <Card className="p-4">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    Terminal
                  </h3>
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      placeholder="$ npm run build"
                      className="font-mono text-sm"
                    />
                    <Button onClick={handleExecuteCommand} size="sm">
                      Run
                    </Button>
                  </div>
                  {executeCommandMutation.data && (
                    <pre className="bg-background p-3 rounded text-sm overflow-auto max-h-32 text-muted-foreground">
                      {executeCommandMutation.data.output}
                    </pre>
                  )}
                </Card>
              </div>
            </div>

            {/* Git & Deployment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5" />
                  Git Operations
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Create Branch
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    View History
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Create Pull Request
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-4">Deployment</h3>
                {deployMutation.data && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status:</span>
                      <Badge>{deployMutation.data.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Preview:</span>
                      <a
                        href={deployMutation.data.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline text-sm"
                      >
                        Open
                      </a>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Test Results */}
            {runTestsMutation.data && (
              <Card className="p-6">
                <h3 className="font-bold mb-4">Test Results</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {runTestsMutation.data.results.passed}
                    </div>
                    <div className="text-xs text-muted-foreground">Passed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {runTestsMutation.data.results.failed}
                    </div>
                    <div className="text-xs text-muted-foreground">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">
                      {runTestsMutation.data.results.skipped}
                    </div>
                    <div className="text-xs text-muted-foreground">Skipped</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {(runTestsMutation.data.results.coverage * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Coverage</div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
