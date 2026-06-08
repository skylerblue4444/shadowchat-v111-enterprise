import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, Cpu, Zap, Terminal, 
  Play, Save, GitBranch, Database,
  Layers, Braces, Binary, Sparkles,
  Bug, Search, Beaker, Rocket, Construction,
  ChevronRight, Activity, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { Streamdown } from "streamdown";
import { SovereignCard, SovereignHeading, SovereignBadge, SovereignButton } from "../components/SovereignUI";
import { useNeuralCore } from "@/lib/neural-core-sync";

const MODES = [
  { id: "write", label: "Write Code", icon: Zap, color: "text-blue-400" },
  { id: "debug", label: "Debug", icon: Bug, color: "text-red-400" },
  { id: "review", label: "Review", icon: Search, color: "text-yellow-400" },
  { id: "test", label: "Test", icon: Beaker, color: "text-green-400" },
  { id: "architect", label: "Architect", icon: Construction, color: "text-purple-400" },
  { id: "deploy", label: "Deploy", icon: Rocket, color: "text-orange-400" },
] as const;

type Mode = typeof MODES[number]["id"];

export default function AIEngineerIDE() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [mode, setMode] = useState<Mode>("write");
  const [input, setInput] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("neural-core.ts");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [activeTab, setActiveTab] = useState<"chat" | "agents" | "terminal" | "files">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addXP, addActivity } = useNeuralCore();

  const { data: agents } = trpc.aiIDE.getAgents.useQuery();
  const { data: health } = trpc.aiIDE.platformHealth.useQuery();

  const chatMutation = trpc.aiIDE.chat.useMutation({
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      addXP(50);
    },
  });

  const agentMutation = trpc.aiIDE.executeAgent.useMutation();
  const pipelineMutation = trpc.aiIDE.runPipeline.useMutation();
  const terminalMutation = trpc.aiIDE.executeCommand.useMutation();

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

  const triggerSelfCode = () => {
    addActivity('AI', 'HOPE AI initiating Autonomous Self-Coding Protocol...');
    pipelineMutation.mutate({
      prompt: "Perform autonomous optimization of the Neural Core and Self-Healing engines. Ensure zero-breakage policy.",
      agents: ["codegen", "reviewer", "tester", "security"],
    });
    addXP(500);
  };

  return (
    <div className="space-y-10 pb-24">
      <SovereignHeading 
        title="Neural Forge IDE" 
        subtitle="AUTONOMOUS_ENGINEERING // SELF_EVOLVING_LOGIC" 
        accent="cyan"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - Agents & Health */}
        <div className="lg:col-span-3 space-y-6">
          <SovereignCard glowColor="cyan">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                AI_AGENTS
              </h3>
              <SovereignBadge type="cyan">ACTIVE</SovereignBadge>
            </div>
            <div className="space-y-2">
              {(agents?.agents || []).map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => agentMutation.mutate({ agentId: agent.id as any, prompt: input || "Analyze platform" })}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-cyan-500/30 transition-all text-left group"
                >
                  <span className="text-lg">{agent.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold text-white/90 uppercase">{agent.name}</div>
                    <div className="text-[9px] text-white/40 font-mono">{agent.accuracy} ACCURACY</div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-cyan-400 transition-colors" />
                </button>
              ))}
            </div>
          </SovereignCard>

          <SovereignCard glowColor="emerald">
            <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              SYSTEM_HEALTH
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/40 uppercase font-bold">Uptime</span>
                <span className="text-[10px] text-emerald-400 font-mono">{health?.uptime || "99.99%"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/40 uppercase font-bold">Neural Sync</span>
                <span className="text-[10px] text-cyan-400 font-mono">OPTIMIZED</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: "94%" }}
                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                />
              </div>
            </div>
          </SovereignCard>

          <SovereignButton 
            variant="primary" 
            className="w-full py-6 flex flex-col gap-1 items-center justify-center bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-xl shadow-purple-500/20"
            onClick={triggerSelfCode}
            disabled={pipelineMutation.isPending}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-black tracking-widest uppercase">Initiate Self-Code</span>
            </div>
            <span className="text-[8px] opacity-60 tracking-[0.2em]">AUTONOMOUS_OPTIMIZATION</span>
          </SovereignButton>
        </div>

        {/* Main IDE Area */}
        <div className="lg:col-span-9 space-y-6">
          <SovereignCard glowColor="purple" className="p-0 overflow-hidden flex flex-col h-[700px]">
            {/* Tab Bar */}
            <div className="flex items-center border-b border-white/5 bg-black/40 px-4">
              {(["chat", "agents", "terminal", "files"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                    activeTab === tab
                      ? "text-cyan-400"
                      : "text-white/30 hover:text-white/60"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="ideTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col bg-black/20">
              {activeTab === "chat" && (
                <>
                  <div className="flex items-center gap-2 p-3 border-b border-white/5 bg-white/[0.02]">
                    {MODES.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMode(m.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                          mode === m.id
                            ? "bg-white/10 text-white border-white/20 shadow-lg"
                            : "text-white/30 border-transparent hover:text-white/60 hover:bg-white/5"
                        }`}
                      >
                        <m.icon className={cn("w-3.5 h-3.5", mode === m.id ? m.color : "text-white/20")} />
                        <span className="uppercase tracking-widest">{m.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-40">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-2xl">
                          <Brain className="w-10 h-10 text-white" />
                        </div>
                        <div className="space-y-2">
                          <h2 className="text-xl font-black tracking-tighter text-white uppercase">Neural Forge Assistant</h2>
                          <p className="text-xs text-white/60 max-w-md font-medium">
                            Sovereign engineering at your command. Write, debug, and evolve the platform logic in real-time.
                          </p>
                        </div>
                      </div>
                    )}
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl px-5 py-4 border ${
                          msg.role === "user"
                            ? "bg-cyan-500/10 border-cyan-500/30 text-white"
                            : "bg-white/5 border-white/10 text-white/90"
                        }`}>
                          <div className="prose prose-invert prose-sm max-w-none font-medium">
                            <Streamdown>{msg.content}</Streamdown>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-4 border-t border-white/5 bg-black/40">
                    <div className="flex gap-4">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder={`Neural Command for ${mode}...`}
                        className="flex-1 bg-white/5 border-white/10 text-white font-medium resize-none min-h-[50px] rounded-2xl focus:ring-cyan-500/20"
                      />
                      <SovereignButton
                        onClick={handleSend}
                        disabled={chatMutation.isPending || !input.trim()}
                        className="h-[50px] px-8"
                      >
                        {chatMutation.isPending ? "THINKING..." : "EXECUTE"}
                      </SovereignButton>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "terminal" && (
                <div className="flex-1 flex flex-col bg-black/80 font-mono text-xs">
                  <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
                    <div className="text-emerald-400 font-black tracking-widest mb-4">SHADOW_OS TERMINAL v1.11 // SECURE_ACCESS_GRANTED</div>
                    {terminalHistory.map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="text-cyan-400 flex items-center gap-2">
                          <ChevronRight className="w-3 h-3" />
                          <span>{item.cmd}</span>
                        </div>
                        <div className="text-white/60 whitespace-pre-wrap pl-5 border-l border-white/5 mb-4">{item.output}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center border-t border-white/10 px-6 py-4 bg-black">
                    <ChevronRight className="w-4 h-4 text-emerald-400 mr-2" />
                    <input
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleTerminal(); }}
                      className="flex-1 bg-transparent text-white outline-none font-mono"
                      placeholder="Enter Sovereign Command..."
                    />
                  </div>
                </div>
              )}

              {activeTab === "agents" && (
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                  <h3 className="text-xs font-black uppercase tracking-widest text-purple-400 flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    AGENT_EXECUTION_STREAM
                  </h3>
                  {pipelineMutation.isPending && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 animate-pulse">Running_Autonomous_Pipeline...</p>
                    </div>
                  )}
                  {pipelineMutation.data && (
                    <div className="space-y-4">
                      {pipelineMutation.data.results.map((r, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <SovereignBadge type="purple">{r.agentName}</SovereignBadge>
                              <span className="text-[10px] text-white/20 font-mono">{r.executionTime}</span>
                            </div>
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div className="prose prose-invert prose-xs max-w-none text-white/70">
                            <Streamdown>{r.result}</Streamdown>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "files" && (
                <div className="flex-1 flex flex-col p-8 space-y-6">
                   <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      FILE_EXPLORER
                    </h3>
                    <SovereignBadge type="cyan">6 FILES FOUND</SovereignBadge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { name: "neural-core.ts", size: "12.4kb", type: "Logic" },
                      { name: "self-healing.ts", size: "8.1kb", type: "Engine" },
                      { name: "personality.ts", size: "15.2kb", type: "Core" },
                      { name: "economy.ts", size: "22.4kb", type: "Finance" },
                      { name: "security.ts", size: "18.7kb", type: "Shield" },
                      { name: "admin-hq.tsx", size: "32.1kb", type: "UI" }
                    ].map((file, i) => (
                      <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-cyan-500/30 cursor-pointer transition-all group">
                        <Code2 className="w-6 h-6 text-cyan-500 mb-3 group-hover:scale-110 transition-transform" />
                        <div className="text-[11px] font-bold text-white mb-1">{file.name}</div>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-white/20 font-mono uppercase">{file.type}</span>
                          <span className="text-[9px] text-white/40 font-mono">{file.size}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SovereignCard>
        </div>
      </div>
    </div>
  );
}
