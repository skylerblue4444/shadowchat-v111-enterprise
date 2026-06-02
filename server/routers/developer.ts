import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { apiKeys, webhooks, plugins } from "../../drizzle/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { createHash } from "crypto";

function hashKey(key: string) {
  return createHash("sha256").update(key).digest("hex");
}

export const developerRouter = router({
  // ─── API KEYS ───────────────────────────────────────────────────────────────
  createApiKey: protectedProcedure
    .input(z.object({
      name: z.string(),
      scopes: z.array(z.string()).default(["read"]),
      rateLimit: z.number().default(1000),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const rawKey = `sk_live_${nanoid(32)}`;
      const keyHash = hashKey(rawKey);
      const keyPrefix = rawKey.slice(0, 12);

      await db!.insert(apiKeys).values({
        userId: ctx.user.id,
        name: input.name,
        keyHash,
        keyPrefix,
        scopes: input.scopes,
        rateLimit: input.rateLimit,
      });
      // Only return the full key once
      return { key: rawKey, prefix: keyPrefix, name: input.name };
    }),

  listApiKeys: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    return db!.select({
      id: apiKeys.id,
      name: apiKeys.name,
      keyPrefix: apiKeys.keyPrefix,
      scopes: apiKeys.scopes,
      rateLimit: apiKeys.rateLimit,
      usageCount: apiKeys.usageCount,
      lastUsedAt: apiKeys.lastUsedAt,
      isActive: apiKeys.isActive,
      createdAt: apiKeys.createdAt,
    }).from(apiKeys).where(eq(apiKeys.userId, ctx.user.id)).orderBy(desc(apiKeys.createdAt));
  }),

  revokeApiKey: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!.update(apiKeys).set({ isActive: false })
        .where(and(eq(apiKeys.id, input.id), eq(apiKeys.userId, ctx.user.id)));
      return { revoked: true };
    }),

  // ─── WEBHOOKS ───────────────────────────────────────────────────────────────
  createWebhook: protectedProcedure
    .input(z.object({
      name: z.string(),
      url: z.string().url(),
      events: z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const secret = `whsec_${nanoid(24)}`;
      const [wh] = await db!.insert(webhooks).values({
        userId: ctx.user.id,
        name: input.name,
        url: input.url,
        events: input.events,
        secret,
      }).$returningId();
      return { id: wh.id, secret };
    }),

  listWebhooks: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    return db!.select().from(webhooks)
      .where(eq(webhooks.userId, ctx.user.id))
      .orderBy(desc(webhooks.createdAt));
  }),

  toggleWebhook: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [wh] = await db!.select().from(webhooks)
        .where(and(eq(webhooks.id, input.id), eq(webhooks.userId, ctx.user.id)));
      if (!wh) return { error: "Not found" };
      await db!.update(webhooks).set({ isActive: !wh.isActive }).where(eq(webhooks.id, input.id));
      return { isActive: !wh.isActive };
    }),

  deleteWebhook: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!.delete(webhooks).where(and(eq(webhooks.id, input.id), eq(webhooks.userId, ctx.user.id)));
      return { deleted: true };
    }),

  // ─── PLUGINS / MARKETPLACE ──────────────────────────────────────────────────
  listPlugins: protectedProcedure
    .input(z.object({
      category: z.enum(["ai", "trading", "social", "analytics", "security", "utility"]).optional(),
      limit: z.number().default(20),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      const condition = input.category ? eq(plugins.category, input.category) : eq(plugins.isPublished, true);
      return db!.select().from(plugins).where(condition).orderBy(desc(plugins.installCount)).limit(input.limit);
    }),

  createPlugin: protectedProcedure
    .input(z.object({
      name: z.string(),
      slug: z.string(),
      description: z.string().optional(),
      category: z.enum(["ai", "trading", "social", "analytics", "security", "utility"]).default("utility"),
      config: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [plugin] = await db!.insert(plugins).values({
        developerId: ctx.user.id,
        name: input.name,
        slug: input.slug,
        description: input.description,
        category: input.category,
        config: input.config,
      }).$returningId();
      return { id: plugin.id, created: true };
    }),

  publishPlugin: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!.update(plugins).set({ isPublished: true })
        .where(and(eq(plugins.id, input.id), eq(plugins.developerId, ctx.user.id)));
      return { published: true };
    }),

  installPlugin: protectedProcedure
    .input(z.object({ pluginId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      await db!.update(plugins).set({ installCount: sql`${plugins.installCount} + 1` })
        .where(eq(plugins.id, input.pluginId));
      return { installed: true };
    }),

  // ─── DEV STATS ──────────────────────────────────────────────────────────────
  stats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const [keyCount] = await db!.select({ count: sql<number>`count(*)` })
      .from(apiKeys).where(eq(apiKeys.userId, ctx.user.id));
    const [whCount] = await db!.select({ count: sql<number>`count(*)` })
      .from(webhooks).where(eq(webhooks.userId, ctx.user.id));
    const [pluginCount] = await db!.select({ count: sql<number>`count(*)` })
      .from(plugins).where(eq(plugins.developerId, ctx.user.id));
    const [totalUsage] = await db!.select({ total: sql<number>`COALESCE(SUM(usageCount), 0)` })
      .from(apiKeys).where(eq(apiKeys.userId, ctx.user.id));
    return {
      apiKeys: keyCount?.count || 0,
      webhooks: whCount?.count || 0,
      plugins: pluginCount?.count || 0,
      totalApiCalls: totalUsage?.total || 0,
    };
  }),
});
