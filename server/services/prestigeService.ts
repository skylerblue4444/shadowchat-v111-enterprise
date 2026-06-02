import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { EventDispatcher } from "./eventDispatcher";

export class PrestigeService {
  static async addXP(userId: number, amount: number, reason: string) {
    const db = await getDb();
    if (!db) return null;

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) return null;

    const newXP = (user.xp || 0) + amount;
    const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;

    await db.update(users)
      .set({ 
        xp: newXP, 
        level: newLevel,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    await EventDispatcher.emit("XP_GAINED", { userId, amount, reason, newLevel });

    if (newLevel > (user.level || 1)) {
      await EventDispatcher.emit("LEVEL_UP", { userId, newLevel });
    }

    return { newXP, newLevel };
  }

  static async getRank(userId: number) {
    const db = await getDb();
    if (!db) return "Novice";

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) return "Novice";

    const level = user.level || 1;
    if (level >= 100) return "Grandmaster";
    if (level >= 75) return "Elite";
    if (level >= 50) return "Veteran";
    if (level >= 25) return "Professional";
    if (level >= 10) return "Apprentice";
    return "Novice";
  }
}
