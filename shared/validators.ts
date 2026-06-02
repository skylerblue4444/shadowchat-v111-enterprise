/**
 * Shared Validation Schemas
 */
import { z } from "zod";

export const emailSchema = z.string().email().max(255);
export const passwordSchema = z.string().min(8).max(128).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Must contain uppercase, lowercase, and number");
export const usernameSchema = z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/);
export const uuidSchema = z.string().uuid();
export const urlSchema = z.string().url().max(2048);
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);
export const slugSchema = z.string().min(1).max(100).regex(/^[a-z0-9-]+$/);

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().max(200).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const dateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
});

export const moneySchema = z.object({
  amount: z.number().min(0),
  currency: z.enum(["USD", "EUR", "GBP", "JPY", "CNY", "KRW", "BTC", "ETH"]),
});
