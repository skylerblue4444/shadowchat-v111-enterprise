import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { searchIndex, posts, users, listings, nfts, proposals } from "../../drizzle/schema";
import { eq, desc, like, sql, or } from "drizzle-orm";

export const searchRouter = router({
  // Global cross-module search
  global: protectedProcedure
    .input(z.object({
      query: z.string().min(1),
      modules: z.array(z.string()).optional(),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      const q = `%${input.query}%`;

      // Search across multiple modules in parallel
      const [postResults, userResults, listingResults, proposalResults] = await Promise.all([
        db!.select({ id: posts.id, content: posts.content, type: sql<string>`'post'` })
          .from(posts).where(like(posts.content, q)).limit(5),
        db!.select({ id: users.id, name: users.name, username: users.username, type: sql<string>`'user'` })
          .from(users).where(or(like(users.name, q), like(users.username, q))).limit(5),
        db!.select({ id: listings.id, title: listings.title, type: sql<string>`'listing'` })
          .from(listings).where(or(like(listings.title, q), like(listings.description, q))).limit(5),
        db!.select({ id: proposals.id, title: proposals.title, type: sql<string>`'proposal'` })
          .from(proposals).where(or(like(proposals.title, q), like(proposals.description, q))).limit(5),
      ]);

      return {
        posts: postResults,
        users: userResults,
        listings: listingResults,
        proposals: proposalResults,
        totalResults: postResults.length + userResults.length + listingResults.length + proposalResults.length,
      };
    }),

  // Index an entity for search
  index: protectedProcedure
    .input(z.object({
      entityType: z.string(),
      entityId: z.number(),
      title: z.string(),
      content: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!.insert(searchIndex).values({
        entityType: input.entityType,
        entityId: input.entityId,
        title: input.title,
        content: input.content,
        tags: input.tags,
        authorId: ctx.user.id,
      });
      return { indexed: true };
    }),

  // Search the index
  searchIndex: protectedProcedure
    .input(z.object({
      query: z.string(),
      entityType: z.string().optional(),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      const q = `%${input.query}%`;
      const conditions = [or(like(searchIndex.title, q), like(searchIndex.content, q))];
      if (input.entityType) conditions.push(eq(searchIndex.entityType, input.entityType));

      return db!.select().from(searchIndex)
        .where(sql`${conditions[0]} ${conditions[1] ? sql`AND ${conditions[1]}` : sql``}`)
        .orderBy(desc(searchIndex.score))
        .limit(input.limit);
    }),

  // Trending searches (mock for now)
  trending: publicProcedure.query(async () => {
    return [
      { term: "SKYCOIN", count: 4420 },
      { term: "HOPE AI", count: 3800 },
      { term: "NFT drops", count: 2100 },
      { term: "governance vote", count: 1850 },
      { term: "staking rewards", count: 1600 },
      { term: "marketplace deals", count: 1200 },
    ];
  }),
});
