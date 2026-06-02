import { z } from "zod";
import { desc, eq, and, gt } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { proposals, votes, wallets, users, notifications } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";

export const governanceRouter = router({
  // Get all proposals
  getProposals: publicProcedure
    .input(z.object({
      status: z.enum(["draft", "active", "passed", "rejected", "executed", "all"]).default("all"),
      limit: z.number().default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const query = db
        .select({
          id: proposals.id,
          title: proposals.title,
          description: proposals.description,
          category: proposals.category,
          status: proposals.status,
          votesFor: proposals.votesFor,
          votesAgainst: proposals.votesAgainst,
          votesAbstain: proposals.votesAbstain,
          quorum: proposals.quorum,
          requiredApproval: proposals.requiredApproval,
          endsAt: proposals.endsAt,
          executedAt: proposals.executedAt,
          onChainId: proposals.onChainId,
          createdAt: proposals.createdAt,
          authorName: users.name,
          authorUsername: users.username,
          authorAvatar: users.avatarUrl,
        })
        .from(proposals)
        .leftJoin(users, eq(proposals.authorId, users.id))
        .orderBy(desc(proposals.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      if (input.status !== "all") {
        return (await query).filter(p => p.status === input.status);
      }
      return query;
    }),

  // Get single proposal
  getProposal: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db
        .select()
        .from(proposals)
        .where(eq(proposals.id, input.id))
        .limit(1);
      return result[0] || null;
    }),

  // Create a proposal
  createProposal: protectedProcedure
    .input(z.object({
      title: z.string().min(10).max(256),
      description: z.string().min(50).max(10000),
      category: z.enum(["protocol", "treasury", "feature", "partnership", "emergency"]),
      endsAt: z.string(), // ISO date string
      quorum: z.number().default(1000),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Check voting power (need at least 100 SKY to create proposal)
      const wallet = await db.select().from(wallets).where(eq(wallets.userId, ctx.user.id)).limit(1);
      const skyBalance = parseFloat(String(wallet[0]?.skyBalance || "0"));
      if (skyBalance < 100) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You need at least 100 SKY to create a proposal" });
      }

      const [result] = await db.insert(proposals).values({
        authorId: ctx.user.id,
        title: input.title,
        description: input.description,
        category: input.category,
        status: "active",
        quorum: input.quorum,
        endsAt: new Date(input.endsAt),
      });

      return { success: true, proposalId: result.insertId };
    }),

  // Vote on a proposal
  vote: protectedProcedure
    .input(z.object({
      proposalId: z.number(),
      vote: z.enum(["for", "against", "abstain"]),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Check if already voted
      const existing = await db
        .select()
        .from(votes)
        .where(and(eq(votes.proposalId, input.proposalId), eq(votes.userId, ctx.user.id)))
        .limit(1);

      if (existing.length > 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You have already voted on this proposal" });
      }

      // Get voting power from SKY balance
      const wallet = await db.select().from(wallets).where(eq(wallets.userId, ctx.user.id)).limit(1);
      const votingPower = Math.max(1, Math.floor(parseFloat(String(wallet[0]?.skyBalance || "1"))));

      // Record vote
      await db.insert(votes).values({
        proposalId: input.proposalId,
        userId: ctx.user.id,
        choice: input.vote,
        votingPower: votingPower.toString(),
      });

      // Update proposal vote counts
      const updateField = input.vote === "for" ? { votesFor: proposals.votesFor } :
                          input.vote === "against" ? { votesAgainst: proposals.votesAgainst } :
                          { votesAbstain: proposals.votesAbstain };

      const { sql } = await import("drizzle-orm");
      if (input.vote === "for") {
        await db.update(proposals).set({ votesFor: sql`${proposals.votesFor} + ${votingPower}` }).where(eq(proposals.id, input.proposalId));
      } else if (input.vote === "against") {
        await db.update(proposals).set({ votesAgainst: sql`${proposals.votesAgainst} + ${votingPower}` }).where(eq(proposals.id, input.proposalId));
      } else {
        await db.update(proposals).set({ votesAbstain: sql`${proposals.votesAbstain} + ${votingPower}` }).where(eq(proposals.id, input.proposalId));
      }

      return { success: true, votingPower };
    }),

  // Get user's vote on a proposal
  getUserVote: protectedProcedure
    .input(z.object({ proposalId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db
        .select()
        .from(votes)
        .where(and(eq(votes.proposalId, input.proposalId), eq(votes.userId, ctx.user.id)))
        .limit(1);
      return result[0] || null;
    }),

  // Get DAO stats
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { totalProposals: 0, activeProposals: 0, totalVotes: 0, treasuryBalance: "0" };

    const allProposals = await db.select({ status: proposals.status }).from(proposals);
    const allVotes = await db.select({ id: votes.id }).from(votes);

    return {
      totalProposals: allProposals.length,
      activeProposals: allProposals.filter(p => p.status === "active").length,
      totalVotes: allVotes.length,
      treasuryBalance: "2,847,293.44",
    };
  }),
});
