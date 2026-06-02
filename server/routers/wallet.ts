import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { wallets, transactions, stakingPositions, users } from "../../drizzle/schema";

export const walletRouter = router({
  // Get user's wallet
  getWallet: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    let wallet = await db.select().from(wallets).where(eq(wallets.userId, ctx.user.id)).limit(1);

    if (wallet.length === 0) {
      // Auto-create wallet on first access
      await db.insert(wallets).values({
        userId: ctx.user.id,
        skyBalance: "1000.00000000", // Welcome bonus
        ethBalance: "0.00000000",
        solBalance: "0.00000000",
        usdcBalance: "0.00000000",
        btcBalance: "0.00000000",
      });
      wallet = await db.select().from(wallets).where(eq(wallets.userId, ctx.user.id)).limit(1);
    }

    return wallet[0] || null;
  }),

  // Get transaction history
  getTransactions: protectedProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];

      return db
        .select()
        .from(transactions)
        .where(eq(transactions.userId, ctx.user.id))
        .orderBy(desc(transactions.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  // Send tokens
  send: protectedProcedure
    .input(z.object({
      asset: z.string(),
      amount: z.string(),
      toAddress: z.string().min(10),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const wallet = await db.select().from(wallets).where(eq(wallets.userId, ctx.user.id)).limit(1);
      if (!wallet[0]) throw new Error("Wallet not found");

      const amount = parseFloat(input.amount);
      const assetKey = `${input.asset.toLowerCase()}Balance` as keyof typeof wallet[0];
      const currentBalance = parseFloat(String(wallet[0][assetKey] || "0"));

      if (currentBalance < amount) throw new Error("Insufficient balance");

      // Record transaction
      await db.insert(transactions).values({
        userId: ctx.user.id,
        type: "send",
        asset: input.asset.toUpperCase(),
        amount: input.amount,
        toAddress: input.toAddress,
        status: "pending",
        notes: input.notes,
        fee: "0.001",
      });

      // Update balance
      const newBalance = (currentBalance - amount).toFixed(8);
      await db.update(wallets)
        .set({ [assetKey]: newBalance } as any)
        .where(eq(wallets.userId, ctx.user.id));

      return { success: true, message: `Sent ${amount} ${input.asset} to ${input.toAddress}` };
    }),

  // Stake SKY tokens
  stake: protectedProcedure
    .input(z.object({
      amount: z.string(),
      lockPeriodDays: z.number().min(7).max(365),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const wallet = await db.select().from(wallets).where(eq(wallets.userId, ctx.user.id)).limit(1);
      if (!wallet[0]) throw new Error("Wallet not found");

      const amount = parseFloat(input.amount);
      const skyBalance = parseFloat(String(wallet[0].skyBalance || "0"));
      if (skyBalance < amount) throw new Error("Insufficient SKY balance");

      // Calculate APY based on lock period
      const apy = input.lockPeriodDays <= 30 ? "8.50" :
                  input.lockPeriodDays <= 90 ? "12.00" :
                  input.lockPeriodDays <= 180 ? "18.00" : "25.00";

      const unlocksAt = new Date();
      unlocksAt.setDate(unlocksAt.getDate() + input.lockPeriodDays);

      await db.insert(stakingPositions).values({
        userId: ctx.user.id,
        amount: input.amount,
        lockPeriodDays: input.lockPeriodDays,
        apy,
        unlocksAt,
      });

      // Deduct from wallet
      const newBalance = (skyBalance - amount).toFixed(8);
      await db.update(wallets)
        .set({ skyBalance: newBalance, stakedSky: String(parseFloat(String(wallet[0].stakedSky || "0")) + amount) })
        .where(eq(wallets.userId, ctx.user.id));

      await db.insert(transactions).values({
        userId: ctx.user.id,
        type: "stake",
        asset: "SKY",
        amount: input.amount,
        status: "confirmed",
        notes: `Staked for ${input.lockPeriodDays} days at ${apy}% APY`,
      });

      return { success: true, apy, unlocksAt };
    }),

  // Get staking positions
  getStakingPositions: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    return db
      .select()
      .from(stakingPositions)
      .where(eq(stakingPositions.userId, ctx.user.id))
      .orderBy(desc(stakingPositions.stakedAt));
  }),
});
