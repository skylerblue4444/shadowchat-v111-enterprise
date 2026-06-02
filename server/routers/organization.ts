import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

// ─── ORGANIZATION DATA MODEL (Cal.com / Slack inspired) ──────────────────────
// User → Team → Department → Organization → Enterprise
interface OrgMember { userId: string; name: string; role: "owner" | "admin" | "member" | "viewer"; joinedAt: number; department?: string; }
interface Team { id: string; name: string; slug: string; description: string; members: OrgMember[]; createdAt: number; parentDept?: string; sharedAgents: string[]; permissions: string[]; }
interface Department { id: string; name: string; head: string; teams: string[]; budget: number; aiQuota: number; }
interface Organization { id: string; name: string; slug: string; plan: "starter" | "pro" | "enterprise"; owner: string; departments: Department[]; teams: Team[]; settings: OrgSettings; createdAt: number; memberCount: number; }
interface OrgSettings { ssoEnabled: boolean; mfaRequired: boolean; ipWhitelist: string[]; dataRetentionDays: number; aiPolicyLevel: "open" | "moderate" | "strict"; maxTeams: number; maxMembers: number; customBranding: boolean; }
interface Workspace { id: string; name: string; orgId: string; type: "project" | "channel" | "shared"; members: string[]; aiAgents: string[]; resources: any[]; createdAt: number; }

// In-memory store (production: DB)
const organizations = new Map<string, Organization>();
const workspaces = new Map<string, Workspace>();

// Seed default org
organizations.set("org_default", {
  id: "org_default", name: "ShadowChat Enterprise", slug: "shadowchat", plan: "enterprise",
  owner: "owner_1", memberCount: 156,
  departments: [
    { id: "dept_eng", name: "Engineering", head: "CTO", teams: ["team_platform", "team_ai", "team_infra"], budget: 500000, aiQuota: 100000 },
    { id: "dept_product", name: "Product", head: "CPO", teams: ["team_design", "team_pm"], budget: 200000, aiQuota: 50000 },
    { id: "dept_ops", name: "Operations", head: "COO", teams: ["team_support", "team_finance"], budget: 150000, aiQuota: 25000 },
  ],
  teams: [
    { id: "team_platform", name: "Platform Team", slug: "platform", description: "Core platform development", members: [{ userId: "u1", name: "Alice", role: "admin", joinedAt: Date.now() - 90 * 86400000 }], createdAt: Date.now() - 180 * 86400000, sharedAgents: ["agent_coderev", "agent_deploy"], permissions: ["deploy", "db_admin", "secrets"], parentDept: "dept_eng" },
    { id: "team_ai", name: "AI/ML Team", slug: "ai-ml", description: "AI model development and training", members: [{ userId: "u2", name: "Bob", role: "admin", joinedAt: Date.now() - 60 * 86400000 }], createdAt: Date.now() - 120 * 86400000, sharedAgents: ["agent_trainer", "agent_eval"], permissions: ["gpu_access", "model_deploy", "data_access"], parentDept: "dept_eng" },
    { id: "team_infra", name: "Infrastructure", slug: "infra", description: "Cloud infrastructure and DevOps", members: [{ userId: "u3", name: "Charlie", role: "admin", joinedAt: Date.now() - 45 * 86400000 }], createdAt: Date.now() - 150 * 86400000, sharedAgents: ["agent_monitor", "agent_incident"], permissions: ["infra_admin", "secrets", "networking"], parentDept: "dept_eng" },
  ],
  settings: { ssoEnabled: true, mfaRequired: true, ipWhitelist: [], dataRetentionDays: 365, aiPolicyLevel: "moderate", maxTeams: 50, maxMembers: 500, customBranding: true },
  createdAt: Date.now() - 365 * 86400000,
});

export const organizationRouter = router({
  // ─── GET ORGANIZATION ──────────────────────────────────────────────
  get: protectedProcedure
    .input(z.object({ orgId: z.string().default("org_default") }))
    .query(async ({ input }) => {
      const org = organizations.get(input.orgId);
      if (!org) throw new Error("Organization not found");
      return org;
    }),

  // ─── LIST TEAMS ────────────────────────────────────────────────────
  teams: protectedProcedure
    .input(z.object({ orgId: z.string().default("org_default"), department: z.string().optional() }))
    .query(async ({ input }) => {
      const org = organizations.get(input.orgId);
      if (!org) return { teams: [] };
      let teams = org.teams;
      if (input.department) teams = teams.filter(t => t.parentDept === input.department);
      return { teams, total: teams.length };
    }),

  // ─── CREATE TEAM ───────────────────────────────────────────────────
  createTeam: protectedProcedure
    .input(z.object({
      name: z.string().min(2),
      description: z.string(),
      department: z.string().optional(),
      permissions: z.array(z.string()).default([]),
    }))
    .mutation(async ({ ctx, input }) => {
      const org = organizations.get("org_default")!;
      const team: Team = {
        id: `team_${Date.now()}`,
        name: input.name,
        slug: input.name.toLowerCase().replace(/\s+/g, "-"),
        description: input.description,
        members: [{ userId: String(ctx.user.id), name: ctx.user.name || "User", role: "owner", joinedAt: Date.now() }],
        createdAt: Date.now(),
        parentDept: input.department,
        sharedAgents: [],
        permissions: input.permissions,
      };
      org.teams.push(team);
      return { success: true, team };
    }),

  // ─── INVITE MEMBER ─────────────────────────────────────────────────
  inviteMember: protectedProcedure
    .input(z.object({
      teamId: z.string(),
      email: z.string().email(),
      role: z.enum(["admin", "member", "viewer"]).default("member"),
    }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        invitation: { teamId: input.teamId, email: input.email, role: input.role, expiresAt: Date.now() + 7 * 86400000, token: `inv_${Date.now()}` },
      };
    }),

  // ─── WORKSPACES ────────────────────────────────────────────────────
  workspaces: protectedProcedure
    .input(z.object({ orgId: z.string().default("org_default") }))
    .query(async ({ input }) => {
      const ws = Array.from(workspaces.values()).filter(w => w.orgId === input.orgId);
      return {
        workspaces: ws.length > 0 ? ws : [
          { id: "ws_main", name: "Main Workspace", orgId: input.orgId, type: "project", members: ["u1", "u2", "u3"], aiAgents: ["agent_coderev"], resources: [], createdAt: Date.now() - 30 * 86400000 },
          { id: "ws_research", name: "AI Research Lab", orgId: input.orgId, type: "shared", members: ["u2", "u4"], aiAgents: ["agent_trainer", "agent_eval"], resources: [], createdAt: Date.now() - 15 * 86400000 },
          { id: "ws_ops", name: "Operations Hub", orgId: input.orgId, type: "channel", members: ["u3", "u5"], aiAgents: ["agent_monitor"], resources: [], createdAt: Date.now() - 7 * 86400000 },
        ],
      };
    }),

  // ─── CREATE WORKSPACE ──────────────────────────────────────────────
  createWorkspace: protectedProcedure
    .input(z.object({
      name: z.string().min(2),
      type: z.enum(["project", "channel", "shared"]),
      aiAgents: z.array(z.string()).default([]),
    }))
    .mutation(async ({ ctx, input }) => {
      const ws: Workspace = {
        id: `ws_${Date.now()}`,
        name: input.name,
        orgId: "org_default",
        type: input.type,
        members: [String(ctx.user.id)],
        aiAgents: input.aiAgents,
        resources: [],
        createdAt: Date.now(),
      };
      workspaces.set(ws.id, ws);
      return { success: true, workspace: ws };
    }),

  // ─── SHARED AI AGENTS ──────────────────────────────────────────────
  sharedAgents: protectedProcedure
    .input(z.object({ teamId: z.string().optional() }))
    .query(async () => {
      return {
        agents: [
          { id: "agent_coderev", name: "Code Reviewer", type: "development", status: "active", usageToday: 45, quota: 100, model: "gpt-4o", permissions: ["read_code", "comment_pr"] },
          { id: "agent_deploy", name: "Deploy Assistant", type: "devops", status: "active", usageToday: 12, quota: 50, model: "gpt-4o", permissions: ["deploy", "rollback"] },
          { id: "agent_trainer", name: "Model Trainer", type: "ml", status: "active", usageToday: 8, quota: 20, model: "custom", permissions: ["gpu_access", "data_read"] },
          { id: "agent_eval", name: "Eval Pipeline", type: "ml", status: "idle", usageToday: 0, quota: 30, model: "gpt-4o", permissions: ["data_read", "metrics_write"] },
          { id: "agent_monitor", name: "Incident Monitor", type: "ops", status: "active", usageToday: 156, quota: 500, model: "gpt-4o-mini", permissions: ["alerts", "logs_read"] },
          { id: "agent_incident", name: "Incident Responder", type: "ops", status: "standby", usageToday: 2, quota: 100, model: "gpt-4o", permissions: ["alerts", "deploy", "rollback"] },
        ],
      };
    }),

  // ─── ORG ANALYTICS ─────────────────────────────────────────────────
  analytics: protectedProcedure.query(async () => {
    return {
      memberActivity: { daily: 89, weekly: 142, monthly: 156 },
      aiUsage: { tokensUsed: 2450000, tokensQuota: 5000000, costThisMonth: 1250, agents: 6, executions: 3400 },
      teamProductivity: [
        { team: "Platform", score: 92, prsThisWeek: 23, deploysThisWeek: 8 },
        { team: "AI/ML", score: 88, prsThisWeek: 15, deploysThisWeek: 3 },
        { team: "Infrastructure", score: 95, prsThisWeek: 12, deploysThisWeek: 15 },
      ],
      billing: { plan: "enterprise", monthlySpend: 4500, seats: 156, aiCredits: 2450000 },
    };
  }),

  // ─── AI POLICY MANAGEMENT ──────────────────────────────────────────
  updateAIPolicy: protectedProcedure
    .input(z.object({
      level: z.enum(["open", "moderate", "strict"]),
      allowedModels: z.array(z.string()).optional(),
      dataRetentionDays: z.number().min(7).max(3650).optional(),
      auditLogging: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const org = organizations.get("org_default")!;
      org.settings.aiPolicyLevel = input.level;
      if (input.dataRetentionDays) org.settings.dataRetentionDays = input.dataRetentionDays;
      return { success: true, settings: org.settings };
    }),
});
