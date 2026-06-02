import { z } from "zod";
import { desc, eq, and } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { nfts, listings, orders, wallets, users } from "../../drizzle/schema";
import { TRPCError } from "@trpc/server";

export const marketplaceRouter = router({
  // Get marketplace listings
  getListings: publicProcedure
    .input(z.object({
      limit: z.number().default(20),
      offset: z.number().default(0),
      category: z.enum(["digital", "physical", "service", "nft", "subscription", "all"]).default("all"),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const results = await db
        .select({
          id: listings.id,
          title: listings.title,
          description: listings.description,
          category: listings.category,
          price: listings.price,
          currency: listings.currency,
          imageUrls: listings.imageUrls,
          tags: listings.tags,
          stock: listings.stock,
          sold: listings.sold,
          rating: listings.rating,
          reviewCount: listings.reviewCount,
          createdAt: listings.createdAt,
          sellerName: users.name,
          sellerUsername: users.username,
          sellerAvatar: users.avatarUrl,
          sellerVerified: users.isVerified,
        })
        .from(listings)
        .leftJoin(users, eq(listings.sellerId, users.id))
        .where(eq(listings.isActive, true))
        .orderBy(desc(listings.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      if (input.category !== "all") {
        return results.filter(r => r.category === input.category);
      }
      return results;
    }),

  // Create a listing
  createListing: protectedProcedure
    .input(z.object({
      title: z.string().min(1).max(256),
      description: z.string().optional(),
      category: z.enum(["digital", "physical", "service", "nft", "subscription"]),
      price: z.string(),
      currency: z.string().default("SKY"),
      imageUrls: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      stock: z.number().default(1),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const [result] = await db.insert(listings).values({
        sellerId: ctx.user.id,
        title: input.title,
        description: input.description,
        category: input.category,
        price: input.price,
        currency: input.currency,
        imageUrls: input.imageUrls || [],
        tags: input.tags || [],
        stock: input.stock,
      });

      return { success: true, listingId: result.insertId };
    }),

  // Buy a listing
  buyListing: protectedProcedure
    .input(z.object({ listingId: z.number(), quantity: z.number().default(1) }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const listing = await db.select().from(listings).where(eq(listings.id, input.listingId)).limit(1);
      if (!listing[0] || !listing[0].isActive) throw new TRPCError({ code: "NOT_FOUND" });
      if (listing[0].sellerId === ctx.user.id) throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot buy your own listing" });

      const totalPrice = parseFloat(String(listing[0].price)) * input.quantity;
      const wallet = await db.select().from(wallets).where(eq(wallets.userId, ctx.user.id)).limit(1);
      const balance = parseFloat(String(wallet[0]?.skyBalance || "0"));

      if (balance < totalPrice) throw new TRPCError({ code: "BAD_REQUEST", message: "Insufficient SKY balance" });

      // Deduct buyer balance
      await db.update(wallets).set({ skyBalance: String(balance - totalPrice) }).where(eq(wallets.userId, ctx.user.id));

      // Credit seller (minus 2.5% platform fee)
      const sellerWallet = await db.select().from(wallets).where(eq(wallets.userId, listing[0].sellerId)).limit(1);
      if (sellerWallet[0]) {
        const sellerBal = parseFloat(String(sellerWallet[0].skyBalance || "0"));
        await db.update(wallets).set({ skyBalance: String(sellerBal + totalPrice * 0.975) }).where(eq(wallets.userId, listing[0].sellerId));
      }

      // Record order
      await db.insert(orders).values({
        buyerId: ctx.user.id,
        listingId: input.listingId,
        quantity: input.quantity,
        totalPrice: String(totalPrice),
        currency: listing[0].currency || "SKY",
        status: "delivered",
      });

      return { success: true };
    }),

  // Get user's orders
  getMyOrders: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select({
        id: orders.id,
        quantity: orders.quantity,
        totalPrice: orders.totalPrice,
        currency: orders.currency,
        status: orders.status,
        createdAt: orders.createdAt,
        listingTitle: listings.title,
        listingCategory: listings.category,
      })
      .from(orders)
      .leftJoin(listings, eq(orders.listingId, listings.id))
      .where(eq(orders.buyerId, ctx.user.id))
      .orderBy(desc(orders.createdAt));
  }),

  // Get NFT gallery
  getNFTs: publicProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select({
          id: nfts.id,
          name: nfts.name,
          description: nfts.description,
          imageUrl: nfts.imageUrl,
          rarity: nfts.rarity,
          collection: nfts.collection,
          price: nfts.price,
          currency: nfts.currency,
          isListed: nfts.isListed,
          views: nfts.views,
          likes: nfts.likes,
          createdAt: nfts.createdAt,
          ownerName: users.name,
          ownerAvatar: users.avatarUrl,
        })
        .from(nfts)
        .leftJoin(users, eq(nfts.ownerId, users.id))
        .orderBy(desc(nfts.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  // Mint NFT
  mintNFT: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(256),
      description: z.string().optional(),
      imageUrl: z.string(),
      collection: z.string().optional(),
      rarity: z.enum(["common", "uncommon", "rare", "epic", "legendary"]).default("common"),
      attributes: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
      price: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const tokenId = `SKY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

      const [result] = await db.insert(nfts).values({
        ownerId: ctx.user.id,
        creatorId: ctx.user.id,
        name: input.name,
        description: input.description,
        imageUrl: input.imageUrl,
        collection: input.collection,
        rarity: input.rarity,
        attributes: input.attributes || {},
        tokenId,
        price: input.price,
        isMinted: true,
        isListed: !!input.price,
      });

      return { success: true, nftId: result.insertId, tokenId };
    }),

  // Get user's NFTs
  getMyNFTs: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(nfts).where(eq(nfts.ownerId, ctx.user.id)).orderBy(desc(nfts.createdAt));
  }),
});
