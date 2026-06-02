import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { treasuryAccounts, revenueEvents } from "../../drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";

export const treasuryRouter = router({
  // Get all treasury accounts
  accounts: protectedProcedure.query(async () => {
    const db = await getDb();
    return db!.select().from(treasuryAccounts).orderBy(desc(treasuryAccounts.balance));
  }),

  // Get revenue breakdown
  revenue: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input }) => {
      const db = await getDb();
      const events = await db!.select().from(revenueEvents)
        .orderBy(desc(revenueEvents.recordedAt))
        .limit(input.limit);

      const bySource = await db!.select({
        source: revenueEvents.source,
        total: sql<number>`SUM(CAST(amount AS DECIMAL(20,8)))`,
        count: sql<number>`count(*)`,
      }).from(revenueEvents).groupBy(revenueEvents.source);

      return { events, bySource };
    }),

  // Record revenue event
  recordRevenue: protectedProcedure
    .input(z.object({
      source: z.enum(["trading_fees", "subscriptions", "nft_royalties", "marketplace", "ai_services", "staking", "ads"]),
      amount: z.string(),
      currency: z.string().default("SKY"),
      metadata: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!.insert(revenueEvents).values({
        source: input.source,
        amount: input.amount,
        currency: input.currency,
        userId: ctx.user.id,
        metadata: input.metadata,
      });
      return { recorded: true };
    }),

  // Treasury summary
  summary: protectedProcedure.query(async () => {
    const db = await getDb();
    const [totalBalance] = await db!.select({
      total: sql<number>`COALESCE(SUM(CAST(balance AS DECIMAL(20,8))), 0)`,
    }).from(treasuryAccounts);

    const [totalRevenue] = await db!.select({
      total: sql<number>`COALESCE(SUM(CAST(amount AS DECIMAL(20,8))), 0)`,
    }).from(revenueEvents);

    const accounts = await db!.select().from(treasuryAccounts);

    return {
      totalBalance: totalBalance?.total || 0,
      totalRevenue: totalRevenue?.total || 0,
      accountCount: accounts.length,
      accounts,
    };
  }),
});
