import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { sandboxEnvironments } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const sandboxRouter = router({
  // Get my environments
  getEnvironments: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    return db!.select().from(sandboxEnvironments)
      .where(eq(sandboxEnvironments.ownerId, ctx.user.id))
      .orderBy(desc(sandboxEnvironments.createdAt));
  }),

  // Create environment
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      type: z.enum(["ai_test", "trading_sim", "feature_preview", "behavior_model"]),
      config: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [env] = await db!.insert(sandboxEnvironments).values({
        ownerId: ctx.user.id,
        name: input.name,
        type: input.type,
        config: input.config || {},
        status: "active",
      }).$returningId();
      return { id: env.id };
    }),

  // Run simulation
  runSimulation: protectedProcedure
    .input(z.object({
      environmentId: z.number(),
      parameters: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      // Simulate running
      const results = {
        status: "completed",
        iterations: Math.floor(Math.random() * 1000) + 100,
        accuracy: (Math.random() * 20 + 80).toFixed(2) + "%",
        duration: (Math.random() * 5 + 1).toFixed(1) + "s",
        insights: [
          "Pattern detected: 73% correlation between engagement and time-of-day",
          "Anomaly: Spike in trading volume at 14:00 UTC",
          "Recommendation: Increase AI agent response frequency by 15%",
        ],
      };
      await db!.update(sandboxEnvironments).set({ results }).where(eq(sandboxEnvironments.id, input.environmentId));
      return results;
    }),

  // Pause/resume environment
  toggleStatus: protectedProcedure
    .input(z.object({ environmentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [env] = await db!.select().from(sandboxEnvironments).where(eq(sandboxEnvironments.id, input.environmentId));
      if (!env) return { success: false };
      const newStatus = env.status === "active" ? "paused" : "active";
      await db!.update(sandboxEnvironments).set({ status: newStatus }).where(eq(sandboxEnvironments.id, input.environmentId));
      return { success: true, status: newStatus };
    }),

  // Delete environment
  delete: protectedProcedure
    .input(z.object({ environmentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!.update(sandboxEnvironments).set({ status: "archived" }).where(eq(sandboxEnvironments.id, input.environmentId));
      return { deleted: true };
    }),
});
