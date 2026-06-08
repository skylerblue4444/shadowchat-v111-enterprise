/**
 * ShadowChat v111 - Economic Engine
 * Gaming, Gambling, Shop, Earnings, Tips, Charity & Profit Models
 */

export interface UserBalance {
  userId: string;
  coins: number;
  credits: number;
  gems: number;
  totalEarned: number;
  totalSpent: number;
  totalTipped: number;
  totalCharityDonated: number;
  lastUpdated: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "earn" | "spend" | "tip" | "charity" | "gamble" | "shop";
  amount: number;
  currency: "coins" | "credits" | "gems";
  description: string;
  metadata: any;
  timestamp: Date;
}

export interface GameResult {
  gameId: string;
  userId: string;
  game: string;
  wager: number;
  result: "win" | "loss" | "draw";
  payout: number;
  multiplier: number;
  timestamp: Date;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: "coins" | "credits" | "gems";
  category: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  icon: string;
  stock: number;
  sales: number;
}

export interface CharityModel {
  id: string;
  name: string;
  description: string;
  goal: number;
  raised: number;
  beneficiary: string;
  endDate: Date;
  active: boolean;
}

// Economic Engine
export class EconomicEngine {
  private balances: Map<string, UserBalance> = new Map();
  private transactions: Transaction[] = [];
  private gameResults: GameResult[] = [];
  private shopItems: Map<string, ShopItem> = new Map();
  private charityModels: Map<string, CharityModel> = new Map();
  private houseEdge = 0.05; // 5% house edge for gambling

  /**
   * Initialize user balance
   */
  initializeUser(userId: string): UserBalance {
    const balance: UserBalance = {
      userId,
      coins: 1000, // Starting coins
      credits: 100, // Starting credits
      gems: 10, // Starting gems
      totalEarned: 1000,
      totalSpent: 0,
      totalTipped: 0,
      totalCharityDonated: 0,
      lastUpdated: new Date(),
    };

    this.balances.set(userId, balance);
    return balance;
  }

  /**
   * Get user balance
   */
  getBalance(userId: string): UserBalance | null {
    return this.balances.get(userId) || null;
  }

  /**
   * Earn coins (passive income, tasks, AI agent rewards)
   */
  async earnCoins(userId: string, amount: number, reason: string): Promise<Transaction> {
    const balance = this.balances.get(userId) || this.initializeUser(userId);
    balance.coins += amount;
    balance.totalEarned += amount;
    balance.lastUpdated = new Date();

    const transaction: Transaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: "earn",
      amount,
      currency: "coins",
      description: reason,
      metadata: { source: "app_activity" },
      timestamp: new Date(),
    };

    this.transactions.push(transaction);
    return transaction;
  }

  /**
   * Spend coins (in-app purchases)
   */
  async spendCoins(userId: string, amount: number, reason: string): Promise<Transaction> {
    const balance = this.balances.get(userId) || this.initializeUser(userId);

    if (balance.coins < amount) {
      throw new Error("Insufficient coins");
    }

    balance.coins -= amount;
    balance.totalSpent += amount;
    balance.lastUpdated = new Date();

    const transaction: Transaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: "spend",
      amount,
      currency: "coins",
      description: reason,
      metadata: { source: "in_app_purchase" },
      timestamp: new Date(),
    };

    this.transactions.push(transaction);
    return transaction;
  }

  /**
   * Send tip to another user
   */
  async sendTip(fromUserId: string, toUserId: string, amount: number): Promise<Transaction> {
    const fromBalance = this.balances.get(fromUserId) || this.initializeUser(fromUserId);
    const toBalance = this.balances.get(toUserId) || this.initializeUser(toUserId);

    if (fromBalance.coins < amount) {
      throw new Error("Insufficient coins for tip");
    }

    fromBalance.coins -= amount;
    fromBalance.totalTipped += amount;
    toBalance.coins += amount;
    toBalance.totalEarned += amount;

    const transaction: Transaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: fromUserId,
      type: "tip",
      amount,
      currency: "coins",
      description: `Tip to ${toUserId}`,
      metadata: { recipient: toUserId },
      timestamp: new Date(),
    };

    this.transactions.push(transaction);
    return transaction;
  }

  /**
   * Donate to charity
   */
  async donateToCharity(userId: string, charityId: string, amount: number): Promise<Transaction> {
    const balance = this.balances.get(userId) || this.initializeUser(userId);
    const charity = this.charityModels.get(charityId);

    if (!charity) throw new Error("Charity not found");
    if (balance.coins < amount) throw new Error("Insufficient coins");

    balance.coins -= amount;
    balance.totalCharityDonated += amount;
    charity.raised += amount;

    const transaction: Transaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: "charity",
      amount,
      currency: "coins",
      description: `Donation to ${charity.name}`,
      metadata: { charityId },
      timestamp: new Date(),
    };

    this.transactions.push(transaction);
    return transaction;
  }

  /**
   * Play gambling game (slots, dice, cards)
   */
  async playGame(
    userId: string,
    game: "slots" | "dice" | "cards" | "roulette",
    wager: number
  ): Promise<GameResult> {
    const balance = this.balances.get(userId) || this.initializeUser(userId);

    if (balance.coins < wager) {
      throw new Error("Insufficient coins for wager");
    }

    balance.coins -= wager;

    // Determine outcome based on game
    const { result, multiplier } = this.calculateGameOutcome(game);
    const payout = result === "win" ? wager * multiplier : 0;

    // Apply house edge
    const finalPayout = Math.floor(payout * (1 - this.houseEdge));
    balance.coins += finalPayout;

    const gameResult: GameResult = {
      gameId: `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      game,
      wager,
      result,
      payout: finalPayout,
      multiplier,
      timestamp: new Date(),
    };

    this.gameResults.push(gameResult);

    // Record transaction
    const transaction: Transaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: "gamble",
      amount: finalPayout - wager,
      currency: "coins",
      description: `${game} game ${result}`,
      metadata: { game, wager, result, multiplier },
      timestamp: new Date(),
    };

    this.transactions.push(transaction);
    return gameResult;
  }

  /**
   * Purchase shop item
   */
  async purchaseItem(userId: string, itemId: string): Promise<Transaction> {
    const balance = this.balances.get(userId) || this.initializeUser(userId);
    const item = this.shopItems.get(itemId);

    if (!item) throw new Error("Item not found");
    if (item.stock <= 0) throw new Error("Item out of stock");

    const currencyKey = item.currency as keyof UserBalance;
    if ((balance[currencyKey] as number) < item.price) {
      throw new Error(`Insufficient ${item.currency}`);
    }

    (balance[currencyKey] as number) -= item.price;
    balance.totalSpent += item.price;
    item.stock--;
    item.sales++;

    const transaction: Transaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: "shop",
      amount: item.price,
      currency: item.currency,
      description: `Purchased ${item.name}`,
      metadata: { itemId, itemName: item.name, rarity: item.rarity },
      timestamp: new Date(),
    };

    this.transactions.push(transaction);
    return transaction;
  }

  /**
   * Add shop item
   */
  addShopItem(item: ShopItem): void {
    this.shopItems.set(item.id, item);
  }

  /**
   * Get shop items
   */
  getShopItems(category?: string): ShopItem[] {
    const items = Array.from(this.shopItems.values());
    return category ? items.filter((i) => i.category === category) : items;
  }

  /**
   * Create charity campaign
   */
  createCharity(charity: CharityModel): void {
    this.charityModels.set(charity.id, charity);
  }

  /**
   * Get charities
   */
  getCharities(): CharityModel[] {
    return Array.from(this.charityModels.values());
  }

  /**
   * Get user transaction history
   */
  getTransactionHistory(userId: string, limit: number = 50): Transaction[] {
    return this.transactions
      .filter((t) => t.userId === userId)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get game statistics
   */
  getGameStats(userId: string) {
    const userGames = this.gameResults.filter((g) => g.userId === userId);
    const totalWagered = userGames.reduce((sum, g) => sum + g.wager, 0);
    const totalWon = userGames.reduce((sum, g) => sum + (g.result === "win" ? g.payout : 0), 0);
    const winRate = userGames.length > 0 ? userGames.filter((g) => g.result === "win").length / userGames.length : 0;

    return {
      gamesPlayed: userGames.length,
      totalWagered,
      totalWon,
      netProfit: totalWon - totalWagered,
      winRate: (winRate * 100).toFixed(2) + "%",
      games: userGames,
    };
  }

  /**
   * Get leaderboard
   */
  getLeaderboard(type: "earnings" | "tips" | "charity", limit: number = 10) {
    const balances = Array.from(this.balances.values());

    let sorted = balances;
    if (type === "earnings") {
      sorted = balances.sort((a, b) => b.totalEarned - a.totalEarned);
    } else if (type === "tips") {
      sorted = balances.sort((a, b) => b.totalTipped - a.totalTipped);
    } else if (type === "charity") {
      sorted = balances.sort((a, b) => b.totalCharityDonated - a.totalCharityDonated);
    }

    return sorted.slice(0, limit);
  }

  /**
   * Private: Calculate game outcome
   */
  private calculateGameOutcome(
    game: string
  ): { result: "win" | "loss" | "draw"; multiplier: number } {
    const rand = Math.random();

    switch (game) {
      case "slots":
        if (rand < 0.3) return { result: "win", multiplier: 2.5 };
        if (rand < 0.5) return { result: "win", multiplier: 1.5 };
        return { result: "loss", multiplier: 0 };

      case "dice":
        if (rand < 0.48) return { result: "win", multiplier: 2 };
        return { result: "loss", multiplier: 0 };

      case "cards":
        if (rand < 0.45) return { result: "win", multiplier: 2.2 };
        if (rand < 0.5) return { result: "draw", multiplier: 1 };
        return { result: "loss", multiplier: 0 };

      case "roulette":
        if (rand < 0.47) return { result: "win", multiplier: 2 };
        return { result: "loss", multiplier: 0 };

      default:
        return { result: "loss", multiplier: 0 };
    }
  }

  /**
   * Get engine statistics
   */
  getEngineStats() {
    const totalTransactions = this.transactions.length;
    const totalCoinsInCirculation = Array.from(this.balances.values()).reduce((sum, b) => sum + b.coins, 0);
    const totalCharityRaised = Array.from(this.charityModels.values()).reduce((sum, c) => sum + c.raised, 0);

    return {
      totalUsers: this.balances.size,
      totalTransactions,
      totalCoinsInCirculation,
      totalCharityRaised,
      avgCoinsPerUser: totalCoinsInCirculation / this.balances.size,
      shopItems: this.shopItems.size,
      charities: this.charityModels.size,
    };
  }
}

// Singleton instance
export const economicEngine = new EconomicEngine();
