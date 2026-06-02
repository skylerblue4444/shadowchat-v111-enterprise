import { sql, eq, desc } from "drizzle-orm";
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";
import { globalCache } from "./cacheLayer";

export class AnalyticsService {
  static async getPlatformStats() {
    const cacheKey = "platform_stats";
    const cached = await globalCache.get(cacheKey);
    if (cached) return cached;

    const db = await getDb();
    if (!db) return null;

    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.users);
    const [postCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.posts);
    const [tradeCount] = await db.select({ count: sql<number>`count(*)` }).from(schema.trades);
    const [volumeResult] = await db.select({ total: sql<string>`COALESCE(SUM(total), '0')` }).from(schema.trades);

    const stats = {
      totalUsers: userCount?.count || 0,
      totalPosts: postCount?.count || 0,
      totalTrades: tradeCount?.count || 0,
      totalVolume: volumeResult?.total || "0",
      timestamp: new Date().toISOString(),
    };

    await globalCache.set(cacheKey, stats, 60000); // Cache for 1 minute
    return stats;
  }

  static async getLeaderboard(limit: number = 20) {
    const db = await getDb();
    if (!db) return [];

    return db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        username: schema.users.username,
        xp: schema.users.xp,
        level: schema.users.level,
      })
      .from(schema.users)
      .orderBy(desc(schema.users.xp))
      .limit(limit);
  }
}
