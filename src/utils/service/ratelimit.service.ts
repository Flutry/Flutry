import { FlutryLogger } from '@flutry/main';

//? Configuration interface for rate limiting
interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum number of requests in the time window
  maxStoreSize?: number; // Maximum stored keys count (memory protection)
  skipFailedRequests?: boolean; // Skip failed requests
  enableLogging?: boolean; // Enable logging
  cleanupIntervalMs?: number; // Cleanup frequency
}

//? Rate limit record structure
interface RateLimitRecord {
  count: number;
  firstRequest: number;
  lastRequest: number; // Last request timestamp for better cleanup
}

//? Rate limit result interface
interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number;
  error?: string;
}

//! Main RateLimit class - handles request rate limiting
export class RateLimit {
  private store: Map<string, RateLimitRecord>;
  private config: Required<RateLimitConfig>;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private isDestroyed = false;

  constructor(config: RateLimitConfig) {
    // Configuration validation
    this.validateConfig(config);

    //? Set default configuration values
    this.config = {
      maxStoreSize: 10000,
      skipFailedRequests: false,
      enableLogging: true,
      cleanupIntervalMs: Math.min(config.windowMs, 60000),
      ...config,
    };

    this.store = new Map();
    this.startCleanup();
  }

  //! Validates the rate limit configuration
  private validateConfig(config: RateLimitConfig): void {
    if (!config || typeof config !== 'object') {
      throw new Error('RateLimit config must be an object');
    }

    if (!Number.isInteger(config.windowMs) || config.windowMs <= 0) {
      throw new Error('windowMs must be a positive integer');
    }

    if (!Number.isInteger(config.maxRequests) || config.maxRequests <= 0) {
      throw new Error('maxRequests must be a positive integer');
    }

    if (
      config.maxStoreSize !== undefined &&
      (!Number.isInteger(config.maxStoreSize) || config.maxStoreSize <= 0)
    ) {
      throw new Error('maxStoreSize must be a positive integer');
    }
  }

  //? Starts the cleanup interval for expired records
  private startCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(() => {
      if (!this.isDestroyed) {
        this.cleanupExpired(Date.now());
      }
    }, this.config.cleanupIntervalMs);
  }

  //! Main handler for rate limit checking
  async handle(ctx: any): Promise<RateLimitResult> {
    //? Check if instance is destroyed
    if (this.isDestroyed) {
      return {
        allowed: false,
        remaining: 0,
        reset: 0,
        error: 'RateLimit instance has been destroyed',
      };
    }

    try {
      //? Generate unique key for the request
      const key = this.generateKey(ctx);
      if (!key) {
        this.logError('Failed to generate rate limit key');
        return { allowed: true, remaining: this.config.maxRequests, reset: 0 }; // Graceful degradation
      }

      const now = Date.now();

      //! Memory protection - cleanup if too many keys exist
      if (this.store.size >= this.config.maxStoreSize) {
        this.cleanupExpired(now);

        // If still too many, remove oldest entries
        if (this.store.size >= this.config.maxStoreSize) {
          this.cleanupOldest(Math.floor(this.config.maxStoreSize * 0.1));
        }
      }

      //? Get or create rate limit record
      const record = this.store.get(key) || {
        count: 0,
        firstRequest: now,
        lastRequest: now,
      };

      //? Window reset check
      if (now - record.firstRequest > this.config.windowMs) {
        record.count = 0;
        record.firstRequest = now;
      }

      // Update record
      record.count++;
      record.lastRequest = now;
      this.store.set(key, record);

      //? Calculate remaining requests and reset time
      const remaining = Math.max(0, this.config.maxRequests - record.count);
      const reset = Math.ceil((record.firstRequest + this.config.windowMs - now) / 1000);

      // Set rate limit headers
      this.setHeaders(ctx, remaining, reset);

      const allowed = record.count <= this.config.maxRequests;

      //! Handle rate limit exceeded
      if (!allowed) {
        this.handleRateLimitExceeded(ctx, reset, key);
      }

      return { allowed, remaining, reset };
    } catch (error) {
      this.logError('Rate limit error:', error);
      // Graceful degradation - allow request on error
      return { allowed: true, remaining: this.config.maxRequests, reset: 0 };
    }
  }

  //? Generates a unique key for rate limiting based on IP and path
  private generateKey(ctx: any): string | null {
    try {
      // Since trust proxy is active, we can use standard Express IP
      const ip =
        ctx.req.ip ||
        ctx.req.headers['cf-connecting-ip'] ||
        ctx.req.headers['x-real-ip'] ||
        'unknown';

      // IP validation
      if (!this.isValidIP(ip) && ip !== 'unknown') {
        this.logError(`Invalid IP detected: ${ip}`);
        return null;
      }

      const path = this.sanitizePath(ctx.req.routerPath || ctx.req.url || '/');
      return `${ip}-${path}`;
    } catch (error) {
      this.logError('Error generating key:', error);
      return null;
    }
  }

  //? Validates if IP address is in correct format
  private isValidIP(ip: string): boolean {
    // Basic IPv4 and IPv6 validation
    const ipv4Regex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$|^::1$|^::$/;

    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  //? Sanitizes path for security reasons
  private sanitizePath(path: string): string {
    // Path cleaning for security purposes
    return path.replace(/[^a-zA-Z0-9\/\-_\.]/g, '').substring(0, 100);
  }

  //? Sets rate limit headers on the response
  private setHeaders(ctx: any, remaining: number, reset: number): void {
    try {
      ctx.setHeader('X-RateLimit-Limit', this.config.maxRequests.toString());
      ctx.setHeader('X-RateLimit-Remaining', remaining.toString());
      ctx.setHeader('X-RateLimit-Reset', reset.toString());
      ctx.setHeader('X-RateLimit-Window', Math.ceil(this.config.windowMs / 1000).toString());
    } catch (error) {
      this.logError('Failed to set rate limit headers:', error);
    }
  }

  //! Handles rate limit exceeded scenario
  private handleRateLimitExceeded(ctx: any, reset: number, key: string): void {
    this.logWarning(`Rate limit exceeded for key: ${key}`);

    try {
      ctx.send(
        {
          status: 429,
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          retry_after: reset,
        },
        429,
      );
    } catch (error) {
      this.logError('Failed to send rate limit response:', error);
    }
  }

  //? Cleans up expired rate limit records
  private cleanupExpired(now: number): void {
    let deletedCount = 0;

    for (const [key, record] of this.store.entries()) {
      if (now - record.firstRequest > this.config.windowMs) {
        this.store.delete(key);
        deletedCount++;
      }
    }

    if (deletedCount > 0 && this.config.enableLogging) {
      this.logInfo(`Cleaned up ${deletedCount} expired rate limit records`);
    }
  }

  //? Cleans up oldest rate limit records for memory management
  private cleanupOldest(count: number): void {
    const entries = Array.from(this.store.entries())
      .sort(([, a], [, b]) => a.lastRequest - b.lastRequest)
      .slice(0, count);

    entries.forEach(([key]) => this.store.delete(key));

    if (this.config.enableLogging) {
      this.logInfo(`Cleaned up ${entries.length} oldest rate limit records`);
    }
  }

  //! Logs error messages
  private logError(message: string, error?: any): void {
    if (this.config.enableLogging) {
      FlutryLogger.getLogger().error(`[RateLimit] ${message}`, error || '');
    }
  }

  //! Logs warning messages
  private logWarning(message: string): void {
    if (this.config.enableLogging) {
      FlutryLogger.getLogger().error(`[RateLimit] ${message}`);
    }
  }

  //? Logs info messages
  private logInfo(message: string): void {
    if (this.config.enableLogging) {
      FlutryLogger.getLogger().error(`[RateLimit] ${message}`);
    }
  }

  //! Cleanup method for proper resource management
  public destroy(): void {
    if (this.isDestroyed) {
      return;
    }

    this.isDestroyed = true;

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    this.store.clear();
    this.logInfo('RateLimit instance destroyed');
  }

  //? Getter for testing and monitoring - returns a copy for safety
  public getStore(): Map<string, RateLimitRecord> {
    return new Map(this.store); // Return copy for safety
  }

  //? Get statistics about the rate limiter
  public getStats(): { storeSize: number; maxStoreSize: number; isDestroyed: boolean } {
    return {
      storeSize: this.store.size,
      maxStoreSize: this.config.maxStoreSize,
      isDestroyed: this.isDestroyed,
    };
  }

  //? Manually remove a specific key from rate limiting
  public removeKey(key: string): boolean {
    return this.store.delete(key);
  }

  //! Clear all rate limit records
  public clear(): void {
    this.store.clear();
    this.logInfo('All rate limit records cleared');
  }
}
