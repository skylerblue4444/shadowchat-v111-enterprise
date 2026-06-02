import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { workflows, workflowRuns } from "../../drizzle/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export const workflowRouter = router({
  // Create workflow
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      trigger: z.enum(["manual", "event", "schedule", "webhook", "ai"]).default("manual"),
      triggerConfig: z.any().optional(),
      steps: z.array(z.object({
        id: z.string(),
        type: z.string(),
        config: z.record(z.string(), z.any()),
        next: z.string().optional(),
      })).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [wf] = await db!.insert(workflows).values({
        ownerId: ctx.user.id,
        name: input.name,
        description: input.description,
        trigger: input.trigger,
        triggerConfig: input.triggerConfig,
        steps: input.steps || [],
      }).$returningId();
      return { id: wf.id, created: true };
    }),

  // List workflows
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    return db!.select().from(workflows)
      .where(eq(workflows.ownerId, ctx.user.id))
      .orderBy(desc(workflows.updatedAt));
  }),

  // Get workflow detail
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      const [wf] = await db!.select().from(workflows)
        .where(and(eq(workflows.id, input.id), eq(workflows.ownerId, ctx.user.id)));
      return wf || null;
    }),

  // Update workflow
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      trigger: z.enum(["manual", "event", "schedule", "webhook", "ai"]).optional(),
      triggerConfig: z.any().optional(),
      steps: z.array(z.object({
        id: z.string(),
        type: z.string(),
        config: z.record(z.string(), z.any()),
        next: z.string().optional(),
      })).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const { id, ...updates } = input;
      await db!.update(workflows).set(updates).where(
        and(eq(workflows.id, id), eq(workflows.ownerId, ctx.user.id))
      );
      return { updated: true };
    }),

  // Toggle active
  toggle: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [wf] = await db!.select().from(workflows)
        .where(and(eq(workflows.id, input.id), eq(workflows.ownerId, ctx.user.id)));
      if (!wf) return { error: "Not found" };
      await db!.update(workflows).set({ isActive: !wf.isActive }).where(eq(workflows.id, input.id));
      return { isActive: !wf.isActive };
    }),

  // Execute workflow (manual trigger)
  execute: protectedProcedure
    .input(z.object({ id: z.number(), input: z.any().optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [wf] = await db!.select().from(workflows)
        .where(and(eq(workflows.id, input.id), eq(workflows.ownerId, ctx.user.id)));
      if (!wf) return { error: "Workflow not found" };

      // Create run record
      const [run] = await db!.insert(workflowRuns).values({
        workflowId: input.id,
        status: "running",
        triggeredBy: `user:${ctx.user.id}`,
        input: input.input,
      }).$returningId();

      // Simulate execution (in production this would be async)
      await db!.update(workflowRuns).set({
        status: "completed",
        output: { result: "Workflow executed successfully", stepsRun: (wf.steps as unknown[])?.length || 0 },
        completedAt: new Date(),
      }).where(eq(workflowRuns.id, run.id));

      // Update workflow stats
      await db!.update(workflows).set({
        lastRunAt: new Date(),
        runCount: sql`${workflows.runCount} + 1`,
        successCount: sql`${workflows.successCount} + 1`,
      }).where(eq(workflows.id, input.id));

      return { runId: run.id, status: "completed" };
    }),

  // Get run history
  runs: protectedProcedure
    .input(z.object({ workflowId: z.number(), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      return db!.select().from(workflowRuns)
        .where(eq(workflowRuns.workflowId, input.workflowId))
        .orderBy(desc(workflowRuns.startedAt))
        .limit(input.limit);
    }),

  // Delete workflow
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!.delete(workflowRuns).where(eq(workflowRuns.workflowId, input.id));
      await db!.delete(workflows).where(and(eq(workflows.id, input.id), eq(workflows.ownerId, ctx.user.id)));
      return { deleted: true };
    }),
});
