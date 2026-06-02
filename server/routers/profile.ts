import { z } from "zod";
import { desc, eq, and, sql } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users, posts, follows, wallets, nfts, trades, referrals } from "../../drizzle/schema";

export const profileRouter = router({
  // Get public profile by username or id
  getProfile: publicProcedure
    .input(z.object({ username: z.string().optional(), userId: z.number().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const condition = input.userId
        ? eq(users.id, input.userId)
        : eq(users.username, input.username || "");

      const result = await db
        .select({
          id: users.id,
          name: users.name,
          username: users.username,
          bio: users.bio,
          avatarUrl: users.avatarUrl,
          bannerUrl: users.bannerUrl,
          isVerified: users.isVerified,
          level: users.level,
          xp: users.xp,
          reputationScore: users.reputationScore,
          subscriptionTier: users.subscriptionTier,
          walletAddress: users.walletAddress,
          solanaAddress: users.solanaAddress,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(condition)
        .limit(1);

      if (!result[0]) return null;

      const profile = result[0];

      // Get follower/following counts
      const [followerCount] = await db.select({ count: sql<number>`count(*)` }).from(follows).where(eq(follows.followingId, profile.id));
      const [followingCount] = await db.select({ count: sql<number>`count(*)` }).from(follows).where(eq(follows.followerId, profile.id));
      const [postCount] = await db.select({ count: sql<number>`count(*)` }).from(posts).where(eq(posts.authorId, profile.id));

      return {
        ...profile,
        followerCount: followerCount?.count || 0,
        followingCount: followingCount?.count || 0,
        postCount: postCount?.count || 0,
      };
    }),

  // Get own profile (authenticated)
  getMe: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    const result = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
    if (!result[0]) return null;

    const wallet = await db.select().from(wallets).where(eq(wallets.userId, ctx.user.id)).limit(1);
    const [followerCount] = await db.select({ count: sql<number>`count(*)` }).from(follows).where(eq(follows.followingId, ctx.user.id));
    const [followingCount] = await db.select({ count: sql<number>`count(*)` }).from(follows).where(eq(follows.followerId, ctx.user.id));

    return {
      ...result[0],
      wallet: wallet[0] || null,
      followerCount: followerCount?.count || 0,
      followingCount: followingCount?.count || 0,
    };
  }),

  // Update profile
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().max(128).optional(),
      username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/).optional(),
      bio: z.string().max(500).optional(),
      avatarUrl: z.string().optional(),
      bannerUrl: z.string().optional(),
      walletAddress: z.string().optional(),
      solanaAddress: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Check username uniqueness
      if (input.username) {
        const existing = await db.select({ id: users.id }).from(users).where(eq(users.username, input.username)).limit(1);
        if (existing[0] && existing[0].id !== ctx.user.id) {
          throw new Error("Username already taken");
        }
      }

      const updateData: Record<string, any> = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.username !== undefined) updateData.username = input.username;
      if (input.bio !== undefined) updateData.bio = input.bio;
      if (input.avatarUrl !== undefined) updateData.avatarUrl = input.avatarUrl;
      if (input.bannerUrl !== undefined) updateData.bannerUrl = input.bannerUrl;
      if (input.walletAddress !== undefined) updateData.walletAddress = input.walletAddress;
      if (input.solanaAddress !== undefined) updateData.solanaAddress = input.solanaAddress;

      await db.update(users).set(updateData).where(eq(users.id, ctx.user.id));
      return { success: true };
    }),

  // Get user's posts
  getUserPosts: publicProcedure
    .input(z.object({ userId: z.number(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(posts)
        .where(and(eq(posts.authorId, input.userId), eq(posts.isHidden, false)))
        .orderBy(desc(posts.createdAt))
        .limit(input.limit);
    }),

  // Get referral info
  getReferralInfo: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { code: null, referrals: [] };

    const user = await db.select({ referralCode: users.referralCode }).from(users).where(eq(users.id, ctx.user.id)).limit(1);
    const myReferrals = await db
      .select({ id: referrals.id, status: referrals.status, reward: referrals.reward, createdAt: referrals.createdAt, referredName: users.name })
      .from(referrals)
      .leftJoin(users, eq(referrals.referredId, users.id))
      .where(eq(referrals.referrerId, ctx.user.id));

    return {
      code: user[0]?.referralCode || null,
      referrals: myReferrals,
    };
  }),
});
