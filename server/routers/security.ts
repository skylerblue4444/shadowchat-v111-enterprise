import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userSessions, threatEvents, securityLogs, users } from "../../drizzle/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export const securityRouter = router({
  // ─── SESSIONS ───────────────────────────────────────────────────────────────
  getSessions: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    return db!.select().from(userSessions)
      .where(eq(userSessions.userId, ctx.user.id))
      .orderBy(desc(userSessions.lastActiveAt));
  }),

  revokeSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!.delete(userSessions).where(
        and(eq(userSessions.id, input.sessionId), eq(userSessions.userId, ctx.user.id))
      );
      return { revoked: true };
    }),

  revokeAllSessions: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    await db!.delete(userSessions).where(
      and(eq(userSessions.userId, ctx.user.id), eq(userSessions.isCurrent, false))
    );
    return { revokedAll: true };
  }),

  // ─── 2FA ────────────────────────────────────────────────────────────────────
  toggle2FA: protectedProcedure
    .input(z.object({ enabled: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!.update(users).set({ twoFactorEnabled: input.enabled })
        .where(eq(users.id, ctx.user.id));
      return { twoFactorEnabled: input.enabled };
    }),

  // ─── THREAT ANALYTICS ───────────────────────────────────────────────────────
  getThreats: protectedProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      // Admin sees all, user sees own
      const condition = ctx.user.role === "admin"
        ? undefined
        : eq(threatEvents.userId, ctx.user.id);
      return db!.select().from(threatEvents)
        .where(condition)
        .orderBy(desc(threatEvents.createdAt))
        .limit(input.limit);
    }),

  resolveThread: protectedProcedure
    .input(z.object({ threatId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!.update(threatEvents).set({
        isResolved: true,
        resolvedBy: ctx.user.id,
        resolvedAt: new Date(),
      }).where(eq(threatEvents.id, input.threatId));
      return { resolved: true };
    }),

  // ─── SECURITY DASHBOARD ─────────────────────────────────────────────────────
  dashboard: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const [user] = await db!.select({
      twoFactorEnabled: users.twoFactorEnabled,
    }).from(users).where(eq(users.id, ctx.user.id));

    const [sessionCount] = await db!.select({ count: sql<number>`count(*)` })
      .from(userSessions).where(eq(userSessions.userId, ctx.user.id));

    const [threatCount] = await db!.select({ count: sql<number>`count(*)` })
      .from(threatEvents).where(and(
        eq(threatEvents.userId, ctx.user.id),
        eq(threatEvents.isResolved, false)
      ));

    const [logCount] = await db!.select({ count: sql<number>`count(*)` })
      .from(securityLogs).where(eq(securityLogs.userId, ctx.user.id));

    return {
      twoFactorEnabled: user?.twoFactorEnabled || false,
      activeSessions: sessionCount?.count || 0,
      unresolvedThreats: threatCount?.count || 0,
      securityEvents: logCount?.count || 0,
      securityScore: user?.twoFactorEnabled ? 92 : 65,
    };
  }),

  // ─── AUDIT LOG ──────────────────────────────────────────────────────────────
  getAuditLog: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      const condition = ctx.user.role === "admin"
        ? undefined
        : eq(securityLogs.userId, ctx.user.id);
      return db!.select().from(securityLogs)
        .where(condition)
        .orderBy(desc(securityLogs.createdAt))
        .limit(input.limit);
    }),
});
