import { z } from "zod";
import { desc, eq, and, or, inArray } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { conversations, conversationMembers, messages, users, notifications } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";

export const messagingRouter = router({
  // Get user's conversations
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    // Get conversation IDs the user is a member of
    const memberOf = await db
      .select({ conversationId: conversationMembers.conversationId })
      .from(conversationMembers)
      .where(eq(conversationMembers.userId, ctx.user.id));

    if (memberOf.length === 0) return [];

    const convIds = memberOf.map(m => m.conversationId);

    const convs = await db
      .select()
      .from(conversations)
      .where(inArray(conversations.id, convIds))
      .orderBy(desc(conversations.lastMessageAt));

    // Get last message and member count for each
    const result = await Promise.all(convs.map(async (conv) => {
      const lastMsg = await db
        .select({ content: messages.content, createdAt: messages.createdAt, senderName: users.name })
        .from(messages)
        .leftJoin(users, eq(messages.senderId, users.id))
        .where(and(eq(messages.conversationId, conv.id), eq(messages.isDeleted, false)))
        .orderBy(desc(messages.createdAt))
        .limit(1);

      const members = await db
        .select({ userId: conversationMembers.userId, userName: users.name, userAvatar: users.avatarUrl })
        .from(conversationMembers)
        .leftJoin(users, eq(conversationMembers.userId, users.id))
        .where(eq(conversationMembers.conversationId, conv.id));

      const unread = await db
        .select({ id: messages.id })
        .from(messages)
        .where(and(eq(messages.conversationId, conv.id), eq(messages.isRead, false)));

      return {
        ...conv,
        lastMessage: lastMsg[0] || null,
        members,
        unreadCount: unread.length,
      };
    }));

    return result;
  }),

  // Get messages in a conversation
  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.number(), limit: z.number().default(50), before: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];

      // Verify user is a member
      const member = await db
        .select()
        .from(conversationMembers)
        .where(and(eq(conversationMembers.conversationId, input.conversationId), eq(conversationMembers.userId, ctx.user.id)))
        .limit(1);

      if (!member[0]) throw new TRPCError({ code: "FORBIDDEN" });

      const msgs = await db
        .select({
          id: messages.id,
          content: messages.content,
          mediaUrl: messages.mediaUrl,
          mediaType: messages.mediaType,
          isRead: messages.isRead,
          reactions: messages.reactions,
          replyToId: messages.replyToId,
          createdAt: messages.createdAt,
          senderId: messages.senderId,
          senderName: users.name,
          senderAvatar: users.avatarUrl,
        })
        .from(messages)
        .leftJoin(users, eq(messages.senderId, users.id))
        .where(and(eq(messages.conversationId, input.conversationId), eq(messages.isDeleted, false)))
        .orderBy(desc(messages.createdAt))
        .limit(input.limit);

      // Mark as read
      await db.update(messages)
        .set({ isRead: true })
        .where(and(eq(messages.conversationId, input.conversationId), eq(messages.isRead, false)));

      return msgs.reverse();
    }),

  // Send a message
  sendMessage: protectedProcedure
    .input(z.object({
      conversationId: z.number(),
      content: z.string().min(1).max(4000),
      mediaUrl: z.string().optional(),
      mediaType: z.string().optional(),
      replyToId: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Verify membership
      const member = await db
        .select()
        .from(conversationMembers)
        .where(and(eq(conversationMembers.conversationId, input.conversationId), eq(conversationMembers.userId, ctx.user.id)))
        .limit(1);

      if (!member[0]) throw new TRPCError({ code: "FORBIDDEN" });

      const [result] = await db.insert(messages).values({
        conversationId: input.conversationId,
        senderId: ctx.user.id,
        content: input.content,
        mediaUrl: input.mediaUrl,
        mediaType: input.mediaType,
        replyToId: input.replyToId,
      });

      // Update conversation last message time
      await db.update(conversations)
        .set({ lastMessageAt: new Date() })
        .where(eq(conversations.id, input.conversationId));

      return { success: true, messageId: result.insertId };
    }),

  // Start a new DM conversation
  startDM: protectedProcedure
    .input(z.object({ targetUserId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Check if DM already exists
      const myConvs = await db
        .select({ conversationId: conversationMembers.conversationId })
        .from(conversationMembers)
        .where(eq(conversationMembers.userId, ctx.user.id));

      const theirConvs = await db
        .select({ conversationId: conversationMembers.conversationId })
        .from(conversationMembers)
        .where(eq(conversationMembers.userId, input.targetUserId));

      const myIds = new Set(myConvs.map(c => c.conversationId));
      const shared = theirConvs.find(c => myIds.has(c.conversationId));

      if (shared) return { conversationId: shared.conversationId };

      // Create new conversation
      const [conv] = await db.insert(conversations).values({ isGroup: false, isEncrypted: true });
      const convId = conv.insertId;

      await db.insert(conversationMembers).values([
        { conversationId: convId, userId: ctx.user.id },
        { conversationId: convId, userId: input.targetUserId },
      ]);

      return { conversationId: convId };
    }),
});
