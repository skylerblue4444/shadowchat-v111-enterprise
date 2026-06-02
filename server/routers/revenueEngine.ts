import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

// ─── BILLION-DOLLAR REVENUE ENGINE ──────────────────────────────────────────
// Inspired by: Stripe billing, Shopify subscriptions, Discord Nitro, Twitch bits

// ─── SUBSCRIPTION TIERS ──────────────────────────────────────────────────────
const SUBSCRIPTION_TIERS = {
  free: {
    id: "free", name: "Free", price: 0, interval: "forever",
    features: ["5 AI queries/day", "Basic social feed", "1 wallet", "Community governance"],
    limits: { aiQueries: 5, storage: 100, agents: 1, apiCalls: 100 },
  },
  pro: {
    id: "pro", name: "Pro", price: 19.99, interval: "month",
    features: ["Unlimited AI", "All 25 personas", "5 wallets", "Priority support", "Advanced analytics", "Creator tools", "Mining pools"],
    limits: { aiQueries: -1, storage: 10000, agents: 10, apiCalls: 10000 },
  },
  enterprise: {
    id: "enterprise", name: "Enterprise", price: 99.99, interval: "month",
    features: ["Everything in Pro", "White-label API", "Dedicated support", "Custom AI agents", "SLA 99.99%", "SSO/SAML", "Unlimited storage", "Data residency"],
    limits: { aiQueries: -1, storage: -1, agents: -1, apiCalls: -1 },
  },
  whale: {
    id: "whale", name: "Whale", price: 499.99, interval: "month",
    features: ["Everything in Enterprise", "Dedicated instance", "Custom development", "24/7 phone support", "Quarterly business reviews", "Early access to all features"],
    limits: { aiQueries: -1, storage: -1, agents: -1, apiCalls: -1 },
  },
};

// ─── PLATFORM FEES ───────────────────────────────────────────────────────────
const PLATFORM_FEES = {
  marketplace: 0.025,    // 2.5% on NFT/marketplace sales
  exchange: 0.001,       // 0.1% on trades
  tips: 0.05,            // 5% on tips
  creatorPayout: 0.10,   // 10% platform cut on creator earnings
  agentExecution: 0.15,  // 15% on AI agent marketplace
  adRevenue: 0.30,       // 30% platform cut on ad revenue (creator gets 70%)
  icoListing: 0.02,      // 2% on ICO token sales
};

// ─── IN-MEMORY STORES ────────────────────────────────────────────────────────
interface UserSubscription {
  userId: string;
  tier: string;
  startedAt: number;
  expiresAt: number;
  autoRenew: boolean;
  paymentMethod: string;
  totalSpent: number;
}

interface CreatorPayout {
  id: string;
  creatorId: string;
  amount: number;
  currency: string;
  source: string;
  status: "pending" | "processing" | "paid" | "failed";
  createdAt: number;
  paidAt?: number;
}

interface AdCampaign {
  id: string;
  advertiserId: string;
  name: string;
  type: "sponsored_post" | "promoted_listing" | "banner" | "native";
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpm: number; // cost per 1000 impressions
  status: "active" | "paused" | "exhausted" | "scheduled";
  targeting: { interests: string[]; regions: string[]; ageRange: [number, number] };
  createdAt: number;
}

const subscriptions = new Map<string, UserSubscription>();
const payouts: CreatorPayout[] = [];
const adCampaigns: AdCampaign[] = [];

// Seed ad campaigns
["ShadowCoin ICO Launch", "HOPE AI Pro Upgrade", "NFT Marketplace Feature", "Enterprise Security Suite", "SkyCoin4444 Staking"].forEach((name, i) => {
  adCampaigns.push({
    id: `ad_${i}`, advertiserId: `adv_${i}`, name,
    type: ["sponsored_post", "promoted_listing", "banner", "native", "sponsored_post"][i] as any,
    budget: [5000, 10000, 3000, 25000, 8000][i],
    spent: [2340, 6780, 1200, 15600, 4500][i],
    impressions: [234000, 678000, 120000, 1560000, 450000][i],
    clicks: [4680, 13560, 2400, 31200, 9000][i],
    conversions: [468, 1356, 240, 3120, 900][i],
    cpm: [10, 10, 10, 10, 10][i],
    status: "active",
    targeting: { interests: ["crypto", "ai", "tech"], regions: ["US", "EU", "APAC"], ageRange: [18, 65] },
    createdAt: Date.now() - (30 - i * 5) * 86400000,
  });
});

// ─── REVENUE METRICS ─────────────────────────────────────────────────────────
const revenueMetrics = {
  mrr: 847000,           // Monthly Recurring Revenue
  arr: 10164000,         // Annual Recurring Revenue
  ltv: 2340,             // Lifetime Value per user
  cac: 45,              // Customer Acquisition Cost
  churnRate: 0.023,      // 2.3% monthly churn
  nrr: 1.15,            // Net Revenue Retention 115%
  totalRevenue: 45000000,
  revenueBySource: {
    subscriptions: 18000000,
    marketplace: 8500000,
    exchange: 6200000,
    adNetwork: 4800000,
    agentMarketplace: 3500000,
    creatorPayouts: 2000000,
    ico: 1500000,
    tips: 500000,
  },
  subscribers: { free: 180000, pro: 35000, enterprise: 4200, whale: 180 },
};

export const revenueEngineRouter = router({
  // ─── SUBSCRIPTION MANAGEMENT ───────────────────────────────────────
  tiers: publicProcedure.query(async () => {
    return { tiers: Object.values(SUBSCRIPTION_TIERS), fees: PLATFORM_FEES };
  }),

  mySubscription: protectedProcedure.query(async ({ ctx }) => {
    const sub = subscriptions.get(String(ctx.user.id));
    return sub || { userId: String(ctx.user.id), tier: "free", startedAt: Date.now(), expiresAt: 0, autoRenew: false, paymentMethod: "none", totalSpent: 0 };
  }),

  subscribe: protectedProcedure
    .input(z.object({
      tier: z.enum(["pro", "enterprise", "whale"]),
      paymentMethod: z.enum(["crypto_btc", "crypto_eth", "crypto_usdt", "crypto_sky", "stripe", "wise"]),
      autoRenew: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      const tierInfo = SUBSCRIPTION_TIERS[input.tier];
      const sub: UserSubscription = {
        userId: String(ctx.user.id),
        tier: input.tier,
        startedAt: Date.now(),
        expiresAt: Date.now() + 30 * 86400000,
        autoRenew: input.autoRenew,
        paymentMethod: input.paymentMethod,
        totalSpent: tierInfo.price,
      };
      subscriptions.set(String(ctx.user.id), sub);
      return { success: true, subscription: sub, tier: tierInfo };
    }),

  // ─── CREATOR PAYOUTS ───────────────────────────────────────────────
  creatorEarnings: protectedProcedure.query(async ({ ctx }) => {
    const myPayouts = payouts.filter(p => p.creatorId === String(ctx.user.id));
    const totalEarned = myPayouts.reduce((s, p) => s + p.amount, 0);
    const pending = myPayouts.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0);
    const paid = myPayouts.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);
    return { totalEarned, pending, paid, payouts: myPayouts.slice(-20), minimumPayout: 50 };
  }),

  requestPayout: protectedProcedure
    .input(z.object({ amount: z.number().min(50), currency: z.enum(["USD", "BTC", "ETH", "USDT", "SKY"]) }))
    .mutation(async ({ ctx, input }) => {
      const payout: CreatorPayout = {
        id: `payout_${Date.now()}`, creatorId: String(ctx.user.id),
        amount: input.amount, currency: input.currency, source: "creator_earnings",
        status: "pending", createdAt: Date.now(),
      };
      payouts.push(payout);
      return { success: true, payout };
    }),

  // ─── AD NETWORK ────────────────────────────────────────────────────
  adCampaigns: protectedProcedure.query(async () => {
    return {
      campaigns: adCampaigns,
      totalBudget: adCampaigns.reduce((s, a) => s + a.budget, 0),
      totalSpent: adCampaigns.reduce((s, a) => s + a.spent, 0),
      totalImpressions: adCampaigns.reduce((s, a) => s + a.impressions, 0),
      avgCTR: 0.02,
    };
  }),

  createAd: protectedProcedure
    .input(z.object({
      name: z.string(), type: z.enum(["sponsored_post", "promoted_listing", "banner", "native"]),
      budget: z.number().min(100), cpm: z.number().min(1),
      targeting: z.object({ interests: z.array(z.string()), regions: z.array(z.string()) }),
    }))
    .mutation(async ({ ctx, input }) => {
      const campaign: AdCampaign = {
        id: `ad_${Date.now()}`, advertiserId: String(ctx.user.id), name: input.name,
        type: input.type, budget: input.budget, spent: 0, impressions: 0, clicks: 0,
        conversions: 0, cpm: input.cpm, status: "active",
        targeting: { ...input.targeting, ageRange: [18, 65] }, createdAt: Date.now(),
      };
      adCampaigns.push(campaign);
      return { success: true, campaign };
    }),

  // ─── REVENUE DASHBOARD ─────────────────────────────────────────────
  metrics: protectedProcedure.query(async () => {
    return revenueMetrics;
  }),

  // ─── API METERING ──────────────────────────────────────────────────
  apiUsage: protectedProcedure.query(async ({ ctx }) => {
    const sub = subscriptions.get(String(ctx.user.id));
    const tier = sub?.tier || "free";
    const limits = SUBSCRIPTION_TIERS[tier as keyof typeof SUBSCRIPTION_TIERS]?.limits || SUBSCRIPTION_TIERS.free.limits;
    return {
      tier, limits,
      usage: { aiQueries: 3, storage: 45, agents: 1, apiCalls: 67 },
      billingCycle: { start: Date.now() - 15 * 86400000, end: Date.now() + 15 * 86400000 },
      overage: { enabled: tier !== "free", rate: 0.01 },
    };
  }),
});
