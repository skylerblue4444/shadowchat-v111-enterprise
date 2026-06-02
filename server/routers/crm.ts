/**
 * CRM Router — Contacts, deals, pipeline, automation
 * Inspired by Twenty CRM, HubSpot, Salesforce patterns
 */
import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const crmRouter = router({
  getContacts: protectedProcedure
    .input(z.object({ search: z.string().optional(), stage: z.string().optional() }))
    .query(async ({ input }) => ({
      contacts: [
        { id: "ct_1", name: "Elon Musk", company: "xAI", email: "elon@x.ai", stage: "qualified", value: 5000000, lastContact: new Date(Date.now() - 86400000) },
        { id: "ct_2", name: "Sam Altman", company: "OpenAI", email: "sam@openai.com", stage: "proposal", value: 2000000, lastContact: new Date(Date.now() - 172800000) },
        { id: "ct_3", name: "Vitalik Buterin", company: "Ethereum", email: "vitalik@ethereum.org", stage: "negotiation", value: 10000000, lastContact: new Date(Date.now() - 259200000) },
        { id: "ct_4", name: "CZ", company: "Binance", email: "cz@binance.com", stage: "won", value: 15000000, lastContact: new Date(Date.now() - 345600000) },
        { id: "ct_5", name: "Brian Armstrong", company: "Coinbase", email: "brian@coinbase.com", stage: "qualified", value: 8000000, lastContact: new Date(Date.now() - 432000000) },
      ],
      totalContacts: 1234,
      totalValue: 40000000,
    })),
  getPipeline: protectedProcedure.query(async () => ({
    stages: [
      { name: "Lead", count: 234, value: 12000000 },
      { name: "Qualified", count: 89, value: 23000000 },
      { name: "Proposal", count: 34, value: 15000000 },
      { name: "Negotiation", count: 12, value: 8000000 },
      { name: "Won", count: 45, value: 45000000 },
    ],
    totalPipeline: 103000000,
    winRate: 34.5,
    avgDealSize: 2500000,
    avgCycleTime: 45,
  })),
  createDeal: protectedProcedure
    .input(z.object({ contactId: z.string(), title: z.string(), value: z.number(), stage: z.string() }))
    .mutation(async ({ input }) => ({ success: true, dealId: `deal_${Date.now()}`, title: input.title, value: input.value, stage: input.stage })),
  getActivities: protectedProcedure.query(async () => ({
    activities: [
      { id: "act_1", type: "call", contact: "Elon Musk", description: "Discussed AI integration partnership", time: new Date(Date.now() - 3600000) },
      { id: "act_2", type: "email", contact: "Sam Altman", description: "Sent proposal for API access", time: new Date(Date.now() - 86400000) },
      { id: "act_3", type: "meeting", contact: "Vitalik Buterin", description: "Blockchain architecture review", time: new Date(Date.now() - 172800000) },
      { id: "act_4", type: "deal_won", contact: "CZ", description: "Closed $15M partnership deal", time: new Date(Date.now() - 259200000) },
    ],
    todayTasks: 8,
    overdue: 2,
  })),
});
