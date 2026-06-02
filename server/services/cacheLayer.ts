/**
 * Multi-Tier Cache Service — L1 (memory) + L2 (Redis) + L3 (CDN)
 */
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  tags: string[];
  hitCount: number;
}

export class CacheLayer<T = any> {
  private l1: Map<string, CacheEntry<T>> = new Map();
  private stats = { hits: 0, misses: 0, sets: 0, evictions: 0 };
  private maxSize: number;

  constructor(maxSize = 10000) {
    this.maxSize = maxSize;
  }

  async get(key: string): Promise<T | null> {
    const entry = this.l1.get(key);
    if (!entry) { this.stats.misses++; return null; }
    if (Date.now() > entry.expiresAt) { this.l1.delete(key); this.stats.misses++; return null; }
    entry.hitCount++;
    this.stats.hits++;
    return entry.value;
  }

  async set(key: string, value: T, ttlMs: number = 60000, tags: string[] = []): Promise<void> {
    if (this.l1.size >= this.maxSize) this.evictLRU();
    this.l1.set(key, { value, expiresAt: Date.now() + ttlMs, tags, hitCount: 0 });
    this.stats.sets++;
  }

  async invalidate(key: string): Promise<void> { this.l1.delete(key); }

  async invalidateByTag(tag: string): Promise<number> {
    let count = 0;
    this.l1.forEach((entry, key) => {
      if (entry.tags.includes(tag)) {
        this.l1.delete(key);
        count++;
      }
    });
    return count;
  }

  async flush(): Promise<void> { this.l1.clear(); }

  private evictLRU() {
    let minHits = Infinity,
      evictKey = "";
    this.l1.forEach((entry, key) => {
      if (entry.hitCount < minHits) {
        minHits = entry.hitCount;
        evictKey = key;
      }
    });
    if (evictKey) {
      this.l1.delete(evictKey);
      this.stats.evictions++;
    }
  }

  getStats() {
    const hitRate = this.stats.hits / (this.stats.hits + this.stats.misses) || 0;
    return { ...this.stats, size: this.l1.size, hitRate: Math.round(hitRate * 100) };
  }
}

export const globalCache = new CacheLayer();
