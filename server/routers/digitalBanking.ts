/**
 * Digital Banking Router — Accounts, transfers, cards, loans, savings
 * Inspired by Revolut, Wise, Chime patterns
 */
import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const digitalBankingRouter = router({
  getAccounts: protectedProcedure.query(async () => ({
    accounts: [
      { id: "acc_1", type: "checking", name: "Main Account", balance: 45678.90, currency: "USD", iban: "US12 3456 7890 1234 5678", status: "active" },
      { id: "acc_2", type: "savings", name: "High Yield Savings", balance: 125000, currency: "USD", apy: 5.25, status: "active" },
      { id: "acc_3", type: "crypto", name: "Crypto Vault", balance: 234567, currency: "USD", assets: 7, status: "active" },
      { id: "acc_4", type: "business", name: "ShadowChat Business", balance: 890123, currency: "USD", status: "active" },
    ],
    totalBalance: 1295368.90,
    monthlyIncome: 45678,
    monthlyExpenses: 23456,
  })),
  transfer: protectedProcedure
    .input(z.object({ from: z.string(), to: z.string(), amount: z.number(), currency: z.string().default("USD"), note: z.string().optional() }))
    .mutation(async ({ input }) => ({
      success: true,
      transferId: `txn_${Date.now()}`,
      amount: input.amount,
      fee: input.amount * 0.001,
      estimatedArrival: "Instant",
      status: "completed",
    })),
  getCards: protectedProcedure.query(async () => ({
    cards: [
      { id: "card_1", type: "virtual", name: "Shadow Black", last4: "4444", limit: 50000, spent: 12345, status: "active", cashback: 3 },
      { id: "card_2", type: "physical", name: "Shadow Platinum", last4: "8888", limit: 100000, spent: 45678, status: "active", cashback: 5 },
      { id: "card_3", type: "crypto", name: "Crypto Debit", last4: "1234", limit: 25000, spent: 5678, status: "active", cryptoRewards: 2 },
    ],
    totalCashback: 2345.67,
  })),
  getLoans: protectedProcedure.query(async () => ({
    available: [
      { type: "personal", maxAmount: 50000, apr: 6.99, term: "12-60 months" },
      { type: "crypto_backed", maxAmount: 500000, apr: 3.99, term: "1-36 months", ltv: 50 },
      { type: "business", maxAmount: 1000000, apr: 8.99, term: "12-120 months" },
    ],
    active: [
      { id: "loan_1", type: "crypto_backed", amount: 25000, remaining: 18750, apr: 3.99, nextPayment: new Date(Date.now() + 2592000000), monthlyPayment: 2150 },
    ],
  })),
  getTransactions: protectedProcedure
    .input(z.object({ accountId: z.string().optional(), limit: z.number().default(20) }))
    .query(async ({ input }) => ({
      transactions: [
        { id: "t_1", type: "credit", amount: 15000, description: "Salary Deposit", category: "income", date: new Date(Date.now() - 86400000) },
        { id: "t_2", type: "debit", amount: 2500, description: "Rent Payment", category: "housing", date: new Date(Date.now() - 172800000) },
        { id: "t_3", type: "credit", amount: 3456, description: "Trading Profit", category: "investment", date: new Date(Date.now() - 259200000) },
        { id: "t_4", type: "debit", amount: 89.99, description: "ShadowChat Pro", category: "subscription", date: new Date(Date.now() - 345600000) },
      ],
      total: 4567,
    })),
});
