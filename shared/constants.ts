/**
 * Shared Constants
 */
export const APP_NAME = "ShadowChat";
export const APP_VERSION = "111.0.0";
export const APP_DESCRIPTION = "WeChat-Style Super App for the West";

// API
export const API_VERSION = "v1";
export const API_BASE_URL = "/api/trpc";
export const WS_URL = "/ws";

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const MAX_BULK_SIZE = 500;

// Rate Limits
export const RATE_LIMITS = {
  standard: { requests: 10000, window: 60000 },
  auth: { requests: 10, window: 60000 },
  upload: { requests: 50, window: 60000 },
  ai: { requests: 100, window: 60000 },
} as const;

// File Upload
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
export const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/webm"];
export const ALLOWED_DOC_TYPES = ["application/pdf", "application/msword", "text/plain"];

// Roles & Permissions
export const ROLES = ["admin", "moderator", "user", "service"] as const;
export const PERMISSIONS = [
  "users:read", "users:write", "users:delete",
  "content:read", "content:write", "content:delete", "content:moderate",
  "payments:read", "payments:write", "payments:refund",
  "admin:access", "admin:settings", "admin:users",
  "miniapps:install", "miniapps:develop", "miniapps:publish",
] as const;

// Currencies
export const SUPPORTED_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CNY", "KRW", "BTC", "ETH"] as const;

// Categories
export const MINI_APP_CATEGORIES = [
  "social", "finance", "shopping", "food", "travel", "health",
  "education", "entertainment", "utilities", "business", "lifestyle", "games",
] as const;
