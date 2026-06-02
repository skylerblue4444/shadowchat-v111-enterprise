import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  json,
  index,
} from "drizzle-orm/mysql-core";

// ─── USERS ───────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "creator", "moderator"]).default("user").notNull(),
  username: varchar("username", { length: 64 }),
  bio: text("bio"),
  avatarUrl: text("avatarUrl"),
  bannerUrl: text("bannerUrl"),
  walletAddress: varchar("walletAddress", { length: 128 }),
  solanaAddress: varchar("solanaAddress", { length: 64 }),
  skyBalance: decimal("skyBalance", { precision: 20, scale: 8 }).default("0"),
  reputationScore: int("reputationScore").default(0),
  level: int("level").default(1),
  xp: int("xp").default(0),
  isVerified: boolean("isVerified").default(false),
  isOnline: boolean("isOnline").default(false),
  referralCode: varchar("referralCode", { length: 16 }),
  referredBy: int("referredBy"),
  subscriptionTier: mysqlEnum("subscriptionTier", ["free", "pro", "elite", "founder"]).default("free"),
  subscriptionExpiresAt: timestamp("subscriptionExpiresAt"),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// ─── SOCIAL POSTS ─────────────────────────────────────────────────────────────
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  content: text("content").notNull(),
  mediaUrls: json("mediaUrls").$type<string[]>(),
  tags: json("tags").$type<string[]>(),
  likes: int("likes").default(0),
  reposts: int("reposts").default(0),
  comments: int("comments").default(0),
  views: int("views").default(0),
  aiScore: decimal("aiScore", { precision: 5, scale: 2 }).default("0"),
  isNFT: boolean("isNFT").default(false),
  nftTokenId: varchar("nftTokenId", { length: 128 }),
  isPinned: boolean("isPinned").default(false),
  isHidden: boolean("isHidden").default(false),
  parentId: int("parentId"),
  repostId: int("repostId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [index("posts_authorId_idx").on(t.authorId)]);

// ─── POST LIKES ───────────────────────────────────────────────────────────────
export const postLikes = mysqlTable("postLikes", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── FOLLOWS ──────────────────────────────────────────────────────────────────
export const follows = mysqlTable("follows", {
  id: int("id").autoincrement().primaryKey(),
  followerId: int("followerId").notNull(),
  followingId: int("followingId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── MESSAGES ─────────────────────────────────────────────────────────────────
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }),
  isGroup: boolean("isGroup").default(false),
  isEncrypted: boolean("isEncrypted").default(true),
  avatarUrl: text("avatarUrl"),
  lastMessageAt: timestamp("lastMessageAt").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const conversationMembers = mysqlTable("conversationMembers", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["admin", "member"]).default("member"),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  senderId: int("senderId").notNull(),
  content: text("content").notNull(),
  mediaUrl: text("mediaUrl"),
  mediaType: varchar("mediaType", { length: 32 }),
  isRead: boolean("isRead").default(false),
  isDeleted: boolean("isDeleted").default(false),
  replyToId: int("replyToId"),
  reactions: json("reactions").$type<Record<string, number>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => [index("messages_convId_idx").on(t.conversationId)]);

// ─── WALLET / TRANSACTIONS ────────────────────────────────────────────────────
export const wallets = mysqlTable("wallets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  skyBalance: decimal("skyBalance", { precision: 20, scale: 8 }).default("0"),
  ethBalance: decimal("ethBalance", { precision: 20, scale: 8 }).default("0"),
  solBalance: decimal("solBalance", { precision: 20, scale: 8 }).default("0"),
  usdcBalance: decimal("usdcBalance", { precision: 20, scale: 8 }).default("0"),
  btcBalance: decimal("btcBalance", { precision: 20, scale: 8 }).default("0"),
  stakedSky: decimal("stakedSky", { precision: 20, scale: 8 }).default("0"),
  stakingRewards: decimal("stakingRewards", { precision: 20, scale: 8 }).default("0"),
  totalValueUsd: decimal("totalValueUsd", { precision: 20, scale: 2 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["send", "receive", "buy", "sell", "stake", "unstake", "reward", "fee", "swap"]).notNull(),
  asset: varchar("asset", { length: 16 }).notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  amountUsd: decimal("amountUsd", { precision: 20, scale: 2 }),
  toAddress: varchar("toAddress", { length: 128 }),
  fromAddress: varchar("fromAddress", { length: 128 }),
  txHash: varchar("txHash", { length: 128 }),
  status: mysqlEnum("status", ["pending", "confirmed", "failed"]).default("pending"),
  network: varchar("network", { length: 32 }),
  fee: decimal("fee", { precision: 20, scale: 8 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => [index("tx_userId_idx").on(t.userId)]);

// ─── EXCHANGE / TRADES ────────────────────────────────────────────────────────
export const trades = mysqlTable("trades", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  pair: varchar("pair", { length: 32 }).notNull(),
  side: mysqlEnum("side", ["buy", "sell"]).notNull(),
  orderType: mysqlEnum("orderType", ["market", "limit", "stop"]).default("market"),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  total: decimal("total", { precision: 20, scale: 8 }).notNull(),
  fee: decimal("fee", { precision: 20, scale: 8 }),
  status: mysqlEnum("status", ["open", "filled", "cancelled", "partial"]).default("open"),
  filledAt: timestamp("filledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => [index("trades_userId_idx").on(t.userId)]);

// ─── GOVERNANCE ───────────────────────────────────────────────────────────────
export const proposals = mysqlTable("proposals", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description").notNull(),
  category: mysqlEnum("category", ["protocol", "treasury", "feature", "partnership", "emergency"]).default("feature"),
  status: mysqlEnum("status", ["draft", "active", "passed", "rejected", "executed"]).default("active"),
  votesFor: int("votesFor").default(0),
  votesAgainst: int("votesAgainst").default(0),
  votesAbstain: int("votesAbstain").default(0),
  quorum: int("quorum").default(1000),
  requiredApproval: decimal("requiredApproval", { precision: 5, scale: 2 }).default("51.00"),
  endsAt: timestamp("endsAt").notNull(),
  executedAt: timestamp("executedAt"),
  onChainId: varchar("onChainId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const votes = mysqlTable("votes", {
  id: int("id").autoincrement().primaryKey(),
  proposalId: int("proposalId").notNull(),
  userId: int("userId").notNull(),
  choice: mysqlEnum("choice", ["for", "against", "abstain"]).notNull(),
  votingPower: decimal("votingPower", { precision: 20, scale: 8 }).notNull(),
  txHash: varchar("txHash", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── NFT GALLERY ──────────────────────────────────────────────────────────────
export const nfts = mysqlTable("nfts", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  creatorId: int("creatorId").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl").notNull(),
  animationUrl: text("animationUrl"),
  collection: varchar("collection", { length: 128 }),
  tokenId: varchar("tokenId", { length: 128 }),
  contractAddress: varchar("contractAddress", { length: 128 }),
  network: varchar("network", { length: 32 }).default("ethereum"),
  rarity: mysqlEnum("rarity", ["common", "uncommon", "rare", "epic", "legendary"]).default("common"),
  attributes: json("attributes").$type<Record<string, string | number>>(),
  price: decimal("price", { precision: 20, scale: 8 }),
  currency: varchar("currency", { length: 16 }).default("ETH"),
  isListed: boolean("isListed").default(false),
  isMinted: boolean("isMinted").default(false),
  views: int("views").default(0),
  likes: int("likes").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => [index("nfts_ownerId_idx").on(t.ownerId)]);

// ─── MARKETPLACE ──────────────────────────────────────────────────────────────
export const listings = mysqlTable("listings", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["digital", "physical", "service", "nft", "subscription"]).default("digital"),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  currency: varchar("currency", { length: 16 }).default("SKY"),
  imageUrls: json("imageUrls").$type<string[]>(),
  tags: json("tags").$type<string[]>(),
  stock: int("stock").default(1),
  sold: int("sold").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: int("reviewCount").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  buyerId: int("buyerId").notNull(),
  listingId: int("listingId").notNull(),
  quantity: int("quantity").default(1),
  totalPrice: decimal("totalPrice", { precision: 20, scale: 8 }).notNull(),
  currency: varchar("currency", { length: 16 }).default("SKY"),
  status: mysqlEnum("status", ["pending", "paid", "shipped", "delivered", "disputed", "refunded"]).default("pending"),
  txHash: varchar("txHash", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── AI AGENTS ────────────────────────────────────────────────────────────────
export const aiAgents = mysqlTable("aiAgents", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  persona: varchar("persona", { length: 64 }).notNull(),
  systemPrompt: text("systemPrompt"),
  model: varchar("model", { length: 64 }).default("gpt-4o-mini"),
  isActive: boolean("isActive").default(true),
  isPublic: boolean("isPublic").default(false),
  totalEarnings: decimal("totalEarnings", { precision: 20, scale: 8 }).default("0"),
  totalTasks: int("totalTasks").default(0),
  successRate: decimal("successRate", { precision: 5, scale: 2 }).default("100.00"),
  capabilities: json("capabilities").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const aiConversations = mysqlTable("aiConversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  agentId: int("agentId"),
  title: varchar("title", { length: 256 }),
  persona: varchar("persona", { length: 64 }).default("oracle"),
  messages: json("messages").$type<Array<{ role: string; content: string; timestamp: number }>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["like", "comment", "follow", "mention", "trade", "governance", "reward", "system", "message"]).notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  body: text("body"),
  data: json("data"),
  isRead: boolean("isRead").default(false),
  actorId: int("actorId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => [index("notif_userId_idx").on(t.userId)]);

// ─── STAKING ──────────────────────────────────────────────────────────────────
export const stakingPositions = mysqlTable("stakingPositions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  lockPeriodDays: int("lockPeriodDays").default(30),
  apy: decimal("apy", { precision: 5, scale: 2 }).notNull(),
  rewards: decimal("rewards", { precision: 20, scale: 8 }).default("0"),
  status: mysqlEnum("status", ["active", "unlocking", "completed"]).default("active"),
  stakedAt: timestamp("stakedAt").defaultNow().notNull(),
  unlocksAt: timestamp("unlocksAt").notNull(),
  claimedAt: timestamp("claimedAt"),
});

// ─── REFERRALS ────────────────────────────────────────────────────────────────
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrerId").notNull(),
  referredId: int("referredId").notNull(),
  reward: decimal("reward", { precision: 20, scale: 8 }).default("0"),
  status: mysqlEnum("status", ["pending", "active", "rewarded"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── EVENTS ───────────────────────────────────────────────────────────────────
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  organizerId: int("organizerId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  category: varchar("category", { length: 64 }),
  startAt: timestamp("startAt").notNull(),
  endAt: timestamp("endAt"),
  location: varchar("location", { length: 256 }),
  isVirtual: boolean("isVirtual").default(false),
  streamUrl: text("streamUrl"),
  maxAttendees: int("maxAttendees"),
  attendeeCount: int("attendeeCount").default(0),
  ticketPrice: decimal("ticketPrice", { precision: 20, scale: 8 }).default("0"),
  currency: varchar("currency", { length: 16 }).default("SKY"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── CREATOR CONTENT ──────────────────────────────────────────────────────────
export const creatorContent = mysqlTable("creatorContent", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["video", "audio", "article", "image", "course"]).default("article"),
  contentUrl: text("contentUrl"),
  thumbnailUrl: text("thumbnailUrl"),
  isPremium: boolean("isPremium").default(false),
  price: decimal("price", { precision: 20, scale: 8 }).default("0"),
  views: int("views").default(0),
  likes: int("likes").default(0),
  earnings: decimal("earnings", { precision: 20, scale: 8 }).default("0"),
  isPublished: boolean("isPublished").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────
export const leaderboardEntries = mysqlTable("leaderboardEntries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  category: mysqlEnum("category", ["trading", "social", "governance", "creator", "referral", "overall"]).notNull(),
  score: decimal("score", { precision: 20, scale: 8 }).default("0"),
  rank: int("rank"),
  period: varchar("period", { length: 16 }).default("weekly"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── SUBSCRIPTIONS ────────────────────────────────────────────────────────────
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  subscriberId: int("subscriberId").notNull(),
  creatorId: int("creatorId").notNull(),
  tier: mysqlEnum("tier", ["basic", "supporter", "vip"]).default("basic"),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  currency: varchar("currency", { length: 16 }).default("SKY"),
  status: mysqlEnum("status", ["active", "cancelled", "expired"]).default("active"),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── DIGITAL TWIN ─────────────────────────────────────────────────────────────
export const digitalTwins = mysqlTable("digitalTwins", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  name: varchar("name", { length: 128 }),
  personality: json("personality").$type<Record<string, number>>(),
  tradingStyle: varchar("tradingStyle", { length: 64 }),
  riskTolerance: mysqlEnum("riskTolerance", ["conservative", "moderate", "aggressive"]).default("moderate"),
  automatedTrading: boolean("automatedTrading").default(false),
  automatedPosting: boolean("automatedPosting").default(false),
  totalEarnings: decimal("totalEarnings", { precision: 20, scale: 8 }).default("0"),
  isActive: boolean("isActive").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── FEATURE FLAGS ────────────────────────────────────────────────────────────
export const featureFlags = mysqlTable("featureFlags", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  isEnabled: boolean("isEnabled").default(false),
  rolloutPercentage: int("rolloutPercentage").default(0),
  conditions: json("conditions"),
  updatedBy: int("updatedBy"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── SECURITY LOGS ────────────────────────────────────────────────────────────
export const securityLogs = mysqlTable("securityLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  event: varchar("event", { length: 128 }).notNull(),
  severity: mysqlEnum("severity", ["info", "warning", "critical"]).default("info"),
  ipAddress: varchar("ipAddress", { length: 64 }),
  userAgent: text("userAgent"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => [index("sec_userId_idx").on(t.userId)]);

// ─── EVENT BUS ────────────────────────────────────────────────────────────────
export const domainEvents = mysqlTable("domainEvents", {
  id: int("id").autoincrement().primaryKey(),
  type: varchar("type", { length: 128 }).notNull(),
  source: varchar("source", { length: 64 }).notNull(),
  actorId: int("actorId"),
  entityType: varchar("entityType", { length: 64 }),
  entityId: int("entityId"),
  payload: json("payload"),
  metadata: json("metadata"),
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => [index("events_type_idx").on(t.type), index("events_source_idx").on(t.source)]);

export const eventSubscriptions = mysqlTable("eventSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  subscriberId: varchar("subscriberId", { length: 128 }).notNull(),
  eventType: varchar("eventType", { length: 128 }).notNull(),
  webhookUrl: text("webhookUrl"),
  isActive: boolean("isActive").default(true),
  lastTriggeredAt: timestamp("lastTriggeredAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── AI MEMORY & KNOWLEDGE ───────────────────────────────────────────────────
export const aiMemory = mysqlTable("aiMemory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  agentId: int("agentId"),
  scope: mysqlEnum("scope", ["user", "agent", "team", "organization", "global"]).default("user"),
  key: varchar("key", { length: 256 }).notNull(),
  value: text("value").notNull(),
  embedding: json("embedding").$type<number[]>(),
  importance: decimal("importance", { precision: 5, scale: 2 }).default("0.50"),
  accessCount: int("accessCount").default(0),
  lastAccessedAt: timestamp("lastAccessedAt"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [index("memory_userId_idx").on(t.userId)]);

export const knowledgeDocuments = mysqlTable("knowledgeDocuments", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  title: varchar("title", { length: 512 }).notNull(),
  content: text("content").notNull(),
  sourceUrl: text("sourceUrl"),
  docType: mysqlEnum("docType", ["document", "webpage", "api_doc", "faq", "policy", "manual"]).default("document"),
  tags: json("tags").$type<string[]>(),
  chunkCount: int("chunkCount").default(0),
  isIndexed: boolean("isIndexed").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const knowledgeChunks = mysqlTable("knowledgeChunks", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull(),
  content: text("content").notNull(),
  embedding: json("embedding").$type<number[]>(),
  chunkIndex: int("chunkIndex").default(0),
  tokenCount: int("tokenCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => [index("chunks_docId_idx").on(t.documentId)]);

// ─── WORKFLOW ENGINE ─────────────────────────────────────────────────────────
export const workflows = mysqlTable("workflows", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  trigger: mysqlEnum("trigger", ["manual", "event", "schedule", "webhook", "ai"]).default("manual"),
  triggerConfig: json("triggerConfig"),
  steps: json("steps").$type<Array<{ id: string; type: string; config: Record<string, unknown>; next?: string }>>(),
  isActive: boolean("isActive").default(false),
  lastRunAt: timestamp("lastRunAt"),
  runCount: int("runCount").default(0),
  successCount: int("successCount").default(0),
  failCount: int("failCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const workflowRuns = mysqlTable("workflowRuns", {
  id: int("id").autoincrement().primaryKey(),
  workflowId: int("workflowId").notNull(),
  status: mysqlEnum("status", ["running", "completed", "failed", "cancelled"]).default("running"),
  triggeredBy: varchar("triggeredBy", { length: 128 }),
  input: json("input"),
  output: json("output"),
  error: text("error"),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
}, (t) => [index("runs_workflowId_idx").on(t.workflowId)]);

// ─── GLOBAL SEARCH INDEX ─────────────────────────────────────────────────────
export const searchIndex = mysqlTable("searchIndex", {
  id: int("id").autoincrement().primaryKey(),
  entityType: varchar("entityType", { length: 64 }).notNull(),
  entityId: int("entityId").notNull(),
  title: varchar("title", { length: 512 }).notNull(),
  content: text("content"),
  tags: json("tags").$type<string[]>(),
  authorId: int("authorId"),
  score: decimal("score", { precision: 10, scale: 4 }).default("0"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => [index("search_entity_idx").on(t.entityType, t.entityId)]);

// ─── DEVELOPER ECOSYSTEM ─────────────────────────────────────────────────────
export const apiKeys = mysqlTable("apiKeys", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  keyHash: varchar("keyHash", { length: 256 }).notNull(),
  keyPrefix: varchar("keyPrefix", { length: 12 }).notNull(),
  scopes: json("scopes").$type<string[]>(),
  rateLimit: int("rateLimit").default(1000),
  usageCount: int("usageCount").default(0),
  lastUsedAt: timestamp("lastUsedAt"),
  expiresAt: timestamp("expiresAt"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const webhooks = mysqlTable("webhooks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  url: text("url").notNull(),
  events: json("events").$type<string[]>(),
  secret: varchar("secret", { length: 256 }),
  isActive: boolean("isActive").default(true),
  failCount: int("failCount").default(0),
  lastTriggeredAt: timestamp("lastTriggeredAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const plugins = mysqlTable("plugins", {
  id: int("id").autoincrement().primaryKey(),
  developerId: int("developerId").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  description: text("description"),
  version: varchar("version", { length: 32 }).default("1.0.0"),
  category: mysqlEnum("category", ["ai", "trading", "social", "analytics", "security", "utility"]).default("utility"),
  iconUrl: text("iconUrl"),
  installCount: int("installCount").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  isPublished: boolean("isPublished").default(false),
  isVerified: boolean("isVerified").default(false),
  config: json("config"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── SESSIONS & SECURITY CENTER ──────────────────────────────────────────────
export const userSessions = mysqlTable("userSessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  deviceName: varchar("deviceName", { length: 128 }),
  deviceType: varchar("deviceType", { length: 32 }),
  browser: varchar("browser", { length: 64 }),
  os: varchar("os", { length: 64 }),
  ipAddress: varchar("ipAddress", { length: 64 }),
  location: varchar("location", { length: 128 }),
  isCurrent: boolean("isCurrent").default(false),
  lastActiveAt: timestamp("lastActiveAt").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
}, (t) => [index("sessions_userId_idx").on(t.userId)]);

export const threatEvents = mysqlTable("threatEvents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  type: mysqlEnum("type", ["brute_force", "suspicious_login", "api_abuse", "data_exfil", "privilege_escalation", "anomaly"]).notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("medium"),
  description: text("description"),
  sourceIp: varchar("sourceIp", { length: 64 }),
  isResolved: boolean("isResolved").default(false),
  resolvedBy: int("resolvedBy"),
  resolvedAt: timestamp("resolvedAt"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => [index("threats_userId_idx").on(t.userId)]);

// ─── OBSERVABILITY ───────────────────────────────────────────────────────────
export const platformMetrics = mysqlTable("platformMetrics", {
  id: int("id").autoincrement().primaryKey(),
  metric: varchar("metric", { length: 128 }).notNull(),
  value: decimal("value", { precision: 20, scale: 4 }).notNull(),
  tags: json("tags").$type<Record<string, string>>(),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

export const errorReports = mysqlTable("errorReports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  module: varchar("module", { length: 64 }).notNull(),
  message: text("message").notNull(),
  stack: text("stack"),
  severity: mysqlEnum("severity", ["info", "warning", "error", "fatal"]).default("error"),
  count: int("count").default(1),
  lastOccurredAt: timestamp("lastOccurredAt").defaultNow(),
  isResolved: boolean("isResolved").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── ENTERPRISE FINANCE ──────────────────────────────────────────────────────
export const treasuryAccounts = mysqlTable("treasuryAccounts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  type: mysqlEnum("type", ["operating", "reserve", "staking", "grants", "development"]).default("operating"),
  balance: decimal("balance", { precision: 20, scale: 8 }).default("0"),
  currency: varchar("currency", { length: 16 }).default("SKY"),
  lastAuditAt: timestamp("lastAuditAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const revenueEvents = mysqlTable("revenueEvents", {
  id: int("id").autoincrement().primaryKey(),
  source: mysqlEnum("source", ["trading_fees", "subscriptions", "nft_royalties", "marketplace", "ai_services", "staking", "ads"]).notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  currency: varchar("currency", { length: 16 }).default("SKY"),
  userId: int("userId"),
  metadata: json("metadata"),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

// ─── EXPORTS ──────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Wallet = typeof wallets.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Trade = typeof trades.$inferSelect;
export type Proposal = typeof proposals.$inferSelect;
export type Vote = typeof votes.$inferSelect;
export type NFT = typeof nfts.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type AIAgent = typeof aiAgents.$inferSelect;
export type Notification = typeof notifications.$inferSelect;


// ═══════════════════════════════════════════════════════════════
// DATING / MATCHING SYSTEM
// ═══════════════════════════════════════════════════════════════
export const datingProfiles = mysqlTable("datingProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  bio: text("bio"),
  interests: json("interests"),
  lookingFor: mysqlEnum("lookingFor", ["friendship", "dating", "networking", "all"]).default("all"),
  ageRange: varchar("ageRange", { length: 20 }).default("18-99"),
  location: varchar("location", { length: 128 }),
  photos: json("photos"),
  isActive: boolean("isActive").default(true),
  compatibilityVector: json("compatibilityVector"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  targetId: int("targetId").notNull(),
  action: mysqlEnum("action", ["like", "pass", "superlike"]).notNull(),
  isMatch: boolean("isMatch").default(false),
  compatibilityScore: decimal("compatibilityScore", { precision: 5, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// LIVE VIDEO / STREAMING SYSTEM
// ═══════════════════════════════════════════════════════════════
export const liveStreams = mysqlTable("liveStreams", {
  id: int("id").autoincrement().primaryKey(),
  hostId: int("hostId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["gaming", "music", "talk", "education", "creative", "other"]).default("other"),
  status: mysqlEnum("status", ["scheduled", "live", "ended", "archived"]).default("scheduled"),
  viewerCount: int("viewerCount").default(0),
  peakViewers: int("peakViewers").default(0),
  thumbnailUrl: varchar("thumbnailUrl", { length: 512 }),
  streamKey: varchar("streamKey", { length: 128 }),
  startedAt: timestamp("startedAt"),
  endedAt: timestamp("endedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const streamMessages = mysqlTable("streamMessages", {
  id: int("id").autoincrement().primaryKey(),
  streamId: int("streamId").notNull(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  type: mysqlEnum("type", ["chat", "tip", "system", "mod"]).default("chat"),
  amount: decimal("amount", { precision: 12, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// CREATOR STUDIO
// ═══════════════════════════════════════════════════════════════
export const creatorProfiles = mysqlTable("creatorProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  displayName: varchar("displayName", { length: 128 }),
  category: mysqlEnum("category", ["influencer", "artist", "educator", "musician", "developer", "other"]).default("other"),
  totalEarnings: decimal("totalEarnings", { precision: 14, scale: 2 }).default("0.00"),
  subscriberCount: int("subscriberCount").default(0),
  monthlyRevenue: decimal("monthlyRevenue", { precision: 12, scale: 2 }).default("0.00"),
  payoutAddress: varchar("payoutAddress", { length: 256 }),
  isVerified: boolean("isVerified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const scheduledPosts = mysqlTable("scheduledPosts", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(),
  content: text("content").notNull(),
  mediaUrls: json("mediaUrls"),
  scheduledFor: timestamp("scheduledFor").notNull(),
  status: mysqlEnum("status", ["pending", "published", "failed", "cancelled"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// PAYMENTS / BILLING HUB
// ═══════════════════════════════════════════════════════════════
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: decimal("amount", { precision: 14, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD"),
  status: mysqlEnum("status", ["pending", "paid", "failed", "refunded"]).default("pending"),
  description: text("description"),
  dueDate: timestamp("dueDate"),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const payouts = mysqlTable("payouts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: decimal("amount", { precision: 14, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD"),
  method: mysqlEnum("method", ["crypto", "bank", "paypal", "stripe"]).default("crypto"),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending"),
  walletAddress: varchar("walletAddress", { length: 256 }),
  txHash: varchar("txHash", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// SOCIAL GRAPH / NETWORK
// ═══════════════════════════════════════════════════════════════
export const socialCircles = mysqlTable("socialCircles", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  memberCount: int("memberCount").default(0),
  isPublic: boolean("isPublic").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const circleMemberships = mysqlTable("circleMemberships", {
  id: int("id").autoincrement().primaryKey(),
  circleId: int("circleId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["member", "moderator", "admin"]).default("member"),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// MODERATION / TRUST & SAFETY
// ═══════════════════════════════════════════════════════════════
export const moderationReports = mysqlTable("moderationReports", {
  id: int("id").autoincrement().primaryKey(),
  reporterId: int("reporterId").notNull(),
  targetType: mysqlEnum("targetType", ["user", "post", "listing", "message", "stream"]).notNull(),
  targetId: int("targetId").notNull(),
  reason: mysqlEnum("reason", ["spam", "harassment", "fraud", "inappropriate", "copyright", "other"]).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "reviewing", "resolved", "dismissed"]).default("pending"),
  resolvedBy: int("resolvedBy"),
  resolution: text("resolution"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const userRiskScores = mysqlTable("userRiskScores", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  score: decimal("score", { precision: 5, scale: 2 }).default("0.00"),
  factors: json("factors"),
  lastCalculated: timestamp("lastCalculated").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// SANDBOX / EXPERIMENTAL ZONE
// ═══════════════════════════════════════════════════════════════
export const sandboxEnvironments = mysqlTable("sandboxEnvironments", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  type: mysqlEnum("type", ["ai_test", "trading_sim", "feature_preview", "behavior_model"]).default("ai_test"),
  config: json("config"),
  status: mysqlEnum("status", ["active", "paused", "archived"]).default("active"),
  results: json("results"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// ENTERPRISE CRYPTO — MINING, TIPPING, BURNS
// ═══════════════════════════════════════════════════════════════
export const miningPools = mysqlTable("miningPools", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  coin: mysqlEnum("coin", ["DOGE", "XMR", "USDT", "SHADOW", "TRUMP", "SKY444"]).notNull(),
  algorithm: varchar("algorithm", { length: 64 }).default("RandomX"),
  totalHashRate: decimal("totalHashRate", { precision: 20, scale: 4 }).default("0"),
  totalMiners: int("totalMiners").default(0),
  blockReward: decimal("blockReward", { precision: 20, scale: 8 }).default("0"),
  difficulty: decimal("difficulty", { precision: 20, scale: 4 }).default("1"),
  status: mysqlEnum("status", ["active", "maintenance", "offline"]).default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const minerPositions = mysqlTable("minerPositions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  poolId: int("poolId").notNull(),
  hashRate: decimal("hashRate", { precision: 20, scale: 4 }).default("0"),
  totalMined: decimal("totalMined", { precision: 20, scale: 8 }).default("0"),
  pendingRewards: decimal("pendingRewards", { precision: 20, scale: 8 }).default("0"),
  isActive: boolean("isActive").default(true),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  lastPayoutAt: timestamp("lastPayoutAt"),
});

export const tips = mysqlTable("tips", {
  id: int("id").autoincrement().primaryKey(),
  fromUserId: int("fromUserId").notNull(),
  toUserId: int("toUserId").notNull(),
  coin: mysqlEnum("coin", ["DOGE", "XMR", "USDT", "SHADOW", "TRUMP", "SKY444"]).notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  message: text("message"),
  context: mysqlEnum("context", ["post", "stream", "chat", "profile", "content"]).default("post"),
  contextId: int("contextId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const burns = mysqlTable("burns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  coin: mysqlEnum("coin", ["DOGE", "XMR", "USDT", "SHADOW", "TRUMP", "SKY444"]).notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  reason: mysqlEnum("reason", ["deflationary", "burn_to_earn", "governance", "event", "voluntary"]).default("voluntary"),
  rewardEarned: decimal("rewardEarned", { precision: 20, scale: 8 }).default("0"),
  txHash: varchar("txHash", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const priceAlerts = mysqlTable("priceAlerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  coin: mysqlEnum("coin", ["DOGE", "XMR", "USDT", "SHADOW", "TRUMP", "SKY444"]).notNull(),
  targetPrice: decimal("targetPrice", { precision: 20, scale: 8 }).notNull(),
  direction: mysqlEnum("direction", ["above", "below"]).notNull(),
  isTriggered: boolean("isTriggered").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
