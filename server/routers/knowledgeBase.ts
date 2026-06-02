/**
 * Knowledge Base Router — Help Center, Documentation, FAQ, Support Tickets
 * Inspired by Zendesk, Intercom, Notion patterns
 */
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const knowledgeBaseRouter = router({
  // ─── Search knowledge base ─────────────────────────────────────────────────
  search: publicProcedure
    .input(z.object({ query: z.string(), category: z.string().optional() }))
    .query(async ({ input }) => {
      return {
        results: [
          { id: "kb_1", title: "How to set up 2FA", category: "Security", relevance: 0.95, views: 12345 },
          { id: "kb_2", title: "Connecting your wallet", category: "Crypto", relevance: 0.87, views: 8901 },
          { id: "kb_3", title: "Creating AI agents", category: "AI", relevance: 0.82, views: 6789 },
          { id: "kb_4", title: "Marketplace seller guide", category: "Commerce", relevance: 0.78, views: 4567 },
        ],
        totalResults: 47,
        query: input.query,
      };
    }),

  // ─── Get categories ────────────────────────────────────────────────────────
  getCategories: publicProcedure
    .query(async () => {
      return {
        categories: [
          { id: "cat_1", name: "Getting Started", articles: 24, icon: "rocket" },
          { id: "cat_2", name: "Security & Privacy", articles: 18, icon: "shield" },
          { id: "cat_3", name: "Crypto & Trading", articles: 34, icon: "bitcoin" },
          { id: "cat_4", name: "AI & Agents", articles: 28, icon: "brain" },
          { id: "cat_5", name: "Marketplace", articles: 15, icon: "store" },
          { id: "cat_6", name: "Social & Dating", articles: 12, icon: "heart" },
          { id: "cat_7", name: "Developer Tools", articles: 42, icon: "code" },
          { id: "cat_8", name: "Billing & Plans", articles: 8, icon: "credit-card" },
        ],
      };
    }),

  // ─── Create support ticket ─────────────────────────────────────────────────
  createTicket: protectedProcedure
    .input(z.object({
      subject: z.string(),
      description: z.string(),
      priority: z.enum(["low", "medium", "high", "critical"]),
      category: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        ticketId: `ticket_${Date.now()}`,
        subject: input.subject,
        priority: input.priority,
        status: "open",
        createdBy: ctx.user.id,
        createdAt: new Date(),
        estimatedResponse: "2 hours",
      };
    }),

  // ─── Get tickets ───────────────────────────────────────────────────────────
  getTickets: protectedProcedure
    .input(z.object({ status: z.string().optional() }))
    .query(async ({ ctx }) => {
      return {
        tickets: [
          { id: "ticket_1", subject: "Cannot withdraw funds", priority: "high", status: "in_progress", assignee: "Support Team", createdAt: new Date(Date.now() - 3600000), lastUpdate: new Date(Date.now() - 1800000) },
          { id: "ticket_2", subject: "AI agent not responding", priority: "medium", status: "open", assignee: null, createdAt: new Date(Date.now() - 7200000), lastUpdate: new Date(Date.now() - 7200000) },
          { id: "ticket_3", subject: "Feature request: Dark mode", priority: "low", status: "resolved", assignee: "Dev Team", createdAt: new Date(Date.now() - 86400000), lastUpdate: new Date(Date.now() - 43200000) },
        ],
        openTickets: 2,
        resolvedTickets: 47,
      };
    }),

  // ─── FAQ ───────────────────────────────────────────────────────────────────
  getFaq: publicProcedure
    .query(async () => {
      return {
        faqs: [
          { id: "faq_1", question: "How do I get started?", answer: "Sign up, complete your profile, and explore the Mission Control dashboard.", category: "Getting Started" },
          { id: "faq_2", question: "Is my data secure?", answer: "Yes, we use enterprise-grade encryption, 2FA, and SOC2 compliance.", category: "Security" },
          { id: "faq_3", question: "How do I earn SKYCOIN?", answer: "Earn through mining, staking, referrals, content creation, and trading.", category: "Crypto" },
          { id: "faq_4", question: "Can I build my own AI agent?", answer: "Yes! Use our AI Agent Builder with no-code tools or custom code.", category: "AI" },
          { id: "faq_5", question: "What payment methods are accepted?", answer: "Crypto (all 7 coins), credit cards, bank transfer, and Wise.", category: "Billing" },
        ],
      };
    }),
});
