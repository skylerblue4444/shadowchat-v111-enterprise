import { z } from "zod";
import { desc, eq, and, sql, like, inArray } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { posts, postLikes, follows, users, notifications } from "../../drizzle/schema";

export const socialRouter = router({
  // Get feed posts (public + followed users)
  getFeed: publicProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return { posts: [], total: 0 };

      const feedPosts = await db
        .select({
          id: posts.id,
          content: posts.content,
          mediaUrls: posts.mediaUrls,
          tags: posts.tags,
          likes: posts.likes,
          reposts: posts.reposts,
          comments: posts.comments,
          views: posts.views,
          aiScore: posts.aiScore,
          isNFT: posts.isNFT,
          createdAt: posts.createdAt,
          authorId: posts.authorId,
          authorName: users.name,
          authorUsername: users.username,
          authorAvatar: users.avatarUrl,
          authorVerified: users.isVerified,
          authorLevel: users.level,
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .where(eq(posts.isHidden, false))
        .orderBy(desc(posts.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return { posts: feedPosts, total: feedPosts.length };
    }),

  // Create a post
  createPost: protectedProcedure
    .input(z.object({
      content: z.string().min(1).max(2000),
      mediaUrls: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const aiScore = Math.min(100, input.content.length / 10 + Math.random() * 20);

      const [result] = await db.insert(posts).values({
        authorId: ctx.user.id,
        content: input.content,
        mediaUrls: input.mediaUrls || [],
        tags: input.tags || [],
        aiScore: aiScore.toFixed(2),
      });

      return { success: true, postId: result.insertId };
    }),

  // Like a post
  likePost: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Check if already liked
      const existing = await db
        .select()
        .from(postLikes)
        .where(and(eq(postLikes.postId, input.postId), eq(postLikes.userId, ctx.user.id)))
        .limit(1);

      if (existing.length > 0) {
        // Unlike
        await db.delete(postLikes).where(
          and(eq(postLikes.postId, input.postId), eq(postLikes.userId, ctx.user.id))
        );
        await db.update(posts)
          .set({ likes: sql`${posts.likes} - 1` })
          .where(eq(posts.id, input.postId));
        return { liked: false };
      } else {
        // Like
        await db.insert(postLikes).values({ postId: input.postId, userId: ctx.user.id });
        await db.update(posts)
          .set({ likes: sql`${posts.likes} + 1` })
          .where(eq(posts.id, input.postId));
        return { liked: true };
      }
    }),

  // Follow a user
  followUser: protectedProcedure
    .input(z.object({ targetUserId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const existing = await db
        .select()
        .from(follows)
        .where(and(eq(follows.followerId, ctx.user.id), eq(follows.followingId, input.targetUserId)))
        .limit(1);

      if (existing.length > 0) {
        await db.delete(follows).where(
          and(eq(follows.followerId, ctx.user.id), eq(follows.followingId, input.targetUserId))
        );
        return { following: false };
      } else {
        await db.insert(follows).values({ followerId: ctx.user.id, followingId: input.targetUserId });
        return { following: true };
      }
    }),

  // Search posts
  search: publicProcedure
    .input(z.object({ query: z.string(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return db
        .select({ id: posts.id, content: posts.content, createdAt: posts.createdAt, authorName: users.name })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .where(like(posts.content, `%${input.query}%`))
        .limit(input.limit);
    }),

  // Get trending tags
  getTrending: publicProcedure.query(async () => {
    return [
      { tag: "SkyToken", count: 4821, change: 12.4 },
      { tag: "DeFi", count: 3205, change: 8.1 },
      { tag: "HOPEai", count: 2987, change: 23.7 },
      { tag: "Web3", count: 2341, change: -2.3 },
      { tag: "NFT", count: 1876, change: 5.6 },
      { tag: "Governance", count: 1543, change: 31.2 },
      { tag: "ShadowChat", count: 1298, change: 18.9 },
    ];
  }),
});
