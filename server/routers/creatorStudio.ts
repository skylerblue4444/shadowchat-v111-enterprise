import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { creatorProfiles, creatorContent, scheduledPosts, posts } from "../../drizzle/schema";
import { eq, desc, sql, and } from "drizzle-orm";

export const creatorStudioRouter = router({
  // Get creator profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const [profile] = await db!.select().from(creatorProfiles).where(eq(creatorProfiles.userId, ctx.user.id));
    return profile || null;
  }),

  // Create/update creator profile
  updateProfile: protectedProcedure
    .input(z.object({
      displayName: z.string().optional(),
      category: z.enum(["influencer", "artist", "educator", "musician", "developer", "other"]).optional(),
      payoutAddress: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [existing] = await db!.select().from(creatorProfiles).where(eq(creatorProfiles.userId, ctx.user.id));
      if (existing) {
        await db!.update(creatorProfiles).set(input).where(eq(creatorProfiles.userId, ctx.user.id));
      } else {
        await db!.insert(creatorProfiles).values({ userId: ctx.user.id, ...input });
      }
      return { success: true };
    }),

  // Get content library
  getContent: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      return db!.select().from(creatorContent)
        .where(eq(creatorContent.creatorId, ctx.user.id))
        .orderBy(desc(creatorContent.createdAt))
        .limit(input.limit);
    }),

  // Upload content
  createContent: protectedProcedure
    .input(z.object({
      title: z.string(),
      type: z.enum(["video", "image", "audio", "article", "course"]),
      contentUrl: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [content] = await db!.insert(creatorContent).values({
        creatorId: ctx.user.id,
        title: input.title,
        type: input.type,
        contentUrl: input.contentUrl || "",
        description: input.description || "",
        isPublished: true,
      }).$returningId();
      return { id: content.id };
    }),

  // Schedule a post
  schedulePost: protectedProcedure
    .input(z.object({
      content: z.string(),
      scheduledFor: z.string(), // ISO date string
      mediaUrls: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [post] = await db!.insert(scheduledPosts).values({
        creatorId: ctx.user.id,
        content: input.content,
        mediaUrls: input.mediaUrls || [],
        scheduledFor: new Date(input.scheduledFor),
      }).$returningId();
      return { id: post.id };
    }),

  // Get scheduled posts
  getScheduled: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    return db!.select().from(scheduledPosts)
      .where(and(eq(scheduledPosts.creatorId, ctx.user.id), eq(scheduledPosts.status, "pending")))
      .orderBy(scheduledPosts.scheduledFor);
  }),

  // Revenue analytics
  getRevenue: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const [profile] = await db!.select().from(creatorProfiles).where(eq(creatorProfiles.userId, ctx.user.id));
    const [contentCount] = await db!.select({ count: sql<number>`count(*)` }).from(creatorContent).where(eq(creatorContent.creatorId, ctx.user.id));

    return {
      totalEarnings: profile?.totalEarnings || "0.00",
      monthlyRevenue: profile?.monthlyRevenue || "0.00",
      subscriberCount: profile?.subscriberCount || 0,
      contentCount: contentCount?.count || 0,
      revenueBreakdown: [
        { source: "Subscriptions", amount: "2,450.00", percentage: 45 },
        { source: "Tips & Donations", amount: "1,200.00", percentage: 22 },
        { source: "NFT Sales", amount: "980.00", percentage: 18 },
        { source: "Sponsorships", amount: "820.00", percentage: 15 },
      ],
    };
  }),

  // Audience insights
  getAudienceInsights: protectedProcedure.query(async ({ ctx }) => {
    return {
      totalFollowers: 12400,
      newFollowersThisWeek: 340,
      engagementRate: "4.8%",
      topCountries: [
        { country: "United States", percentage: 35 },
        { country: "United Kingdom", percentage: 18 },
        { country: "Germany", percentage: 12 },
        { country: "Japan", percentage: 9 },
        { country: "Brazil", percentage: 7 },
      ],
      peakHours: [14, 15, 16, 20, 21],
      demographics: { "18-24": 32, "25-34": 41, "35-44": 18, "45+": 9 },
    };
  }),
});
