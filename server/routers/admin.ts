import { z } from "zod";
import { desc, eq, sql } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users, posts, featureFlags, securityLogs, wallets, notifications } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";

// Admin-only middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const adminRouter = router({
  // Get all users
  getUsers: adminProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0), search: z.string().optional() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const results = await db
        .select({
          id: users.id,
          name: users.name,
          username: users.username,
          email: users.email,
          role: users.role,
          isVerified: users.isVerified,
          level: users.level,
          xp: users.xp,
          subscriptionTier: users.subscriptionTier,
          createdAt: users.createdAt,
          lastSignedIn: users.lastSignedIn,
          skyBalance: wallets.skyBalance,
        })
        .from(users)
        .leftJoin(wallets, eq(users.id, wallets.userId))
        .orderBy(desc(users.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      if (input.search) {
        const s = input.search.toLowerCase();
        return results.filter(u => u.name?.toLowerCase().includes(s) || u.username?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s));
      }
      return results;
    }),

  // Update user role
  updateUserRole: adminProcedure
    .input(z.object({ userId: z.number(), role: z.enum(["user", "admin", "creator", "moderator"]) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
      return { success: true };
    }),

  // Verify user
  verifyUser: adminProcedure
    .input(z.object({ userId: z.number(), verified: z.boolean() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.update(users).set({ isVerified: input.verified }).where(eq(users.id, input.userId));
      return { success: true };
    }),

  // Get feature flags
  getFeatureFlags: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(featureFlags).orderBy(featureFlags.name);
  }),

  // Toggle feature flag
  toggleFeatureFlag: adminProcedure
    .input(z.object({ id: z.number(), enabled: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.update(featureFlags).set({ isEnabled: input.enabled, updatedBy: ctx.user.id }).where(eq(featureFlags.id, input.id));
      return { success: true };
    }),

  // Create feature flag
  createFeatureFlag: adminProcedure
    .input(z.object({ key: z.string(), name: z.string(), description: z.string().optional(), isEnabled: z.boolean().default(false) }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.insert(featureFlags).values({ key: input.key, name: input.name, description: input.description, isEnabled: input.isEnabled, updatedBy: ctx.user.id });
      return { success: true };
    }),

  // Get security logs
  getSecurityLogs: adminProcedure
    .input(z.object({ limit: z.number().default(100) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(securityLogs).orderBy(desc(securityLogs.createdAt)).limit(input.limit);
    }),

  // Get platform overview stats
  getOverview: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { totalUsers: 0, totalPosts: 0, activeFeatureFlags: 0 };

    const [totalUsers] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [totalPosts] = await db.select({ count: sql<number>`count(*)` }).from(posts);
    const [flagCount] = await db.select({ count: sql<number>`count(*)` }).from(featureFlags).where(eq(featureFlags.isEnabled, true));

    return {
      totalUsers: totalUsers?.count || 0,
      totalPosts: totalPosts?.count || 0,
      activeFeatureFlags: flagCount?.count || 0,
    };
  }),

  // Broadcast system notification
  broadcastNotification: adminProcedure
    .input(z.object({ title: z.string(), body: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const allUsers = await db.select({ id: users.id }).from(users).limit(500);
      const notifValues = allUsers.map(u => ({
        userId: u.id,
        type: "system" as const,
        title: input.title,
        body: input.body,
        actorId: ctx.user.id,
      }));

      for (let i = 0; i < notifValues.length; i += 100) {
        if (notifValues.slice(i, i + 100).length > 0) {
          await db.insert(notifications).values(notifValues.slice(i, i + 100));
        }
      }

      return { success: true, sent: notifValues.length };
    }),

  // Hide/unhide a post
  moderatePost: adminProcedure
    .input(z.object({ postId: z.number(), hide: z.boolean() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.update(posts).set({ isHidden: input.hide }).where(eq(posts.id, input.postId));
      return { success: true };
    }),
});
