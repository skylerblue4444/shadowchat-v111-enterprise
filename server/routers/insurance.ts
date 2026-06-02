/**
 * Insurance & DeFi Insurance Router — Crypto insurance, smart contract coverage, health/auto
 * Inspired by Nexus Mutual, InsurAce, Lemonade patterns
 */
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const insuranceRouter = router({
  // ─── Get insurance products ────────────────────────────────────────────────
  getProducts: publicProcedure
    .query(async () => {
      return {
        products: [
          { id: "ins_1", name: "Smart Contract Cover", category: "DeFi", premium: 2.5, coverage: 100000, description: "Protection against smart contract exploits and hacks" },
          { id: "ins_2", name: "Exchange Hack Protection", category: "Crypto", premium: 1.8, coverage: 50000, description: "Coverage if your exchange gets hacked" },
          { id: "ins_3", name: "Stablecoin De-peg Insurance", category: "DeFi", premium: 3.2, coverage: 200000, description: "Protection against stablecoin losing its peg" },
          { id: "ins_4", name: "NFT Theft Protection", category: "NFT", premium: 1.5, coverage: 25000, description: "Coverage for stolen or compromised NFTs" },
          { id: "ins_5", name: "Mining Equipment", category: "Hardware", premium: 4.0, coverage: 500000, description: "Physical mining rig damage and theft coverage" },
          { id: "ins_6", name: "Cyber Liability", category: "Business", premium: 5.5, coverage: 1000000, description: "Business cyber attack and data breach coverage" },
        ],
      };
    }),

  // ─── Purchase policy ───────────────────────────────────────────────────────
  purchasePolicy: protectedProcedure
    .input(z.object({ productId: z.string(), coverageAmount: z.number(), durationMonths: z.number(), paymentCoin: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const premium = (input.coverageAmount * 0.025 * input.durationMonths) / 12;
      return {
        success: true,
        policyId: `policy_${Date.now()}`,
        premium,
        premiumCrypto: premium / 65000,
        coverage: input.coverageAmount,
        startDate: new Date(),
        endDate: new Date(Date.now() + input.durationMonths * 30 * 86400000),
        status: "active",
      };
    }),

  // ─── File claim ────────────────────────────────────────────────────────────
  fileClaim: protectedProcedure
    .input(z.object({ policyId: z.string(), description: z.string(), amount: z.number(), evidence: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        claimId: `claim_${Date.now()}`,
        status: "under_review",
        estimatedResolution: new Date(Date.now() + 604800000),
        assignedAdjuster: "AI Claims Bot",
      };
    }),

  // ─── Get my policies ───────────────────────────────────────────────────────
  getMyPolicies: protectedProcedure
    .query(async ({ ctx }) => {
      return {
        policies: [
          { id: "policy_1", product: "Smart Contract Cover", coverage: 100000, premium: 208, status: "active", expiresAt: new Date(Date.now() + 15552000000) },
          { id: "policy_2", product: "Exchange Hack Protection", coverage: 50000, premium: 75, status: "active", expiresAt: new Date(Date.now() + 7776000000) },
        ],
        totalCoverage: 150000,
        monthlyPremium: 283,
        claims: [],
      };
    }),
});
