/**
 * ShadowChat v1111 - Smart Quest Engine
 * Gamified Rewards, Progressive Challenges, Engagement Mechanics
 */

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: "exploration" | "social" | "economic" | "technical" | "achievement";
  difficulty: "easy" | "medium" | "hard" | "legendary";
  rewards: QuestReward;
  requirements: QuestRequirement[];
  progress: number; // 0-100
  status: "available" | "in_progress" | "completed" | "claimed" | "expired";
  expiresAt: Date;
  createdAt: Date;
  completedAt?: Date;
}

export interface QuestReward {
  skycoin: number;
  xp: number;
  badges: string[];
  nftUnlock?: string;
  multiplier: number; // Bonus multiplier for early completion
}

export interface QuestRequirement {
  type: "visit_page" | "complete_action" | "earn_coins" | "social_share" | "invite_friend" | "play_game" | "custom";
  target: string;
  progress: number;
  required: number;
}

export interface UserQuestProgress {
  userId: string;
  totalQuestsCompleted: number;
  totalCoinsEarned: number;
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  badges: string[];
  questHistory: QuestCompletion[];
}

export interface QuestCompletion {
  questId: string;
  completedAt: Date;
  coinsEarned: number;
  xpEarned: number;
  multiplierApplied: number;
}

export interface DailyChallenge {
  id: string;
  date: Date;
  quests: Quest[];
  totalReward: number;
  bonusMultiplier: number;
}

// Smart Quest Engine
export class SmartQuestEngine {
  private quests: Map<string, Quest> = new Map();
  private userProgress: Map<string, UserQuestProgress> = new Map();
  private dailyChallenges: Map<string, DailyChallenge> = new Map();
  private questLog: any[] = [];

  constructor() {
    this.initializeQuests();
    this.generateDailyChallenge();
  }

  /**
   * Initialize quests
   */
  private initializeQuests(): void {
    const questConfigs = [
      {
        title: "Welcome to ShadowChat",
        description: "Visit the main dashboard",
        category: "exploration",
        difficulty: "easy",
        rewards: { skycoin: 50, xp: 100, badges: ["explorer"], nftUnlock: undefined, multiplier: 1.5 },
        requirements: [{ type: "visit_page", target: "dashboard", progress: 0, required: 1 }],
      },
      {
        title: "Economic Explorer",
        description: "Visit the economic dashboard",
        category: "economic",
        difficulty: "easy",
        rewards: { skycoin: 75, xp: 150, badges: ["economist"], nftUnlock: undefined, multiplier: 1.3 },
        requirements: [{ type: "visit_page", target: "economic", progress: 0, required: 1 }],
      },
      {
        title: "AI Enthusiast",
        description: "Explore the AI Platform Hub",
        category: "technical",
        difficulty: "medium",
        rewards: { skycoin: 100, xp: 250, badges: ["ai_explorer"], nftUnlock: "ai_badge_nft", multiplier: 1.5 },
        requirements: [{ type: "visit_page", target: "ai-platform", progress: 0, required: 1 }],
      },
      {
        title: "First Gamble",
        description: "Play any casino game",
        category: "economic",
        difficulty: "easy",
        rewards: { skycoin: 50, xp: 100, badges: ["gambler"], nftUnlock: undefined, multiplier: 2.0 },
        requirements: [{ type: "play_game", target: "casino", progress: 0, required: 1 }],
      },
      {
        title: "Charity Champion",
        description: "Donate 100 coins to charity",
        category: "social",
        difficulty: "medium",
        rewards: { skycoin: 200, xp: 500, badges: ["philanthropist"], nftUnlock: "charity_nft", multiplier: 1.2 },
        requirements: [{ type: "earn_coins", target: "charity_donation", progress: 0, required: 100 }],
      },
      {
        title: "Social Butterfly",
        description: "Invite 3 friends",
        category: "social",
        difficulty: "hard",
        rewards: { skycoin: 300, xp: 750, badges: ["influencer"], nftUnlock: "social_nft", multiplier: 1.8 },
        requirements: [{ type: "invite_friend", target: "referral", progress: 0, required: 3 }],
      },
      {
        title: "Code Wizard",
        description: "Generate code in the AI IDE",
        category: "technical",
        difficulty: "hard",
        rewards: { skycoin: 250, xp: 600, badges: ["developer"], nftUnlock: "code_nft", multiplier: 2.5 },
        requirements: [{ type: "custom", target: "generate_code", progress: 0, required: 1 }],
      },
      {
        title: "Sovereign Explorer",
        description: "Create a workspace in the Sovereign Dev Zone",
        category: "technical",
        difficulty: "hard",
        rewards: { skycoin: 150, xp: 400, badges: ["sovereign"], nftUnlock: "sovereign_nft", multiplier: 2.0 },
        requirements: [{ type: "custom", target: "create_sovereign_workspace", progress: 0, required: 1 }],
      },
      {
        title: "Crypto Millionaire",
        description: "Earn 10,000 Skycoin",
        category: "economic",
        difficulty: "legendary",
        rewards: { skycoin: 1000, xp: 5000, badges: ["millionaire"], nftUnlock: "millionaire_nft", multiplier: 1.0 },
        requirements: [{ type: "earn_coins", target: "total_balance", progress: 0, required: 10000 }],
      },
      {
        title: "Master of All Trades",
        description: "Complete 50 quests",
        category: "achievement",
        difficulty: "legendary",
        rewards: { skycoin: 500, xp: 2000, badges: ["master"], nftUnlock: "master_nft", multiplier: 1.5 },
        requirements: [{ type: "custom", target: "complete_quests", progress: 0, required: 50 }],
      },
    ];

    questConfigs.forEach((config, idx) => {
      const quest: Quest = {
        id: `quest-${idx}`,
        title: config.title,
        description: config.description,
        category: config.category as any,
        difficulty: config.difficulty as any,
        rewards: config.rewards,
        requirements: config.requirements,
        progress: 0,
        status: "available",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        createdAt: new Date(),
      };

      this.quests.set(quest.id, quest);
    });
  }

  /**
   * Get available quests for user
   */
  getAvailableQuests(userId: string): Quest[] {
    const userProgress = this.userProgress.get(userId);
    const completedQuestIds = userProgress?.questHistory.map((q) => q.questId) || [];

    return Array.from(this.quests.values()).filter(
      (q) => q.status === "available" && !completedQuestIds.includes(q.id) && new Date() < q.expiresAt
    );
  }

  /**
   * Start a quest
   */
  startQuest(userId: string, questId: string): Quest {
    const quest = this.quests.get(questId);
    if (!quest) throw new Error("Quest not found");

    quest.status = "in_progress";
    this.logQuestActivity(userId, `Started quest: ${quest.title}`);

    return quest;
  }

  /**
   * Update quest progress
   */
  updateQuestProgress(userId: string, questId: string, requirementIndex: number, progress: number): Quest {
    const quest = this.quests.get(questId);
    if (!quest) throw new Error("Quest not found");

    const requirement = quest.requirements[requirementIndex];
    if (!requirement) throw new Error("Requirement not found");

    requirement.progress = Math.min(requirement.required, progress);

    // Calculate overall progress
    const totalProgress = quest.requirements.reduce((sum, req) => sum + (req.progress / req.required) * 100, 0) / quest.requirements.length;
    quest.progress = totalProgress;

    // Check if quest is complete
    if (quest.requirements.every((req) => req.progress >= req.required)) {
      this.completeQuest(userId, questId);
    }

    return quest;
  }

  /**
   * Complete a quest
   */
  private completeQuest(userId: string, questId: string): void {
    const quest = this.quests.get(questId);
    if (!quest) return;

    quest.status = "completed";
    quest.completedAt = new Date();

    // Calculate rewards
    const timeSinceCreation = Date.now() - quest.createdAt.getTime();
    const daysSinceCreation = timeSinceCreation / (1000 * 60 * 60 * 24);
    const multiplier = Math.max(1, quest.rewards.multiplier - daysSinceCreation * 0.1); // Decay multiplier over time

    const coinsEarned = Math.floor(quest.rewards.skycoin * multiplier);
    const xpEarned = Math.floor(quest.rewards.xp * multiplier);

    // Update user progress
    let userProgress = this.userProgress.get(userId);
    if (!userProgress) {
      userProgress = {
        userId,
        totalQuestsCompleted: 0,
        totalCoinsEarned: 0,
        totalXP: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        badges: [],
        questHistory: [],
      };
      this.userProgress.set(userId, userProgress);
    }

    userProgress.totalQuestsCompleted++;
    userProgress.totalCoinsEarned += coinsEarned;
    userProgress.totalXP += xpEarned;
    userProgress.currentStreak++;
    userProgress.longestStreak = Math.max(userProgress.longestStreak, userProgress.currentStreak);
    userProgress.badges.push(...quest.rewards.badges);
    userProgress.level = Math.floor(userProgress.totalXP / 1000) + 1;

    userProgress.questHistory.push({
      questId,
      completedAt: new Date(),
      coinsEarned,
      xpEarned,
      multiplierApplied: multiplier,
    });

    this.logQuestActivity(userId, `Completed quest: ${quest.title} (+${coinsEarned} coins, +${xpEarned} XP)`);
  }

  /**
   * Claim quest rewards
   */
  claimRewards(userId: string, questId: string): QuestCompletion {
    const quest = this.quests.get(questId);
    if (!quest || quest.status !== "completed") throw new Error("Quest not completed");

    quest.status = "claimed";

    const userProgress = this.userProgress.get(userId);
    if (!userProgress) throw new Error("User progress not found");

    const completion = userProgress.questHistory.find((q) => q.questId === questId);
    if (!completion) throw new Error("Quest completion not found");

    this.logQuestActivity(userId, `Claimed rewards for: ${quest.title}`);

    return completion;
  }

  /**
   * Generate daily challenge
   */
  generateDailyChallenge(): DailyChallenge {
    const today = new Date().toDateString();
    const existingChallenge = this.dailyChallenges.get(today);

    if (existingChallenge) return existingChallenge;

    // Select 5 random quests for daily challenge
    const allQuests = Array.from(this.quests.values());
    const selectedQuests = allQuests.sort(() => Math.random() - 0.5).slice(0, 5);

    const totalReward = selectedQuests.reduce((sum, q) => sum + q.rewards.skycoin, 0);
    const bonusMultiplier = 1.5; // 50% bonus for completing all daily quests

    const challenge: DailyChallenge = {
      id: `daily-${today}`,
      date: new Date(),
      quests: selectedQuests,
      totalReward,
      bonusMultiplier,
    };

    this.dailyChallenges.set(today, challenge);
    return challenge;
  }

  /**
   * Get user progress
   */
  getUserProgress(userId: string): UserQuestProgress | null {
    return this.userProgress.get(userId) || null;
  }

  /**
   * Get quest by ID
   */
  getQuest(questId: string): Quest | null {
    return this.quests.get(questId) || null;
  }

  /**
   * Get all quests
   */
  getAllQuests(): Quest[] {
    return Array.from(this.quests.values());
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(limit: number = 10): any[] {
    return Array.from(this.userProgress.values())
      .sort((a, b) => b.totalCoinsEarned - a.totalCoinsEarned)
      .slice(0, limit)
      .map((p) => ({
        userId: p.userId,
        coinsEarned: p.totalCoinsEarned,
        questsCompleted: p.totalQuestsCompleted,
        level: p.level,
        streak: p.currentStreak,
      }));
  }

  /**
   * Private: Log quest activity
   */
  private logQuestActivity(userId: string, action: string): void {
    this.questLog.push({
      timestamp: new Date(),
      userId,
      action,
    });
  }

  /**
   * Get quest statistics
   */
  getStats() {
    return {
      totalQuests: this.quests.size,
      totalUsers: this.userProgress.size,
      totalCoinsDistributed: Array.from(this.userProgress.values()).reduce((sum, p) => sum + p.totalCoinsEarned, 0),
      totalXPDistributed: Array.from(this.userProgress.values()).reduce((sum, p) => sum + p.totalXP, 0),
      avgQuestsPerUser: this.userProgress.size > 0 ? Array.from(this.userProgress.values()).reduce((sum, p) => sum + p.totalQuestsCompleted, 0) / this.userProgress.size : 0,
    };
  }
}

// Singleton instance
export const smartQuestEngine = new SmartQuestEngine();
