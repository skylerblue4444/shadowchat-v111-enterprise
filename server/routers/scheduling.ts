/**
 * Scheduling & Calendar Router — Appointments, Meetings, Availability
 * Inspired by Cal.com, Calendly patterns
 */
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const schedulingRouter = router({
  // ─── Create event type ─────────────────────────────────────────────────────
  createEventType: protectedProcedure
    .input(z.object({
      title: z.string(),
      duration: z.number(),
      description: z.string().optional(),
      price: z.number().optional(),
      location: z.enum(["video", "phone", "in_person", "custom"]),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        eventTypeId: `evt_${Date.now()}`,
        title: input.title,
        duration: input.duration,
        slug: input.title.toLowerCase().replace(/\s+/g, "-"),
        owner: ctx.user.id,
        createdAt: new Date(),
      };
    }),

  // ─── Get availability ──────────────────────────────────────────────────────
  getAvailability: publicProcedure
    .input(z.object({ userId: z.string(), date: z.string() }))
    .query(async ({ input }) => {
      return {
        userId: input.userId,
        date: input.date,
        slots: [
          { start: "09:00", end: "09:30", available: true },
          { start: "09:30", end: "10:00", available: true },
          { start: "10:00", end: "10:30", available: false },
          { start: "10:30", end: "11:00", available: true },
          { start: "11:00", end: "11:30", available: true },
          { start: "14:00", end: "14:30", available: true },
          { start: "14:30", end: "15:00", available: true },
          { start: "15:00", end: "15:30", available: false },
          { start: "15:30", end: "16:00", available: true },
        ],
        timezone: "America/Chicago",
      };
    }),

  // ─── Book appointment ──────────────────────────────────────────────────────
  bookAppointment: protectedProcedure
    .input(z.object({
      eventTypeId: z.string(),
      hostId: z.string(),
      startTime: z.string(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        bookingId: `booking_${Date.now()}`,
        eventTypeId: input.eventTypeId,
        host: input.hostId,
        guest: ctx.user.id,
        startTime: input.startTime,
        status: "confirmed",
        meetingUrl: `https://meet.shadowchat.app/room/${Date.now()}`,
        createdAt: new Date(),
      };
    }),

  // ─── Get bookings ──────────────────────────────────────────────────────────
  getBookings: protectedProcedure
    .input(z.object({ status: z.string().optional() }))
    .query(async ({ ctx }) => {
      return {
        bookings: [
          { id: "booking_1", title: "Strategy Call", host: "Alice", guest: "Bob", startTime: new Date(Date.now() + 3600000), duration: 30, status: "confirmed", meetingUrl: "https://meet.shadowchat.app/room/1" },
          { id: "booking_2", title: "Code Review", host: "Charlie", guest: "Diana", startTime: new Date(Date.now() + 86400000), duration: 60, status: "confirmed", meetingUrl: "https://meet.shadowchat.app/room/2" },
          { id: "booking_3", title: "AI Consultation", host: "HOPE AI", guest: "Eve", startTime: new Date(Date.now() + 172800000), duration: 45, status: "pending", meetingUrl: null },
        ],
        upcomingCount: 3,
        pastCount: 47,
      };
    }),

  // ─── Cancel booking ────────────────────────────────────────────────────────
  cancelBooking: protectedProcedure
    .input(z.object({ bookingId: z.string(), reason: z.string().optional() }))
    .mutation(async ({ input }) => {
      return { success: true, bookingId: input.bookingId, status: "cancelled", cancelledAt: new Date() };
    }),
});
