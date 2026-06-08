import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { Streamdown } from "streamdown";

const MODES = [
  { id: "write", label: "Write Code", icon: "⚡", color: "text-blue-400" },
  { id: "debug", label: "Debug", icon: "🐛", color: "text-red-400" },
  { id: "review", label: "Review", icon: "🔍", color: "text-yellow-400" },
  { id: "test", label: "Test", icon: "🧪", color: "text-green-400" },
  { id: "architect", label: "Architect", icon: "🏗️", color: "text-purple-400" },
  { id: "deploy", label: "Deploy", icon: "🚀", color: "text-orange-400" },
] as const;

type Mode = typeof MODES[number]["id"];

export default function AIEngineerIDE() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [mode, setMode] = useState<Mode>("write");
  const [input, setInput] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("untitled.ts");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [activeTab, setActiveTab] = useState<"chat" | "agents" | "terminal" | "files">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: agents } = trpc.aiIDE.getAgents.useQuery();
  const { data: health } = trpc.aiIDE.platformHealth.useQuery();
  const { data: history } = trpc.aiIDE.getTaskHistory.useQuery();

  const chatMutation = trpc.aiIDE.chat.useMutation({
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    },
  });

  const agentMutation = trpc.aiIDE.executeAgent.useMutation();
  const pipelineMutation = trpc.aiIDE.runPipeline.useMutation();
  const terminalMutation = trpc.aiIDE.executeCommand.useMutation();
  const fileMutation = trpc.aiIDE.analyzeFile.useMutation();

  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; output: string }>>([]);
  const [terminalInput, setTerminalInput] = useState("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user" as const, content: input }];
    setMessages(newMessages);
    chatMutation.mutate({
      message: input,
      history: messages.slice(-10),
      mode: mode as any,
    });
    setInput("");
  };

  const handleTerminal = () => {
    if (!terminalInput.trim()) return;
    terminalMutation.mutate({ command: terminalInput }, {
      onSuccess: (data) => {
        setTerminalHistory(prev => [...prev, { cmd: terminalInput, output: data.output }]);
        setTerminalInput("");
      },
    });
  };

  const runPipeline = (agentIds: Array<"codegen" | "reviewer" | "tester" | "security">) => {
    pipelineMutation.mutate({
      prompt: input || "Analyze and improve the platform",
      agents: agentIds,
      context: fileContent ? { files: [{ path: fileName, content: fileContent }] } : undefined,
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a1a] text-white overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04] bg-[#0d0d20]">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-white tracking-tighter uppercase" style={{ fontFamily: "Syne, sans-serif" }}>
              Neural <span className="text-cyan-400">Forge</span>
            </span>
            <div className="px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-[8px] font-mono text-cyan-400 tracking-[0.2em] uppercase">Autonomous IDE</div>
          </div>
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em] mt-1">Self-Optimizing Architecture</span>
        </div>
        <div className="flex items-center gap-2">
          {health && (
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {health.status} • {health.uptime}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel — Agents */}
        <div className="w-64 border-r border-white/10 flex flex-col bg-[#0d0d20]">
          <div className="p-3 border-b border-white/10">
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">AI Agents</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {(agents?.agents || []).map((agent) => (
              <button
                key={agent.id}
                onClick={() => agentMutation.mutate({ agentId: agent.id as any, prompt: input || "Analyze platform" })}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left group"
              >
                <span className="text-lg">{agent.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white/90">{agent.name}</div>
                  <div className="text-[10px] text-white/40 truncate">{agent.accuracy} accuracy</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>

          {/* Pipeline Buttons (Admin Only) */}
          {isAdmin && (
            <div className="p-3 border-t border-white/10 space-y-2">
              <h4 className="text-[10px] font-bold text-white/40 uppercase">Pipelines</h4>
              <Button
                size="sm"
                className="w-full text-xs bg-gradient-to-r from-cyan-600 to-blue-600"
                onClick={() => runPipeline(["codegen", "reviewer", "tester", "security"])}
                disabled={pipelineMutation.isPending}
              >
                {pipelineMutation.isPending ? "Running..." : "Full Pipeline →"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs border-white/20"
                onClick={() => runPipeline(["codegen", "reviewer"])}
              >
                Quick Review →
              </Button>
            </div>
          )}
        </div>

        {/* Center — Main Editor/Chat */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className="flex items-center border-b border-white/10 bg-[#0d0d20]">
            {(["chat", "agents", "terminal", "files"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? "text-cyan-400 border-b-2 border-cyan-400 bg-white/5"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeTab === "chat" && (
              <>
                {/* Mode Selector */}
                <div className="flex items-center gap-1 p-2 border-b border-white/5">
                  {MODES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all ${
                        mode === m.id
                          ? "bg-white/10 text-white border border-white/20"
                          : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      <span>{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="text-4xl mb-4">🧠</div>
                      <h2 className="text-xl font-bold text-white/80 mb-2">ShadowChat AI Engineer</h2>
                      <p className="text-sm text-white/40 max-w-md">
                        Smarter than Grok, ChatGPT, and Manus combined. Write code, debug, architect, test, and deploy — all from one place.
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-6 max-w-sm">
                        {["Build a REST API", "Debug this error", "Write unit tests", "Optimize performance"].map((s) => (
                          <button
                            key={s}
                            onClick={() => setInput(s)}
                            className="px-3 py-2 text-xs text-white/60 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-cyan-600/20 border border-cyan-500/30 text-white"
                          : "bg-white/5 border border-white/10 text-white/90"
                      }`}>
                        {msg.role === "assistant" ? (
                          <div className="prose prose-invert prose-sm max-w-none">
                            <Streamdown>{msg.content}</Streamdown>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {chatMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <span className="animate-spin">⚡</span> Thinking...
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-white/10 bg-[#0d0d20]">
                  <div className="flex gap-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      placeholder={`Ask AI to ${mode}...`}
                      className="flex-1 bg-white/5 border-white/10 text-white resize-none min-h-[44px] max-h-[200px]"
                      rows={2}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={chatMutation.isPending || !input.trim()}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 self-end"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </>
            )}

            {activeTab === "agents" && (
              <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-lg font-bold mb-4">Agent Execution Results</h3>
                {agentMutation.data && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-cyan-400">{agentMutation.data.agentName}</span>
                      <span className="text-xs text-white/40">{agentMutation.data.executionTime}</span>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <Streamdown>{agentMutation.data.result}</Streamdown>
                    </div>
                  </div>
                )}
                {pipelineMutation.data && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-purple-400">Pipeline Results ({pipelineMutation.data.totalTime})</h4>
                    {pipelineMutation.data.results.map((r, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{r.agentName}</span>
                          <span className="text-xs text-white/40">{r.executionTime}</span>
                        </div>
                        <div className="prose prose-invert prose-xs max-w-none">
                          <Streamdown>{r.result.slice(0, 1000)}</Streamdown>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {!agentMutation.data && !pipelineMutation.data && (
                  <p className="text-white/40 text-sm">Run an agent or pipeline to see results here.</p>
                )}
              </div>
            )}

            {activeTab === "terminal" && (
              <div className="flex-1 flex flex-col bg-black/50 font-mono text-sm">
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                  <div className="text-green-400">ShadowChat Terminal v1.0 — Type commands below</div>
                  <div className="text-white/40">$ </div>
                  {terminalHistory.map((item, i) => (
                    <div key={i}>
                      <div className="text-cyan-400">$ {item.cmd}</div>
                      <div className="text-white/70 whitespace-pre-wrap pl-2">{item.output}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center border-t border-white/10 px-3 py-2">
                  <span className="text-green-400 mr-2">$</span>
                  <input
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleTerminal(); }}
                    className="flex-1 bg-transparent text-white outline-none"
                    placeholder="Enter command..."
                  />
                </div>
              </div>
            )}

            {activeTab === "files" && (
              <div className="flex-1 flex flex-col p-4">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm text-white flex-1"
                    placeholder="filename.ts"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-xs"
                    onClick={() => fileMutation.mutate({ filename: fileName, content: fileContent, action: "explain" })}
                  >
                    Explain
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-xs"
                    onClick={() => fileMutation.mutate({ filename: fileName, content: fileContent, action: "refactor" })}
                  >
                    Refactor
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-xs"
                    onClick={() => fileMutation.mutate({ filename: fileName, content: fileContent, action: "test" })}
                  >
                    Test
                  </Button>
                </div>
                <Textarea
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  className="flex-1 bg-black/30 border-white/10 text-white font-mono text-sm resize-none"
                  placeholder="Paste code here for AI analysis..."
                />
                {fileMutation.data && (
                  <div className="mt-3 bg-white/5 border border-white/10 rounded-lg p-3 max-h-64 overflow-y-auto">
                    <div className="prose prose-invert prose-sm max-w-none">
                      <Streamdown>{fileMutation.data.result}</Streamdown>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel — History & Health */}
        <div className="w-56 border-l border-white/10 flex flex-col bg-[#0d0d20]">
          <div className="p-3 border-b border-white/10">
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">Recent Tasks</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {(history?.tasks || []).map((task) => (
              <div key={task.id} className="px-2 py-1.5 rounded text-xs">
                <div className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${task.status === "completed" ? "bg-emerald-400" : "bg-yellow-400"}`} />
                  <span className="text-white/70 font-medium truncate">{task.agent}</span>
                  <span className="text-white/30 ml-auto">{task.time}</span>
                </div>
                <p className="text-white/40 truncate mt-0.5 pl-3">{task.prompt}</p>
              </div>
            ))}
          </div>
          {health && (
            <div className="p-3 border-t border-white/10 space-y-2">
              <h4 className="text-[10px] font-bold text-white/40 uppercase">Platform Health</h4>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                <div className="text-white/50">Build</div>
                <div className="text-emerald-400">{health.build.status}</div>
                <div className="text-white/50">Tests</div>
                <div className="text-emerald-400">{health.tests.passing}/{health.tests.passing + health.tests.failing}</div>
                <div className="text-white/50">P95</div>
                <div className="text-cyan-400">{health.performance.p95}</div>
                <div className="text-white/50">Errors</div>
                <div className="text-emerald-400">{health.errors.last24h}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
