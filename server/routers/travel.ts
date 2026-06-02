/**
 * Travel & Booking Router — Flights, Hotels, Experiences, Crypto Payments
 * Inspired by Booking.com, Airbnb, Travala patterns
 */
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const travelRouter = router({
  // ─── Search flights ────────────────────────────────────────────────────────
  searchFlights: publicProcedure
    .input(z.object({ from: z.string(), to: z.string(), date: z.string(), passengers: z.number().default(1) }))
    .query(async ({ input }) => {
      return {
        flights: [
          { id: "fl_1", airline: "SkyAir", from: input.from, to: input.to, departure: "08:00", arrival: "11:30", price: 299, cryptoPrice: 0.0045, duration: "3h 30m", stops: 0 },
          { id: "fl_2", airline: "CryptoJet", from: input.from, to: input.to, departure: "12:00", arrival: "15:45", price: 249, cryptoPrice: 0.0038, duration: "3h 45m", stops: 0 },
          { id: "fl_3", airline: "BlockAir", from: input.from, to: input.to, departure: "18:30", arrival: "22:15", price: 199, cryptoPrice: 0.003, duration: "3h 45m", stops: 1 },
        ],
        cheapest: 199,
        fastest: "3h 30m",
      };
    }),

  // ─── Search hotels ─────────────────────────────────────────────────────────
  searchHotels: publicProcedure
    .input(z.object({ city: z.string(), checkIn: z.string(), checkOut: z.string(), guests: z.number().default(2) }))
    .query(async ({ input }) => {
      return {
        hotels: [
          { id: "hotel_1", name: "Crypto Grand Hotel", city: input.city, rating: 4.8, price: 189, cryptoPrice: 0.0029, amenities: ["wifi", "pool", "gym", "spa"], reviews: 2345 },
          { id: "hotel_2", name: "Blockchain Boutique", city: input.city, rating: 4.6, price: 149, cryptoPrice: 0.0023, amenities: ["wifi", "restaurant", "bar"], reviews: 1234 },
          { id: "hotel_3", name: "DeFi Resort & Spa", city: input.city, rating: 4.9, price: 349, cryptoPrice: 0.0053, amenities: ["wifi", "pool", "spa", "beach", "gym"], reviews: 4567 },
        ],
      };
    }),

  // ─── Book trip ─────────────────────────────────────────────────────────────
  bookTrip: protectedProcedure
    .input(z.object({
      type: z.enum(["flight", "hotel", "experience"]),
      itemId: z.string(),
      paymentMethod: z.enum(["crypto", "card", "wallet"]),
      coin: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        bookingId: `booking_${Date.now()}`,
        type: input.type,
        status: "confirmed",
        paymentMethod: input.paymentMethod,
        confirmationCode: `SC${Date.now().toString(36).toUpperCase()}`,
        bookedAt: new Date(),
      };
    }),

  // ─── Get bookings ──────────────────────────────────────────────────────────
  getMyBookings: protectedProcedure
    .query(async ({ ctx }) => {
      return {
        upcoming: [
          { id: "book_1", type: "flight", destination: "Tokyo", date: new Date(Date.now() + 2592000000), status: "confirmed", price: 299 },
          { id: "book_2", type: "hotel", destination: "Dubai", date: new Date(Date.now() + 5184000000), status: "confirmed", price: 189 },
        ],
        past: [
          { id: "book_3", type: "flight", destination: "London", date: new Date(Date.now() - 2592000000), status: "completed", price: 449 },
        ],
        rewards: { points: 12456, tier: "gold", nextTier: 20000 },
      };
    }),
});
