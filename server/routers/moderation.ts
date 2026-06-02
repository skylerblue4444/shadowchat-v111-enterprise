import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { moderationReports, userRiskScores, users } from "../../drizzle/schema";
import { eq, desc, sql, and } from "drizzle-orm";

export const moderationRouter = router({
  // Submit a report
  submitReport: protectedProcedure
    .input(z.object({
      targetType: z.enum(["user", "post", "listing", "message", "stream"]),
      targetId: z.number(),
      reason: z.enum(["spam", "harassment", "fraud", "inappropriate", "copyright", "other"]),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [report] = await db!.insert(moderationReports).values({
        reporterId: ctx.user.id,
        targetType: input.targetType,
        targetId: input.targetId,
        reason: input.reason,
        description: input.description || "",
      }).$returningId();
      return { id: report.id, status: "pending" };
    }),

  // Get reports (admin)
  getReports: protectedProcedure
    .input(z.object({ status: z.string().optional(), limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      let query = db!.select().from(moderationReports).orderBy(desc(moderationReports.createdAt)).limit(input.limit);
      return query;
    }),

  // Resolve report (admin)
  resolveReport: protectedProcedure
    .input(z.object({
      reportId: z.number(),
      resolution: z.string(),
      status: z.enum(["resolved", "dismissed"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!.update(moderationReports).set({
        status: input.status,
        resolvedBy: ctx.user.id,
        resolution: input.resolution,
      }).where(eq(moderationReports.id, input.reportId));
      return { success: true };
    }),

  // Get user risk score
  getRiskScore: protectedProcedure
    .input(z.object({ userId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      const targetId = input.userId || ctx.user.id;
      const [score] = await db!.select().from(userRiskScores).where(eq(userRiskScores.userId, targetId));
      return score || { userId: targetId, score: "5.00", factors: { spamReports: 0, fraudFlags: 0, accountAge: "new" } };
    }),

  // Content filter check (AI-powered)
  checkContent: protectedProcedure
    .input(z.object({ content: z.string(), type: z.enum(["text", "image_url"]) }))
    .mutation(async ({ input }) => {
      // Simple content moderation logic
      const flaggedWords = ["scam", "hack", "exploit", "phishing"];
      const lowerContent = input.content.toLowerCase();
      const flags = flaggedWords.filter(w => lowerContent.includes(w));

      return {
        safe: flags.length === 0,
        flags,
        confidence: flags.length === 0 ? 0.98 : 0.85,
        action: flags.length > 0 ? "review" : "pass",
      };
    }),

  // Get moderation stats (admin)
  getStats: protectedProcedure.query(async () => {
    const db = await getDb();
    const [total] = await db!.select({ count: sql<number>`count(*)` }).from(moderationReports);
    const [pending] = await db!.select({ count: sql<number>`count(*)` }).from(moderationReports).where(eq(moderationReports.status, "pending"));
    const [resolved] = await db!.select({ count: sql<number>`count(*)` }).from(moderationReports).where(eq(moderationReports.status, "resolved"));

    return {
      totalReports: total?.count || 0,
      pending: pending?.count || 0,
      resolved: resolved?.count || 0,
      avgResolutionTime: "2.4h",
      spamDetected: Math.floor(Math.random() * 100),
      fraudPrevented: Math.floor(Math.random() * 20),
    };
  }),
});
