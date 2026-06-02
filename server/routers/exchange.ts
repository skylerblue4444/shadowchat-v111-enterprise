import { z } from "zod";
import { desc, eq, and, gte, lte } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { trades, wallets, transactions } from "../../drizzle/schema";

export const exchangeRouter = router({
  // Get live price from CoinGecko (server-side proxy)
  getPrice: publicProcedure
    .input(z.object({ coinId: z.string().default("bitcoin") }))
    .query(async ({ input }) => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${input.coinId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) throw new Error("CoinGecko unavailable");
        const data = await res.json();
        return data[input.coinId] || null;
      } catch {
        return null;
      }
    }),

  // Get multiple prices
  getPrices: publicProcedure
    .input(z.object({ coinIds: z.array(z.string()) }))
    .query(async ({ input }) => {
      try {
        const ids = input.coinIds.join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) return {};
        return await res.json();
      } catch {
        return {};
      }
    }),

  // Get market chart data
  getChart: publicProcedure
    .input(z.object({ coinId: z.string(), days: z.number().default(7) }))
    .query(async ({ input }) => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${input.coinId}/market_chart?vs_currency=usd&days=${input.days}`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) return { prices: [], volumes: [] };
        return await res.json();
      } catch {
        return { prices: [], volumes: [] };
      }
    }),

  // Get Jupiter DEX quote (Solana)
  getJupiterQuote: publicProcedure
    .input(z.object({
      inputMint: z.string(),
      outputMint: z.string(),
      amount: z.string(),
      slippageBps: z.number().default(50),
    }))
    .query(async ({ input }) => {
      try {
        const url = `https://quote-api.jup.ag/v6/quote?inputMint=${input.inputMint}&outputMint=${input.outputMint}&amount=${input.amount}&slippageBps=${input.slippageBps}`;
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    }),

  // Get user's trades
  getTrades: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(trades)
        .where(eq(trades.userId, ctx.user.id))
        .orderBy(desc(trades.createdAt))
        .limit(input.limit);
    }),

  // Execute a trade (platform-internal SKY swap)
  executeTrade: protectedProcedure
    .input(z.object({
      fromAsset: z.string(),
      toAsset: z.string(),
      fromAmount: z.string(),
      toAmount: z.string(),
      price: z.string(),
      type: z.enum(["market", "limit"]),
      side: z.enum(["buy", "sell"]),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const wallet = await db.select().from(wallets).where(eq(wallets.userId, ctx.user.id)).limit(1);
      if (!wallet[0]) throw new Error("Wallet not found");

      const fromAmount = parseFloat(input.fromAmount);
      const toAmount = parseFloat(input.toAmount);
      const fromKey = `${input.fromAsset.toLowerCase()}Balance` as keyof typeof wallet[0];
      const toKey = `${input.toAsset.toLowerCase()}Balance` as keyof typeof wallet[0];

      const fromBalance = parseFloat(String(wallet[0][fromKey] || "0"));
      if (fromBalance < fromAmount) throw new Error(`Insufficient ${input.fromAsset} balance`);

      // Record trade
      const pair = `${input.fromAsset.toUpperCase()}/${input.toAsset.toUpperCase()}`;
      const [result] = await db.insert(trades).values({
        userId: ctx.user.id,
        pair,
        side: input.side,
        orderType: input.type,
        amount: input.fromAmount,
        price: input.price,
        total: input.toAmount,
        status: "filled",
        fee: (fromAmount * 0.001).toFixed(8),
        filledAt: new Date(),
      });

      // Update balances
      const newFromBalance = (fromBalance - fromAmount).toFixed(8);
      const toBalance = parseFloat(String(wallet[0][toKey] || "0"));
      const newToBalance = (toBalance + toAmount).toFixed(8);

      await db.update(wallets)
        .set({
          [fromKey]: newFromBalance,
          [toKey]: newToBalance,
        } as any)
        .where(eq(wallets.userId, ctx.user.id));

      return { success: true, tradeId: result.insertId };
    }),

  // Get top markets from CoinGecko
  getMarkets: publicProcedure
    .input(z.object({ page: z.number().default(1), perPage: z.number().default(20) }))
    .query(async ({ input }) => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${input.perPage}&page=${input.page}&sparkline=false&price_change_percentage=24h`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) return [];
        return await res.json();
      } catch {
        return [];
      }
    }),
});
