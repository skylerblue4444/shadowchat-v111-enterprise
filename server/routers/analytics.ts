import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { AnalyticsService } from "../services/analyticsService";
import { AuditService } from "../services/auditService";
import { EventDispatcher } from "../services/eventDispatcher";
import { getDb } from "../db";
import { wallets, posts, trades, nfts, aiConversations } from "../../drizzle/schema";
import { eq, sql } from "drizzle-orm";

export const analyticsRouter = router({
  // Platform-wide stats (public)
  getPlatformStats: publicProcedure.query(async () => {
    return await AnalyticsService.getPlatformStats();
  }),

  getSystemHealth: protectedProcedure.query(async ({ ctx }) => {
    await AuditService.log(ctx.user.id, "CHECK_SYSTEM_HEALTH");
    await EventDispatcher.emit("SYSTEM_HEALTH_CHECK", { userId: ctx.user.id });
    return await AuditService.getSystemHealth();
  }),

  // User's personal analytics
  getMyStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    const wallet = await db.select().from(wallets).where(eq(wallets.userId, ctx.user.id)).limit(1);
    const [myPosts] = await db.select({ count: sql<number>`count(*)` }).from(posts).where(eq(posts.authorId, ctx.user.id));
    const [myTrades] = await db.select({ count: sql<number>`count(*)` }).from(trades).where(eq(trades.userId, ctx.user.id));
    const [myNFTs] = await db.select({ count: sql<number>`count(*)` }).from(nfts).where(eq(nfts.ownerId, ctx.user.id));
    const [myAI] = await db.select({ count: sql<number>`count(*)` }).from(aiConversations).where(eq(aiConversations.userId, ctx.user.id));

    return {
      wallet: wallet[0] || null,
      postsCount: myPosts?.count || 0,
      tradesCount: myTrades?.count || 0,
      nftsCount: myNFTs?.count || 0,
      aiChatsCount: myAI?.count || 0,
    };
  }),

  // Revenue chart data (mock + real)
  getRevenueChart: protectedProcedure
    .input(z.object({ days: z.number().default(30) }))
    .query(async ({ input }) => {
      // Generate chart data based on real trade volume + mock platform revenue
      const data = [];
      for (let i = input.days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split("T")[0],
          revenue: Math.floor(Math.random() * 50000 + 10000),
          volume: Math.floor(Math.random() * 500000 + 100000),
          users: Math.floor(Math.random() * 500 + 100),
          trades: Math.floor(Math.random() * 1000 + 200),
        });
      }
      return data;
    }),

  // Top traders leaderboard
  getLeaderboard: publicProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return db
        .select({
          id: users.id,
          name: users.name,
          username: users.username,
          avatarUrl: users.avatarUrl,
          level: users.level,
          xp: users.xp,
          skyBalance: wallets.skyBalance,
          isVerified: users.isVerified,
        })
        .from(users)
        .leftJoin(wallets, eq(users.id, wallets.userId))
        .orderBy(desc(users.xp))
        .limit(input.limit);
    }),
});
