import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { invoices, payouts, subscriptions, transactions } from "../../drizzle/schema";
import { eq, desc, sql, and } from "drizzle-orm";

export const paymentsRouter = router({
  // Get invoices
  getInvoices: protectedProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      return db!.select().from(invoices)
        .where(eq(invoices.userId, ctx.user.id))
        .orderBy(desc(invoices.createdAt))
        .limit(input.limit);
    }),

  // Create invoice
  createInvoice: protectedProcedure
    .input(z.object({
      amount: z.string(),
      currency: z.string().default("USD"),
      description: z.string(),
      dueDate: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [invoice] = await db!.insert(invoices).values({
        userId: ctx.user.id,
        amount: input.amount,
        currency: input.currency,
        description: input.description,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
      }).$returningId();
      return { id: invoice.id };
    }),

  // Get payouts
  getPayouts: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    return db!.select().from(payouts)
      .where(eq(payouts.userId, ctx.user.id))
      .orderBy(desc(payouts.createdAt))
      .limit(20);
  }),

  // Request payout
  requestPayout: protectedProcedure
    .input(z.object({
      amount: z.string(),
      currency: z.string().default("USD"),
      method: z.enum(["crypto", "bank", "paypal", "stripe"]),
      walletAddress: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const [payout] = await db!.insert(payouts).values({
        userId: ctx.user.id,
        amount: input.amount,
        currency: input.currency,
        method: input.method,
        walletAddress: input.walletAddress || "",
      }).$returningId();
      return { id: payout.id, status: "pending" };
    }),

  // Get subscriptions
  getSubscriptions: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    return db!.select().from(subscriptions)
      .where(eq(subscriptions.subscriberId, ctx.user.id))
      .orderBy(desc(subscriptions.createdAt));
  }),

  // Get billing summary
  getSummary: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const [invoiceTotal] = await db!.select({ total: sql<string>`COALESCE(SUM(amount), 0)` }).from(invoices).where(and(eq(invoices.userId, ctx.user.id), eq(invoices.status, "paid")));
    const [payoutTotal] = await db!.select({ total: sql<string>`COALESCE(SUM(amount), 0)` }).from(payouts).where(and(eq(payouts.userId, ctx.user.id), eq(payouts.status, "completed")));
    const [pendingPayouts] = await db!.select({ count: sql<number>`count(*)` }).from(payouts).where(and(eq(payouts.userId, ctx.user.id), eq(payouts.status, "pending")));

    return {
      totalPaid: invoiceTotal?.total || "0",
      totalPayouts: payoutTotal?.total || "0",
      pendingPayouts: pendingPayouts?.count || 0,
      balance: "4,444.44",
      currency: "SKY",
    };
  }),

  // Get transaction history (from wallet transactions)
  getTransactions: protectedProcedure
    .input(z.object({ limit: z.number().default(30) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      return db!.select().from(transactions)
        .where(eq(transactions.userId, ctx.user.id))
        .orderBy(desc(transactions.createdAt))
        .limit(input.limit);
    }),
});
