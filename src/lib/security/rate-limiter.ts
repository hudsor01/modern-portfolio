/**
 * Enhanced Rate Limiting System
 * Provides progressive penalties and better tracking than simple in-memory storage
 */

interface RateLimitRecord {
  count: number
  resetTime: number
  lastAttempt: number
  penalties: number // Track repeated violations
}

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxAttempts: number // Max attempts per window
  progressivePenalty: boolean // Enable progressive penalties
  blockDuration: number // Duration to block after max penalties
}

interface RateLimitResult {
  allowed: boolean
  resetTime?: number
  remaining?: number
  retryAfter?: number
  blocked?: boolean
}

class RateLimiter {
  private store = new Map<string, RateLimitRecord>()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  /**
   * Check if a request is allowed based on rate limiting rules
   */
  checkLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now()
    const record = this.store.get(identifier)

    // No existing record - allow and create new
    if (!record) {
      this.store.set(identifier, {
        count: 1,
        resetTime: now + config.windowMs,
        lastAttempt: now,
        penalties: 0
      })
      return {
        allowed: true,
        remaining: config.maxAttempts - 1,
        resetTime: now + config.windowMs
      }
    }

    // Check if currently blocked due to penalties
    if (config.progressivePenalty && record.penalties > 0) {
      const blockUntil = record.lastAttempt + (config.blockDuration * Math.pow(2, record.penalties - 1))
      if (now < blockUntil) {
        return {
          allowed: false,
          blocked: true,
          retryAfter: blockUntil
        }
      }
    }

    // Reset window if expired
    if (now > record.resetTime) {
      record.count = 1
      record.resetTime = now + config.windowMs
      record.lastAttempt = now
      return {
        allowed: true,
        remaining: config.maxAttempts - 1,
        resetTime: record.resetTime
      }
    }

    // Check if limit exceeded
    if (record.count >= config.maxAttempts) {
      record.penalties += 1
      record.lastAttempt = now
      
      const retryAfter = config.progressivePenalty 
        ? record.lastAttempt + (config.blockDuration * Math.pow(2, record.penalties - 1))
        : record.resetTime

      return {
        allowed: false,
        resetTime: record.resetTime,
        retryAfter,
        blocked: config.progressivePenalty
      }
    }

    // Increment count and allow
    record.count += 1
    record.lastAttempt = now
    
    return {
      allowed: true,
      remaining: config.maxAttempts - record.count,
      resetTime: record.resetTime
    }
  }

  /**
   * Clear rate limit for specific identifier
   */
  clearLimit(identifier: string): void {
    this.store.delete(identifier)
  }

  /**
   * Get current status for identifier
   */
  getStatus(identifier: string): RateLimitRecord | null {
    return this.store.get(identifier) || null
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, record] of this.store.entries()) {
      // Remove if window expired and no active penalties
      if (now > record.resetTime && record.penalties === 0) {
        this.store.delete(key)
      }
      // Remove penalty blocks that have expired
      else if (record.penalties > 0) {
        const blockExpiry = record.lastAttempt + (60000 * Math.pow(2, record.penalties))
        if (now > blockExpiry) {
          record.penalties = Math.max(0, record.penalties - 1)
        }
      }
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.store.clear()
  }
}

// Singleton instance
const rateLimiter = new RateLimiter()

// Pre-configured rate limiters for different use cases
export const RateLimitConfigs = {
  // Contact form submissions
  contactForm: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 5,
    progressivePenalty: true,
    blockDuration: 60 * 1000, // 1 minute base penalty
  },
  
  // API endpoints
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 100,
    progressivePenalty: false,
    blockDuration: 0,
  },
  
  // Authentication attempts
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5,
    progressivePenalty: true,
    blockDuration: 5 * 60 * 1000, // 5 minute base penalty
  },
  
  // File uploads
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 10,
    progressivePenalty: true,
    blockDuration: 2 * 60 * 1000, // 2 minute base penalty
  }
} as const

/**
 * Helper function to check contact form rate limit
 */
export function checkContactFormRateLimit(identifier: string): RateLimitResult {
  return rateLimiter.checkLimit(identifier, RateLimitConfigs.contactForm)
}

/**
 * Helper function to check API rate limit
 */
export function checkApiRateLimit(identifier: string): RateLimitResult {
  return rateLimiter.checkLimit(identifier, RateLimitConfigs.api)
}

/**
 * Helper function to get client identifier from request
 * Uses multiple fallbacks for identifier
 */
export function getClientIdentifier(req: Request): string {
  // Try to get IP from various headers (Vercel provides x-forwarded-for)
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const cfConnectingIp = req.headers.get('cf-connecting-ip')
  
  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
  
  // Add user agent as additional identifier to prevent IP spoofing
  const userAgent = req.headers.get('user-agent') || 'unknown'
  const userAgentHash = Buffer.from(userAgent).toString('base64').slice(0, 8)
  
  return `${ip}:${userAgentHash}`
}

export { rateLimiter }
export type { RateLimitResult, RateLimitConfig }