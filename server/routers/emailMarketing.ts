/**
 * Email Marketing Router — Campaigns, automation, templates, analytics
 * Inspired by Mailchimp, ConvertKit, SendGrid patterns
 */
import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const emailMarketingRouter = router({
  getCampaigns: protectedProcedure.query(async ({ ctx }) => ({
    campaigns: [
      { id: "em_1", name: "Welcome Series", status: "active", sent: 12456, opened: 8234, clicked: 3456, revenue: 23456, openRate: 66.1, clickRate: 27.7 },
      { id: "em_2", name: "Pro Upgrade Promo", status: "active", sent: 8900, opened: 5340, clicked: 1780, revenue: 45678, openRate: 60, clickRate: 20 },
      { id: "em_3", name: "Weekly Crypto Digest", status: "scheduled", sent: 0, opened: 0, clicked: 0, revenue: 0, openRate: 0, clickRate: 0 },
    ],
    stats: { totalSubscribers: 24900, totalSent: 234567, avgOpenRate: 62.3, avgClickRate: 24.1, totalRevenue: 234567 },
  })),
  createCampaign: protectedProcedure
    .input(z.object({ name: z.string(), subject: z.string(), content: z.string(), audience: z.string(), scheduledAt: z.string().optional() }))
    .mutation(async ({ input }) => ({ success: true, campaignId: `em_${Date.now()}`, status: input.scheduledAt ? "scheduled" : "draft", estimatedReach: 24900 })),
  getAutomations: protectedProcedure.query(async () => ({
    automations: [
      { id: "auto_1", name: "Welcome Onboarding", trigger: "signup", emails: 5, active: true, conversions: 2345 },
      { id: "auto_2", name: "Abandoned Cart", trigger: "cart_abandon", emails: 3, active: true, conversions: 567 },
      { id: "auto_3", name: "Re-engagement", trigger: "inactive_30d", emails: 4, active: true, conversions: 890 },
      { id: "auto_4", name: "Upgrade Nudge", trigger: "usage_limit", emails: 2, active: true, conversions: 1234 },
    ],
  })),
  getTemplates: protectedProcedure.query(async () => ({
    templates: [
      { id: "tpl_1", name: "Product Launch", category: "marketing", uses: 45 },
      { id: "tpl_2", name: "Weekly Newsletter", category: "newsletter", uses: 234 },
      { id: "tpl_3", name: "Transaction Receipt", category: "transactional", uses: 12456 },
      { id: "tpl_4", name: "Security Alert", category: "transactional", uses: 890 },
    ],
  })),
});
