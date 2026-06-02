import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { liveStreams, streamMessages, users } from "../../drizzle/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export const liveVideoRouter = router({
  // Get live streams
  getLive: publicProcedure
    .input(z.object({ category: z.string().optional(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      let query = db!.select({
        id: liveStreams.id,
        hostId: liveStreams.hostId,
        title: liveStreams.title,
        description: liveStreams.description,
        category: liveStreams.category,
        status: liveStreams.status,
        viewerCount: liveStreams.viewerCount,
        thumbnailUrl: liveStreams.thumbnailUrl,
        startedAt: liveStreams.startedAt,
      }).from(liveStreams)
        .where(eq(liveStreams.status, "live"))
        .orderBy(desc(liveStreams.viewerCount))
        .limit(input.limit);

      const streams = await query;
      // Enrich with host info
      const enriched = await Promise.all(streams.map(async (s) => {
        const [host] = await db!.select({ name: users.name, avatarUrl: users.avatarUrl }).from(users).where(eq(users.id, s.hostId));
        return { ...s, hostName: host?.name || "Anonymous", hostAvatar: host?.avatarUrl };
      }));
      return enriched;
    }),

  // Start a stream
  startStream: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      category: z.enum(["gaming", "music", "talk", "education", "creative", "other"]).default("other"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const streamKey = nanoid(24);
      const [stream] = await db!.insert(liveStreams).values({
        hostId: ctx.user.id,
        title: input.title,
        description: input.description || "",
        category: input.category,
        status: "live",
        streamKey,
        startedAt: new Date(),
      }).$returningId();
      return { id: stream.id, streamKey };
    }),

  // End a stream
  endStream: protectedProcedure
    .input(z.object({ streamId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!.update(liveStreams).set({
        status: "ended",
        endedAt: new Date(),
      }).where(and(eq(liveStreams.id, input.streamId), eq(liveStreams.hostId, ctx.user.id)));
      return { ended: true };
    }),

  // Get stream details
  getStream: publicProcedure
    .input(z.object({ streamId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [stream] = await db!.select().from(liveStreams).where(eq(liveStreams.id, input.streamId));
      if (!stream) return null;
      const [host] = await db!.select({ name: users.name, avatarUrl: users.avatarUrl }).from(users).where(eq(users.id, stream.hostId));
      return { ...stream, hostName: host?.name, hostAvatar: host?.avatarUrl };
    }),

  // Get stream chat messages
  getMessages: publicProcedure
    .input(z.object({ streamId: z.number(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      const db = await getDb();
      const msgs = await db!.select().from(streamMessages)
        .where(eq(streamMessages.streamId, input.streamId))
        .orderBy(desc(streamMessages.createdAt))
        .limit(input.limit);

      const enriched = await Promise.all(msgs.map(async (m) => {
        const [user] = await db!.select({ name: users.name }).from(users).where(eq(users.id, m.userId));
        return { ...m, userName: user?.name || "Anonymous" };
      }));
      return enriched.reverse();
    }),

  // Send chat message in stream
  sendMessage: protectedProcedure
    .input(z.object({
      streamId: z.number(),
      content: z.string(),
      type: z.enum(["chat", "tip", "system", "mod"]).default("chat"),
      amount: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!.insert(streamMessages).values({
        streamId: input.streamId,
        userId: ctx.user.id,
        content: input.content,
        type: input.type,
        amount: input.amount,
      });
      return { sent: true };
    }),

  // Get my streams (creator dashboard)
  myStreams: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    return db!.select().from(liveStreams)
      .where(eq(liveStreams.hostId, ctx.user.id))
      .orderBy(desc(liveStreams.createdAt))
      .limit(20);
  }),
});
