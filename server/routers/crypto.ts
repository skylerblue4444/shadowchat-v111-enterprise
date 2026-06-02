import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { wallets, transactions, stakingPositions, miningPools, minerPositions, tips, burns, priceAlerts, users } from "../../drizzle/schema";
import { eq, and, desc, sql, gt } from "drizzle-orm";

const COINS = ["DOGE", "XMR", "USDT", "SHADOW", "TRUMP", "SKY444"] as const;

export const cryptoRouter = router({
  // ─── MULTI-COIN WALLET ─────────────────────────────────────────────
  getPortfolio: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const [wallet] = await db!.select().from(wallets).where(eq(wallets.userId, ctx.user.id));
    if (!wallet) {
      await db!.insert(wallets).values({ userId: ctx.user.id });
      const [newWallet] = await db!.select().from(wallets).where(eq(wallets.userId, ctx.user.id));
      return {
        wallet: newWallet,
        coins: getCoinsFromWallet(newWallet),
      };
    }
    return { wallet, coins: getCoinsFromWallet(wallet) };
  }),

  // ─── STAKING ───────────────────────────────────────────────────────
  getStakingPools: publicProcedure.query(async () => {
    return [
      { coin: "SKY444", apy: "24.5", minStake: "100", lockPeriods: [7, 30, 90, 365], tvl: "2,450,000" },
      { coin: "TRUMP", apy: "18.2", minStake: "50", lockPeriods: [14, 30, 60], tvl: "1,200,000" },
      { coin: "SHADOW", apy: "32.0", minStake: "500", lockPeriods: [30, 90, 180], tvl: "890,000" },
      { coin: "DOGE", apy: "8.5", minStake: "1000", lockPeriods: [7, 30], tvl: "5,600,000" },
      { coin: "XMR", apy: "12.0", minStake: "1", lockPeriods: [30, 90, 365], tvl: "3,200,000" },
      { coin: "USDT", apy: "6.2", minStake: "100", lockPeriods: [7, 14, 30], tvl: "12,400,000" },
    ];
  }),

  stake: protectedProcedure
    .input(z.object({
      coin: z.enum(COINS),
      amount: z.string(),
      lockPeriodDays: z.number().min(7).max(365),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const apyMap: Record<string, number> = { SKY444: 24.5, TRUMP: 18.2, SHADOW: 32.0, DOGE: 8.5, XMR: 12.0, USDT: 6.2 };
      const apy = apyMap[input.coin] || 10;
      const unlocksAt = new Date(Date.now() + input.lockPeriodDays * 86400000);
      const [pos] = await db!.insert(stakingPositions).values({
        userId: ctx.user.id,
        amount: input.amount,
        lockPeriodDays: input.lockPeriodDays,
        apy: String(apy),
        unlocksAt,
      }).$returningId();
      await db!.insert(transactions).values({
        userId: ctx.user.id,
        type: "stake",
        asset: input.coin,
        amount: input.amount,
        status: "confirmed",
        notes: `Staked ${input.amount} ${input.coin} for ${input.lockPeriodDays} days at ${apy}% APY`,
      });
      return { id: pos.id, apy, unlocksAt: unlocksAt.toISOString() };
    }),

  getMyStakes: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    return db!.select().from(stakingPositions)
      .where(eq(stakingPositions.userId, ctx.user.id))
      .orderBy(desc(stakingPositions.stakedAt));
  }),

  claimRewards: protectedProcedure
    .input(z.object({ stakeId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [stake] = await db!.select().from(stakingPositions).where(and(eq(stakingPositions.id, input.stakeId), eq(stakingPositions.userId, ctx.user.id)));
      if (!stake) throw new Error("Stake not found");
      const daysStaked = Math.floor((Date.now() - stake.stakedAt.getTime()) / 86400000);
      const reward = (parseFloat(stake.amount) * parseFloat(stake.apy) / 100 * daysStaked / 365).toFixed(8);
      await db!.update(stakingPositions).set({ rewards: reward }).where(eq(stakingPositions.id, input.stakeId));
      return { reward, coin: "SKY444" };
    }),

  // ─── MINING ────────────────────────────────────────────────────────
  getMiningPools: publicProcedure.query(async () => {
    const db = await getDb();
    const pools = await db!.select().from(miningPools);
    if (pools.length === 0) {
      // Seed default pools
      const defaults = [
        { name: "DOGE Power Pool", coin: "DOGE" as const, algorithm: "Scrypt", blockReward: "10000", difficulty: "4500000" },
        { name: "Monero Privacy Pool", coin: "XMR" as const, algorithm: "RandomX", blockReward: "0.6", difficulty: "320000000" },
        { name: "Shadow Stealth Pool", coin: "SHADOW" as const, algorithm: "CryptoNight", blockReward: "50", difficulty: "1200000" },
        { name: "TRUMP Victory Pool", coin: "TRUMP" as const, algorithm: "SHA-256d", blockReward: "25", difficulty: "8900000" },
        { name: "SKY444 Genesis Pool", coin: "SKY444" as const, algorithm: "Ethash", blockReward: "100", difficulty: "2400000" },
      ];
      for (const pool of defaults) {
        await db!.insert(miningPools).values(pool);
      }
      return db!.select().from(miningPools);
    }
    return pools;
  }),

  startMining: protectedProcedure
    .input(z.object({ poolId: z.number(), hashRate: z.string().default("100") }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [existing] = await db!.select().from(minerPositions).where(and(eq(minerPositions.userId, ctx.user.id), eq(minerPositions.poolId, input.poolId)));
      if (existing) {
        await db!.update(minerPositions).set({ isActive: true, hashRate: input.hashRate }).where(eq(minerPositions.id, existing.id));
        return { id: existing.id, status: "resumed" };
      }
      const [pos] = await db!.insert(minerPositions).values({
        userId: ctx.user.id,
        poolId: input.poolId,
        hashRate: input.hashRate,
      }).$returningId();
      await db!.update(miningPools).set({ totalMiners: sql`totalMiners + 1` }).where(eq(miningPools.id, input.poolId));
      return { id: pos.id, status: "started" };
    }),

  stopMining: protectedProcedure
    .input(z.object({ positionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!.update(minerPositions).set({ isActive: false }).where(and(eq(minerPositions.id, input.positionId), eq(minerPositions.userId, ctx.user.id)));
      return { status: "stopped" };
    }),

  getMyMining: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const positions = await db!.select().from(minerPositions).where(eq(minerPositions.userId, ctx.user.id));
    const pools = await db!.select().from(miningPools);
    return positions.map(p => ({
      ...p,
      pool: pools.find(pool => pool.id === p.poolId),
    }));
  }),

  claimMiningRewards: protectedProcedure
    .input(z.object({ positionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [pos] = await db!.select().from(minerPositions).where(and(eq(minerPositions.id, input.positionId), eq(minerPositions.userId, ctx.user.id)));
      if (!pos) throw new Error("Mining position not found");
      const rewards = pos.pendingRewards || "0";
      await db!.update(minerPositions).set({ pendingRewards: "0", lastPayoutAt: new Date(), totalMined: sql`totalMined + ${rewards}` }).where(eq(minerPositions.id, input.positionId));
      return { claimed: rewards };
    }),

  // ─── TIPPING ───────────────────────────────────────────────────────
  sendTip: protectedProcedure
    .input(z.object({
      toUserId: z.number(),
      coin: z.enum(COINS),
      amount: z.string(),
      message: z.string().optional(),
      context: z.enum(["post", "stream", "chat", "profile", "content"]).default("post"),
      contextId: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [tip] = await db!.insert(tips).values({
        fromUserId: ctx.user.id,
        toUserId: input.toUserId,
        coin: input.coin,
        amount: input.amount,
        message: input.message,
        context: input.context,
        contextId: input.contextId,
      }).$returningId();
      // Record transactions for both parties
      await db!.insert(transactions).values([
        { userId: ctx.user.id, type: "send" as const, asset: input.coin, amount: input.amount, status: "confirmed" as const, notes: `Tip to user #${input.toUserId}` },
        { userId: input.toUserId, type: "receive" as const, asset: input.coin, amount: input.amount, status: "confirmed" as const, notes: `Tip from user #${ctx.user.id}` },
      ]);
      return { id: tip.id, success: true };
    }),

  getTipHistory: protectedProcedure
    .input(z.object({ type: z.enum(["sent", "received"]).default("received") }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      const condition = input.type === "sent" ? eq(tips.fromUserId, ctx.user.id) : eq(tips.toUserId, ctx.user.id);
      const tipList = await db!.select().from(tips).where(condition).orderBy(desc(tips.createdAt)).limit(50);
      return tipList;
    }),

  getTipLeaderboard: publicProcedure.query(async () => {
    const db = await getDb();
    const leaders = await db!.select({
      userId: tips.toUserId,
      totalTips: sql<number>`count(*)`,
      totalAmount: sql<string>`sum(cast(amount as decimal(20,8)))`,
    }).from(tips).groupBy(tips.toUserId).orderBy(desc(sql`count(*)`)).limit(20);
    return leaders;
  }),

  // ─── BURNING ───────────────────────────────────────────────────────
  burnTokens: protectedProcedure
    .input(z.object({
      coin: z.enum(COINS),
      amount: z.string(),
      reason: z.enum(["deflationary", "burn_to_earn", "governance", "event", "voluntary"]).default("voluntary"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      // Calculate burn-to-earn reward (10% of burned amount in SKY444)
      const rewardAmount = input.reason === "burn_to_earn" ? (parseFloat(input.amount) * 0.1).toFixed(8) : "0";
      const [burn] = await db!.insert(burns).values({
        userId: ctx.user.id,
        coin: input.coin,
        amount: input.amount,
        reason: input.reason,
        rewardEarned: rewardAmount,
        txHash: `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`,
      }).$returningId();
      await db!.insert(transactions).values({
        userId: ctx.user.id,
        type: "fee" as const,
        asset: input.coin,
        amount: input.amount,
        status: "confirmed" as const,
        notes: `Burned ${input.amount} ${input.coin} (${input.reason})`,
      });
      return { id: burn.id, rewardEarned: rewardAmount, txHash: `0x${Date.now().toString(16)}` };
    }),

  getBurnHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    return db!.select().from(burns).where(eq(burns.userId, ctx.user.id)).orderBy(desc(burns.createdAt)).limit(50);
  }),

  getBurnStats: publicProcedure.query(async () => {
    const db = await getDb();
    const stats = await db!.select({
      totalBurned: sql<string>`sum(cast(amount as decimal(20,8)))`,
      totalBurns: sql<number>`count(*)`,
      uniqueBurners: sql<number>`count(distinct userId)`,
    }).from(burns);
    return {
      totalBurned: stats[0]?.totalBurned || "0",
      totalBurns: stats[0]?.totalBurns || 0,
      uniqueBurners: stats[0]?.uniqueBurners || 0,
      burnRate: "2.4% monthly",
      nextBurnEvent: new Date(Date.now() + 7 * 86400000).toISOString(),
    };
  }),

  // ─── PRICE ALERTS ──────────────────────────────────────────────────
  createAlert: protectedProcedure
    .input(z.object({
      coin: z.enum(COINS),
      targetPrice: z.string(),
      direction: z.enum(["above", "below"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [alert] = await db!.insert(priceAlerts).values({
        userId: ctx.user.id,
        coin: input.coin,
        targetPrice: input.targetPrice,
        direction: input.direction,
      }).$returningId();
      return { id: alert.id };
    }),

  getAlerts: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    return db!.select().from(priceAlerts).where(eq(priceAlerts.userId, ctx.user.id)).orderBy(desc(priceAlerts.createdAt));
  }),

  deleteAlert: protectedProcedure
    .input(z.object({ alertId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const { sql: sqlTag } = await import("drizzle-orm");
      await db!.delete(priceAlerts).where(and(eq(priceAlerts.id, input.alertId), eq(priceAlerts.userId, ctx.user.id)));
      return { success: true };
    }),

  // ─── CRYPTO PAYMENTS ───────────────────────────────────────────────
  payWithCrypto: protectedProcedure
    .input(z.object({
      coin: z.enum(COINS),
      amount: z.string(),
      recipientId: z.number(),
      purpose: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const txHash = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 14)}`;
      await db!.insert(transactions).values([
        { userId: ctx.user.id, type: "send" as const, asset: input.coin, amount: input.amount, status: "confirmed" as const, txHash, notes: `Payment: ${input.purpose}` },
        { userId: input.recipientId, type: "receive" as const, asset: input.coin, amount: input.amount, status: "confirmed" as const, txHash, notes: `Received payment: ${input.purpose}` },
      ]);
      return { txHash, success: true };
    }),
});

function getCoinsFromWallet(wallet: any) {
  return [
    { symbol: "SKY444", name: "SkyCoin 4444", balance: wallet?.skyBalance || "0", icon: "✦", color: "#6366f1", price: "8.72" },
    { symbol: "TRUMP", name: "TRUMP", balance: "0", icon: "🎯", color: "#ef4444", price: "14.85" },
    { symbol: "DOGE", name: "Dogecoin", balance: "0", icon: "Ð", color: "#f59e0b", price: "0.42" },
    { symbol: "XMR", name: "Monero", balance: "0", icon: "ɱ", color: "#f97316", price: "187.50" },
    { symbol: "USDT", name: "Tether", balance: wallet?.usdcBalance || "0", icon: "$", color: "#22c55e", price: "1.00" },
    { symbol: "SHADOW", name: "Shadow", balance: "0", icon: "◈", color: "#8b5cf6", price: "3.44" },
    { symbol: "ETH", name: "Ethereum", balance: wallet?.ethBalance || "0", icon: "Ξ", color: "#3b82f6", price: "3842.00" },
    { symbol: "SOL", name: "Solana", balance: wallet?.solBalance || "0", icon: "◎", color: "#14b8a6", price: "178.20" },
    { symbol: "BTC", name: "Bitcoin", balance: wallet?.btcBalance || "0", icon: "₿", color: "#f59e0b", price: "104200.00" },
  ];
}
