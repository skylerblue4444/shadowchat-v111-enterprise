/**
 * ShadowChat v1111 - Profit-Share Engine
 * Community Revenue Sharing, Referral Bonuses, Platform Profitability
 */

export interface ProfitShare {
  id: string;
  period: string; // YYYY-MM
  totalPlatformRevenue: number;
  totalDistributed: number;
  sharePercentage: number; // % of revenue shared with community
  participantCount: number;
  avgSharePerUser: number;
}

export interface UserProfitShare {
  userId: string;
  totalEarned: number;
  referralBonuses: number;
  platformShare: number;
  loyaltyBonus: number;
  achievements: ProfitShareAchievement[];
  claimedAt: Date[];
}

export interface ProfitShareAchievement {
  type: "referral_milestone" | "loyalty_bonus" | "platform_share" | "engagement_reward";
  amount: number;
  earnedAt: Date;
  description: string;
}

export interface ReferralNetwork {
  userId: string;
  referrals: string[];
  directBonuses: number;
  indirectBonuses: number;
  networkValue: number;
}

export interface LoyaltyTier {
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  minMonthsActive: number;
  bonusMultiplier: number;
  benefits: string[];
}

// Profit-Share Engine
export class ProfitShareEngine {
  private profitShares: Map<string, ProfitShare> = new Map();
  private userShares: Map<string, UserProfitShare> = new Map();
  private referralNetworks: Map<string, ReferralNetwork> = new Map();
  private loyaltyTiers: Map<string, LoyaltyTier> = new Map();
  private platformMetrics = {
    monthlyRevenue: 50000, // $50k/month baseline
    revenueGrowth: 1.15, // 15% monthly growth
    communitySharePercentage: 30, // 30% to community
  };

  constructor() {
    this.initializeLoyaltyTiers();
    this.generateMonthlyProfitShare();
  }

  /**
   * Initialize loyalty tiers
   */
  private initializeLoyaltyTiers(): void {
    const tiers: LoyaltyTier[] = [
      {
        tier: "bronze",
        minMonthsActive: 0,
        bonusMultiplier: 1.0,
        benefits: ["Basic profit share", "1% referral bonus"],
      },
      {
        tier: "silver",
        minMonthsActive: 3,
        bonusMultiplier: 1.2,
        benefits: ["Enhanced profit share", "3% referral bonus", "Monthly bonus"],
      },
      {
        tier: "gold",
        minMonthsActive: 6,
        bonusMultiplier: 1.5,
        benefits: ["Premium profit share", "5% referral bonus", "Weekly bonus", "Exclusive NFT"],
      },
      {
        tier: "platinum",
        minMonthsActive: 12,
        bonusMultiplier: 2.0,
        benefits: ["VIP profit share", "10% referral bonus", "Daily bonus", "Exclusive events"],
      },
      {
        tier: "diamond",
        minMonthsActive: 24,
        bonusMultiplier: 3.0,
        benefits: ["Maximum profit share", "20% referral bonus", "Hourly bonus", "Lifetime rewards"],
      },
    ];

    tiers.forEach((tier) => {
      this.loyaltyTiers.set(tier.tier, tier);
    });
  }

  /**
   * Generate monthly profit share
   */
  generateMonthlyProfitShare(): ProfitShare {
    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const existingShare = this.profitShares.get(period);
    if (existingShare) return existingShare;

    const totalRevenue = this.platformMetrics.monthlyRevenue * Math.pow(this.platformMetrics.revenueGrowth, this.profitShares.size);
    const totalDistributed = totalRevenue * (this.platformMetrics.communitySharePercentage / 100);
    const participantCount = Math.max(100, this.userShares.size);
    const avgShare = totalDistributed / participantCount;

    const share: ProfitShare = {
      id: `share-${period}`,
      period,
      totalPlatformRevenue: totalRevenue,
      totalDistributed,
      sharePercentage: this.platformMetrics.communitySharePercentage,
      participantCount,
      avgSharePerUser: avgShare,
    };

    this.profitShares.set(period, share);
    return share;
  }

  /**
   * Add referral
   */
  addReferral(referrerId: string, referredUserId: string): ReferralNetwork {
    let network = this.referralNetworks.get(referrerId);

    if (!network) {
      network = {
        userId: referrerId,
        referrals: [],
        directBonuses: 0,
        indirectBonuses: 0,
        networkValue: 0,
      };
      this.referralNetworks.set(referrerId, network);
    }

    network.referrals.push(referredUserId);

    // Award referral bonus
    const bonusAmount = 100; // 100 Skycoin per referral
    const directBonus = bonusAmount;

    network.directBonuses += directBonus;
    network.networkValue += directBonus;

    // Update referrer's profit share
    let referrerShare = this.userShares.get(referrerId);
    if (!referrerShare) {
      referrerShare = {
        userId: referrerId,
        totalEarned: 0,
        referralBonuses: 0,
        platformShare: 0,
        loyaltyBonus: 0,
        achievements: [],
        claimedAt: [],
      };
      this.userShares.set(referrerId, referrerShare);
    }

    referrerShare.referralBonuses += directBonus;
    referrerShare.totalEarned += directBonus;

    referrerShare.achievements.push({
      type: "referral_milestone",
      amount: directBonus,
      earnedAt: new Date(),
      description: `Referred ${referredUserId}`,
    });

    return network;
  }

  /**
   * Distribute monthly profit share
   */
  distributeProfitShare(): Map<string, number> {
    const currentShare = this.generateMonthlyProfitShare();
    const distribution = new Map<string, number>();

    // Distribute to all active users
    this.userShares.forEach((userShare, userId) => {
      const loyaltyTier = this.getUserLoyaltyTier(userId);
      const multiplier = loyaltyTier?.bonusMultiplier || 1.0;

      const userDistribution = (currentShare.avgSharePerUser * multiplier * (1 + userShare.referralBonuses / 1000)) | 0;

      userShare.platformShare += userDistribution;
      userShare.totalEarned += userDistribution;

      userShare.achievements.push({
        type: "platform_share",
        amount: userDistribution,
        earnedAt: new Date(),
        description: `Monthly profit share (${currentShare.period})`,
      });

      distribution.set(userId, userDistribution);
    });

    return distribution;
  }

  /**
   * Get user loyalty tier
   */
  getUserLoyaltyTier(userId: string): LoyaltyTier | null {
    const userShare = this.userShares.get(userId);
    if (!userShare) return null;

    const monthsActive = userShare.claimedAt.length;

    // Find highest tier user qualifies for
    let highestTier: LoyaltyTier | null = null;
    this.loyaltyTiers.forEach((tier) => {
      if (monthsActive >= tier.minMonthsActive) {
        if (!highestTier || tier.minMonthsActive > highestTier.minMonthsActive) {
          highestTier = tier;
        }
      }
    });

    return highestTier;
  }

  /**
   * Claim profit share
   */
  claimProfitShare(userId: string): UserProfitShare {
    let userShare = this.userShares.get(userId);

    if (!userShare) {
      userShare = {
        userId,
        totalEarned: 0,
        referralBonuses: 0,
        platformShare: 0,
        loyaltyBonus: 0,
        achievements: [],
        claimedAt: [],
      };
      this.userShares.set(userId, userShare);
    }

    userShare.claimedAt.push(new Date());

    return userShare;
  }

  /**
   * Get user profit share info
   */
  getUserProfitShare(userId: string): UserProfitShare | null {
    return this.userShares.get(userId) || null;
  }

  /**
   * Get referral network
   */
  getReferralNetwork(userId: string): ReferralNetwork | null {
    return this.referralNetworks.get(userId) || null;
  }

  /**
   * Get top earners
   */
  getTopEarners(limit: number = 10): any[] {
    return Array.from(this.userShares.values())
      .sort((a, b) => b.totalEarned - a.totalEarned)
      .slice(0, limit)
      .map((share) => ({
        userId: share.userId,
        totalEarned: share.totalEarned,
        referralBonuses: share.referralBonuses,
        platformShare: share.platformShare,
        tier: this.getUserLoyaltyTier(share.userId)?.tier || "bronze",
      }));
  }

  /**
   * Get platform statistics
   */
  getPlatformStats() {
    const currentShare = this.generateMonthlyProfitShare();

    return {
      currentPeriod: currentShare.period,
      monthlyRevenue: currentShare.totalPlatformRevenue.toFixed(2),
      communityShare: currentShare.totalDistributed.toFixed(2),
      sharePercentage: currentShare.sharePercentage,
      activeUsers: this.userShares.size,
      totalDistributed: Array.from(this.userShares.values()).reduce((sum, s) => sum + s.totalEarned, 0),
      avgEarningsPerUser: (Array.from(this.userShares.values()).reduce((sum, s) => sum + s.totalEarned, 0) / Math.max(1, this.userShares.size)).toFixed(2),
      referralNetworks: this.referralNetworks.size,
    };
  }

  /**
   * Get loyalty tiers
   */
  getLoyaltyTiers(): LoyaltyTier[] {
    return Array.from(this.loyaltyTiers.values());
  }
}

// Singleton instance
export const profitShareEngine = new ProfitShareEngine();
