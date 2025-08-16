/**
 * Enhanced Rate Limiting System
 * Advanced rate limiting with analytics, adaptive thresholds, and smart blocking
 */


export interface RateLimitRecord {
  count: number
  resetTime: number
  lastAttempt: number
  penalties: number
  requestHistory: number[] // Track request timestamps for pattern analysis
  userAgent?: string
  suspicious: boolean
}

export interface EnhancedRateLimitConfig {
  windowMs: number
  maxAttempts: number
  progressivePenalty: boolean
  blockDuration: number
  adaptiveThreshold: boolean
  antiAbuse: boolean
  whitelist?: string[]
  blacklist?: string[]
  burstProtection?: {
    enabled: boolean
    burstWindow: number // Short window for burst detection (e.g., 10 seconds)
    maxBurstRequests: number
  }
}

export interface RateLimitAnalytics {
  totalRequests: number
  blockedRequests: number
  uniqueClients: number
  avgRequestsPerClient: number
  suspiciousActivities: number
  topClients: Array<{ identifier: string; requests: number; blocked: boolean }>
  trends: {
    hourly: number[]
    daily: number[]
  }
}

export interface RateLimitResult {
  allowed: boolean
  resetTime?: number
  remaining?: number
  retryAfter?: number
  blocked?: boolean
  reason?: string
  confidence?: number // How confident we are in this decision (0-1)
  analytics?: {
    clientRisk: number // Risk score for this client
    globalLoad: number // Current global load percentage
  }
}

// Simple in-memory store for rate limiting (could be replaced with Redis in production)  
// Note: This store is not used directly in the current implementation

class EnhancedRateLimiter {
  private store = new Map<string, RateLimitRecord>()
  private analytics: RateLimitAnalytics = {
    totalRequests: 0,
    blockedRequests: 0,
    uniqueClients: 0,
    avgRequestsPerClient: 0,
    suspiciousActivities: 0,
    topClients: [],
    trends: {
      hourly: new Array(24).fill(0),
      daily: new Array(7).fill(0)
    }
  }
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Cleanup expired entries every 2 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
      this.updateAnalytics()
    }, 2 * 60 * 1000)
  }

  /**
   * Enhanced rate limiting with smart detection
   */
  checkLimit(identifier: string, config: EnhancedRateLimitConfig, context?: {
    userAgent?: string
    path?: string
    method?: string
  }): RateLimitResult {
    const now = Date.now()
    
    // Check whitelist/blacklist first
    if (config.whitelist?.includes(identifier)) {
      return { allowed: true, reason: 'whitelisted', confidence: 1.0 }
    }
    
    if (config.blacklist?.includes(identifier)) {
      this.analytics.blockedRequests++
      return { 
        allowed: false, 
        blocked: true, 
        reason: 'blacklisted',
        confidence: 1.0,
        retryAfter: now + (24 * 60 * 60 * 1000) // 24 hours
      }
    }

    let record = this.store.get(identifier)

    // Initialize new record
    if (!record) {
      record = {
        count: 0,
        resetTime: now + config.windowMs,
        lastAttempt: now,
        penalties: 0,
        requestHistory: [],
        userAgent: context?.userAgent,
        suspicious: false
      }
      this.store.set(identifier, record)
      this.analytics.uniqueClients++
    }

    // Update analytics
    this.analytics.totalRequests++
    const hour = new Date().getHours()
    const day = new Date().getDay()
    this.analytics.trends.hourly[hour] = (this.analytics.trends.hourly[hour] || 0) + 1
    this.analytics.trends.daily[day] = (this.analytics.trends.daily[day] || 0) + 1

    // Analyze request patterns for suspicious behavior
    const suspiciousScore = this.analyzeSuspiciousBehavior(record, context)
    if (suspiciousScore > 0.7) {
      record.suspicious = true
      this.analytics.suspiciousActivities++
    }

    // Check for burst protection
    if (config.burstProtection?.enabled) {
      const burstCheck = this.checkBurstProtection(record, config.burstProtection)
      if (!burstCheck.allowed) {
        this.analytics.blockedRequests++
        return {
          ...burstCheck,
          reason: 'burst_protection',
          confidence: 0.9,
          analytics: {
            clientRisk: suspiciousScore,
            globalLoad: this.calculateGlobalLoad()
          }
        }
      }
    }

    // Check if currently blocked due to penalties
    if (config.progressivePenalty && record.penalties > 0) {
      const penaltyMultiplier = record.suspicious ? 2 : 1
      const blockUntil = record.lastAttempt + (config.blockDuration * Math.pow(2, record.penalties - 1) * penaltyMultiplier)
      
      if (now < blockUntil) {
        this.analytics.blockedRequests++
        return {
          allowed: false,
          blocked: true,
          retryAfter: blockUntil,
          reason: 'penalty_block',
          confidence: 0.95,
          analytics: {
            clientRisk: suspiciousScore,
            globalLoad: this.calculateGlobalLoad()
          }
        }
      }
    }

    // Reset window if expired
    if (now > record.resetTime) {
      record.count = 0
      record.resetTime = now + config.windowMs
      record.requestHistory = record.requestHistory.filter(t => t > now - config.windowMs)
    }

    // Adaptive threshold based on global load and client risk
    let effectiveMaxAttempts = config.maxAttempts
    if (config.adaptiveThreshold) {
      const globalLoad = this.calculateGlobalLoad()
      const riskMultiplier = 1 - (suspiciousScore * 0.5) // Reduce limit for risky clients
      const loadMultiplier = 1 - (globalLoad * 0.3) // Reduce limit under high load
      
      effectiveMaxAttempts = Math.floor(config.maxAttempts * riskMultiplier * loadMultiplier)
      effectiveMaxAttempts = Math.max(effectiveMaxAttempts, 1) // Never go below 1
    }

    // Check if limit exceeded
    if (record.count >= effectiveMaxAttempts) {
      record.penalties += 1
      record.lastAttempt = now
      
      const penaltyMultiplier = record.suspicious ? 2 : 1
      const retryAfter = config.progressivePenalty 
        ? record.lastAttempt + (config.blockDuration * Math.pow(2, record.penalties - 1) * penaltyMultiplier)
        : record.resetTime

      this.analytics.blockedRequests++
      
      return {
        allowed: false,
        resetTime: record.resetTime,
        retryAfter,
        blocked: config.progressivePenalty,
        reason: 'rate_limit_exceeded',
        confidence: 0.8,
        analytics: {
          clientRisk: suspiciousScore,
          globalLoad: this.calculateGlobalLoad()
        }
      }
    }

    // Allow request and update counters
    record.count++
    record.lastAttempt = now
    record.requestHistory.push(now)
    
    // Keep only recent history
    record.requestHistory = record.requestHistory.filter(t => t > now - config.windowMs)

    return {
      allowed: true,
      remaining: effectiveMaxAttempts - record.count,
      resetTime: record.resetTime,
      confidence: 1.0,
      analytics: {
        clientRisk: suspiciousScore,
        globalLoad: this.calculateGlobalLoad()
      }
    }
  }

  /**
   * Analyze suspicious behavior patterns
   */
  private analyzeSuspiciousBehavior(
    record: RateLimitRecord, 
    context?: { userAgent?: string; path?: string; method?: string }
  ): number {
    let suspicionScore = 0
    const now = Date.now()

    // Check for rapid successive requests (bot-like behavior)
    if (record.requestHistory.length >= 5) {
      const recentRequests = record.requestHistory.filter(t => t > now - 10000) // Last 10 seconds
      if (recentRequests.length >= 5) {
        const intervals = []
        for (let i = 1; i < recentRequests.length; i++) {
          const prev = recentRequests[i - 1]
          const curr = recentRequests[i]
          if (prev !== undefined && curr !== undefined) {
            intervals.push(curr - prev)
          }
        }
        
        // Check for uniform intervals (bot behavior)
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
        const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length
        const standardDeviation = Math.sqrt(variance)
        
        // Low variance suggests automated requests
        if (standardDeviation < avgInterval * 0.1) {
          suspicionScore += 0.4
        }
        
        // Very high frequency
        if (avgInterval < 1000) { // Less than 1 second between requests
          suspicionScore += 0.3
        }
      }
    }

    // Check for suspicious user agent patterns
    if (context?.userAgent) {
      const ua = context.userAgent.toLowerCase()
      const suspiciousPatterns = [
        'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python', 'java'
      ]
      
      if (suspiciousPatterns.some(pattern => ua.includes(pattern))) {
        suspicionScore += 0.2
      }
      
      // Very short or missing user agent
      if (context.userAgent.length < 20) {
        suspicionScore += 0.1
      }
    }

    // Check penalty history
    if (record.penalties > 2) {
      suspicionScore += 0.2
    }

    // Multiple violations across different time windows
    const recentViolations = record.requestHistory.filter(t => t > now - (60 * 60 * 1000)) // Last hour
    if (recentViolations.length > 50) {
      suspicionScore += 0.3
    }

    return Math.min(suspicionScore, 1.0)
  }

  /**
   * Check burst protection
   */
  private checkBurstProtection(
    record: RateLimitRecord,
    burstConfig: { burstWindow: number; maxBurstRequests: number }
  ): RateLimitResult {
    const now = Date.now()
    const burstRequests = record.requestHistory.filter(t => t > now - burstConfig.burstWindow)
    
    if (burstRequests.length >= burstConfig.maxBurstRequests) {
      return {
        allowed: false,
        blocked: true,
        retryAfter: now + burstConfig.burstWindow
      }
    }
    
    return { allowed: true }
  }

  /**
   * Calculate global system load
   */
  private calculateGlobalLoad(): number {
    const totalActiveClients = this.store.size
    const recentRequests = Array.from(this.store.values())
      .map(record => record.requestHistory.filter(t => t > Date.now() - 60000).length)
      .reduce((sum, count) => sum + count, 0)
    
    // Normalize to 0-1 scale based on reasonable thresholds
    const maxExpectedClients = 1000
    const maxExpectedRPM = 10000 // requests per minute
    
    const clientLoad = Math.min(totalActiveClients / maxExpectedClients, 1)
    const requestLoad = Math.min(recentRequests / maxExpectedRPM, 1)
    
    return (clientLoad + requestLoad) / 2
  }

  /**
   * Get comprehensive analytics
   */
  getAnalytics(): RateLimitAnalytics {
    this.updateAnalytics()
    return { ...this.analytics }
  }

  /**
   * Update analytics data
   */
  private updateAnalytics(): void {
    const activeRecords = Array.from(this.store.entries())
    
    this.analytics.uniqueClients = activeRecords.length
    this.analytics.avgRequestsPerClient = activeRecords.length > 0
      ? activeRecords.reduce((sum, [, record]) => sum + record.count, 0) / activeRecords.length
      : 0

    // Update top clients
    this.analytics.topClients = activeRecords
      .map(([identifier, record]) => ({
        identifier: identifier.substring(0, 20) + '...', // Anonymize
        requests: record.count,
        blocked: record.penalties > 0
      }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 10)
  }

  /**
   * Clear rate limit for specific identifier (admin function)
   */
  clearLimit(identifier: string): void {
    this.store.delete(identifier)
  }

  /**
   * Add to whitelist/blacklist dynamically
   */
  updateWhitelist(identifier: string, config: EnhancedRateLimitConfig): void {
    if (!config.whitelist) config.whitelist = []
    if (!config.whitelist.includes(identifier)) {
      config.whitelist.push(identifier)
    }
  }

  updateBlacklist(identifier: string, config: EnhancedRateLimitConfig): void {
    if (!config.blacklist) config.blacklist = []
    if (!config.blacklist.includes(identifier)) {
      config.blacklist.push(identifier)
    }
  }

  /**
   * Get detailed client information
   */
  getClientInfo(identifier: string): RateLimitRecord | null {
    return this.store.get(identifier) || null
  }

  /**
   * Clean up expired entries and reset penalties
   */
  private cleanup(): void {
    const now = Date.now()
    
    for (const [key, record] of this.store.entries()) {
      // Remove completely expired records
      if (now > record.resetTime && record.penalties === 0 && record.requestHistory.length === 0) {
        this.store.delete(key)
        continue
      }
      
      // Clean up old request history
      record.requestHistory = record.requestHistory.filter(t => t > now - (60 * 60 * 1000)) // Keep last hour
      
      // Reduce penalties over time (penalty decay)
      if (record.penalties > 0 && now > record.lastAttempt + (60 * 60 * 1000)) { // After 1 hour
        record.penalties = Math.max(0, record.penalties - 1)
        record.suspicious = false // Reset suspicious flag
      }
    }
  }

  /**
   * Export analytics data for monitoring
   */
  exportMetrics(): {
    timestamp: number
    metrics: RateLimitAnalytics
    systemLoad: number
    activeClients: number
  } {
    return {
      timestamp: Date.now(),
      metrics: this.getAnalytics(),
      systemLoad: this.calculateGlobalLoad(),
      activeClients: this.store.size
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
const enhancedRateLimiter = new EnhancedRateLimiter()

// Enhanced rate limit configurations
export const EnhancedRateLimitConfigs = {
  // Contact form with anti-spam measures
  contactForm: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 3,
    progressivePenalty: true,
    blockDuration: 5 * 60 * 1000, // 5 minutes base
    adaptiveThreshold: true,
    antiAbuse: true,
    burstProtection: {
      enabled: true,
      burstWindow: 10 * 1000, // 10 seconds
      maxBurstRequests: 2
    }
  },

  // API endpoints with moderate protection
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 100,
    progressivePenalty: false,
    blockDuration: 0,
    adaptiveThreshold: true,
    antiAbuse: true,
    burstProtection: {
      enabled: true,
      burstWindow: 5 * 1000, // 5 seconds
      maxBurstRequests: 20
    }
  },

  // Authentication with strict protection
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5,
    progressivePenalty: true,
    blockDuration: 10 * 60 * 1000, // 10 minutes base
    adaptiveThreshold: true,
    antiAbuse: true,
    burstProtection: {
      enabled: true,
      burstWindow: 30 * 1000, // 30 seconds
      maxBurstRequests: 3
    }
  },

  // File uploads with capacity management
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 10,
    progressivePenalty: true,
    blockDuration: 5 * 60 * 1000, // 5 minutes base
    adaptiveThreshold: true,
    antiAbuse: true,
    burstProtection: {
      enabled: true,
      burstWindow: 60 * 1000, // 1 minute
      maxBurstRequests: 3
    }
  }
} as const

/**
 * Helper functions for different rate limit types
 */
export function checkEnhancedContactFormRateLimit(
  identifier: string, 
  context?: { userAgent?: string; path?: string }
): RateLimitResult {
  return enhancedRateLimiter.checkLimit(identifier, EnhancedRateLimitConfigs.contactForm, context)
}

export function checkEnhancedApiRateLimit(
  identifier: string,
  context?: { userAgent?: string; path?: string; method?: string }
): RateLimitResult {
  return enhancedRateLimiter.checkLimit(identifier, EnhancedRateLimitConfigs.api, context)
}

export function checkEnhancedAuthRateLimit(
  identifier: string,
  context?: { userAgent?: string }
): RateLimitResult {
  return enhancedRateLimiter.checkLimit(identifier, EnhancedRateLimitConfigs.auth, context)
}

// Admin functions
export function getRateLimitAnalytics(): RateLimitAnalytics {
  return enhancedRateLimiter.getAnalytics()
}

export function exportRateLimitMetrics() {
  return enhancedRateLimiter.exportMetrics()
}

export function clearRateLimit(identifier: string): void {
  enhancedRateLimiter.clearLimit(identifier)
}

export function getClientRateLimitInfo(identifier: string): RateLimitRecord | null {
  return enhancedRateLimiter.getClientInfo(identifier)
}

export { enhancedRateLimiter }
// Type exports are already done via interface exports above