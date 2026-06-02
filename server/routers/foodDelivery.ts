/**
 * Food & Delivery Router — Restaurant ordering, delivery tracking, crypto payments
 * Inspired by DoorDash, UberEats, Glovo patterns
 */
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const foodDeliveryRouter = router({
  // ─── Get restaurants ───────────────────────────────────────────────────────
  getRestaurants: publicProcedure
    .input(z.object({ category: z.string().optional(), sortBy: z.enum(["rating", "distance", "price"]).default("rating") }))
    .query(async ({ input }) => {
      return {
        restaurants: [
          { id: "rest_1", name: "Crypto Kitchen", rating: 4.8, deliveryTime: "25-35 min", minOrder: 15, categories: ["Asian", "Fusion"], acceptsCrypto: true },
          { id: "rest_2", name: "Blockchain Burger", rating: 4.6, deliveryTime: "20-30 min", minOrder: 10, categories: ["American", "Fast Food"], acceptsCrypto: true },
          { id: "rest_3", name: "DeFi Deli", rating: 4.9, deliveryTime: "15-25 min", minOrder: 8, categories: ["Sandwiches", "Healthy"], acceptsCrypto: true },
          { id: "rest_4", name: "NFT Noodles", rating: 4.7, deliveryTime: "30-40 min", minOrder: 12, categories: ["Japanese", "Ramen"], acceptsCrypto: true },
          { id: "rest_5", name: "Hash House", rating: 4.5, deliveryTime: "20-30 min", minOrder: 10, categories: ["Breakfast", "Brunch"], acceptsCrypto: true },
        ],
        totalRestaurants: 234,
      };
    }),

  // ─── Get menu ──────────────────────────────────────────────────────────────
  getMenu: publicProcedure
    .input(z.object({ restaurantId: z.string() }))
    .query(async ({ input }) => {
      return {
        categories: [
          { name: "Starters", items: [
            { id: "item_1", name: "Crypto Chips", price: 5.99, cryptoPrice: 0.00009, description: "Golden crispy chips with blockchain sauce" },
            { id: "item_2", name: "Mining Mozzarella Sticks", price: 7.99, cryptoPrice: 0.00012, description: "Deep fried with hash rate dip" },
          ]},
          { name: "Mains", items: [
            { id: "item_3", name: "Satoshi Steak", price: 24.99, cryptoPrice: 0.00038, description: "Premium wagyu, medium rare" },
            { id: "item_4", name: "Ethereum Enchiladas", price: 16.99, cryptoPrice: 0.00026, description: "Triple wrapped with smart contract salsa" },
          ]},
          { name: "Drinks", items: [
            { id: "item_5", name: "Liquidity Pool Smoothie", price: 6.99, cryptoPrice: 0.0001, description: "Mixed berry with yield farming boost" },
          ]},
        ],
      };
    }),

  // ─── Place order ───────────────────────────────────────────────────────────
  placeOrder: protectedProcedure
    .input(z.object({
      restaurantId: z.string(),
      items: z.array(z.object({ itemId: z.string(), quantity: z.number() })),
      paymentMethod: z.enum(["crypto", "card", "wallet"]),
      deliveryAddress: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        orderId: `order_${Date.now()}`,
        estimatedDelivery: new Date(Date.now() + 1800000),
        status: "confirmed",
        trackingUrl: `/delivery/track/${Date.now()}`,
      };
    }),

  // ─── Track delivery ────────────────────────────────────────────────────────
  trackDelivery: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      return {
        orderId: input.orderId,
        status: "on_the_way",
        driver: { name: "Alex", rating: 4.9, vehicle: "Electric Bike" },
        eta: new Date(Date.now() + 900000),
        progress: 65,
        updates: [
          { time: new Date(Date.now() - 1200000), status: "Order confirmed" },
          { time: new Date(Date.now() - 600000), status: "Being prepared" },
          { time: new Date(Date.now() - 120000), status: "Picked up by driver" },
        ],
      };
    }),
});
