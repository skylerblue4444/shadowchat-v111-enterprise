import { z } from "zod";
import { desc, eq, and } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { notifications } from "../../drizzle/schema";
import { sql } from "drizzle-orm";

export const notificationsRouter = router({
  // Get user notifications
  getAll: protectedProcedure
    .input(z.object({ limit: z.number().default(50), unreadOnly: z.boolean().default(false) }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const query = db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, ctx.user.id))
        .orderBy(desc(notifications.createdAt))
        .limit(input.limit);

      const results = await query;
      if (input.unreadOnly) return results.filter(n => !n.isRead);
      return results;
    }),

  // Get unread count
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return 0;
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(and(eq(notifications.userId, ctx.user.id), eq(notifications.isRead, false)));
    return result[0]?.count || 0;
  }),

  // Mark as read
  markRead: protectedProcedure
    .input(z.object({ id: z.number().optional() })) // if no id, mark all read
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return;

      if (input.id) {
        await db.update(notifications)
          .set({ isRead: true })
          .where(and(eq(notifications.id, input.id), eq(notifications.userId, ctx.user.id)));
      } else {
        await db.update(notifications)
          .set({ isRead: true })
          .where(eq(notifications.userId, ctx.user.id));
      }
      return { success: true };
    }),

  // Create notification (internal use / admin)
  create: protectedProcedure
    .input(z.object({
      userId: z.number(),
      type: z.enum(["like", "comment", "follow", "mention", "trade", "governance", "reward", "system", "message"]),
      title: z.string(),
      body: z.string().optional(),
      data: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return;
      await db.insert(notifications).values({
        userId: input.userId,
        type: input.type,
        title: input.title,
        body: input.body,
        data: input.data,
        actorId: ctx.user.id,
      });
      return { success: true };
    }),
});
