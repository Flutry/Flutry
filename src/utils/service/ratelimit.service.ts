interface RateLimitConfig {
  windowMs: number; // Időablak milliszekundumban
  maxRequests: number; // Maximum kérések száma az időablakban
}

interface RateLimitRecord {
  count: number;
  firstRequest: number;
}

export class RateLimit {
  private store: Map<string, RateLimitRecord>;
  private config: RateLimitConfig;
  private cleanupInterval: NodeJS.Timeout;

  constructor(config: RateLimitConfig) {
    this.store = new Map();
    this.config = config;

    // Automatikus tisztítás beállítása
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired(Date.now());
    }, this.config.windowMs);
  }

  async handle(ctx: any) {
    const key = this.generateKey(ctx);
    const now = Date.now();

    // Ellenőrizzük és tisztítjuk a lejárt rekordokat
    this.cleanupExpired(now);

    const record = this.store.get(key) || { count: 0, firstRequest: now };

    if (now - record.firstRequest > this.config.windowMs) {
      record.count = 0;
      record.firstRequest = now;
    }

    record.count++;
    this.store.set(key, record);

    // Rate limit headerek beállítása
    const remaining = Math.max(0, this.config.maxRequests - record.count);
    const reset = Math.ceil((record.firstRequest + this.config.windowMs - now) / 1000);

    try {
      ctx.setHeader('X-RateLimit-Limit', this.config.maxRequests.toString());
      ctx.setHeader('X-RateLimit-Remaining', remaining.toString());
      ctx.setHeader('X-RateLimit-Reset', reset.toString());
    } catch (error) {
      console.error('Failed to set rate limit headers:', error);
    }

    if (record.count > this.config.maxRequests) {
      ctx.send(
        {
          status: 429,
          error: 'Too Many Requests',
          message: 'Rate limit exceeded',
          retryAfter: reset,
        },
        429,
      );
      return false;
    }

    return true;
  }

  private generateKey(ctx: any): string {
    const ip =
      ctx.req.headers['cf-connecting-ip'] || // Cloudflare
      ctx.req.headers['x-real-ip'] || // Nginx
      ctx.req.headers['x-forwarded-for'] || // Standard proxy header
      ctx.req.ip || // Direct IP
      'unknown'; // Fallback

    const path = ctx.req.routerPath || ctx.req.url || '/';

    return `${ip}-${path}`;
  }

  private cleanupExpired(now: number): void {
    for (const [key, record] of this.store.entries()) {
      if (now - record.firstRequest > this.config.windowMs) {
        this.store.delete(key);
      }
    }
  }

  // Cleanup method for proper resource management
  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }

  // Getter for testing and monitoring
  public getStore(): Map<string, RateLimitRecord> {
    return this.store;
  }
}
