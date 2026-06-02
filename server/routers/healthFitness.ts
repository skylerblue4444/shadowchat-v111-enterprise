/**
 * Health & Fitness Router — Workout Tracking, Nutrition, Goals, Wearable Integration
 * Inspired by Strava, MyFitnessPal, Apple Health patterns
 */
import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const healthFitnessRouter = router({
  // ─── Log workout ───────────────────────────────────────────────────────────
  logWorkout: protectedProcedure
    .input(z.object({
      type: z.enum(["running", "cycling", "swimming", "weights", "yoga", "hiit", "custom"]),
      duration: z.number(),
      calories: z.number().optional(),
      distance: z.number().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        workoutId: `workout_${Date.now()}`,
        type: input.type,
        duration: input.duration,
        calories: input.calories || Math.floor(input.duration * 8),
        xpEarned: Math.floor(input.duration * 2),
        streak: 7,
        loggedAt: new Date(),
      };
    }),

  // ─── Get fitness dashboard ─────────────────────────────────────────────────
  getDashboard: protectedProcedure
    .query(async ({ ctx }) => {
      return {
        today: { steps: 8432, calories: 2100, activeMinutes: 45, water: 6 },
        weekly: { workouts: 5, totalMinutes: 320, caloriesBurned: 2400, avgHeartRate: 72 },
        goals: { dailySteps: { current: 8432, target: 10000 }, weeklyWorkouts: { current: 5, target: 5 }, weight: { current: 175, target: 170 } },
        streak: { current: 7, longest: 34, xpToday: 150 },
        recentWorkouts: [
          { id: "w_1", type: "running", duration: 35, calories: 380, date: new Date(Date.now() - 86400000) },
          { id: "w_2", type: "weights", duration: 60, calories: 450, date: new Date(Date.now() - 172800000) },
          { id: "w_3", type: "yoga", duration: 30, calories: 150, date: new Date(Date.now() - 259200000) },
        ],
      };
    }),

  // ─── Log nutrition ─────────────────────────────────────────────────────────
  logNutrition: protectedProcedure
    .input(z.object({
      meal: z.enum(["breakfast", "lunch", "dinner", "snack"]),
      foods: z.array(z.object({ name: z.string(), calories: z.number(), protein: z.number().optional(), carbs: z.number().optional(), fat: z.number().optional() })),
    }))
    .mutation(async ({ input }) => {
      const totalCalories = input.foods.reduce((sum, f) => sum + f.calories, 0);
      return {
        success: true,
        mealId: `meal_${Date.now()}`,
        meal: input.meal,
        totalCalories,
        loggedAt: new Date(),
      };
    }),

  // ─── Get nutrition summary ─────────────────────────────────────────────────
  getNutritionSummary: protectedProcedure
    .input(z.object({ date: z.string().optional() }))
    .query(async ({ ctx }) => {
      return {
        daily: { calories: 1850, protein: 120, carbs: 200, fat: 65, fiber: 28, water: 6 },
        target: { calories: 2200, protein: 150, carbs: 250, fat: 70, fiber: 30, water: 8 },
        meals: [
          { meal: "breakfast", calories: 450, time: "08:00" },
          { meal: "lunch", calories: 650, time: "12:30" },
          { meal: "snack", calories: 200, time: "15:00" },
          { meal: "dinner", calories: 550, time: "19:00" },
        ],
      };
    }),

  // ─── Set goals ─────────────────────────────────────────────────────────────
  setGoals: protectedProcedure
    .input(z.object({
      dailySteps: z.number().optional(),
      weeklyWorkouts: z.number().optional(),
      targetWeight: z.number().optional(),
      dailyCalories: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return { success: true, goals: input, updatedAt: new Date() };
    }),
});
