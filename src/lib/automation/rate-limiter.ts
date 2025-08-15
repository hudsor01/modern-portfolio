/**
 * Rate Limiting for Automation APIs
 * Implements sliding window rate limiting with different tiers
 */

import { NextRequest } from 'next/server';

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  burstLimit?: number; // Maximum burst requests (short term)
  burstWindowMs?: number; // Burst window in milliseconds
  keyGenerator?: (request: NextRequest) => string;
  skipIfCondition?: (request: NextRequest) => boolean;
  onLimitReached?: (key: string, request: NextRequest) => void;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}

class RateLimiter {
  private storage = new Map<string, {
    requests: { timestamp: number; count: number }[];
    burstRequests?: { timestamp: number; count: number }[];
  }>();

  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup old entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  /**
   * Check if request is within rate limit
   */
  async checkLimit(request: NextRequest, config: RateLimitConfig): Promise<RateLimitResult> {
    // Skip if condition is met
    if (config.skipIfCondition && config.skipIfCondition(request)) {
      return {
        allowed: true,
        limit: config.maxRequests,
        remaining: config.maxRequests,
        resetTime: new Date(Date.now() + config.windowMs)
      };
    }

    // Generate key for this request
    const key = config.keyGenerator ? 
      config.keyGenerator(request) : 
      this.defaultKeyGenerator(request);

    const now = Date.now();
    const windowStart = now - config.windowMs;
    const burstWindowStart = config.burstWindowMs ? now - config.burstWindowMs : now;

    // Get or create request history for this key
    let entry = this.storage.get(key);
    if (!entry) {
      entry = { requests: [] };
      this.storage.set(key, entry);
    }

    // Remove old requests outside the window
    entry.requests = entry.requests.filter(req => req.timestamp > windowStart);

    // Count current requests in window
    const requestCount = entry.requests.reduce((sum, req) => sum + req.count, 0);

    // Check burst limit if configured
    let burstExceeded = false;
    if (config.burstLimit && config.burstWindowMs) {
      if (!entry.burstRequests) {
        entry.burstRequests = [];
      }
      
      // Remove old burst requests
      entry.burstRequests = entry.burstRequests.filter(
        req => req.timestamp > burstWindowStart
      );
      
      const burstCount = entry.burstRequests.reduce((sum, req) => sum + req.count, 0);
      burstExceeded = burstCount >= config.burstLimit;
    }

    // Check if limit is exceeded
    const limitExceeded = requestCount >= config.maxRequests;
    const allowed = !limitExceeded && !burstExceeded;

    if (allowed) {
      // Record this request
      entry.requests.push({ timestamp: now, count: 1 });
      
      if (entry.burstRequests) {
        entry.burstRequests.push({ timestamp: now, count: 1 });
      }
    } else {
      // Trigger limit reached callback
      if (config.onLimitReached) {
        config.onLimitReached(key, request);
      }
    }

    // Calculate reset time (when oldest request in window expires)
    const oldestRequest = entry.requests[0];
    const resetTime = oldestRequest ? 
      new Date(oldestRequest.timestamp + config.windowMs) :
      new Date(now + config.windowMs);

    // Calculate retry after (seconds until next request allowed)
    const retryAfter = limitExceeded ? 
      Math.ceil((resetTime.getTime() - now) / 1000) : 
      undefined;

    return {
      allowed,
      limit: config.maxRequests,
      remaining: Math.max(0, config.maxRequests - requestCount),
      resetTime,
      retryAfter
    };
  }

  /**
   * Reset rate limit for a specific key
   */
  reset(key: string): void {
    this.storage.delete(key);
  }

  /**
   * Get current usage statistics
   */
  getStats(): {
    totalKeys: number;
    totalRequests: number;
    memoryUsage: number;
  } {
    let totalRequests = 0;
    
    for (const entry of this.storage.values()) {
      totalRequests += entry.requests.reduce((sum, req) => sum + req.count, 0);
    }

    return {
      totalKeys: this.storage.size,
      totalRequests,
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  /**
   * Cleanup old entries
   */
  private cleanup(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [key, entry] of this.storage.entries()) {
      // Remove entries with no recent requests
      const hasRecentRequests = entry.requests.some(
        req => now - req.timestamp < maxAge
      );
      
      if (!hasRecentRequests) {
        this.storage.delete(key);
      }
    }
  }

  private defaultKeyGenerator(request: NextRequest): string {
    // Use IP address as default key
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 
               request.headers.get('x-real-ip') ||
               'unknown';
    return `ip:${ip}`;
  }

  private estimateMemoryUsage(): number {
    // Rough estimate of memory usage in bytes
    let size = 0;
    
    for (const [key, entry] of this.storage.entries()) {
      size += key.length * 2; // String overhead
      size += entry.requests.length * 16; // Request objects
      size += (entry.burstRequests?.length || 0) * 16; // Burst request objects
    }
    
    return size;
  }

  /**
   * Cleanup on shutdown
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.storage.clear();
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Pre-configured rate limit configurations
export const rateLimitConfigs = {
  // General API endpoints
  api: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 100,
    burstLimit: 10,
    burstWindowMs: 60 * 1000 // 1 minute
  },
  
  // Webhook endpoints (higher limits for automated systems)
  webhook: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 1000,
    burstLimit: 50,
    burstWindowMs: 60 * 1000, // 1 minute
    keyGenerator: (request: NextRequest) => {
      // Use user agent + IP for webhooks
      const userAgent = request.headers.get('user-agent') || '';
      const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown';
      return `webhook:${ip}:${userAgent.substring(0, 50)}`;
    }
  },
  
  // Automation triggers (moderate limits)
  automation: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 200,
    burstLimit: 20,
    burstWindowMs: 5 * 60 * 1000, // 5 minutes
    keyGenerator: (request: NextRequest) => {
      // Use API key if available, fallback to IP
      const auth = request.headers.get('authorization');
      if (auth && auth.startsWith('Bearer ')) {
        const key = auth.substring(7);
        return `api-key:${key.substring(0, 10)}`;
      }
      
      const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown';
      return `automation:${ip}`;
    },
    skipIfCondition: (request: NextRequest) => {
      // Skip rate limiting for internal requests
      const origin = request.headers.get('origin');
      return origin === process.env.NEXT_PUBLIC_SITE_URL;
    }
  },
  
  // Health check endpoints (very high limits)
  health: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60 // 1 per second average
  }
} as const;

// Helper function to apply rate limiting to API routes
export async function applyRateLimit(
  request: NextRequest, 
  configName: keyof typeof rateLimitConfigs
): Promise<{
  success: boolean;
  headers: Record<string, string>;
  error?: string;
}> {
  const config = rateLimitConfigs[configName];
  const result = await rateLimiter.checkLimit(request, config);
  
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetTime.getTime().toString(),
  };
  
  if (result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString();
  }
  
  return {
    success: result.allowed,
    headers,
    ...(result.allowed ? {} : { 
      error: `Rate limit exceeded. Try again in ${result.retryAfter || 0} seconds.` 
    })
  };
}

// Middleware helper for Next.js API routes
export function withRateLimit(
  configName: keyof typeof rateLimitConfigs,
  handler: (request: NextRequest) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    const rateLimitResult = await applyRateLimit(request, configName);
    
    if (!rateLimitResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: rateLimitResult.error,
          data: null
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...rateLimitResult.headers
          }
        }
      );
    }
    
    const response = await handler(request);
    
    // Add rate limit headers to successful responses
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  };
}