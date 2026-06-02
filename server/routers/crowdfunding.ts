/**
 * Crowdfunding Router — Project Funding, Equity Crowdfunding, Rewards, DAO Treasury
 * Inspired by Kickstarter, Republic, Juicebox patterns
 */
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const crowdfundingRouter = router({
  // ─── Get campaigns ─────────────────────────────────────────────────────────
  getCampaigns: publicProcedure
    .input(z.object({ category: z.string().optional(), status: z.enum(["active", "funded", "all"]).default("active") }))
    .query(async ({ input }) => {
      return {
        campaigns: [
          { id: "camp_1", title: "ShadowChat Mobile App", goal: 500000, raised: 387500, backers: 2345, daysLeft: 14, category: "Technology", equity: 5, tokenReward: 10000 },
          { id: "camp_2", title: "HOPE AI Research Lab", goal: 1000000, raised: 892000, backers: 5678, daysLeft: 7, category: "AI", equity: 3, tokenReward: 25000 },
          { id: "camp_3", title: "Decentralized VPN Network", goal: 250000, raised: 198000, backers: 1234, daysLeft: 21, category: "Privacy", equity: 8, tokenReward: 5000 },
          { id: "camp_4", title: "Crypto Mining Farm Expansion", goal: 2000000, raised: 1456000, backers: 890, daysLeft: 3, category: "Mining", equity: 10, tokenReward: 50000 },
          { id: "camp_5", title: "AI Music Platform", goal: 150000, raised: 145000, backers: 3456, daysLeft: 1, category: "Entertainment", equity: 6, tokenReward: 3000 },
        ],
        totalActive: 47,
        totalFunded: 234,
        totalRaised: 45678900,
      };
    }),

  // ─── Back campaign ─────────────────────────────────────────────────────────
  backCampaign: protectedProcedure
    .input(z.object({ campaignId: z.string(), amount: z.number(), paymentMethod: z.enum(["crypto", "card", "wallet"]), tier: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        pledgeId: `pledge_${Date.now()}`,
        amount: input.amount,
        equityReceived: input.amount >= 10000 ? 0.1 : 0,
        tokensReceived: Math.floor(input.amount / 10),
        rewards: input.amount >= 1000 ? ["Early Access", "Exclusive Badge", "Founding Member NFT"] : ["Early Access"],
      };
    }),

  // ─── Create campaign ───────────────────────────────────────────────────────
  createCampaign: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      goal: z.number(),
      durationDays: z.number(),
      category: z.string(),
      equityOffered: z.number().optional(),
      tokenReward: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        campaignId: `camp_${Date.now()}`,
        title: input.title,
        status: "pending_review",
        estimatedLaunch: new Date(Date.now() + 172800000),
      };
    }),

  // ─── Get my investments ────────────────────────────────────────────────────
  getMyInvestments: protectedProcedure
    .query(async ({ ctx }) => {
      return {
        investments: [
          { campaignId: "camp_1", title: "ShadowChat Mobile App", invested: 5000, equity: 0.5, tokens: 500, status: "active", roi: 0 },
          { campaignId: "camp_2", title: "HOPE AI Research Lab", invested: 25000, equity: 0.75, tokens: 2500, status: "funded", roi: 34.5 },
        ],
        totalInvested: 30000,
        totalEquity: 1.25,
        totalTokens: 3000,
        estimatedValue: 42500,
      };
    }),
});
