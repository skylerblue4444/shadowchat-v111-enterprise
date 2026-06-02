import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

// ─── AGENT OPERATING SYSTEM (Temporal + LangGraph + AutoGPT inspired) ────────
interface Agent {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  status: "active" | "idle" | "error" | "deprecated" | "pending_review";
  capabilities: string[];
  permissions: AgentPermission[];
  model: string;
  systemPrompt: string;
  tools: AgentTool[];
  billing: AgentBilling;
  metrics: AgentMetrics;
  config: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

interface AgentPermission {
  resource: string;
  actions: ("read" | "write" | "execute" | "delete")[];
  scope: "user" | "team" | "org" | "global";
}

interface AgentTool {
  id: string;
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  endpoint?: string;
}

interface AgentBilling {
  model: "per_execution" | "per_token" | "subscription" | "free";
  pricePerExecution?: number;
  pricePerToken?: number;
  monthlyPrice?: number;
  totalRevenue: number;
  totalExecutions: number;
}

interface AgentMetrics {
  totalExecutions: number;
  successRate: number;
  avgLatencyMs: number;
  tokensUsed: number;
  errorCount: number;
  lastExecution: number;
  rating: number;
  reviews: number;
}

interface AgentExecution {
  id: string;
  agentId: string;
  userId: string;
  status: "running" | "completed" | "failed" | "cancelled" | "timeout";
  input: any;
  output: any;
  tokensUsed: number;
  latencyMs: number;
  cost: number;
  startedAt: number;
  completedAt?: number;
  steps: ExecutionStep[];
}

interface ExecutionStep {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  input: any;
  output: any;
  duration: number;
  toolCalls: string[];
}

// In-memory stores
const agents = new Map<string, Agent>();
const executions: AgentExecution[] = [];

// Seed enterprise agents
const seedAgents: Agent[] = [
  {
    id: "agent_architect", name: "System Architect", version: "2.1.0",
    description: "Designs system architecture, reviews PRs, suggests optimizations. Understands microservices, event-driven, and serverless patterns.",
    author: "ShadowChat Core", status: "active",
    capabilities: ["code_review", "architecture_design", "optimization", "security_audit"],
    permissions: [{ resource: "code", actions: ["read", "write"], scope: "org" }, { resource: "deployments", actions: ["read", "execute"], scope: "team" }],
    model: "gpt-4o", systemPrompt: "You are a senior system architect with 20 years experience...",
    tools: [
      { id: "t1", name: "code_analysis", description: "Analyze code quality and patterns", inputSchema: { code: "string", language: "string" } },
      { id: "t2", name: "diagram_gen", description: "Generate architecture diagrams", inputSchema: { description: "string" } },
    ],
    billing: { model: "per_execution", pricePerExecution: 0.05, totalRevenue: 12500, totalExecutions: 250000 },
    metrics: { totalExecutions: 250000, successRate: 0.97, avgLatencyMs: 2300, tokensUsed: 45000000, errorCount: 7500, lastExecution: Date.now() - 300000, rating: 4.8, reviews: 1250 },
    config: { maxTokens: 4096, temperature: 0.3 }, createdAt: Date.now() - 180 * 86400000, updatedAt: Date.now() - 2 * 86400000,
  },
  {
    id: "agent_trader", name: "Crypto Trading Bot", version: "3.0.1",
    description: "AI-powered crypto trading with technical analysis, sentiment analysis, and risk management.",
    author: "ShadowChat Finance", status: "active",
    capabilities: ["market_analysis", "trade_execution", "risk_management", "portfolio_optimization"],
    permissions: [{ resource: "wallet", actions: ["read", "execute"], scope: "user" }, { resource: "exchange", actions: ["read", "execute"], scope: "user" }],
    model: "gpt-4o", systemPrompt: "You are an expert crypto trader...",
    tools: [
      { id: "t3", name: "market_data", description: "Fetch real-time market data", inputSchema: { symbol: "string", timeframe: "string" } },
      { id: "t4", name: "execute_trade", description: "Execute a trade order", inputSchema: { symbol: "string", side: "string", amount: "number" } },
    ],
    billing: { model: "per_execution", pricePerExecution: 0.10, totalRevenue: 45000, totalExecutions: 450000 },
    metrics: { totalExecutions: 450000, successRate: 0.92, avgLatencyMs: 1500, tokensUsed: 80000000, errorCount: 36000, lastExecution: Date.now() - 60000, rating: 4.6, reviews: 890 },
    config: { maxRiskPercent: 2, stopLossPercent: 5 }, createdAt: Date.now() - 120 * 86400000, updatedAt: Date.now() - 86400000,
  },
  {
    id: "agent_devops", name: "DevOps Orchestrator", version: "1.8.0",
    description: "Manages CI/CD pipelines, infrastructure provisioning, monitoring alerts, and incident response.",
    author: "ShadowChat Infra", status: "active",
    capabilities: ["ci_cd", "infrastructure", "monitoring", "incident_response", "cost_optimization"],
    permissions: [{ resource: "infrastructure", actions: ["read", "write", "execute"], scope: "org" }, { resource: "secrets", actions: ["read"], scope: "team" }],
    model: "gpt-4o", systemPrompt: "You are a DevOps engineer...",
    tools: [
      { id: "t5", name: "deploy", description: "Deploy to environment", inputSchema: { service: "string", env: "string" } },
      { id: "t6", name: "scale", description: "Scale service instances", inputSchema: { service: "string", replicas: "number" } },
    ],
    billing: { model: "subscription", monthlyPrice: 99, totalRevenue: 29700, totalExecutions: 180000 },
    metrics: { totalExecutions: 180000, successRate: 0.99, avgLatencyMs: 800, tokensUsed: 25000000, errorCount: 1800, lastExecution: Date.now() - 120000, rating: 4.9, reviews: 456 },
    config: { autoScale: true, alertThreshold: 0.8 }, createdAt: Date.now() - 200 * 86400000, updatedAt: Date.now() - 3 * 86400000,
  },
  {
    id: "agent_content", name: "Content Creator AI", version: "2.5.0",
    description: "Generates social posts, articles, marketing copy, and multimedia content with brand consistency.",
    author: "ShadowChat Creative", status: "active",
    capabilities: ["copywriting", "social_media", "seo", "image_prompts", "video_scripts"],
    permissions: [{ resource: "content", actions: ["read", "write"], scope: "team" }, { resource: "media", actions: ["read", "write"], scope: "user" }],
    model: "gpt-4o", systemPrompt: "You are a creative content strategist...",
    tools: [
      { id: "t7", name: "generate_image", description: "Generate image from prompt", inputSchema: { prompt: "string", style: "string" } },
      { id: "t8", name: "schedule_post", description: "Schedule social media post", inputSchema: { content: "string", platform: "string", time: "string" } },
    ],
    billing: { model: "per_token", pricePerToken: 0.00002, totalRevenue: 18000, totalExecutions: 320000 },
    metrics: { totalExecutions: 320000, successRate: 0.95, avgLatencyMs: 3200, tokensUsed: 900000000, errorCount: 16000, lastExecution: Date.now() - 600000, rating: 4.7, reviews: 2100 },
    config: { brandVoice: "professional_friendly", maxLength: 2000 }, createdAt: Date.now() - 90 * 86400000, updatedAt: Date.now() - 86400000,
  },
  {
    id: "agent_security", name: "Security Sentinel", version: "1.3.0",
    description: "Monitors for threats, analyzes vulnerabilities, manages incident response, and enforces compliance.",
    author: "ShadowChat Security", status: "active",
    capabilities: ["threat_detection", "vulnerability_scan", "compliance", "incident_response", "access_control"],
    permissions: [{ resource: "logs", actions: ["read"], scope: "global" }, { resource: "security", actions: ["read", "write", "execute"], scope: "org" }],
    model: "gpt-4o", systemPrompt: "You are a cybersecurity expert...",
    tools: [
      { id: "t9", name: "scan_vulnerabilities", description: "Scan for security vulnerabilities", inputSchema: { target: "string" } },
      { id: "t10", name: "block_ip", description: "Block suspicious IP", inputSchema: { ip: "string", reason: "string" } },
    ],
    billing: { model: "subscription", monthlyPrice: 149, totalRevenue: 44700, totalExecutions: 500000 },
    metrics: { totalExecutions: 500000, successRate: 0.998, avgLatencyMs: 450, tokensUsed: 15000000, errorCount: 1000, lastExecution: Date.now() - 30000, rating: 4.95, reviews: 320 },
    config: { alertLevel: "high", autoBlock: true }, createdAt: Date.now() - 250 * 86400000, updatedAt: Date.now() - 86400000,
  },
];

seedAgents.forEach(a => agents.set(a.id, a));

export const agentOSRouter = router({
  // ─── AGENT REGISTRY ────────────────────────────────────────────────
  registry: publicProcedure
    .input(z.object({
      status: z.enum(["active", "idle", "error", "deprecated", "pending_review"]).optional(),
      capability: z.string().optional(),
      sortBy: z.enum(["rating", "executions", "revenue", "newest"]).default("rating"),
    }))
    .query(async ({ input }) => {
      let list = Array.from(agents.values());
      if (input.status) list = list.filter(a => a.status === input.status);
      if (input.capability) list = list.filter(a => a.capabilities.includes(input.capability!));

      switch (input.sortBy) {
        case "rating": list.sort((a, b) => b.metrics.rating - a.metrics.rating); break;
        case "executions": list.sort((a, b) => b.metrics.totalExecutions - a.metrics.totalExecutions); break;
        case "revenue": list.sort((a, b) => b.billing.totalRevenue - a.billing.totalRevenue); break;
        case "newest": list.sort((a, b) => b.createdAt - a.createdAt); break;
      }

      return { agents: list, total: list.length };
    }),

  // ─── GET AGENT DETAILS ─────────────────────────────────────────────
  getAgent: protectedProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input }) => {
      const agent = agents.get(input.agentId);
      if (!agent) throw new Error("Agent not found");
      return agent;
    }),

  // ─── EXECUTE AGENT ─────────────────────────────────────────────────
  execute: protectedProcedure
    .input(z.object({
      agentId: z.string(),
      input: z.string(),
      context: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const agent = agents.get(input.agentId);
      if (!agent) throw new Error("Agent not found");
      if (agent.status !== "active") throw new Error("Agent is not active");

      const startTime = Date.now();

      // Execute via LLM
      const response = await invokeLLM({
        messages: [
          { role: "system", content: agent.systemPrompt },
          { role: "user", content: input.input },
        ],
      });

      const output = String(response.choices[0]?.message?.content || "");
      const latency = Date.now() - startTime;
      const tokensUsed = output.length / 4; // rough estimate

      // Calculate cost
      let cost = 0;
      if (agent.billing.model === "per_execution") cost = agent.billing.pricePerExecution || 0;
      else if (agent.billing.model === "per_token") cost = tokensUsed * (agent.billing.pricePerToken || 0);

      // Record execution
      const execution: AgentExecution = {
        id: `exec_${Date.now()}`,
        agentId: agent.id,
        userId: String(ctx.user.id),
        status: "completed",
        input: input.input,
        output,
        tokensUsed,
        latencyMs: latency,
        cost,
        startedAt: startTime,
        completedAt: Date.now(),
        steps: [{ id: "s1", name: "llm_inference", status: "completed", input: input.input, output, duration: latency, toolCalls: [] }],
      };
      executions.push(execution);

      // Update metrics
      agent.metrics.totalExecutions++;
      agent.metrics.tokensUsed += tokensUsed;
      agent.metrics.lastExecution = Date.now();
      agent.billing.totalRevenue += cost;
      agent.billing.totalExecutions++;

      return { execution, output, cost, latencyMs: latency };
    }),

  // ─── EXECUTION HISTORY ─────────────────────────────────────────────
  executions: protectedProcedure
    .input(z.object({
      agentId: z.string().optional(),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      let list = executions.filter(e => e.userId === String(ctx.user.id));
      if (input.agentId) list = list.filter(e => e.agentId === input.agentId);
      return { executions: list.slice(-input.limit).reverse(), total: list.length };
    }),

  // ─── REGISTER NEW AGENT ────────────────────────────────────────────
  register: protectedProcedure
    .input(z.object({
      name: z.string().min(2),
      description: z.string(),
      capabilities: z.array(z.string()),
      model: z.string().default("gpt-4o"),
      systemPrompt: z.string(),
      billingModel: z.enum(["per_execution", "per_token", "subscription", "free"]),
      price: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const id = `agent_${Date.now()}`;
      const agent: Agent = {
        id, name: input.name, version: "1.0.0",
        description: input.description, author: String(ctx.user.name || "Unknown"),
        status: "pending_review", capabilities: input.capabilities,
        permissions: [], model: input.model, systemPrompt: input.systemPrompt,
        tools: [],
        billing: {
          model: input.billingModel,
          pricePerExecution: input.billingModel === "per_execution" ? input.price : undefined,
          pricePerToken: input.billingModel === "per_token" ? input.price : undefined,
          monthlyPrice: input.billingModel === "subscription" ? input.price : undefined,
          totalRevenue: 0, totalExecutions: 0,
        },
        metrics: { totalExecutions: 0, successRate: 0, avgLatencyMs: 0, tokensUsed: 0, errorCount: 0, lastExecution: 0, rating: 0, reviews: 0 },
        config: {}, createdAt: Date.now(), updatedAt: Date.now(),
      };
      agents.set(id, agent);
      return { success: true, agent };
    }),

  // ─── AGENT VERSIONING ──────────────────────────────────────────────
  updateVersion: protectedProcedure
    .input(z.object({
      agentId: z.string(),
      version: z.string(),
      changelog: z.string(),
      systemPrompt: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const agent = agents.get(input.agentId);
      if (!agent) throw new Error("Agent not found");
      agent.version = input.version;
      if (input.systemPrompt) agent.systemPrompt = input.systemPrompt;
      agent.updatedAt = Date.now();
      return { success: true, version: input.version, changelog: input.changelog };
    }),

  // ─── PLATFORM STATS ────────────────────────────────────────────────
  platformStats: publicProcedure.query(async () => {
    const allAgents = Array.from(agents.values());
    return {
      totalAgents: allAgents.length,
      activeAgents: allAgents.filter(a => a.status === "active").length,
      totalExecutions: allAgents.reduce((s, a) => s + a.metrics.totalExecutions, 0),
      totalRevenue: allAgents.reduce((s, a) => s + a.billing.totalRevenue, 0),
      avgRating: allAgents.reduce((s, a) => s + a.metrics.rating, 0) / (allAgents.length || 1),
      topCapabilities: ["code_review", "market_analysis", "content_creation", "security", "devops"],
    };
  }),
});
