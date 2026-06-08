/**
 * ShadowChat v1111 - Digital Easter Egg System
 * Hidden Bonuses, Rare Unlocks, Secret Achievements
 */

export interface EasterEgg {
  id: string;
  name: string;
  description: string;
  hint: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
  trigger: EasterEggTrigger;
  reward: EasterEggReward;
  discovered: boolean;
  discoveredBy: string[];
  discoveredAt?: Date;
}

export interface EasterEggTrigger {
  type: "click_sequence" | "keyword" | "location" | "time_based" | "combination" | "hidden_button" | "code_input";
  value: any;
  requiresCondition?: string;
}

export interface EasterEggReward {
  skycoin: number;
  xp: number;
  nft?: string;
  badge: string;
  title?: string;
  multiplier: number;
}

export interface UserEasterEggProgress {
  userId: string;
  discoveredEggs: string[];
  totalCoinsFromEggs: number;
  rareEggsFound: number;
  achievements: EasterEggAchievement[];
}

export interface EasterEggAchievement {
  eggId: string;
  discoveredAt: Date;
  coinsEarned: number;
  xpEarned: number;
}

// Easter Egg System
export class EasterEggSystem {
  private easterEggs: Map<string, EasterEgg> = new Map();
  private userProgress: Map<string, UserEasterEggProgress> = new Map();
  private discoveryLog: any[] = [];

  constructor() {
    this.initializeEasterEggs();
  }

  /**
   * Initialize easter eggs
   */
  private initializeEasterEggs(): void {
    const eggs: EasterEgg[] = [
      {
        id: "egg-konami",
        name: "Konami Code",
        description: "Enter the legendary Konami code",
        hint: "Up, Up, Down, Down, Left, Right, Left, Right, B, A",
        rarity: "epic",
        trigger: { type: "click_sequence", value: ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"] },
        reward: { skycoin: 500, xp: 1000, nft: "konami_nft", badge: "konami_master", multiplier: 2.0 },
        discovered: false,
        discoveredBy: [],
      },
      {
        id: "egg-shadow-chat",
        name: "Shadow Chat Secret",
        description: "Type 'SHADOW' on any page",
        hint: "Look for hidden messages in the darkness",
        rarity: "rare",
        trigger: { type: "keyword", value: "SHADOW" },
        reward: { skycoin: 250, xp: 500, badge: "shadow_seeker", multiplier: 1.5 },
        discovered: false,
        discoveredBy: [],
      },
      {
        id: "egg-midnight-mode",
        name: "Midnight Mode",
        description: "Visit the platform at midnight UTC",
        hint: "The witching hour holds secrets",
        rarity: "uncommon",
        trigger: { type: "time_based", value: { hour: 0, minute: 0 } },
        reward: { skycoin: 100, xp: 250, badge: "night_owl", multiplier: 1.2 },
        discovered: false,
        discoveredBy: [],
      },
      {
        id: "egg-dev-console",
        name: "Developer's Secret",
        description: "Type 'console.log(\"ShadowChat\")' in browser console",
        hint: "Developers know where to look",
        rarity: "rare",
        trigger: { type: "code_input", value: "console.log" },
        reward: { skycoin: 300, xp: 750, nft: "dev_nft", badge: "developer_secret", multiplier: 1.8 },
        discovered: false,
        discoveredBy: [],
      },
      {
        id: "egg-easter-bunny",
        name: "Easter Bunny",
        description: "Find the hidden bunny emoji",
        hint: "🐰 Look in the charity section",
        rarity: "uncommon",
        trigger: { type: "hidden_button", value: "charity-bunny" },
        reward: { skycoin: 150, xp: 300, badge: "bunny_finder", multiplier: 1.3 },
        discovered: false,
        discoveredBy: [],
      },
      {
        id: "egg-ai-consciousness",
        name: "AI Consciousness",
        description: "Ask the AI platform a philosophical question",
        hint: "What does it mean to be alive?",
        rarity: "epic",
        trigger: { type: "keyword", value: "consciousness" },
        reward: { skycoin: 400, xp: 1000, nft: "ai_consciousness_nft", badge: "philosopher", multiplier: 2.5 },
        discovered: false,
        discoveredBy: [],
      },
      {
        id: "egg-crypto-whale",
        name: "Crypto Whale",
        description: "Earn 100,000 Skycoin in one session",
        hint: "Go big or go home",
        rarity: "legendary",
        trigger: { type: "combination", value: { action: "earn_coins", amount: 100000 } },
        reward: { skycoin: 1000, xp: 5000, nft: "whale_nft", badge: "crypto_whale", title: "🐋 Whale", multiplier: 3.0 },
        discovered: false,
        discoveredBy: [],
      },
      {
        id: "egg-sovereign-master",
        name: "Sovereign Master",
        description: "Create 10 workspaces in the Sovereign Dev Zone",
        hint: "Master the art of sovereignty",
        rarity: "epic",
        trigger: { type: "combination", value: { action: "create_workspaces", count: 10 } },
        reward: { skycoin: 600, xp: 2000, nft: "sovereign_master_nft", badge: "sovereign_master", multiplier: 2.0 },
        discovered: false,
        discoveredBy: [],
      },
      {
        id: "egg-all-seeing-eye",
        name: "All-Seeing Eye",
        description: "Visit all 11 pages in one day",
        hint: "See everything the platform has to offer",
        rarity: "rare",
        trigger: { type: "combination", value: { action: "visit_pages", count: 11 } },
        reward: { skycoin: 350, xp: 800, nft: "eye_nft", badge: "all_seeing", multiplier: 1.7 },
        discovered: false,
        discoveredBy: [],
      },
      {
        id: "egg-ultimate-secret",
        name: "Ultimate Secret",
        description: "Discover all 9 other easter eggs",
        hint: "Find them all to unlock the ultimate prize",
        rarity: "mythic",
        trigger: { type: "combination", value: { action: "discover_all_eggs" } },
        reward: { skycoin: 5000, xp: 10000, nft: "ultimate_secret_nft", badge: "ultimate_seeker", title: "🌟 Legend", multiplier: 5.0 },
        discovered: false,
        discoveredBy: [],
      },
    ];

    eggs.forEach((egg) => {
      this.easterEggs.set(egg.id, egg);
    });
  }

  /**
   * Discover an easter egg
   */
  discoverEgg(userId: string, eggId: string): EasterEggAchievement {
    const egg = this.easterEggs.get(eggId);
    if (!egg) throw new Error("Easter egg not found");

    if (egg.discoveredBy.includes(userId)) throw new Error("Already discovered this egg");

    egg.discovered = true;
    egg.discoveredBy.push(userId);
    egg.discoveredAt = new Date();

    // Update user progress
    let userProgress = this.userProgress.get(userId);
    if (!userProgress) {
      userProgress = {
        userId,
        discoveredEggs: [],
        totalCoinsFromEggs: 0,
        rareEggsFound: 0,
        achievements: [],
      };
      this.userProgress.set(userId, userProgress);
    }

    userProgress.discoveredEggs.push(eggId);
    const coinsEarned = egg.reward.skycoin;
    const xpEarned = egg.reward.xp;

    userProgress.totalCoinsFromEggs += coinsEarned;
    if (["rare", "epic", "legendary", "mythic"].includes(egg.rarity)) {
      userProgress.rareEggsFound++;
    }

    const achievement: EasterEggAchievement = {
      eggId,
      discoveredAt: new Date(),
      coinsEarned,
      xpEarned,
    };

    userProgress.achievements.push(achievement);

    this.logDiscovery(userId, `Discovered: ${egg.name} (${egg.rarity})`);

    return achievement;
  }

  /**
   * Check if trigger is activated
   */
  checkTrigger(userId: string, triggerType: string, triggerValue: any): EasterEgg | null {
    for (const egg of this.easterEggs.values()) {
      if (egg.trigger.type === triggerType && egg.trigger.value === triggerValue) {
        if (!egg.discoveredBy.includes(userId)) {
          return egg;
        }
      }
    }
    return null;
  }

  /**
   * Get available eggs for user
   */
  getAvailableEggs(userId: string): EasterEgg[] {
    const userProgress = this.userProgress.get(userId);
    const discoveredIds = userProgress?.discoveredEggs || [];

    return Array.from(this.easterEggs.values()).filter((egg) => !discoveredIds.includes(egg.id));
  }

  /**
   * Get discovered eggs for user
   */
  getDiscoveredEggs(userId: string): EasterEgg[] {
    const userProgress = this.userProgress.get(userId);
    if (!userProgress) return [];

    return userProgress.discoveredEggs.map((id) => this.easterEggs.get(id)!).filter((egg) => egg);
  }

  /**
   * Get user progress
   */
  getUserProgress(userId: string): UserEasterEggProgress | null {
    return this.userProgress.get(userId) || null;
  }

  /**
   * Get all eggs (for admin/debug)
   */
  getAllEggs(): EasterEgg[] {
    return Array.from(this.easterEggs.values());
  }

  /**
   * Get easter egg statistics
   */
  getStats() {
    const allEggs = Array.from(this.easterEggs.values());
    const discoveredEggs = allEggs.filter((e) => e.discovered);

    return {
      totalEggs: allEggs.length,
      discoveredEggs: discoveredEggs.length,
      discoveryRate: ((discoveredEggs.length / allEggs.length) * 100).toFixed(1),
      totalUsers: this.userProgress.size,
      totalCoinsDistributed: Array.from(this.userProgress.values()).reduce((sum, p) => sum + p.totalCoinsFromEggs, 0),
      rareEggsDiscovered: discoveredEggs.filter((e) => ["rare", "epic", "legendary", "mythic"].includes(e.rarity)).length,
    };
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(limit: number = 10): any[] {
    return Array.from(this.userProgress.values())
      .sort((a, b) => b.totalCoinsFromEggs - a.totalCoinsFromEggs)
      .slice(0, limit)
      .map((p) => ({
        userId: p.userId,
        eggsFound: p.discoveredEggs.length,
        coinsEarned: p.totalCoinsFromEggs,
        rareEggs: p.rareEggsFound,
      }));
  }

  /**
   * Private: Log discovery
   */
  private logDiscovery(userId: string, action: string): void {
    this.discoveryLog.push({
      timestamp: new Date(),
      userId,
      action,
    });
  }
}

// Singleton instance
export const easterEggSystem = new EasterEggSystem();
