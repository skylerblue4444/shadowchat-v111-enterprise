/**
 * ShadowChat v1111 - Advanced Profile & Identity System
 * Reputation, Achievements, Identity Verification, Social Proof
 */

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  coverImageUrl: string;
  status: "online" | "away" | "busy" | "offline";
  reputation: ReputationScore;
  identity: IdentityVerification;
  socialProof: SocialProof;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReputationScore {
  total: number; // 0-1000
  categories: {
    trust: number;
    contribution: number;
    reliability: number;
    skill: number;
  };
  rank: string;
  level: number;
}

export interface IdentityVerification {
  isVerified: boolean;
  methods: string[];
  verifiedAt?: Date;
  trustScore: number;
  kycLevel: number;
}

export interface SocialProof {
  followers: number;
  following: number;
  achievements: Achievement[];
  badges: string[];
  endorsements: Endorsement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt: Date;
}

export interface Endorsement {
  fromUserId: string;
  skill: string;
  timestamp: Date;
}

export interface UserPreferences {
  theme: "dark" | "light" | "system";
  privacy: "public" | "private" | "restricted";
  notifications: boolean;
  language: string;
}

// Profile & Identity System
export class ProfileIdentitySystem {
  private profiles: Map<string, UserProfile> = new Map();
  private reputationLog: any[] = [];

  /**
   * Create or update profile
   */
  updateProfile(userId: string, updates: Partial<UserProfile>): UserProfile {
    const current = this.profiles.get(userId) || this.createInitialProfile(userId);
    const updated = { ...current, ...updates, updatedAt: new Date() };
    this.profiles.set(userId, updated);
    return updated;
  }

  /**
   * Create initial profile
   */
  private createInitialProfile(userId: string): UserProfile {
    return {
      id: userId,
      username: `user_${userId.substr(0, 5)}`,
      displayName: "New User",
      bio: "Welcome to ShadowChat v1111",
      avatarUrl: "",
      coverImageUrl: "",
      status: "offline",
      reputation: {
        total: 100,
        categories: { trust: 25, contribution: 25, reliability: 25, skill: 25 },
        rank: "Novice",
        level: 1,
      },
      identity: { isVerified: false, methods: [], trustScore: 10, kycLevel: 0 },
      socialProof: { followers: 0, following: 0, achievements: [], badges: [], endorsements: [] },
      preferences: { theme: "dark", privacy: "public", notifications: true, language: "en" },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Update reputation score
   */
  updateReputation(userId: string, category: keyof ReputationScore["categories"], points: number): ReputationScore {
    const profile = this.profiles.get(userId);
    if (!profile) throw new Error("Profile not found");

    profile.reputation.categories[category] += points;
    profile.reputation.total = Object.values(profile.reputation.categories).reduce((a, b) => a + b, 0);

    // Update rank and level
    profile.reputation.level = Math.floor(profile.reputation.total / 100) + 1;
    profile.reputation.rank = this.calculateRank(profile.reputation.total);

    this.reputationLog.push({ userId, category, points, timestamp: new Date() });
    return profile.reputation;
  }

  /**
   * Calculate rank based on score
   */
  private calculateRank(score: number): string {
    if (score >= 900) return "Grandmaster";
    if (score >= 750) return "Master";
    if (score >= 500) return "Expert";
    if (score >= 250) return "Adept";
    if (score >= 100) return "Novice";
    return "Newcomer";
  }

  /**
   * Unlock achievement
   */
  unlockAchievement(userId: string, achievement: Omit<Achievement, "unlockedAt">): Achievement {
    const profile = this.profiles.get(userId);
    if (!profile) throw new Error("Profile not found");

    const newAchievement: Achievement = { ...achievement, unlockedAt: new Date() };
    profile.socialProof.achievements.push(newAchievement);
    
    // Boost reputation for achievement
    this.updateReputation(userId, "contribution", 50);

    return newAchievement;
  }

  /**
   * Endorse a user
   */
  endorseUser(fromUserId: string, toUserId: string, skill: string): void {
    const toProfile = this.profiles.get(toUserId);
    if (!toProfile) throw new Error("Target profile not found");

    toProfile.socialProof.endorsements.push({ fromUserId, skill, timestamp: new Date() });
    this.updateReputation(toUserId, "trust", 10);
  }

  /**
   * Get profile
   */
  getProfile(userId: string): UserProfile | null {
    return this.profiles.get(userId) || null;
  }

  /**
   * Get reputation history
   */
  getReputationHistory(userId: string, limit: number = 20): any[] {
    return this.reputationLog.filter((l) => l.userId === userId).slice(-limit);
  }

  /**
   * Get top ranked users
   */
  getTopRanked(limit: number = 10): UserProfile[] {
    return Array.from(this.profiles.values())
      .sort((a, b) => b.reputation.total - a.reputation.total)
      .slice(0, limit);
  }
}

// Singleton instance
export const profileIdentitySystem = new ProfileIdentitySystem();
