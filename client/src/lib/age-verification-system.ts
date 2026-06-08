/**
 * ShadowChat v1111 - Advanced Age Verification & Content Restriction System
 * Multi-method verification, NSFW/Grey-Area content gating, Privacy-first approach
 */

export interface VerificationMethod {
  id: string;
  type: "government_id" | "credit_card" | "third_party" | "self_attestation" | "biometric";
  name: string;
  trustLevel: number; // 0-100
  privacyLevel: number; // 0-100 (higher = more private)
  verificationTime: number; // ms
  cost: number; // in cents
}

export interface VerificationChallenge {
  id: string;
  userId: string;
  method: VerificationMethod;
  status: "pending" | "completed" | "failed" | "expired";
  createdAt: Date;
  expiresAt: Date;
  result?: VerificationResult;
}

export interface VerificationResult {
  verified: boolean;
  age: number;
  confidence: number; // 0-100
  method: string;
  timestamp: Date;
  expiresAt: Date;
}

export interface ContentPolicy {
  id: string;
  rating: "general" | "teen" | "mature" | "nsfw" | "restricted";
  minAge: number;
  requiresVerification: boolean;
  verificationMethods: string[];
  description: string;
}

export interface UserContentAccess {
  userId: string;
  allowedRatings: string[];
  verifiedAge: number;
  verificationMethods: string[];
  lastVerified: Date;
  nextVerificationDue: Date;
}

// Age Verification System
export class AgeVerificationSystem {
  private verificationMethods: Map<string, VerificationMethod> = new Map();
  private verificationChallenges: Map<string, VerificationChallenge> = new Map();
  private contentPolicies: Map<string, ContentPolicy> = new Map();
  private userAccess: Map<string, UserContentAccess> = new Map();
  private verificationLog: any[] = [];

  constructor() {
    this.initializeVerificationMethods();
    this.initializeContentPolicies();
  }

  /**
   * Initialize verification methods
   */
  private initializeVerificationMethods(): void {
    const methods: VerificationMethod[] = [
      {
        id: "gov_id",
        type: "government_id",
        name: "Government ID Verification",
        trustLevel: 95,
        privacyLevel: 40,
        verificationTime: 300000, // 5 minutes
        cost: 0,
      },
      {
        id: "credit_card",
        type: "credit_card",
        name: "Credit Card Verification",
        trustLevel: 85,
        privacyLevel: 30,
        verificationTime: 30000, // 30 seconds
        cost: 0,
      },
      {
        id: "third_party",
        type: "third_party",
        name: "Third-Party Verification (Stripe, etc)",
        trustLevel: 80,
        privacyLevel: 50,
        verificationTime: 60000, // 1 minute
        cost: 50, // 50 cents
      },
      {
        id: "self_attestation",
        type: "self_attestation",
        name: "Self-Attestation (Privacy Mode)",
        trustLevel: 50,
        privacyLevel: 95,
        verificationTime: 10000, // 10 seconds
        cost: 0,
      },
      {
        id: "biometric",
        type: "biometric",
        name: "Biometric Verification",
        trustLevel: 90,
        privacyLevel: 70,
        verificationTime: 45000, // 45 seconds
        cost: 100, // $1.00
      },
    ];

    methods.forEach((method) => {
      this.verificationMethods.set(method.id, method);
    });
  }

  /**
   * Initialize content policies
   */
  private initializeContentPolicies(): void {
    const policies: ContentPolicy[] = [
      {
        id: "general",
        rating: "general",
        minAge: 0,
        requiresVerification: false,
        verificationMethods: [],
        description: "General audience content",
      },
      {
        id: "teen",
        rating: "teen",
        minAge: 13,
        requiresVerification: true,
        verificationMethods: ["self_attestation"],
        description: "Teen-appropriate content (13+)",
      },
      {
        id: "mature",
        rating: "mature",
        minAge: 17,
        requiresVerification: true,
        verificationMethods: ["self_attestation", "third_party"],
        description: "Mature content (17+)",
      },
      {
        id: "nsfw",
        rating: "nsfw",
        minAge: 18,
        requiresVerification: true,
        verificationMethods: ["credit_card", "third_party", "biometric", "gov_id"],
        description: "NSFW content (18+, strict verification)",
      },
      {
        id: "restricted",
        rating: "restricted",
        minAge: 18,
        requiresVerification: true,
        verificationMethods: ["gov_id", "biometric"],
        description: "Restricted/Grey-area content (18+, government ID required)",
      },
    ];

    policies.forEach((policy) => {
      this.contentPolicies.set(policy.id, policy);
    });
  }

  /**
   * Create verification challenge
   */
  createChallenge(userId: string, methodId: string): VerificationChallenge {
    const method = this.verificationMethods.get(methodId);
    if (!method) throw new Error("Verification method not found");

    const challenge: VerificationChallenge = {
      id: `challenge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      method,
      status: "pending",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };

    this.verificationChallenges.set(challenge.id, challenge);
    this.log(userId, `Created verification challenge: ${methodId}`);

    return challenge;
  }

  /**
   * Complete verification challenge
   */
  completeChallenge(challengeId: string, age: number, confidence: number = 100): VerificationResult {
    const challenge = this.verificationChallenges.get(challengeId);
    if (!challenge) throw new Error("Challenge not found");

    if (challenge.status !== "pending") throw new Error("Challenge already completed or expired");

    const result: VerificationResult = {
      verified: age >= 18,
      age,
      confidence,
      method: challenge.method.type,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    };

    challenge.result = result;
    challenge.status = "completed";

    // Update user access
    this.updateUserAccess(challenge.userId, result);
    this.log(challenge.userId, `Completed verification: age=${age}, confidence=${confidence}%`);

    return result;
  }

  /**
   * Check if user can access content
   */
  canAccessContent(userId: string, contentRating: string): boolean {
    const policy = this.contentPolicies.get(contentRating);
    if (!policy) return false;

    if (!policy.requiresVerification) return true;

    const userAccess = this.userAccess.get(userId);
    if (!userAccess) return false;

    const isAllowed = userAccess.allowedRatings.includes(contentRating);
    const isVerified = userAccess.verifiedAge >= policy.minAge;
    const isNotExpired = new Date() < userAccess.nextVerificationDue;

    return isAllowed && isVerified && isNotExpired;
  }

  /**
   * Get recommended verification method for content
   */
  getRecommendedMethod(contentRating: string): VerificationMethod | null {
    const policy = this.contentPolicies.get(contentRating);
    if (!policy || !policy.requiresVerification) return null;

    // Return the method with best balance of privacy and trust
    const allowedMethods = policy.verificationMethods
      .map((id) => this.verificationMethods.get(id))
      .filter((m) => m !== undefined) as VerificationMethod[];

    if (allowedMethods.length === 0) return null;

    // Score: prioritize privacy, then trust
    return allowedMethods.sort((a, b) => {
      const scoreA = a.privacyLevel * 0.6 + a.trustLevel * 0.4;
      const scoreB = b.privacyLevel * 0.6 + b.trustLevel * 0.4;
      return scoreB - scoreA;
    })[0];
  }

  /**
   * Get all available verification methods
   */
  getAvailableMethods(): VerificationMethod[] {
    return Array.from(this.verificationMethods.values());
  }

  /**
   * Get content policy
   */
  getContentPolicy(rating: string): ContentPolicy | null {
    return this.contentPolicies.get(rating) || null;
  }

  /**
   * Get user access info
   */
  getUserAccess(userId: string): UserContentAccess | null {
    return this.userAccess.get(userId) || null;
  }

  /**
   * Revoke user access (for compliance)
   */
  revokeAccess(userId: string): boolean {
    return this.userAccess.delete(userId);
  }

  /**
   * Private: Update user access after verification
   */
  private updateUserAccess(userId: string, result: VerificationResult): void {
    const allowedRatings: string[] = [];

    // Determine allowed ratings based on age
    if (result.age >= 0) allowedRatings.push("general");
    if (result.age >= 13) allowedRatings.push("teen");
    if (result.age >= 17) allowedRatings.push("mature");
    if (result.age >= 18) {
      allowedRatings.push("nsfw");
      allowedRatings.push("restricted");
    }

    const access: UserContentAccess = {
      userId,
      allowedRatings,
      verifiedAge: result.age,
      verificationMethods: [result.method],
      lastVerified: result.timestamp,
      nextVerificationDue: result.expiresAt,
    };

    this.userAccess.set(userId, access);
  }

  /**
   * Private: Log verification activity
   */
  private log(userId: string, action: string): void {
    this.verificationLog.push({
      timestamp: new Date(),
      userId,
      action,
    });
  }

  /**
   * Get verification statistics
   */
  getStats() {
    return {
      totalMethods: this.verificationMethods.size,
      totalChallenges: this.verificationChallenges.size,
      completedChallenges: Array.from(this.verificationChallenges.values()).filter((c) => c.status === "completed").length,
      verifiedUsers: this.userAccess.size,
      contentPolicies: this.contentPolicies.size,
      logEntries: this.verificationLog.length,
    };
  }

  /**
   * Get verification log
   */
  getLog(limit: number = 100): any[] {
    return this.verificationLog.slice(-limit);
  }
}

// Singleton instance
export const ageVerificationSystem = new AgeVerificationSystem();
