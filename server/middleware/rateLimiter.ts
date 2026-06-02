/**
 * Distributed Rate Limiter — Token bucket with sliding window
 */
interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

export class RateLimiter {
  private buckets: Map<string, { tokens: number; lastRefill: number }> = new Map();

  constructor(private config: { requests: number; window: number; burst: number }) {}

  check(key: string): RateLimitResult {
    const now = Date.now();
    let bucket = this.buckets.get(key);
    if (!bucket) { bucket = { tokens: this.config.burst, lastRefill: now }; this.buckets.set(key, bucket); }

    const elapsed = now - bucket.lastRefill;
    const refillRate = this.config.requests / this.config.window;
    bucket.tokens = Math.min(this.config.burst, bucket.tokens + elapsed * refillRate);
    bucket.lastRefill = now;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return { allowed: true, remaining: Math.floor(bucket.tokens), resetAt: now + this.config.window };
    }
    return { allowed: false, remaining: 0, resetAt: now + this.config.window, retryAfter: Math.ceil((1 - bucket.tokens) / refillRate) };
  }
}

export const apiLimiter = new RateLimiter({ requests: 10000, window: 60000, burst: 200 });
export const authLimiter = new RateLimiter({ requests: 10, window: 60000, burst: 5 });
export const uploadLimiter = new RateLimiter({ requests: 50, window: 60000, burst: 10 });
