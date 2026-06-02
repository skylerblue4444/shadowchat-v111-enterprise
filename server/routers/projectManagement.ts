/**
 * Project Management Router — Tasks, Sprints, Kanban, Time Tracking
 * Inspired by Linear, Jira, Plane patterns
 */
import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const projectManagementRouter = router({
  // ─── Create project ────────────────────────────────────────────────────────
  createProject: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      template: z.enum(["kanban", "scrum", "waterfall"]).default("kanban"),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        projectId: `proj_${Date.now()}`,
        name: input.name,
        template: input.template,
        owner: ctx.user.id,
        createdAt: new Date(),
      };
    }),

  // ─── Get projects ──────────────────────────────────────────────────────────
  getProjects: protectedProcedure
    .query(async ({ ctx }) => {
      return {
        projects: [
          { id: "proj_1", name: "ShadowChat v2.0", status: "active", tasks: 47, completed: 32, members: 8, dueDate: new Date(Date.now() + 2592000000) },
          { id: "proj_2", name: "HOPE AI Engine", status: "active", tasks: 28, completed: 15, members: 5, dueDate: new Date(Date.now() + 5184000000) },
          { id: "proj_3", name: "Mobile App", status: "planning", tasks: 64, completed: 0, members: 12, dueDate: new Date(Date.now() + 7776000000) },
          { id: "proj_4", name: "Blockchain Integration", status: "active", tasks: 18, completed: 12, members: 4, dueDate: new Date(Date.now() + 1296000000) },
        ],
        totalProjects: 12,
      };
    }),

  // ─── Create task ───────────────────────────────────────────────────────────
  createTask: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      title: z.string(),
      description: z.string().optional(),
      priority: z.enum(["urgent", "high", "medium", "low"]),
      assignee: z.string().optional(),
      dueDate: z.string().optional(),
      labels: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        taskId: `task_${Date.now()}`,
        title: input.title,
        priority: input.priority,
        status: "backlog",
        creator: ctx.user.id,
        createdAt: new Date(),
      };
    }),

  // ─── Get tasks (kanban view) ───────────────────────────────────────────────
  getTasks: protectedProcedure
    .input(z.object({ projectId: z.string(), status: z.string().optional() }))
    .query(async ({ input }) => {
      return {
        columns: {
          backlog: [
            { id: "task_1", title: "Design new dashboard", priority: "high", assignee: "Alice", labels: ["design", "ui"] },
            { id: "task_2", title: "API rate limiting", priority: "medium", assignee: "Bob", labels: ["backend"] },
          ],
          todo: [
            { id: "task_3", title: "Implement WebSocket", priority: "urgent", assignee: "Charlie", labels: ["backend", "realtime"] },
            { id: "task_4", title: "Mobile responsive fix", priority: "high", assignee: "Diana", labels: ["frontend", "bug"] },
          ],
          in_progress: [
            { id: "task_5", title: "AI agent memory", priority: "high", assignee: "Eve", labels: ["ai", "feature"] },
          ],
          review: [
            { id: "task_6", title: "Payment integration", priority: "urgent", assignee: "Frank", labels: ["payments"] },
          ],
          done: [
            { id: "task_7", title: "User onboarding flow", priority: "medium", assignee: "Grace", labels: ["ux"] },
            { id: "task_8", title: "Database optimization", priority: "high", assignee: "Henry", labels: ["backend", "performance"] },
          ],
        },
        totalTasks: 47,
        completedTasks: 32,
      };
    }),

  // ─── Update task status ────────────────────────────────────────────────────
  updateTaskStatus: protectedProcedure
    .input(z.object({ taskId: z.string(), status: z.enum(["backlog", "todo", "in_progress", "review", "done"]) }))
    .mutation(async ({ input }) => {
      return { success: true, taskId: input.taskId, status: input.status, updatedAt: new Date() };
    }),

  // ─── Time tracking ─────────────────────────────────────────────────────────
  logTime: protectedProcedure
    .input(z.object({ taskId: z.string(), minutes: z.number(), description: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        timeLogId: `time_${Date.now()}`,
        taskId: input.taskId,
        minutes: input.minutes,
        userId: ctx.user.id,
        loggedAt: new Date(),
      };
    }),

  // ─── Sprint management ─────────────────────────────────────────────────────
  getSprints: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      return {
        activeSprint: { id: "sprint_1", name: "Sprint 14", startDate: new Date(Date.now() - 604800000), endDate: new Date(Date.now() + 604800000), tasks: 12, completed: 7, velocity: 34 },
        backlog: { tasks: 28, storyPoints: 89 },
        history: [
          { id: "sprint_13", name: "Sprint 13", velocity: 31, completed: 11, total: 13 },
          { id: "sprint_12", name: "Sprint 12", velocity: 28, completed: 10, total: 12 },
        ],
      };
    }),
});
