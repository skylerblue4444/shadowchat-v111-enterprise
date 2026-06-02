import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

// ─── ICO & INVESTMENT DATA ───────────────────────────────────────────────────
const icoProjects = [
  {
    id: "skycoin4444", symbol: "SKY4", name: "SkyCoin4444", status: "live",
    price: 0.0042, raised: 2850000, hardCap: 5000000, softCap: 1000000,
    totalSupply: 444400000000, circulatingSupply: 88800000000,
    startDate: Date.now() - 15 * 86400000, endDate: Date.now() + 45 * 86400000,
    description: "The native utility token of ShadowChat ecosystem — powering governance, staking, tipping, and AI services.",
    features: ["Deflationary burn", "Staking rewards", "Governance voting", "AI access token"],
    allocation: { publicSale: 40, team: 15, ecosystem: 25, liquidity: 10, reserve: 10 },
    vesting: "Team tokens locked 12 months, linear unlock over 24 months",
    chain: "Multi-chain (ETH, SOL, BSC)",
    tier: "platinum",
  },
  {
    id: "shadow", symbol: "SHDW", name: "Shadow Token", status: "live",
    price: 0.085, raised: 4200000, hardCap: 8000000, softCap: 2000000,
    totalSupply: 100000000, circulatingSupply: 35000000,
    startDate: Date.now() - 30 * 86400000, endDate: Date.now() + 30 * 86400000,
    description: "Privacy-first token for anonymous transactions, encrypted messaging, and shadow governance.",
    features: ["Zero-knowledge proofs", "Ring signatures", "Stealth addresses", "Private governance"],
    allocation: { publicSale: 35, team: 10, privacy: 30, liquidity: 15, reserve: 10 },
    vesting: "No team vesting — fully community-driven",
    chain: "Shadow Network (L2)",
    tier: "gold",
  },
  {
    id: "trump-meme", symbol: "TRUMP", name: "TRUMP Meme", status: "upcoming",
    price: 0.00001, raised: 0, hardCap: 1000000, softCap: 250000,
    totalSupply: 1000000000000, circulatingSupply: 0,
    startDate: Date.now() + 7 * 86400000, endDate: Date.now() + 37 * 86400000,
    description: "Community meme token — for entertainment purposes only. Not affiliated with any political entity.",
    features: ["Meme rewards", "Community votes", "Burn events", "Airdrop campaigns"],
    allocation: { publicSale: 60, community: 20, liquidity: 15, marketing: 5 },
    vesting: "No vesting — instant distribution",
    chain: "Solana",
    tier: "bronze",
  },
];

const investments: any[] = [];

export const icoRouter = router({
  // ─── LIST ICO PROJECTS ─────────────────────────────────────────────
  projects: publicProcedure.query(async () => {
    return {
      projects: icoProjects.map(p => ({
        ...p,
        progress: Math.round((p.raised / p.hardCap) * 100),
        daysLeft: Math.max(0, Math.ceil((p.endDate - Date.now()) / 86400000)),
        investors: Math.floor(p.raised / (p.price * 10000)),
      })),
      totalRaised: icoProjects.reduce((s, p) => s + p.raised, 0),
      activeProjects: icoProjects.filter(p => p.status === "live").length,
    };
  }),

  // ─── GET PROJECT DETAILS ───────────────────────────────────────────
  projectDetail: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const project = icoProjects.find(p => p.id === input.id);
      if (!project) throw new Error("Project not found");
      return {
        ...project,
        progress: Math.round((project.raised / project.hardCap) * 100),
        daysLeft: Math.max(0, Math.ceil((project.endDate - Date.now()) / 86400000)),
        priceHistory: Array.from({ length: 30 }, (_, i) => ({
          date: Date.now() - (29 - i) * 86400000,
          price: project.price * (0.8 + Math.random() * 0.4),
        })),
      };
    }),

  // ─── INVEST/BUY TOKENS ─────────────────────────────────────────────
  invest: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      amount: z.number().min(10),
      paymentCoin: z.enum(["USDT", "ETH", "SOL", "BNB", "SHADOW"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const project = icoProjects.find(p => p.id === input.projectId);
      if (!project) throw new Error("Project not found");
      if (project.status !== "live") throw new Error("ICO not active");
      if (project.raised + input.amount > project.hardCap) throw new Error("Exceeds hard cap");

      const tokensReceived = Math.floor(input.amount / project.price);
      project.raised += input.amount;

      const investment = {
        id: `inv_${Date.now()}`,
        userId: ctx.user.id,
        projectId: input.projectId,
        symbol: project.symbol,
        amount: input.amount,
        tokensReceived,
        price: project.price,
        paymentCoin: input.paymentCoin,
        timestamp: Date.now(),
        status: "confirmed",
        txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      };
      investments.push(investment);

      return {
        success: true,
        investment,
        newProjectTotal: project.raised,
        bonusTokens: tokensReceived > 100000 ? Math.floor(tokensReceived * 0.05) : 0,
      };
    }),

  // ─── MY INVESTMENTS ────────────────────────────────────────────────
  myInvestments: protectedProcedure.query(async ({ ctx }) => {
    const mine = investments.filter(i => i.userId === ctx.user.id);
    return {
      investments: mine,
      totalInvested: mine.reduce((s, i) => s + i.amount, 0),
      totalTokens: mine.reduce((s, i) => s + i.tokensReceived, 0),
      portfolioValue: mine.reduce((s, i) => {
        const project = icoProjects.find(p => p.id === i.projectId);
        return s + (project ? i.tokensReceived * project.price : 0);
      }, 0),
    };
  }),

  // ─── PORTFOLIO OVERVIEW ────────────────────────────────────────────
  portfolio: protectedProcedure.query(async ({ ctx }) => {
    return {
      holdings: [
        { symbol: "SKY4", name: "SkyCoin4444", balance: 5000000, value: 21000, change24h: 12.5, price: 0.0042 },
        { symbol: "SHDW", name: "Shadow Token", balance: 150000, value: 12750, change24h: -3.2, price: 0.085 },
        { symbol: "DOGE", name: "Dogecoin", balance: 250000, value: 45000, change24h: 8.1, price: 0.18 },
        { symbol: "XMR", name: "Monero", balance: 25, value: 4125, change24h: 1.5, price: 165 },
        { symbol: "USDT", name: "Tether", balance: 10000, value: 10000, change24h: 0, price: 1.0 },
        { symbol: "TRUMP", name: "TRUMP Meme", balance: 0, value: 0, change24h: 0, price: 0.00001 },
      ],
      totalValue: 92875,
      change24h: 5.8,
      change7d: 18.2,
    };
  }),
});
