/**
 * Shared TypeScript Types — Used across client and server
 */

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "moderator" | "user" | "service";
  status: "active" | "inactive" | "suspended" | "deleted";
  metadata?: Record<string, any>;
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  cursor?: string | null;
}

export interface PaginationInput {
  page?: number;
  limit?: number;
  cursor?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
  meta?: { requestId: string; duration: number; timestamp: string };
}

// Events
export interface AppEvent {
  id: string;
  type: string;
  payload: any;
  actor: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Notifications
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

// Mini Apps
export interface MiniApp {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  developer: { id: string; name: string };
  permissions: string[];
  version: string;
  downloads: number;
  rating: number;
  status: "active" | "pending" | "suspended";
}

// Transactions
export interface Transaction {
  id: string;
  type: "payment" | "transfer" | "refund" | "deposit" | "withdrawal";
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  from?: string;
  to?: string;
  reference?: string;
  createdAt: string;
}

// Chat
export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "video" | "audio" | "file" | "location" | "sticker";
  metadata?: Record<string, any>;
  replyTo?: string;
  reactions?: Record<string, string[]>;
  createdAt: string;
  editedAt?: string;
}

export interface Channel {
  id: string;
  name: string;
  type: "dm" | "group" | "channel" | "bot";
  members: string[];
  lastMessage?: Message;
  unreadCount: number;
  pinned: boolean;
  muted: boolean;
}
