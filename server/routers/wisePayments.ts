import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";

// Wise/International Transfer simulation
const EXCHANGE_RATES: Record<string, number> = {
  "USD_EUR": 0.92, "USD_GBP": 0.79, "USD_JPY": 149.5, "USD_CAD": 1.36,
  "USD_AUD": 1.53, "USD_INR": 83.2, "USD_BRL": 4.97, "USD_MXN": 17.1,
  "USD_NGN": 1550, "USD_KES": 153, "USD_ZAR": 18.5, "USD_PHP": 56.2,
  "EUR_USD": 1.09, "GBP_USD": 1.27, "JPY_USD": 0.0067,
};

const transfers: any[] = [];

export const wisePaymentsRouter = router({
  // ─── GET EXCHANGE RATE ─────────────────────────────────────────────
  getRate: protectedProcedure
    .input(z.object({
      from: z.string().length(3),
      to: z.string().length(3),
      amount: z.number().min(1),
    }))
    .query(async ({ input }) => {
      const key = `${input.from}_${input.to}`;
      const rate = EXCHANGE_RATES[key] || 1;
      const fee = input.amount * 0.005; // 0.5% fee
      const convertedAmount = (input.amount - fee) * rate;

      return {
        rate,
        fee,
        convertedAmount,
        fromCurrency: input.from,
        toCurrency: input.to,
        estimatedDelivery: "1-2 business days",
        savings: `Save up to 6x compared to banks`,
      };
    }),

  // ─── SEND INTERNATIONAL TRANSFER ──────────────────────────────────
  sendTransfer: protectedProcedure
    .input(z.object({
      amount: z.number().min(1),
      fromCurrency: z.string().length(3),
      toCurrency: z.string().length(3),
      recipientName: z.string().min(2),
      recipientEmail: z.string().email().optional(),
      recipientBank: z.string().optional(),
      recipientAccount: z.string().optional(),
      reference: z.string().optional(),
      paymentMethod: z.enum(["crypto", "bank", "card", "shadow_balance"]).default("crypto"),
    }))
    .mutation(async ({ ctx, input }) => {
      const key = `${input.fromCurrency}_${input.toCurrency}`;
      const rate = EXCHANGE_RATES[key] || 1;
      const fee = input.amount * 0.005;
      const convertedAmount = (input.amount - fee) * rate;

      const transfer = {
        id: `txfr_${Date.now()}`,
        userId: ctx.user.id,
        ...input,
        rate,
        fee,
        convertedAmount,
        status: "processing",
        createdAt: Date.now(),
        estimatedArrival: Date.now() + 2 * 86400000,
        trackingCode: `SC${Date.now().toString(36).toUpperCase()}`,
      };
      transfers.push(transfer);

      return {
        success: true,
        transfer,
        message: `Sending ${input.fromCurrency} ${input.amount} → ${input.toCurrency} ${convertedAmount.toFixed(2)} to ${input.recipientName}`,
      };
    }),

  // ─── TRANSFER HISTORY ──────────────────────────────────────────────
  history: protectedProcedure.query(async ({ ctx }) => {
    const mine = transfers.filter(t => t.userId === ctx.user.id);
    return {
      transfers: mine,
      totalSent: mine.reduce((s, t) => s + t.amount, 0),
      totalFees: mine.reduce((s, t) => s + t.fee, 0),
      savedVsBanks: mine.reduce((s, t) => s + t.amount * 0.03, 0), // ~3% bank fee savings
    };
  }),

  // ─── SUPPORTED CURRENCIES ─────────────────────────────────────────
  currencies: protectedProcedure.query(async () => {
    return {
      fiat: [
        { code: "USD", name: "US Dollar", flag: "🇺🇸", supported: true },
        { code: "EUR", name: "Euro", flag: "🇪🇺", supported: true },
        { code: "GBP", name: "British Pound", flag: "🇬🇧", supported: true },
        { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", supported: true },
        { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", supported: true },
        { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", supported: true },
        { code: "INR", name: "Indian Rupee", flag: "🇮🇳", supported: true },
        { code: "BRL", name: "Brazilian Real", flag: "🇧🇷", supported: true },
        { code: "MXN", name: "Mexican Peso", flag: "🇲🇽", supported: true },
        { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬", supported: true },
        { code: "KES", name: "Kenyan Shilling", flag: "🇰🇪", supported: true },
        { code: "ZAR", name: "South African Rand", flag: "🇿🇦", supported: true },
        { code: "PHP", name: "Philippine Peso", flag: "🇵🇭", supported: true },
      ],
      crypto: [
        { code: "BTC", name: "Bitcoin", icon: "₿", supported: true },
        { code: "ETH", name: "Ethereum", icon: "Ξ", supported: true },
        { code: "USDT", name: "Tether", icon: "₮", supported: true },
        { code: "XMR", name: "Monero", icon: "ɱ", supported: true },
        { code: "DOGE", name: "Dogecoin", icon: "Ð", supported: true },
        { code: "SOL", name: "Solana", icon: "◎", supported: true },
        { code: "SHDW", name: "Shadow", icon: "🌑", supported: true },
        { code: "SKY4", name: "SkyCoin4444", icon: "🌌", supported: true },
      ],
    };
  }),

  // ─── CRYPTO TO FIAT OFF-RAMP ───────────────────────────────────────
  offRamp: protectedProcedure
    .input(z.object({
      cryptoAmount: z.number().min(0.001),
      cryptoCurrency: z.string(),
      fiatCurrency: z.string().length(3),
      bankAccount: z.string().optional(),
      method: z.enum(["bank_transfer", "mobile_money", "card"]).default("bank_transfer"),
    }))
    .mutation(async ({ ctx, input }) => {
      const cryptoPrices: Record<string, number> = {
        BTC: 67500, ETH: 3800, USDT: 1, XMR: 165, DOGE: 0.18,
        SOL: 175, SHDW: 0.085, SKY4: 0.0042,
      };
      const usdValue = input.cryptoAmount * (cryptoPrices[input.cryptoCurrency] || 1);
      const key = `USD_${input.fiatCurrency}`;
      const rate = EXCHANGE_RATES[key] || 1;
      const fee = usdValue * 0.01;
      const fiatAmount = (usdValue - fee) * rate;

      return {
        success: true,
        conversion: {
          from: `${input.cryptoAmount} ${input.cryptoCurrency}`,
          usdValue,
          fee,
          to: `${fiatAmount.toFixed(2)} ${input.fiatCurrency}`,
          rate,
          method: input.method,
          estimatedArrival: "1-3 business days",
        },
      };
    }),
});
