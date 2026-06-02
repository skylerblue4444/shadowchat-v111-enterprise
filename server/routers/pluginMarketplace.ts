import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

/**
 * Plugin Marketplace Router — Developer Ecosystem
 * Features: Plugin discovery, installation, publishing, reviews, revenue sharing
 */

const PLUGINS = [
  { id: "p1", name: "AI Code Review", author: "ShadowDev", downloads: 245_000, rating: 4.8, price: 0, category: "developer", icon: "🤖", version: "2.4.1" },
  { id: "p2", name: "DeFi Analytics Pro", author: "CryptoLabs", downloads: 189_000, rating: 4.6, price: 4.99, category: "finance", icon: "📊", version: "3.1.0" },
  { id: "p3", name: "Social Scheduler", author: "ContentKing", downloads: 312_000, rating: 4.9, price: 0, category: "social", icon: "📅", version: "1.8.2" },
  { id: "p4", name: "NFT Minter", author: "ArtForge", downloads: 98_000, rating: 4.3, price: 9.99, category: "nft", icon: "🎨", version: "1.2.0" },
  { id: "p5", name: "Voice Translator", author: "LinguaAI", downloads: 456_000, rating: 4.7, price: 2.99, category: "ai", icon: "🗣️", version: "4.0.3" },
  { id: "p6", name: "Privacy Shield", author: "SecureNet", downloads: 567_000, rating: 4.9, price: 0, category: "security", icon: "🛡️", version: "5.2.1" },
  { id: "p7", name: "Trading Bot", author: "AlgoTrader", downloads: 134_000, rating: 4.4, price: 19.99, category: "finance", icon: "🤖", version: "2.0.0" },
  { id: "p8", name: "Theme Studio", author: "DesignPro", downloads: 278_000, rating: 4.5, price: 0, category: "customization", icon: "🎭", version: "3.3.3" },
];

export const pluginMarketplaceRouter = router({
  // Browse plugins
  browse: publicProcedure.input(z.object({
    category: z.string().optional(),
    search: z.string().optional(),
    sort: z.enum(["popular", "newest", "rating", "price"]).default("popular"),
    page: z.number().default(1),
    limit: z.number().max(50).default(20),
  }).optional()).query(({ input }) => {
    let filtered = [...PLUGINS];
    if (input?.category) filtered = filtered.filter(p => p.category === input.category);
    if (input?.search) filtered = filtered.filter(p => p.name.toLowerCase().includes(input.search!.toLowerCase()));
    return {
      plugins: filtered.map(p => ({ ...p, installed: Math.random() > 0.7 })),
      total: filtered.length,
      categories: ["developer", "finance", "social", "nft", "ai", "security", "customization"],
      featured: PLUGINS.slice(0, 3),
    };
  }),

  // Get plugin details
  getPlugin: publicProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
    const plugin = PLUGINS.find(p => p.id === input.id) || PLUGINS[0];
    return {
      ...plugin,
      description: `${plugin.name} is a powerful plugin that enhances your ShadowChat experience with advanced ${plugin.category} features.`,
      changelog: [
        { version: plugin.version, date: "2025-01-15", changes: ["Performance improvements", "Bug fixes", "New features"] },
        { version: "1.0.0", date: "2024-06-01", changes: ["Initial release"] },
      ],
      reviews: Array.from({ length: 5 }, (_, i) => ({
        user: `User_${i + 1}`,
        rating: 4 + Math.random(),
        comment: "Great plugin, works perfectly!",
        date: Date.now() - i * 86400000 * 7,
      })),
      permissions: ["read_profile", "access_wallet", "send_notifications"],
      size: "2.4MB",
      lastUpdated: Date.now() - 86400000 * 3,
    };
  }),

  // Install plugin
  install: protectedProcedure.input(z.object({ pluginId: z.string() })).mutation(({ input, ctx }) => ({
    success: true,
    pluginId: input.pluginId,
    installedAt: Date.now(),
    message: "Plugin installed successfully",
  })),

  // Uninstall plugin
  uninstall: protectedProcedure.input(z.object({ pluginId: z.string() })).mutation(({ input }) => ({
    success: true,
    pluginId: input.pluginId,
    message: "Plugin uninstalled",
  })),

  // Publish plugin
  publish: protectedProcedure.input(z.object({
    name: z.string().min(3),
    description: z.string().min(20),
    category: z.string(),
    version: z.string(),
    price: z.number().min(0),
    sourceUrl: z.string().url().optional(),
  })).mutation(({ input, ctx }) => ({
    success: true,
    pluginId: `pub_${Date.now()}`,
    name: input.name,
    status: "pending_review",
    estimatedReviewTime: "24-48 hours",
    revenueShare: "70% to developer, 30% platform",
  })),

  // Get my published plugins
  myPlugins: protectedProcedure.query(({ ctx }) => ({
    published: [
      { id: "my1", name: "My Custom Plugin", downloads: 1_200, revenue: 450, status: "active" },
    ],
    totalRevenue: 450,
    totalDownloads: 1_200,
  })),

  // Review plugin
  review: protectedProcedure.input(z.object({
    pluginId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().min(10),
  })).mutation(({ input, ctx }) => ({
    success: true,
    reviewId: `rev_${Date.now()}`,
  })),

  // Get developer stats
  devStats: protectedProcedure.query(() => ({
    totalPlugins: PLUGINS.length,
    totalDownloads: PLUGINS.reduce((s, p) => s + p.downloads, 0),
    averageRating: 4.6,
    totalRevenue: 2_400_000,
    activeDevs: 12_400,
    pendingReviews: 34,
  })),
});
