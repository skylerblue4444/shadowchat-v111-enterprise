/**
 * Customer Support / Help Desk Router — Tickets, live chat, AI support, knowledge base
 * Inspired by Zendesk, Intercom, Freshdesk patterns
 */
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";

export const supportDeskRouter = router({
  // ─── Get tickets ───────────────────────────────────────────────────────────
  getTickets: protectedProcedure
    .input(z.object({ status: z.enum(["open", "pending", "resolved", "all"]).default("all") }))
    .query(async ({ input, ctx }) => {
      return {
        tickets: [
          { id: "tkt_1", subject: "Cannot withdraw crypto", status: "open", priority: "high", category: "Wallet", createdAt: new Date(Date.now() - 3600000), assignee: "AI Bot" },
          { id: "tkt_2", subject: "Dating match not showing", status: "pending", priority: "medium", category: "Dating", createdAt: new Date(Date.now() - 86400000), assignee: "Sarah" },
          { id: "tkt_3", subject: "Feature request: dark mode", status: "resolved", priority: "low", category: "UI", createdAt: new Date(Date.now() - 172800000), assignee: "AI Bot" },
        ],
        stats: { open: 12, pending: 5, resolved: 234, avgResponseTime: "2.3 hours", satisfaction: 4.7 },
      };
    }),

  // ─── Create ticket ─────────────────────────────────────────────────────────
  createTicket: protectedProcedure
    .input(z.object({ subject: z.string(), description: z.string(), category: z.string(), priority: z.enum(["low", "medium", "high", "critical"]) }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        ticketId: `tkt_${Date.now()}`,
        status: "open",
        estimatedResponse: "Within 2 hours",
        aiSuggestion: "Based on your issue, try clearing your cache and reconnecting your wallet. If the issue persists, our team will investigate.",
      };
    }),

  // ─── AI support chat ───────────────────────────────────────────────────────
  aiSupportChat: protectedProcedure
    .input(z.object({ message: z.string(), ticketId: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are ShadowChat's AI support agent. Help users with their issues professionally and efficiently. If you cannot resolve the issue, escalate to a human agent." },
            { role: "user", content: input.message },
          ],
        });
        return {
          success: true,
          response: response.choices[0]?.message?.content || "I'll connect you with a human agent.",
          resolved: false,
          escalated: false,
        };
      } catch {
        return {
          success: true,
          response: "I understand your concern. Let me connect you with a human agent who can help further.",
          resolved: false,
          escalated: true,
        };
      }
    }),

  // ─── Get satisfaction metrics ──────────────────────────────────────────────
  getSatisfactionMetrics: protectedProcedure
    .query(async ({ ctx }) => {
      return {
        overall: 4.7,
        breakdown: { "5": 67, "4": 22, "3": 7, "2": 3, "1": 1 },
        nps: 72,
        responseTime: { average: "2.3h", median: "45min", p95: "8h" },
        resolutionRate: 94.5,
        aiResolutionRate: 78.2,
        topIssues: [
          { category: "Wallet", count: 45, trend: "down" },
          { category: "Trading", count: 34, trend: "stable" },
          { category: "Account", count: 23, trend: "down" },
        ],
      };
    }),
});
