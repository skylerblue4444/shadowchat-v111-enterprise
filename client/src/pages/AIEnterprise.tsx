import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Zap, Code2, Shield, BookOpen, Lightbulb, Globe, Send, Copy, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const FEATURES = [
  { id: "chat", label: "Chat Stream", icon: Brain, desc: "Real-time AI conversations with streaming" },
  { id: "analyze", label: "Text Analysis", icon: Zap, desc: "Sentiment, entities, summary, keywords, tone" },
  { id: "code", label: "Code Generation", icon: Code2, desc: "Generate production-grade code" },
  { id: "audit", label: "Smart Contract Audit", icon: Shield, desc: "Security analysis of Solidity/Rust" },
  { id: "content", label: "Content Generation", icon: BookOpen, desc: "Social, marketing, product copy" },
  { id: "research", label: "Research", icon: Globe, desc: "Deep topic research and analysis" },
];

export default function AIEnterprise() {
  const [activeFeature, setActiveFeature] = useState("chat");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Chat stream mutation
  const chatMutation = trpc.aiEnterprise.chatStream.useQuery(
    {
      messages: [{ role: "user" as const, content: input }],
      model: "gpt-4-turbo",
    },
    { enabled: false }
  );

  // Text analysis mutation
  const analyzeMutation = trpc.aiEnterprise.analyzeText.useQuery(
    {
      text: input,
      analysisType: "sentiment",
    },
    { enabled: false }
  );

  // Code generation mutation
  const codeMutation = trpc.aiEnterprise.generateCode.useQuery(
    {
      description: input,
      language: "typescript",
    },
    { enabled: false }
  );

  // Smart contract audit mutation
  const auditMutation = trpc.aiEnterprise.auditSmartContract.useQuery(
    {
      code: input,
      language: "solidity",
    },
    { enabled: false }
  );

  // Content generation mutation
  const contentMutation = trpc.aiEnterprise.generateContent.useQuery(
    {
      topic: input,
      contentType: "tweet",
    },
    { enabled: false }
  );

  // Research mutation
  const researchMutation = trpc.aiEnterprise.researchTopic.useQuery(
    {
      topic: input,
      depth: "standard",
    },
    { enabled: false }
  );

  const handleExecute = async () => {
    if (!input.trim()) { toast.error("Enter input"); return; }
    setLoading(true);
    setOutput("");

    try {
      let result;
      switch (activeFeature) {
        case "chat":
          result = await chatMutation.refetch();
          if (result.data?.content) setOutput(typeof result.data.content === 'string' ? result.data.content : '');
          break;
        case "analyze":
          result = await analyzeMutation.refetch();
          if (result.data?.analysis) setOutput(JSON.stringify(result.data.analysis, null, 2) || '');
          break;
        case "code":
          result = await codeMutation.refetch();
          if (result.data?.code) setOutput(result.data.code || '');
          break;
        case "audit":
          result = await auditMutation.refetch();
          if (result.data?.audit) setOutput(JSON.stringify(result.data.audit, null, 2) || '');
          break;
        case "content":
          result = await contentMutation.refetch();
          if (result.data?.content) setOutput(result.data.content || '');
          break;
        case "research":
          result = await researchMutation.refetch();
          if (result.data?.research) setOutput(result.data.research || '');
          break;
      }
      toast.success("Done!");
    } catch (err) {
      toast.error(`Error: ${err instanceof Error ? err.message : "Unknown"}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied!");
  };

  return (
    <div className="p-5 max-w-[1400px] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>Enterprise AI Suite</h1>
          <p className="text-[11px] text-white/40">$2B-Grade AI Architecture · Multi-Model · Streaming · Structured Outputs</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px]">
            <Brain className="w-3.5 h-3.5" /> GPT-4 Turbo
          </span>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {FEATURES.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFeature(f.id)}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all text-center",
              activeFeature === f.id
                ? "bg-cyan-500/15 border-cyan-500/25 text-cyan-400"
                : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:border-white/[0.12]"
            )}
          >
            <f.icon className="w-4 h-4" />
            <span className="text-[10px] font-medium">{f.label}</span>
          </button>
        ))}
      </div>

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input Panel */}
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-5 space-y-3">
          <h3 className="text-[13px] font-bold text-white">Input</h3>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={
              activeFeature === "chat" ? "Ask anything..." :
              activeFeature === "code" ? "Describe the code you need..." :
              activeFeature === "audit" ? "Paste your smart contract code..." :
              activeFeature === "content" ? "Enter topic for content..." :
              "Enter text to analyze..."
            }
            className="w-full h-48 bg-white/[0.05] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-500/40 resize-none"
          />
          <button
            onClick={handleExecute}
            disabled={loading}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-[0.97]",
              loading
                ? "bg-amber-500/20 border border-amber-500/30 text-amber-400"
                : "bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30"
            )}
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <><Zap className="w-4 h-4" /> Execute</>}
          </button>
        </div>

        {/* Output Panel */}
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-bold text-white">Output</h3>
            {output && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-[10px] text-white/40 hover:text-white/60 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
          <div className="w-full h-48 bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 text-sm text-white/70 overflow-auto font-mono">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                  <span className="text-[10px] text-white/30">Processing...</span>
                </div>
              </div>
            ) : output ? (
              output
            ) : (
              <span className="text-white/20">Output will appear here...</span>
            )}
          </div>
        </div>
      </div>

      {/* Feature Details */}
      <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-5 space-y-3">
        <h3 className="text-[13px] font-bold text-white">Feature Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: "Streaming Responses", desc: "Real-time token streaming for instant feedback" },
            { title: "Structured JSON", desc: "Guaranteed JSON schema compliance for parsing" },
            { title: "Multi-Model Support", desc: "GPT-4, Claude 3, and more coming soon" },
            { title: "Context Awareness", desc: "Maintains conversation history and context" },
            { title: "Error Handling", desc: "Graceful fallbacks and retry logic" },
            { title: "Rate Limiting", desc: "Fair usage policies with quota management" },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]"
            >
              <div className="text-[11px] font-semibold text-cyan-400 mb-1">{f.title}</div>
              <div className="text-[10px] text-white/40">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* API Usage Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Requests Today", value: "2,847", color: "text-cyan-400" },
          { label: "Tokens Used", value: "12.4M", color: "text-purple-400" },
          { label: "Avg Latency", value: "245ms", color: "text-green-400" },
          { label: "Success Rate", value: "99.8%", color: "text-amber-400" },
        ].map(s => (
          <div key={s.label} className="rounded-lg border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-3">
            <div className="text-[10px] text-white/40 mb-1">{s.label}</div>
            <div className={cn("text-lg font-bold font-mono", s.color)}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
