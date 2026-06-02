/**
 * Invoicing & Contracts Router — Professional Invoicing, Contract Management
 * Inspired by Stripe Invoicing, Shopify Billing, Wave patterns
 */
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const invoicingContractsRouter = router({
  // ─── Create invoice ────────────────────────────────────────────────────────
  createInvoice: protectedProcedure
    .input(z.object({
      clientId: z.string(),
      items: z.array(z.object({
        description: z.string(),
        quantity: z.number().min(1),
        unitPrice: z.number().min(0),
      })),
      dueDate: z.date(),
      notes: z.string().optional(),
      taxRate: z.number().min(0).max(1).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const subtotal = input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      const tax = subtotal * (input.taxRate || 0);
      const total = subtotal + tax;

      return {
        success: true,
        invoiceId: `inv_${Date.now()}`,
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        clientId: input.clientId,
        vendorId: ctx.user.id,
        subtotal,
        tax,
        total,
        status: "draft",
        createdAt: new Date(),
        dueDate: input.dueDate,
      };
    }),

  // ─── Send invoice ──────────────────────────────────────────────────────────
  sendInvoice: protectedProcedure
    .input(z.object({
      invoiceId: z.string(),
      clientEmail: z.string().email(),
      message: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        invoiceId: input.invoiceId,
        status: "sent",
        sentAt: new Date(),
        sentTo: input.clientEmail,
        viewUrl: `https://shadowchat.com/invoices/${input.invoiceId}`,
      };
    }),

  // ─── Record payment ────────────────────────────────────────────────────────
  recordPayment: protectedProcedure
    .input(z.object({
      invoiceId: z.string(),
      amount: z.number().min(0),
      paymentMethod: z.enum(["credit_card", "bank_transfer", "crypto", "paypal"]),
      transactionId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        paymentId: `pay_${Date.now()}`,
        invoiceId: input.invoiceId,
        amount: input.amount,
        status: "completed",
        recordedAt: new Date(),
        paymentMethod: input.paymentMethod,
      };
    }),

  // ─── Create contract ───────────────────────────────────────────────────────
  createContract: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      parties: z.array(z.object({
        name: z.string(),
        email: z.string().email(),
        role: z.enum(["service_provider", "client"]),
      })),
      terms: z.string(),
      startDate: z.date(),
      endDate: z.date().optional(),
      value: z.number().min(0),
      paymentTerms: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        contractId: `contract_${Date.now()}`,
        title: input.title,
        status: "draft",
        createdAt: new Date(),
        parties: input.parties,
        value: input.value,
      };
    }),

  // ─── Sign contract ────────────────────────────────────────────────────────
  signContract: protectedProcedure
    .input(z.object({
      contractId: z.string(),
      signature: z.string(),
      timestamp: z.date(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        contractId: input.contractId,
        signedBy: ctx.user.id,
        signedAt: input.timestamp,
        status: "signed",
      };
    }),

  // ─── Get invoice details ───────────────────────────────────────────────────
  getInvoiceDetails: publicProcedure
    .input(z.object({
      invoiceId: z.string(),
    }))
    .query(async ({ input }) => {
      return {
        invoiceId: input.invoiceId,
        invoiceNumber: "INV-001234",
        vendor: {
          name: "TechCorp Inc",
          address: "123 Tech St, SF, CA 94105",
          taxId: "12-3456789",
        },
        client: {
          name: "Client Company",
          address: "456 Business Ave, NYC, NY 10001",
        },
        items: [
          { description: "Web Development Services", quantity: 40, unitPrice: 150, total: 6000 },
          { description: "UI/UX Design", quantity: 20, unitPrice: 120, total: 2400 },
        ],
        subtotal: 8400,
        tax: 672,
        total: 9072,
        status: "paid",
        issuedDate: new Date(Date.now() - 604800000),
        dueDate: new Date(Date.now() + 604800000),
        paidDate: new Date(Date.now() - 86400000),
      };
    }),

  // ─── Get vendor invoicing dashboard ─────────────────────────────────────────
  getInvoicingDashboard: protectedProcedure
    .query(async ({ ctx }) => {
      return {
        vendorId: ctx.user.id,
        stats: {
          totalInvoiced: 125000,
          totalPaid: 118500,
          totalOutstanding: 6500,
          totalOverdue: 2500,
          avgPaymentTime: 12,
        },
        recentInvoices: [
          {
            invoiceId: "inv_1",
            invoiceNumber: "INV-001234",
            client: "Client A",
            amount: 9072,
            status: "paid",
            issuedDate: new Date(Date.now() - 604800000),
            dueDate: new Date(Date.now() + 604800000),
          },
          {
            invoiceId: "inv_2",
            invoiceNumber: "INV-001235",
            client: "Client B",
            amount: 5500,
            status: "outstanding",
            issuedDate: new Date(Date.now() - 1209600000),
            dueDate: new Date(Date.now() + 604800000),
          },
        ],
        paymentMethods: {
          credit_card: 0.45,
          bank_transfer: 0.35,
          crypto: 0.15,
          paypal: 0.05,
        },
      };
    }),

  // ─── Get contract details ──────────────────────────────────────────────────
  getContractDetails: publicProcedure
    .input(z.object({
      contractId: z.string(),
    }))
    .query(async ({ input }) => {
      return {
        contractId: input.contractId,
        title: "Software Development Agreement",
        status: "active",
        parties: [
          { name: "TechCorp Inc", role: "service_provider", signed: true },
          { name: "Client Company", role: "client", signed: true },
        ],
        startDate: new Date(Date.now() - 2592000000),
        endDate: new Date(Date.now() + 7776000000),
        value: 50000,
        paymentTerms: "Net 30",
        milestones: [
          { title: "Phase 1 - Design", value: 10000, dueDate: new Date(Date.now() + 604800000) },
          { title: "Phase 2 - Development", value: 25000, dueDate: new Date(Date.now() + 1814400000) },
          { title: "Phase 3 - Testing & Deployment", value: 15000, dueDate: new Date(Date.now() + 2592000000) },
        ],
      };
    }),

  // ─── Bulk invoice generation ───────────────────────────────────────────────
  bulkGenerateInvoices: protectedProcedure
    .input(z.object({
      clients: z.array(z.object({
        clientId: z.string(),
        amount: z.number().min(0),
        description: z.string(),
      })),
      dueDate: z.date(),
    }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        invoicesCreated: input.clients.length,
        totalAmount: input.clients.reduce((sum, c) => sum + c.amount, 0),
        createdAt: new Date(),
        invoiceIds: input.clients.map((_, i) => `inv_${Date.now() + i}`),
      };
    }),

  // ─── Get payment analytics ────────────────────────────────────────────────
  getPaymentAnalytics: protectedProcedure
    .input(z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }))
    .query(async ({ input, ctx }) => {
      return {
        vendorId: ctx.user.id,
        period: {
          start: input.startDate || new Date(Date.now() - 2592000000),
          end: input.endDate || new Date(),
        },
        stats: {
          totalInvoiced: 125000,
          totalPaid: 118500,
          totalRefunded: 2000,
          avgInvoiceAmount: 8333,
          avgPaymentTime: 12,
          paymentSuccessRate: 0.948,
        },
        paymentsByMethod: [
          { method: "credit_card", count: 45, amount: 53325 },
          { method: "bank_transfer", count: 35, amount: 41475 },
          { method: "crypto", count: 15, amount: 17775 },
          { method: "paypal", count: 5, amount: 5925 },
        ],
        paymentTrend: [
          { date: "2026-05-20", amount: 12500 },
          { date: "2026-05-27", amount: 15000 },
          { date: "2026-06-03", amount: 18000 },
        ],
      };
    }),
});
