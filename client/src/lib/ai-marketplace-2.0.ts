/**
 * ShadowChat v1111 - AI Marketplace 2.0
 * Bot Creation, Monetization, Revenue Sharing
 */

export interface CustomBot {
  id: string;
  creatorId: string;
  name: string;
  description: string;
  category: string;
  personality: string;
  capabilities: string[];
  price: number; // Monthly subscription price in Skycoin
  revenue: number;
  downloads: number;
  rating: number;
  reviews: BotReview[];
  status: "draft" | "published" | "featured" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

export interface BotReview {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  timestamp: Date;
}

export interface BotSubscription {
  id: string;
  userId: string;
  botId: string;
  startDate: Date;
  endDate: Date;
  status: "active" | "paused" | "cancelled";
  monthlyFee: number;
}

export interface CreatorDashboard {
  creatorId: string;
  totalBots: number;
  totalDownloads: number;
  totalRevenue: number;
  monthlyRevenue: number;
  avgRating: number;
  subscribers: number;
}

export interface BotTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  baseCapabilities: string[];
  customizableFields: string[];
}

// AI Marketplace 2.0
export class AIMarketplace2 {
  private bots: Map<string, CustomBot> = new Map();
  private subscriptions: Map<string, BotSubscription> = new Map();
  private templates: Map<string, BotTemplate> = new Map();
  private creatorStats: Map<string, CreatorDashboard> = new Map();
  private marketplaceLog: any[] = [];

  constructor() {
    this.initializeTemplates();
  }

  /**
   * Initialize bot templates
   */
  private initializeTemplates(): void {
    const templates: BotTemplate[] = [
      {
        id: "tmpl-analyst",
        name: "Data Analyst Bot",
        description: "Analyzes platform data and generates insights",
        category: "analytics",
        baseCapabilities: ["data_analysis", "visualization", "reporting"],
        customizableFields: ["focus_area", "update_frequency", "alert_threshold"],
      },
      {
        id: "tmpl-trader",
        name: "Trading Bot",
        description: "Automates trading strategies",
        category: "finance",
        baseCapabilities: ["market_analysis", "order_execution", "risk_management"],
        customizableFields: ["strategy", "risk_level", "capital_allocation"],
      },
      {
        id: "tmpl-content",
        name: "Content Creator Bot",
        description: "Generates and curates content",
        category: "content",
        baseCapabilities: ["content_generation", "curation", "scheduling"],
        customizableFields: ["content_type", "tone", "frequency"],
      },
      {
        id: "tmpl-support",
        name: "Customer Support Bot",
        description: "Handles customer inquiries",
        category: "support",
        baseCapabilities: ["nlp", "ticket_management", "escalation"],
        customizableFields: ["response_style", "knowledge_base", "escalation_rules"],
      },
    ];

    templates.forEach((tmpl) => {
      this.templates.set(tmpl.id, tmpl);
    });
  }

  /**
   * Create custom bot
   */
  createCustomBot(creatorId: string, name: string, description: string, category: string, price: number = 99): CustomBot {
    const bot: CustomBot = {
      id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      creatorId,
      name,
      description,
      category,
      personality: "professional",
      capabilities: [],
      price,
      revenue: 0,
      downloads: 0,
      rating: 0,
      reviews: [],
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.bots.set(bot.id, bot);
    this.initializeCreatorStats(creatorId);

    this.marketplaceLog.push({ action: "created_bot", bot: name, creator: creatorId, timestamp: new Date() });

    return bot;
  }

  /**
   * Publish bot to marketplace
   */
  publishBot(botId: string): CustomBot | null {
    const bot = this.bots.get(botId);
    if (!bot) return null;

    bot.status = "published";
    bot.updatedAt = new Date();

    this.marketplaceLog.push({ action: "published_bot", bot: bot.name, timestamp: new Date() });

    return bot;
  }

  /**
   * Subscribe to bot
   */
  subscribeToBot(userId: string, botId: string): BotSubscription {
    const bot = this.bots.get(botId);
    if (!bot) throw new Error("Bot not found");

    const subscription: BotSubscription = {
      id: `sub-${Date.now()}`,
      userId,
      botId,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: "active",
      monthlyFee: bot.price,
    };

    this.subscriptions.set(subscription.id, subscription);

    // Update bot stats
    bot.downloads++;
    bot.revenue += bot.price;

    // Update creator stats
    const creatorStats = this.creatorStats.get(bot.creatorId);
    if (creatorStats) {
      creatorStats.monthlyRevenue += bot.price;
      creatorStats.totalRevenue += bot.price;
      creatorStats.subscribers++;
    }

    this.marketplaceLog.push({ action: "subscribed_to_bot", bot: bot.name, user: userId, timestamp: new Date() });

    return subscription;
  }

  /**
   * Add review to bot
   */
  addReview(botId: string, userId: string, rating: number, comment: string): BotReview {
    const bot = this.bots.get(botId);
    if (!bot) throw new Error("Bot not found");

    const review: BotReview = {
      id: `review-${Date.now()}`,
      userId,
      rating,
      comment,
      timestamp: new Date(),
    };

    bot.reviews.push(review);

    // Update bot rating
    const avgRating = bot.reviews.reduce((sum, r) => sum + r.rating, 0) / bot.reviews.length;
    bot.rating = avgRating;

    return review;
  }

  /**
   * Get marketplace bots
   */
  getMarketplaceBots(category?: string): CustomBot[] {
    const bots = Array.from(this.bots.values()).filter((b) => b.status === "published");
    return category ? bots.filter((b) => b.category === category) : bots;
  }

  /**
   * Get featured bots
   */
  getFeaturedBots(limit: number = 5): CustomBot[] {
    return Array.from(this.bots.values())
      .filter((b) => b.status === "featured")
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, limit);
  }

  /**
   * Get creator dashboard
   */
  getCreatorDashboard(creatorId: string): CreatorDashboard | null {
    return this.creatorStats.get(creatorId) || null;
  }

  /**
   * Get bot details
   */
  getBot(botId: string): CustomBot | null {
    return this.bots.get(botId) || null;
  }

  /**
   * Get user subscriptions
   */
  getUserSubscriptions(userId: string): BotSubscription[] {
    return Array.from(this.subscriptions.values()).filter((s) => s.userId === userId && s.status === "active");
  }

  /**
   * Get template
   */
  getTemplate(templateId: string): BotTemplate | null {
    return this.templates.get(templateId) || null;
  }

  /**
   * Get all templates
   */
  getAllTemplates(): BotTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get marketplace statistics
   */
  getMarketplaceStats() {
    const allBots = Array.from(this.bots.values());
    const publishedBots = allBots.filter((b) => b.status === "published");
    const totalRevenue = allBots.reduce((sum, b) => sum + b.revenue, 0);
    const totalDownloads = allBots.reduce((sum, b) => sum + b.downloads, 0);

    return {
      totalBots: allBots.length,
      publishedBots: publishedBots.length,
      totalCreators: this.creatorStats.size,
      totalRevenue,
      totalDownloads,
      avgBotRating: (allBots.reduce((sum, b) => sum + b.rating, 0) / Math.max(1, publishedBots.length)).toFixed(2),
      activeSubscriptions: Array.from(this.subscriptions.values()).filter((s) => s.status === "active").length,
    };
  }

  /**
   * Private: Initialize creator stats
   */
  private initializeCreatorStats(creatorId: string): void {
    if (!this.creatorStats.has(creatorId)) {
      this.creatorStats.set(creatorId, {
        creatorId,
        totalBots: 0,
        totalDownloads: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        avgRating: 0,
        subscribers: 0,
      });
    }
  }

  /**
   * Get marketplace log
   */
  getMarketplaceLog(limit: number = 50): any[] {
    return this.marketplaceLog.slice(-limit);
  }
}

// Singleton instance
export const aiMarketplace2 = new AIMarketplace2();
