import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { digitalTwins, trades, posts, aiMemory } from "../../drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";

export const digitalTwinRouter = router({
  // Get or create digital twin
  get: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const [twin] = await db!.select().from(digitalTwins).where(eq(digitalTwins.userId, ctx.user.id));
    if (!twin) return null;
    return twin;
  }),

  // Create digital twin
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      tradingStyle: z.string().optional(),
      riskTolerance: z.enum(["conservative", "moderate", "aggressive"]).default("moderate"),
      personality: z.record(z.string(), z.number()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [twin] = await db!.insert(digitalTwins).values({
        userId: ctx.user.id,
        name: input.name,
        tradingStyle: input.tradingStyle,
        riskTolerance: input.riskTolerance,
        personality: input.personality || { creativity: 0.7, logic: 0.8, empathy: 0.6, risk: 0.5 },
        isActive: true,
      }).$returningId();
      return { id: twin.id, created: true };
    }),

  // Update twin settings
  update: protectedProcedure
    .input(z.object({
      name: z.string().optional(),
      tradingStyle: z.string().optional(),
      riskTolerance: z.enum(["conservative", "moderate", "aggressive"]).optional(),
      personality: z.record(z.string(), z.number()).optional(),
      automatedTrading: z.boolean().optional(),
      automatedPosting: z.boolean().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!.update(digitalTwins).set(input).where(eq(digitalTwins.userId, ctx.user.id));
      return { updated: true };
    }),

  // Get twin's behavioral analysis (AI-powered)
  analyze: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    // Gather user data for analysis
    const recentTrades = await db!.select().from(trades)
      .where(eq(trades.userId, ctx.user.id))
      .orderBy(desc(trades.createdAt)).limit(10);
    const recentPosts = await db!.select().from(posts)
      .where(eq(posts.authorId, ctx.user.id))
      .orderBy(desc(posts.createdAt)).limit(5);

    const context = `User has ${recentTrades.length} recent trades (${recentTrades.map(t => `${t.side} ${t.amount} @ ${t.price}`).join(", ")}). Recent posts: ${recentPosts.map(p => p.content?.slice(0, 50)).join("; ")}`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are a behavioral analysis AI. Analyze the user's digital footprint and provide personality insights, trading patterns, and recommendations. Return JSON with keys: tradingPattern, socialPattern, riskProfile, recommendations (array), personalityScores (object with creativity, logic, empathy, risk as 0-1 floats)." },
        { role: "user", content: context },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "twin_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              tradingPattern: { type: "string" },
              socialPattern: { type: "string" },
              riskProfile: { type: "string" },
              recommendations: { type: "array", items: { type: "string" } },
              personalityScores: {
                type: "object",
                properties: {
                  creativity: { type: "number" },
                  logic: { type: "number" },
                  empathy: { type: "number" },
                  risk: { type: "number" },
                },
                required: ["creativity", "logic", "empathy", "risk"],
                additionalProperties: false,
              },
            },
            required: ["tradingPattern", "socialPattern", "riskProfile", "recommendations", "personalityScores"],
            additionalProperties: false,
          },
        },
      },
    });

    const analysis = JSON.parse((response.choices[0]?.message?.content as string) || "{}");

    // Update twin personality based on analysis
    if (analysis.personalityScores) {
      await db!.update(digitalTwins).set({
        personality: analysis.personalityScores,
      }).where(eq(digitalTwins.userId, ctx.user.id));
    }

    return analysis;
  }),

  // Twin autonomous action (simulate what twin would do)
  simulate: protectedProcedure
    .input(z.object({ scenario: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [twin] = await db!.select().from(digitalTwins).where(eq(digitalTwins.userId, ctx.user.id));
      if (!twin) return { error: "No digital twin configured" };

      const response = await invokeLLM({
        messages: [
          { role: "system", content: `You are a digital twin AI with personality: ${JSON.stringify(twin.personality)}. Trading style: ${twin.tradingStyle || "balanced"}. Risk tolerance: ${twin.riskTolerance}. Simulate what this user's digital twin would do in the given scenario. Be specific about actions.` },
          { role: "user", content: input.scenario },
        ],
      });

      return {
        action: response.choices[0]?.message?.content || "No simulation generated",
        twinName: twin.name,
        confidence: 0.85,
      };
    }),

  // Get twin earnings
  earnings: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const [twin] = await db!.select().from(digitalTwins).where(eq(digitalTwins.userId, ctx.user.id));
    return {
      totalEarnings: twin?.totalEarnings || "0",
      automatedTrading: twin?.automatedTrading || false,
      automatedPosting: twin?.automatedPosting || false,
    };
  }),
});
