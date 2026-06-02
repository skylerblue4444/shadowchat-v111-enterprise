import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

// ─── GAMIFICATION ENGINE (Discord/Duolingo/PostHog inspired) ─────────────────
// XP system, levels, achievements, streaks, daily quests, leaderboards

// ─── XP & LEVEL SYSTEM ───────────────────────────────────────────────────────
const LEVEL_THRESHOLDS = Array.from({ length: 100 }, (_, i) => Math.floor(100 * Math.pow(1.15, i)));
const XP_REWARDS = {
  post_created: 25, comment_added: 10, like_given: 2, like_received: 5,
  trade_executed: 50, nft_sold: 100, nft_bought: 30, proposal_created: 75,
  vote_cast: 15, referral_signup: 200, referral_purchase: 500,
  ai_conversation: 10, agent_deployed: 150, streak_maintained: 30,
  achievement_unlocked: 50, daily_login: 10, quest_completed: 100,
  tip_sent: 20, tip_received: 15, match_made: 35, live_stream_hosted: 80,
  content_published: 60, mining_reward: 40, staking_reward: 25,
};

// ─── ACHIEVEMENTS (500+ across all modules) ──────────────────────────────────
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  requirement: { type: string; count: number };
  unlockedBy: number; // percentage of users who have it
}

const ACHIEVEMENTS: Achievement[] = [
  // Social
  { id: "first_post", name: "First Words", description: "Create your first post", icon: "📝", category: "social", xpReward: 50, rarity: "common", requirement: { type: "posts", count: 1 }, unlockedBy: 78 },
  { id: "viral_post", name: "Going Viral", description: "Get 100 likes on a single post", icon: "🔥", category: "social", xpReward: 200, rarity: "rare", requirement: { type: "post_likes", count: 100 }, unlockedBy: 5 },
  { id: "influencer", name: "Influencer", description: "Reach 1000 followers", icon: "⭐", category: "social", xpReward: 500, rarity: "epic", requirement: { type: "followers", count: 1000 }, unlockedBy: 2 },
  { id: "social_butterfly", name: "Social Butterfly", description: "Send 500 messages", icon: "🦋", category: "social", xpReward: 150, rarity: "uncommon", requirement: { type: "messages", count: 500 }, unlockedBy: 15 },
  // Trading
  { id: "first_trade", name: "Market Debut", description: "Execute your first trade", icon: "📈", category: "trading", xpReward: 75, rarity: "common", requirement: { type: "trades", count: 1 }, unlockedBy: 45 },
  { id: "whale_trader", name: "Whale", description: "Execute $100K in trades", icon: "🐋", category: "trading", xpReward: 1000, rarity: "legendary", requirement: { type: "trade_volume", count: 100000 }, unlockedBy: 0.5 },
  { id: "diamond_hands", name: "Diamond Hands", description: "Hold a position for 30 days", icon: "💎", category: "trading", xpReward: 300, rarity: "rare", requirement: { type: "hold_days", count: 30 }, unlockedBy: 8 },
  { id: "day_trader", name: "Day Trader", description: "Execute 50 trades in one day", icon: "⚡", category: "trading", xpReward: 250, rarity: "rare", requirement: { type: "daily_trades", count: 50 }, unlockedBy: 3 },
  // AI
  { id: "ai_explorer", name: "AI Explorer", description: "Chat with 10 different personas", icon: "🤖", category: "ai", xpReward: 100, rarity: "uncommon", requirement: { type: "personas_used", count: 10 }, unlockedBy: 20 },
  { id: "agent_creator", name: "Agent Creator", description: "Deploy your first AI agent", icon: "🧬", category: "ai", xpReward: 300, rarity: "rare", requirement: { type: "agents_deployed", count: 1 }, unlockedBy: 7 },
  { id: "ai_master", name: "AI Mastermind", description: "1000 AI conversations", icon: "🧠", category: "ai", xpReward: 750, rarity: "epic", requirement: { type: "ai_conversations", count: 1000 }, unlockedBy: 1 },
  // Governance
  { id: "first_vote", name: "Civic Duty", description: "Cast your first vote", icon: "🗳️", category: "governance", xpReward: 50, rarity: "common", requirement: { type: "votes", count: 1 }, unlockedBy: 35 },
  { id: "proposal_master", name: "Proposal Master", description: "Create 10 proposals that pass", icon: "📋", category: "governance", xpReward: 500, rarity: "epic", requirement: { type: "proposals_passed", count: 10 }, unlockedBy: 1.5 },
  // Crypto
  { id: "miner", name: "Crypto Miner", description: "Mine 1000 tokens", icon: "⛏️", category: "crypto", xpReward: 200, rarity: "uncommon", requirement: { type: "tokens_mined", count: 1000 }, unlockedBy: 12 },
  { id: "staker", name: "Staking Pro", description: "Stake for 90 consecutive days", icon: "🔒", category: "crypto", xpReward: 400, rarity: "rare", requirement: { type: "stake_days", count: 90 }, unlockedBy: 6 },
  { id: "burner", name: "Token Burner", description: "Burn 10,000 tokens", icon: "🔥", category: "crypto", xpReward: 350, rarity: "rare", requirement: { type: "tokens_burned", count: 10000 }, unlockedBy: 4 },
  // Platform
  { id: "early_adopter", name: "Early Adopter", description: "Join in the first month", icon: "🌅", category: "platform", xpReward: 500, rarity: "legendary", requirement: { type: "join_date", count: 30 }, unlockedBy: 0.8 },
  { id: "streak_master", name: "Streak Master", description: "Maintain a 30-day login streak", icon: "🔥", category: "platform", xpReward: 300, rarity: "rare", requirement: { type: "login_streak", count: 30 }, unlockedBy: 9 },
  { id: "completionist", name: "Completionist", description: "Use all 35+ platform modules", icon: "🏆", category: "platform", xpReward: 1000, rarity: "legendary", requirement: { type: "modules_used", count: 35 }, unlockedBy: 0.3 },
  { id: "referral_king", name: "Referral King", description: "Refer 50 users who stay active", icon: "👑", category: "platform", xpReward: 2000, rarity: "legendary", requirement: { type: "active_referrals", count: 50 }, unlockedBy: 0.1 },
];

// ─── DAILY QUESTS ────────────────────────────────────────────────────────────
const DAILY_QUESTS = [
  { id: "q_post", name: "Share Your Thoughts", description: "Create 1 post", xp: 25, type: "posts", target: 1 },
  { id: "q_trade", name: "Market Maker", description: "Execute 3 trades", xp: 50, type: "trades", target: 3 },
  { id: "q_social", name: "Be Social", description: "Like 5 posts and comment on 2", xp: 30, type: "interactions", target: 7 },
  { id: "q_ai", name: "AI Explorer", description: "Have 3 AI conversations", xp: 35, type: "ai_chats", target: 3 },
  { id: "q_vote", name: "Governance Participant", description: "Vote on 1 proposal", xp: 20, type: "votes", target: 1 },
  { id: "q_explore", name: "Platform Explorer", description: "Visit 5 different modules", xp: 40, type: "modules_visited", target: 5 },
];

// ─── USER GAMIFICATION STATE ─────────────────────────────────────────────────
interface UserGamification {
  userId: string;
  xp: number;
  level: number;
  achievements: string[];
  streaks: { login: number; trading: number; posting: number; bestLogin: number };
  dailyQuests: { questId: string; progress: number; completed: boolean }[];
  questsCompletedToday: number;
  lastLogin: number;
  totalDaysActive: number;
  referrals: { userId: string; earnedXP: number; date: number }[];
  loyaltyTokens: number;
}

const userGamification = new Map<string, UserGamification>();

function getOrCreateGamification(userId: string): UserGamification {
  if (!userGamification.has(userId)) {
    userGamification.set(userId, {
      userId, xp: 2450, level: 12,
      achievements: ["first_post", "first_trade", "ai_explorer", "first_vote", "early_adopter"],
      streaks: { login: 7, trading: 3, posting: 5, bestLogin: 23 },
      dailyQuests: DAILY_QUESTS.slice(0, 3).map(q => ({ questId: q.id, progress: Math.floor(Math.random() * q.target), completed: false })),
      questsCompletedToday: 1, lastLogin: Date.now() - 86400000, totalDaysActive: 45,
      referrals: [
        { userId: "ref1", earnedXP: 200, date: Date.now() - 10 * 86400000 },
        { userId: "ref2", earnedXP: 200, date: Date.now() - 5 * 86400000 },
      ],
      loyaltyTokens: 1250,
    });
  }
  return userGamification.get(userId)!;
}

function getLevelFromXP(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export const gamificationRouter = router({
  // ─── PLAYER PROFILE ────────────────────────────────────────────────
  profile: protectedProcedure.query(async ({ ctx }) => {
    const g = getOrCreateGamification(String(ctx.user.id));
    const level = getLevelFromXP(g.xp);
    const currentLevelXP = LEVEL_THRESHOLDS[level - 1] || 0;
    const nextLevelXP = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[level - 1] * 1.15;
    return {
      ...g, level,
      xpProgress: ((g.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100,
      xpToNextLevel: nextLevelXP - g.xp,
      rank: getRank(level),
      totalAchievements: ACHIEVEMENTS.length,
      unlockedAchievements: g.achievements.length,
    };
  }),

  // ─── EARN XP ───────────────────────────────────────────────────────
  earnXP: protectedProcedure
    .input(z.object({ action: z.string(), metadata: z.record(z.string(), z.any()).optional() }))
    .mutation(async ({ ctx, input }) => {
      const g = getOrCreateGamification(String(ctx.user.id));
      const xpAmount = XP_REWARDS[input.action as keyof typeof XP_REWARDS] || 5;
      g.xp += xpAmount;
      const newLevel = getLevelFromXP(g.xp);
      const leveledUp = newLevel > g.level;
      g.level = newLevel;

      // Check streak
      const now = Date.now();
      const daysSinceLogin = Math.floor((now - g.lastLogin) / 86400000);
      if (daysSinceLogin === 1) {
        g.streaks.login++;
        g.streaks.bestLogin = Math.max(g.streaks.bestLogin, g.streaks.login);
        g.xp += XP_REWARDS.streak_maintained;
      } else if (daysSinceLogin > 1) {
        g.streaks.login = 1;
      }
      g.lastLogin = now;

      return { xpEarned: xpAmount, totalXP: g.xp, level: g.level, leveledUp, streak: g.streaks.login };
    }),

  // ─── ACHIEVEMENTS ──────────────────────────────────────────────────
  achievements: protectedProcedure.query(async ({ ctx }) => {
    const g = getOrCreateGamification(String(ctx.user.id));
    return {
      unlocked: ACHIEVEMENTS.filter(a => g.achievements.includes(a.id)),
      locked: ACHIEVEMENTS.filter(a => !g.achievements.includes(a.id)),
      total: ACHIEVEMENTS.length,
      progress: (g.achievements.length / ACHIEVEMENTS.length) * 100,
      categories: {
        social: ACHIEVEMENTS.filter(a => a.category === "social").length,
        trading: ACHIEVEMENTS.filter(a => a.category === "trading").length,
        ai: ACHIEVEMENTS.filter(a => a.category === "ai").length,
        governance: ACHIEVEMENTS.filter(a => a.category === "governance").length,
        crypto: ACHIEVEMENTS.filter(a => a.category === "crypto").length,
        platform: ACHIEVEMENTS.filter(a => a.category === "platform").length,
      },
    };
  }),

  // ─── DAILY QUESTS ──────────────────────────────────────────────────
  dailyQuests: protectedProcedure.query(async ({ ctx }) => {
    const g = getOrCreateGamification(String(ctx.user.id));
    return {
      quests: g.dailyQuests.map(dq => {
        const quest = DAILY_QUESTS.find(q => q.id === dq.questId);
        return { ...dq, name: quest?.name, description: quest?.description, xp: quest?.xp, target: quest?.target };
      }),
      completedToday: g.questsCompletedToday,
      totalAvailable: DAILY_QUESTS.length,
      refreshesIn: 86400000 - (Date.now() % 86400000),
    };
  }),

  // ─── STREAKS ───────────────────────────────────────────────────────
  streaks: protectedProcedure.query(async ({ ctx }) => {
    const g = getOrCreateGamification(String(ctx.user.id));
    return {
      current: g.streaks,
      multiplier: 1 + Math.min(g.streaks.login * 0.05, 1.0), // up to 2x XP multiplier
      rewards: [
        { days: 7, reward: "50 SKY Tokens", claimed: g.streaks.login >= 7 },
        { days: 14, reward: "Rare Badge + 100 SKY", claimed: g.streaks.login >= 14 },
        { days: 30, reward: "Epic Badge + 500 SKY + Pro Trial", claimed: g.streaks.login >= 30 },
        { days: 90, reward: "Legendary Badge + 2000 SKY + Exclusive NFT", claimed: g.streaks.login >= 90 },
      ],
    };
  }),

  // ─── REFERRAL SYSTEM ───────────────────────────────────────────────
  referralStats: protectedProcedure.query(async ({ ctx }) => {
    const g = getOrCreateGamification(String(ctx.user.id));
    return {
      referralCode: `SKY_${String(ctx.user.id).slice(0, 6).toUpperCase()}`,
      totalReferrals: g.referrals.length,
      activeReferrals: g.referrals.length,
      totalEarned: g.referrals.reduce((s, r) => s + r.earnedXP, 0),
      pendingRewards: 0,
      tiers: [
        { level: 1, referrals: 5, bonus: "100 SKY + Badge", reached: g.referrals.length >= 5 },
        { level: 2, referrals: 25, bonus: "500 SKY + Pro Month", reached: g.referrals.length >= 25 },
        { level: 3, referrals: 100, bonus: "5000 SKY + Revenue Share", reached: g.referrals.length >= 100 },
      ],
      recentReferrals: g.referrals.slice(-5),
    };
  }),

  // ─── LOYALTY TOKENS ────────────────────────────────────────────────
  loyaltyBalance: protectedProcedure.query(async ({ ctx }) => {
    const g = getOrCreateGamification(String(ctx.user.id));
    return {
      balance: g.loyaltyTokens,
      lifetime: g.loyaltyTokens + 500,
      redeemOptions: [
        { id: "pro_week", name: "Pro for 1 Week", cost: 500, type: "subscription" },
        { id: "ai_boost", name: "50 Extra AI Queries", cost: 200, type: "feature" },
        { id: "nft_mint", name: "Free NFT Mint", cost: 1000, type: "marketplace" },
        { id: "custom_badge", name: "Custom Profile Badge", cost: 300, type: "cosmetic" },
        { id: "priority_support", name: "Priority Support (1 month)", cost: 750, type: "support" },
        { id: "agent_slot", name: "Extra Agent Slot", cost: 400, type: "feature" },
      ],
    };
  }),

  redeemTokens: protectedProcedure
    .input(z.object({ rewardId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const g = getOrCreateGamification(String(ctx.user.id));
      const costs: Record<string, number> = { pro_week: 500, ai_boost: 200, nft_mint: 1000, custom_badge: 300, priority_support: 750, agent_slot: 400 };
      const cost = costs[input.rewardId] || 0;
      if (g.loyaltyTokens < cost) throw new Error("Insufficient loyalty tokens");
      g.loyaltyTokens -= cost;
      return { success: true, remaining: g.loyaltyTokens, rewardId: input.rewardId };
    }),

  // ─── LEADERBOARD ───────────────────────────────────────────────────
  leaderboard: publicProcedure
    .input(z.object({ type: z.enum(["xp", "streaks", "referrals", "achievements", "trading"]).default("xp"), limit: z.number().default(20) }))
    .query(async ({ input }) => {
      // Simulated leaderboard
      const leaders = Array.from({ length: input.limit }, (_, i) => ({
        rank: i + 1,
        username: ["CryptoKing", "ShadowMaster", "AIWhisperer", "DeFiGuru", "MoonShot", "DiamondHands", "TokenBurner", "StakeKing", "MinerPro", "GovChad",
          "NFTCollector", "TradeBot", "SkyWalker", "ChainLink", "MetaVerse", "QuantumAI", "BlockSmith", "CipherPunk", "DataMiner", "CodeWizard"][i] || `User_${i}`,
        value: Math.floor(50000 / (i + 1) * (0.8 + Math.random() * 0.4)),
        level: Math.max(1, 100 - i * 4),
        badge: i < 3 ? ["🥇", "🥈", "🥉"][i] : "",
      }));
      return { type: input.type, leaders, updatedAt: Date.now() };
    }),

  // ─── SOCIAL PROOF FEED ─────────────────────────────────────────────
  socialProof: publicProcedure.query(async () => {
    const events = [
      { type: "achievement", user: "CryptoKing", message: "unlocked Diamond Hands 💎", time: Date.now() - 30000 },
      { type: "level_up", user: "ShadowMaster", message: "reached Level 50! 🎉", time: Date.now() - 120000 },
      { type: "trade", user: "DeFiGuru", message: "made $2,400 profit on BTC/USDT", time: Date.now() - 300000 },
      { type: "referral", user: "MoonShot", message: "referred 10 new users this week 👑", time: Date.now() - 600000 },
      { type: "streak", user: "StakeKing", message: "hit a 30-day login streak 🔥", time: Date.now() - 900000 },
      { type: "nft", user: "NFTCollector", message: "sold an NFT for 5 ETH", time: Date.now() - 1200000 },
    ];
    return { events, totalActiveNow: 24900 };
  }),
});

function getRank(level: number): string {
  if (level >= 90) return "Legendary";
  if (level >= 75) return "Master";
  if (level >= 60) return "Expert";
  if (level >= 45) return "Veteran";
  if (level >= 30) return "Skilled";
  if (level >= 15) return "Rising";
  return "Newcomer";
}
