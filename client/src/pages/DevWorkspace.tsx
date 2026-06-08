import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Streamdown } from "streamdown";

const MODES = [
  { id: "write", label: "Write", icon: "✍️" },
  { id: "debug", label: "Debug", icon: "🐛" },
  { id: "explain", label: "Explain", icon: "💡" },
  { id: "refactor", label: "Refactor", icon: "♻️" },
  { id: "test", label: "Test", icon: "🧪" },
  { id: "architect", label: "Architect", icon: "🏗️" },
] as const;

type Mode = typeof MODES[number]["id"];

export default function DevWorkspace() {
  const [mode, setMode] = useState<Mode>("write");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [editorContent, setEditorContent] = useState("");
  const [editorFile, setEditorFile] = useState("app.ts");
  const [editorLang, setEditorLang] = useState("typescript");
  const [showEditor, setShowEditor] = useState(false);
  const [activePanel, setActivePanel] = useState<"chat" | "scaffold" | "complete">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: templates } = trpc.devWorkspace.getTemplates.useQuery();

  const codeMutation = trpc.devWorkspace.aiCode.useMutation({
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    },
  });

  const scaffoldMutation = trpc.devWorkspace.scaffold.useMutation();
  const completeMutation = trpc.devWorkspace.complete.useMutation();
  const featureMutation = trpc.devWorkspace.generateFeature.useMutation();
  const gitMutation = trpc.devWorkspace.gitOps.useMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { role: "user" as const, content: input };
    setMessages(prev => [...prev, newMsg]);
    codeMutation.mutate({
      message: input,
      context: editorContent ? { currentFile: editorFile, fileContent: editorContent, language: editorLang } : undefined,
      history: messages.slice(-10),
      mode,
    });
    setInput("");
  };

  const handleComplete = () => {
    if (!editorContent) return;
    completeMutation.mutate({
      prefix: editorContent,
      language: editorLang,
      filename: editorFile,
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a1a] text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04] bg-[#0d0d20]">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-white tracking-tighter uppercase" style={{ fontFamily: "Syne, sans-serif" }}>
              Neural <span className="text-emerald-400">Core</span>
            </span>
            <div className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-[8px] font-mono text-emerald-400 tracking-[0.2em] uppercase">Autonomous Dev</div>
          </div>
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em] mt-1">Deep Learning Environment</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={showEditor ? "default" : "outline"}
            className="text-xs border-white/20"
            onClick={() => setShowEditor(!showEditor)}
          >
            {showEditor ? "Hide Editor" : "Show Editor"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs border-white/20"
            onClick={() => gitMutation.mutate({ operation: "status" })}
          >
            Git
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel (toggleable) */}
        {showEditor && (
          <div className="w-[45%] border-r border-white/10 flex flex-col">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-[#0d0d20]">
              <input
                value={editorFile}
                onChange={(e) => setEditorFile(e.target.value)}
                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white flex-1"
              />
              <select
                value={editorLang}
                onChange={(e) => setEditorLang(e.target.value)}
                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="rust">Rust</option>
                <option value="go">Go</option>
                <option value="css">CSS</option>
                <option value="html">HTML</option>
                <option value="sql">SQL</option>
              </select>
              <Button size="sm" variant="outline" className="text-xs border-white/20" onClick={handleComplete}>
                {completeMutation.isPending ? "..." : "⚡ Complete"}
              </Button>
            </div>
            <Textarea
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              className="flex-1 bg-black/40 border-0 text-white font-mono text-sm resize-none rounded-none focus-visible:ring-0"
              placeholder="// Write or paste code here...&#10;// AI will use this as context for your questions&#10;&#10;export function main() {&#10;  &#10;}"
              spellCheck={false}
            />
            {completeMutation.data && (
              <div className="border-t border-white/10 p-2 bg-emerald-900/20 max-h-32 overflow-y-auto">
                <div className="text-xs text-emerald-400 mb-1">AI Completion:</div>
                <pre className="text-xs text-white/80 whitespace-pre-wrap font-mono">{completeMutation.data.completion}</pre>
              </div>
            )}
          </div>
        )}

        {/* Main Chat/Workspace */}
        <div className="flex-1 flex flex-col">
          {/* Sub-tabs */}
          <div className="flex items-center border-b border-white/10 bg-[#0d0d20]">
            {(["chat", "scaffold", "complete"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setActivePanel(p)}
                className={`px-4 py-2 text-xs capitalize transition-colors ${
                  activePanel === p ? "text-emerald-400 border-b-2 border-emerald-400" : "text-white/50 hover:text-white/80"
                }`}
              >
                {p === "complete" ? "Generate Feature" : p}
              </button>
            ))}
          </div>

          {activePanel === "chat" && (
            <div className="flex-1 flex flex-col">
              {/* Mode Bar */}
              <div className="flex items-center gap-1 p-2 border-b border-white/5 overflow-x-auto">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                      mode === m.id ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-white/40 hover:text-white/70"
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
                    <div className="text-5xl mb-4">👨‍💻</div>
                    <h2 className="text-xl font-bold text-white/80 mb-2">Your AI Development Partner</h2>
                    <p className="text-sm text-white/40 max-w-md mb-6">
                      Write code, debug errors, generate tests, architect systems — powered by AI that understands your entire codebase.
                    </p>
                    <div className="grid grid-cols-2 gap-2 max-w-md">
                      {[
                        "Build a user dashboard with charts",
                        "Debug: TypeError cannot read undefined",
                        "Generate a REST API for blog posts",
                        "Architect a real-time chat system",
                      ].map((s) => (
                        <button
                          key={s}
                          onClick={() => setInput(s)}
                          className="px-3 py-2 text-xs text-left text-white/60 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-emerald-600/20 border border-emerald-500/30"
                        : "bg-white/5 border border-white/10"
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
                {codeMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-white/60">
                      <span className="animate-pulse">🧠</span> AI is thinking...
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
                    placeholder={`Ask AI to ${mode} code...`}
                    className="flex-1 bg-white/5 border-white/10 text-white resize-none min-h-[44px] max-h-[160px]"
                    rows={2}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={codeMutation.isPending || !input.trim()}
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 self-end"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activePanel === "scaffold" && (
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-lg font-bold mb-4">Project Templates</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {(templates || []).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => scaffoldMutation.mutate({ projectName: `my-${t.id}`, description: t.description, stack: "fullstack" })}
                    className="flex flex-col items-center gap-2 p-4 border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <span className="text-sm font-medium">{t.name}</span>
                    <span className="text-[10px] text-white/40 text-center">{t.description}</span>
                  </button>
                ))}
              </div>
              {scaffoldMutation.data && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="font-bold mb-2">Generated: {scaffoldMutation.data.projectName}</h4>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <Streamdown>{scaffoldMutation.data.scaffold}</Streamdown>
                  </div>
                </div>
              )}
            </div>
          )}

          {activePanel === "complete" && (
            <div className="flex-1 flex flex-col p-6">
              <h3 className="text-lg font-bold mb-2">Generate Complete Feature</h3>
              <p className="text-sm text-white/40 mb-4">Describe a feature and AI will generate all files (router, page, tests, schema).</p>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe the feature you want to build... e.g. 'A real-time notification system with push notifications, email digests, and in-app alerts'"
                className="bg-white/5 border-white/10 text-white min-h-[120px] mb-4"
              />
              <Button
                onClick={() => featureMutation.mutate({ description: input })}
                disabled={featureMutation.isPending || !input.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 w-fit"
              >
                {featureMutation.isPending ? "Generating..." : "Generate Feature →"}
              </Button>
              {featureMutation.data && (
                <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4 flex-1 overflow-y-auto">
                  <div className="prose prose-invert prose-sm max-w-none">
                    <Streamdown>{featureMutation.data.generatedCode}</Streamdown>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Git Panel */}
        {gitMutation.data && (
          <div className="w-56 border-l border-white/10 flex flex-col bg-[#0d0d20]">
            <div className="p-3 border-b border-white/10">
              <h3 className="text-xs font-bold text-white/60 uppercase">Git</h3>
            </div>
            <div className="flex-1 p-3">
              <div className="font-mono text-xs text-white/70 whitespace-pre-wrap">{gitMutation.data.output}</div>
            </div>
            <div className="p-2 border-t border-white/10 space-y-1">
              {(["status", "log", "diff", "branch"] as const).map((op) => (
                <Button
                  key={op}
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start text-xs text-white/60"
                  onClick={() => gitMutation.mutate({ operation: op })}
                >
                  git {op}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
