import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { follows, users, socialCircles, circleMemberships } from "../../drizzle/schema";
import { eq, desc, sql, and } from "drizzle-orm";

export const socialGraphRouter = router({
  // Get followers
  getFollowers: protectedProcedure
    .input(z.object({ userId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      const targetId = input.userId || ctx.user.id;
      const followerRows = await db!.select({ followerId: follows.followerId })
        .from(follows).where(eq(follows.followingId, targetId));

      const enriched = await Promise.all(followerRows.map(async (f) => {
        const [user] = await db!.select({ id: users.id, name: users.name, avatarUrl: users.avatarUrl }).from(users).where(eq(users.id, f.followerId));
        return user;
      }));
      return enriched.filter(Boolean);
    }),

  // Get following
  getFollowing: protectedProcedure
    .input(z.object({ userId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      const targetId = input.userId || ctx.user.id;
      const followingRows = await db!.select({ followingId: follows.followingId })
        .from(follows).where(eq(follows.followerId, targetId));

      const enriched = await Promise.all(followingRows.map(async (f) => {
        const [user] = await db!.select({ id: users.id, name: users.name, avatarUrl: users.avatarUrl }).from(users).where(eq(users.id, f.followingId));
        return user;
      }));
      return enriched.filter(Boolean);
    }),

  // Get mutual connections
  getMutuals: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const myFollowing = await db!.select({ followingId: follows.followingId }).from(follows).where(eq(follows.followerId, ctx.user.id));
    const myFollowers = await db!.select({ followerId: follows.followerId }).from(follows).where(eq(follows.followingId, ctx.user.id));

    const followingSet = new Set(myFollowing.map(f => f.followingId));
    const mutualIds = myFollowers.filter(f => followingSet.has(f.followerId)).map(f => f.followerId);

    const mutuals = await Promise.all(mutualIds.slice(0, 50).map(async (id) => {
      const [user] = await db!.select({ id: users.id, name: users.name, avatarUrl: users.avatarUrl }).from(users).where(eq(users.id, id));
      return user;
    }));
    return mutuals.filter(Boolean);
  }),

  // Follow/unfollow
  toggleFollow: protectedProcedure
    .input(z.object({ targetId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [existing] = await db!.select().from(follows)
        .where(and(eq(follows.followerId, ctx.user.id), eq(follows.followingId, input.targetId)));

      if (existing) {
        await db!.delete(follows).where(eq(follows.id, existing.id));
        return { following: false };
      } else {
        await db!.insert(follows).values({ followerId: ctx.user.id, followingId: input.targetId });
        return { following: true };
      }
    }),

  // Get social circles
  getCircles: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    return db!.select().from(socialCircles).where(eq(socialCircles.ownerId, ctx.user.id));
  }),

  // Create circle
  createCircle: protectedProcedure
    .input(z.object({ name: z.string(), description: z.string().optional(), isPublic: z.boolean().default(true) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [circle] = await db!.insert(socialCircles).values({
        ownerId: ctx.user.id,
        name: input.name,
        description: input.description || "",
        isPublic: input.isPublic,
      }).$returningId();
      return { id: circle.id };
    }),

  // Get network stats
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const [followerCount] = await db!.select({ count: sql<number>`count(*)` }).from(follows).where(eq(follows.followingId, ctx.user.id));
    const [followingCount] = await db!.select({ count: sql<number>`count(*)` }).from(follows).where(eq(follows.followerId, ctx.user.id));
    const [circleCount] = await db!.select({ count: sql<number>`count(*)` }).from(socialCircles).where(eq(socialCircles.ownerId, ctx.user.id));

    return {
      followers: followerCount?.count || 0,
      following: followingCount?.count || 0,
      circles: circleCount?.count || 0,
      influenceScore: (Math.random() * 50 + 50).toFixed(1),
      networkReach: Math.floor(Math.random() * 5000 + 1000),
    };
  }),
});
