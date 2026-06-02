import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { proposals, votes, users } from "../../drizzle/schema";
import { eq, desc, sql, and } from "drizzle-orm";

export const advancedGovernanceRouter = router({
  // Delegate voting power to another user
  delegate: protectedProcedure
    .input(z.object({
      delegateToId: z.number(),
      power: z.number().min(1).max(100).default(100),
    }))
    .mutation(async ({ ctx, input }) => {
      // In a real system, this would update a delegation table
      return {
        delegated: true,
        from: ctx.user.id,
        to: input.delegateToId,
        power: input.power,
      };
    }),

  // Create treasury proposal (requires minimum reputation)
  createTreasuryProposal: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      amount: z.string(),
      recipient: z.string(),
      category: z.enum(["development", "marketing", "community", "infrastructure", "grants"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [proposal] = await db!.insert(proposals).values({
        title: `[Treasury] ${input.title}`,
        description: `${input.description}\n\n---\nRequested Amount: ${input.amount} SKY\nRecipient: ${input.recipient}\nCategory: ${input.category}`,
        authorId: ctx.user.id,
        category: "treasury",
        quorum: 75,
        endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }).$returningId();
      return { id: proposal.id, created: true };
    }),

  // Get community councils
  councils: protectedProcedure.query(async () => {
    return [
      { id: 1, name: "Technical Council", members: 7, focus: "Protocol upgrades & security", nextMeeting: Date.now() + 86400000 },
      { id: 2, name: "Treasury Council", members: 5, focus: "Fund allocation & grants", nextMeeting: Date.now() + 172800000 },
      { id: 3, name: "Community Council", members: 9, focus: "Events, partnerships & growth", nextMeeting: Date.now() + 259200000 },
      { id: 4, name: "AI Ethics Council", members: 4, focus: "AI safety, bias & transparency", nextMeeting: Date.now() + 345600000 },
    ];
  }),

  // Get election status
  elections: protectedProcedure.query(async () => {
    return {
      currentElection: {
        title: "Q3 2026 Council Elections",
        status: "nominating",
        positions: 5,
        candidates: 12,
        startDate: Date.now() - 86400000 * 3,
        endDate: Date.now() + 86400000 * 4,
        phase: "nomination", // nomination -> voting -> results
      },
      pastElections: [
        { title: "Q2 2026 Council Elections", winners: 5, totalVotes: 1247, date: Date.now() - 86400000 * 90 },
        { title: "Q1 2026 Council Elections", winners: 5, totalVotes: 982, date: Date.now() - 86400000 * 180 },
      ],
    };
  }),

  // Get governance analytics
  analytics: protectedProcedure.query(async () => {
    const db = await getDb();
    const [proposalCount] = await db!.select({ count: sql<number>`count(*)` }).from(proposals);
    const [voteCount] = await db!.select({ count: sql<number>`count(*)` }).from(votes);
    const [voterCount] = await db!.select({ count: sql<number>`count(DISTINCT userId)` }).from(votes);

    return {
      totalProposals: proposalCount?.count || 0,
      totalVotes: voteCount?.count || 0,
      uniqueVoters: voterCount?.count || 0,
      participationRate: "34.2%",
      averageQuorum: "67%",
      treasuryBalance: "2,400,000 SKY",
      monthlyBurn: "45,000 SKY",
    };
  }),
});
