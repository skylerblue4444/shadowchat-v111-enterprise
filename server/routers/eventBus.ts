import { z } from "zod";
import { publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { domainEvents, eventSubscriptions } from "../../drizzle/schema";
import { eq, desc, and, sql, like } from "drizzle-orm";
import { router } from "../_core/trpc";

export const eventBusRouter = router({
  // Emit a domain event
  emit: protectedProcedure
    .input(z.object({
      type: z.string(),
      source: z.string(),
      entityType: z.string().optional(),
      entityId: z.number().optional(),
      payload: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [event] = await db!.insert(domainEvents).values({
        type: input.type,
        source: input.source,
        actorId: ctx.user.id,
        entityType: input.entityType,
        entityId: input.entityId,
        payload: input.payload,
      }).$returningId();
      return { id: event.id, type: input.type, emitted: true };
    }),

  // Get recent events (with optional filter)
  list: protectedProcedure
    .input(z.object({
      type: z.string().optional(),
      source: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      const conditions = [];
      if (input.type) conditions.push(like(domainEvents.type, `%${input.type}%`));
      if (input.source) conditions.push(eq(domainEvents.source, input.source));

      const events = await db!.select().from(domainEvents)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(domainEvents.createdAt))
        .limit(input.limit);
      return events;
    }),

  // Subscribe to event type
  subscribe: protectedProcedure
    .input(z.object({
      eventType: z.string(),
      webhookUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!.insert(eventSubscriptions).values({
        subscriberId: String(ctx.user.id),
        eventType: input.eventType,
        webhookUrl: input.webhookUrl,
      });
      return { subscribed: true };
    }),

  // Get subscriptions
  subscriptions: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    return db!.select().from(eventSubscriptions)
      .where(eq(eventSubscriptions.subscriberId, String(ctx.user.id)));
  }),

  // Get event stats
  stats: protectedProcedure.query(async () => {
    const db = await getDb();
    const [total] = await db!.select({ count: sql<number>`count(*)` }).from(domainEvents);
    const [today] = await db!.select({ count: sql<number>`count(*)` }).from(domainEvents)
      .where(sql`${domainEvents.createdAt} > DATE_SUB(NOW(), INTERVAL 1 DAY)`);
    const sources = await db!.select({
      source: domainEvents.source,
      count: sql<number>`count(*)`,
    }).from(domainEvents).groupBy(domainEvents.source).limit(10);
    return { totalEvents: total.count, todayEvents: today.count, topSources: sources };
  }),
});
