import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

// In-memory charity data (production would use DB)
const campaigns: any[] = [
  { id: "1", title: "Clean Water Initiative", description: "Providing clean water to 10,000 families in developing nations", goal: 50000, raised: 32450, donors: 245, category: "humanitarian", image: "🌊", endDate: Date.now() + 30 * 86400000, matched: true, matchRatio: 2 },
  { id: "2", title: "Code Education for Youth", description: "Teaching programming to underprivileged children worldwide", goal: 25000, raised: 18900, donors: 178, category: "education", image: "💻", endDate: Date.now() + 45 * 86400000, matched: true, matchRatio: 1.5 },
  { id: "3", title: "Reforestation Project", description: "Planting 1 million trees to combat climate change", goal: 100000, raised: 67800, donors: 512, category: "environment", image: "🌳", endDate: Date.now() + 60 * 86400000, matched: false, matchRatio: 1 },
  { id: "4", title: "Mental Health Support", description: "Free therapy sessions for those who cannot afford mental healthcare", goal: 35000, raised: 21000, donors: 156, category: "health", image: "🧠", endDate: Date.now() + 20 * 86400000, matched: true, matchRatio: 3 },
  { id: "5", title: "Animal Rescue Network", description: "Rescuing and rehabilitating abandoned animals", goal: 15000, raised: 12300, donors: 298, category: "animals", image: "🐾", endDate: Date.now() + 15 * 86400000, matched: false, matchRatio: 1 },
  { id: "6", title: "Disaster Relief Fund", description: "Emergency aid for communities affected by natural disasters", goal: 200000, raised: 145000, donors: 1024, category: "emergency", image: "🆘", endDate: Date.now() + 90 * 86400000, matched: true, matchRatio: 2 },
];

const donations: any[] = [];

export const charityRouter = router({
  // ─── LIST CAMPAIGNS ────────────────────────────────────────────────
  campaigns: publicProcedure
    .input(z.object({
      category: z.enum(["all", "humanitarian", "education", "environment", "health", "animals", "emergency"]).default("all"),
    }).optional())
    .query(async ({ input }) => {
      const cat = input?.category || "all";
      const filtered = cat === "all" ? campaigns : campaigns.filter(c => c.category === cat);
      return {
        campaigns: filtered.map(c => ({
          ...c,
          progress: Math.round((c.raised / c.goal) * 100),
          daysLeft: Math.max(0, Math.ceil((c.endDate - Date.now()) / 86400000)),
        })),
        totalRaised: campaigns.reduce((s, c) => s + c.raised, 0),
        totalDonors: campaigns.reduce((s, c) => s + c.donors, 0),
        activeCampaigns: campaigns.length,
      };
    }),

  // ─── DONATE ────────────────────────────────────────────────────────
  donate: protectedProcedure
    .input(z.object({
      campaignId: z.string(),
      amount: z.number().min(0.01),
      coin: z.string().default("SHADOW"),
      anonymous: z.boolean().default(false),
      message: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const campaign = campaigns.find(c => c.id === input.campaignId);
      if (!campaign) throw new Error("Campaign not found");

      const matchedAmount = input.amount * (campaign.matched ? campaign.matchRatio : 1);
      campaign.raised += matchedAmount;
      campaign.donors += 1;

      const donation = {
        id: `don_${Date.now()}`,
        userId: ctx.user.id,
        username: input.anonymous ? "Anonymous" : ctx.user.name,
        campaignId: input.campaignId,
        amount: input.amount,
        matchedAmount,
        coin: input.coin,
        message: input.message,
        timestamp: Date.now(),
        txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      };
      donations.push(donation);

      return {
        success: true,
        donation,
        newTotal: campaign.raised,
        matchBonus: matchedAmount - input.amount,
        receipt: `CHARITY-${donation.id}`,
      };
    }),

  // ─── MY DONATIONS ─────────────────────────────────────────────────
  myDonations: protectedProcedure.query(async ({ ctx }) => {
    const mine = donations.filter(d => d.userId === ctx.user.id);
    return {
      donations: mine,
      totalDonated: mine.reduce((s, d) => s + d.amount, 0),
      totalMatched: mine.reduce((s, d) => s + d.matchedAmount, 0),
      impactScore: mine.length * 10 + mine.reduce((s, d) => s + d.amount, 0) / 100,
    };
  }),

  // ─── CREATE CAMPAIGN ───────────────────────────────────────────────
  createCampaign: protectedProcedure
    .input(z.object({
      title: z.string().min(5),
      description: z.string().min(20),
      goal: z.number().min(100),
      category: z.enum(["humanitarian", "education", "environment", "health", "animals", "emergency"]),
      durationDays: z.number().min(7).max(365),
      matchEnabled: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const campaign = {
        id: `camp_${Date.now()}`,
        ...input,
        raised: 0,
        donors: 0,
        image: "🎯",
        endDate: Date.now() + input.durationDays * 86400000,
        matched: input.matchEnabled,
        matchRatio: input.matchEnabled ? 1.5 : 1,
        creatorId: ctx.user.id,
        creatorName: ctx.user.name,
      };
      campaigns.push(campaign);
      return { success: true, campaign };
    }),

  // ─── RECENT DONATIONS FEED ────────────────────────────────────────
  recentDonations: publicProcedure.query(async () => {
    return donations.slice(-20).reverse().map(d => ({
      username: d.username,
      amount: d.amount,
      coin: d.coin,
      campaignId: d.campaignId,
      timestamp: d.timestamp,
      message: d.message,
    }));
  }),

  // ─── IMPACT LEADERBOARD ───────────────────────────────────────────
  leaderboard: publicProcedure.query(async () => {
    return {
      topDonors: [
        { rank: 1, username: "ShadowPhilanthropist", totalDonated: 52000, campaigns: 12 },
        { rank: 2, username: "CryptoGiver", totalDonated: 38500, campaigns: 8 },
        { rank: 3, username: "HopeBuilder", totalDonated: 27000, campaigns: 15 },
        { rank: 4, username: "SkylerBlue", totalDonated: 21000, campaigns: 6 },
        { rank: 5, username: "MoonDonor", totalDonated: 18500, campaigns: 9 },
      ],
      platformStats: {
        totalRaised: 4250000,
        totalDonors: 12500,
        campaignsCompleted: 89,
        matchedFunds: 1200000,
      },
    };
  }),
});
