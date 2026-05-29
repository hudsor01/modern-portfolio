/**
 * Rate Limiter Store
 * The RateLimiter class with Map store, cleanup timer, and core logic
 */

import { logger } from '@/lib/logger'
import type {
  RateLimitRecord,
  RateLimitConfig,
  RateLimitAnalytics,
  RateLimitResult,
} from '@/types/security'
import { securityConfig } from '@/lib/security'

// Memory-management constants, each mapped to a DISTINCT security-config field.
// Previously several aliased the same field, which silently collapsed separate
// concepts — most consequentially the absolute ceiling onto the 15-min
// inactivity window, which let an active client's penalties/blocks be wiped
// every cleanup cycle and made the inactivity sweep unreachable.
const MAX_STORE_SIZE = securityConfig.rateLimitMaxStoreSize
const MAX_REQUEST_HISTORY_PER_CLIENT = securityConfig.rateLimitMaxHistoryPerClient
const REQUEST_HISTORY_RETENTION_MS = securityConfig.rateLimitHistoryRetentionMs
const CLIENT_EXPIRY_TIME = securityConfig.rateLimitClientExpiryMs
const CLEANUP_INTERVAL = 300000 // 5 minutes
const ABSOLUTE_EXPIRATION_MS = securityConfig.rateLimitAbsoluteExpiryMs
const EVICTION_BATCH_SIZE = 100
const EVICTION_TARGET_RATIO = 0.8
const GLOBAL_LOAD_CACHE_TTL_MS = 1000 // recompute the global-load signal at most once/sec

// Node.js 24: Implements Disposable for automatic cleanup via 'using' keyword
export class RateLimiter implements Disposable {
  private store = new Map<string, RateLimitRecord>()
  // Runtime allow/deny lists held as limiter state — never mutate the shared
  // per-route RateLimitConfig singletons (see addToWhitelist/addToBlacklist).
  private dynamicWhitelist = new Set<string>()
  private dynamicBlacklist = new Set<string>()
  // Cached global-load signal; recomputed at most once per TTL to avoid an
  // O(store size) scan on every checkLimit call.
  private cachedGlobalLoad = 0
  private globalLoadComputedAt = 0
  private analytics: RateLimitAnalytics = {
    totalRequests: 0,
    blockedRequests: 0,
    uniqueClients: 0,
    avgRequestsPerClient: 0,
    suspiciousActivities: 0,
    topClients: [],
    trends: {
      hourly: new Array(24).fill(0),
      daily: new Array(7).fill(0),
    },
  }
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Cleanup expired entries every configured interval
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
      this.updateAnalytics()
    }, CLEANUP_INTERVAL)
    this.cleanupInterval.unref?.()
  }

  /**
   * Check rate limit with smart detection
   */
  checkLimit(
    identifier: string,
    config: RateLimitConfig,
    context?: {
      userAgent?: string
      path?: string
      method?: string
    }
  ): RateLimitResult {
    const now = Date.now()

    // Check whitelist/blacklist first (per-route config + runtime overrides)
    if (config.whitelist?.includes(identifier) || this.dynamicWhitelist.has(identifier)) {
      return { allowed: true, reason: 'whitelisted', confidence: 1.0 }
    }

    if (config.blacklist?.includes(identifier) || this.dynamicBlacklist.has(identifier)) {
      this.analytics.blockedRequests++
      return {
        allowed: false,
        blocked: true,
        reason: 'blacklisted',
        confidence: 1.0,
        retryAfter: now + 24 * 60 * 60 * 1000, // 24 hours
      }
    }

    let record = this.store.get(identifier)

    // Initialize new record
    if (!record) {
      // Enforce maximum store size to prevent memory exhaustion
      if (this.store.size >= MAX_STORE_SIZE) {
        this.evictOldestEntries()
      }

      record = {
        count: 0,
        resetTime: now + config.windowMs,
        lastAttempt: now,
        penalties: 0,
        requestHistory: [],
        userAgent: context?.userAgent,
        suspicious: false,
        createdAt: now, // Track creation time for LRU eviction
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
            globalLoad: this.calculateGlobalLoad(),
          },
        }
      }
    }

    // Check if currently blocked due to penalties
    if (config.progressivePenalty && record.penalties > 0) {
      const penaltyMultiplier = record.suspicious ? 2 : 1
      const blockUntil =
        record.lastAttempt + config.blockDuration * 2 ** (record.penalties - 1) * penaltyMultiplier

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
            globalLoad: this.calculateGlobalLoad(),
          },
        }
      }
    }

    // Reset window if expired
    if (now > record.resetTime) {
      record.count = 0
      record.resetTime = now + config.windowMs
      this.trimRequestHistory(record, now, config.windowMs)
    }

    // Adaptive threshold based on global load and client risk
    let effectiveMaxAttempts = config.maxAttempts
    if (config.adaptiveThreshold) {
      const globalLoad = this.calculateGlobalLoad()
      const riskMultiplier = 1 - suspiciousScore * 0.5 // Reduce limit for risky clients
      const loadMultiplier = 1 - globalLoad * 0.3 // Reduce limit under high load

      effectiveMaxAttempts = Math.floor(config.maxAttempts * riskMultiplier * loadMultiplier)
      effectiveMaxAttempts = Math.max(effectiveMaxAttempts, 1) // Never go below 1
    }

    // Check if limit exceeded
    if (record.count >= effectiveMaxAttempts) {
      record.penalties += 1
      record.lastAttempt = now

      const penaltyMultiplier = record.suspicious ? 2 : 1
      const retryAfter = config.progressivePenalty
        ? record.lastAttempt +
          config.blockDuration * 2 ** (record.penalties - 1) * penaltyMultiplier
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
          globalLoad: this.calculateGlobalLoad(),
        },
      }
    }

    // Allow request and update counters
    record.count++
    record.lastAttempt = now
    record.requestHistory.push(now)
    this.trimRequestHistory(record, now, config.windowMs)

    return {
      allowed: true,
      remaining: effectiveMaxAttempts - record.count,
      resetTime: record.resetTime,
      confidence: 1.0,
      analytics: {
        clientRisk: suspiciousScore,
        globalLoad: this.calculateGlobalLoad(),
      },
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
      const recentRequests = record.requestHistory.filter((t) => t > now - 10000) // Last 10 seconds
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
        const variance =
          intervals.reduce((sum, interval) => sum + (interval - avgInterval) ** 2, 0) /
          intervals.length
        const standardDeviation = Math.sqrt(variance)

        // Low variance suggests automated requests
        if (standardDeviation < avgInterval * 0.1) {
          suspicionScore += 0.4
        }

        // Very high frequency
        if (avgInterval < 1000) {
          // Less than 1 second between requests
          suspicionScore += 0.3
        }
      }
    }

    // Check for suspicious user agent patterns
    if (context?.userAgent) {
      const ua = context.userAgent.toLowerCase()
      const suspiciousPatterns = [
        'bot',
        'crawler',
        'spider',
        'scraper',
        'curl',
        'wget',
        'python',
        'java',
      ]

      if (suspiciousPatterns.some((pattern) => ua.includes(pattern))) {
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
    const recentViolations = record.requestHistory.filter((t) => t > now - 60 * 60 * 1000) // Last hour
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
    const burstRequests = record.requestHistory.filter((t) => t > now - burstConfig.burstWindow)

    if (burstRequests.length >= burstConfig.maxBurstRequests) {
      return {
        allowed: false,
        blocked: true,
        retryAfter: now + burstConfig.burstWindow,
      }
    }

    return { allowed: true }
  }

  /**
   * Calculate global system load
   */
  private calculateGlobalLoad(): number {
    // Cached: this scans the whole store, but checkLimit calls it on every
    // request. With a large store that would be O(n) per request; recomputing
    // at most once per second keeps the hot path cheap while the signal (only
    // used for adaptive thresholds + analytics) stays fresh enough.
    const now = Date.now()
    if (now - this.globalLoadComputedAt < GLOBAL_LOAD_CACHE_TTL_MS) {
      return this.cachedGlobalLoad
    }

    const totalActiveClients = this.store.size
    const recentRequests = Array.from(this.store.values())
      .map((record) => record.requestHistory.filter((t) => t > now - 60000).length)
      .reduce((sum, count) => sum + count, 0)

    // Normalize to 0-1 scale based on the store's real capacity. Tie the
    // client-load denominator to the eviction target (the steady-state ceiling
    // LRU eviction drives the store toward) so the signal reaches 1.0 exactly
    // as eviction begins reclaiming — not at an arbitrary 10% of capacity.
    const maxExpectedClients = Math.floor(MAX_STORE_SIZE * EVICTION_TARGET_RATIO)
    const maxExpectedRPM = 10000 // requests per minute

    const clientLoad = Math.min(totalActiveClients / maxExpectedClients, 1)
    const requestLoad = Math.min(recentRequests / maxExpectedRPM, 1)

    const load = (clientLoad + requestLoad) / 2
    this.cachedGlobalLoad = load
    this.globalLoadComputedAt = now
    return load
  }

  /**
   * Enforce request history retention and size limits
   */
  private trimRequestHistory(record: RateLimitRecord, now: number, windowMs: number): void {
    const retentionMs = Math.max(windowMs, REQUEST_HISTORY_RETENTION_MS)
    const cutoff = now - retentionMs

    record.requestHistory = record.requestHistory.filter((t) => t > cutoff)

    if (record.requestHistory.length > MAX_REQUEST_HISTORY_PER_CLIENT) {
      record.requestHistory = record.requestHistory.slice(-MAX_REQUEST_HISTORY_PER_CLIENT)
    }
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
    this.analytics.avgRequestsPerClient =
      activeRecords.length > 0
        ? activeRecords.reduce((sum, [, record]) => sum + record.count, 0) / activeRecords.length
        : 0

    // Update top clients
    this.analytics.topClients = activeRecords
      .map(([identifier, record]) => ({
        identifier: `${identifier.substring(0, 20)}...`, // Anonymize
        requests: record.count,
        blocked: record.penalties > 0,
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
   * Dynamically allow/deny an identifier at runtime (admin functions).
   *
   * These mutate limiter-instance state only — they never touch the shared
   * per-route RateLimitConfig objects (which are module-level singletons, so
   * mutating them would leak across every request and could never be undone).
   * Allow and deny are mutually exclusive: adding to one removes from the other.
   */
  addToWhitelist(identifier: string): void {
    this.dynamicBlacklist.delete(identifier)
    this.dynamicWhitelist.add(identifier)
  }

  addToBlacklist(identifier: string): void {
    this.dynamicWhitelist.delete(identifier)
    this.dynamicBlacklist.add(identifier)
  }

  removeFromWhitelist(identifier: string): void {
    this.dynamicWhitelist.delete(identifier)
  }

  removeFromBlacklist(identifier: string): void {
    this.dynamicBlacklist.delete(identifier)
  }

  /**
   * Get detailed client information
   */
  getClientInfo(identifier: string): RateLimitRecord | null {
    return this.store.get(identifier) || null
  }

  /**
   * Evict oldest entries when store is full (LRU-style eviction)
   * Prioritizes removing records that are expired and have no penalties
   */
  private evictOldestEntries(): void {
    const now = Date.now()

    // Separate entries into categories for smart eviction
    const expiredNoPenalty: Array<{ key: string; record: RateLimitRecord; age: number }> = []
    const expiredWithPenalty: Array<{ key: string; record: RateLimitRecord; age: number }> = []
    const activeNoPenalty: Array<{ key: string; record: RateLimitRecord; age: number }> = []
    const activeWithPenalty: Array<{ key: string; record: RateLimitRecord; age: number }> = []

    for (const [key, record] of this.store.entries()) {
      const age = now - record.createdAt
      const isExpired = now > record.resetTime
      const hasPenalty = record.penalties > 0

      if (isExpired && !hasPenalty) {
        expiredNoPenalty.push({ key, record, age })
      } else if (isExpired && hasPenalty) {
        expiredWithPenalty.push({ key, record, age })
      } else if (!isExpired && !hasPenalty) {
        activeNoPenalty.push({ key, record, age })
      } else {
        activeWithPenalty.push({ key, record, age })
      }
    }

    // Sort each category by age (oldest first)
    expiredNoPenalty.sort((a, b) => b.age - a.age)
    expiredWithPenalty.sort((a, b) => b.age - a.age)
    activeNoPenalty.sort((a, b) => b.age - a.age)
    activeWithPenalty.sort((a, b) => b.age - a.age)

    // Eviction priority order:
    // 1. Expired records with no penalties (safest to remove)
    // 2. Expired records with penalties (might still be blocking)
    // 3. Active records with no penalties (least impactful)
    // 4. Active records with penalties (last resort)

    const allEntries = [
      ...expiredNoPenalty,
      ...expiredWithPenalty,
      ...activeNoPenalty,
      ...activeWithPenalty,
    ]

    // Remove oldest entries until we're under the limit
    const targetSize = Math.floor(MAX_STORE_SIZE * EVICTION_TARGET_RATIO) // Target configured ratio of max to prevent frequent eviction
    const toRemove = Math.min(EVICTION_BATCH_SIZE, this.store.size - targetSize)

    for (let i = 0; i < toRemove && i < allEntries.length; i++) {
      const entry = allEntries[i]
      if (entry) {
        this.store.delete(entry.key)
      }
    }
  }

  /**
   * Clean up expired entries and reset penalties.
   *
   * A single pass over the store collects keys to delete, then batch-deletes
   * after iterating. Deleting during Map iteration is well-defined and safe in
   * JS (the iterator simply skips not-yet-visited deleted keys), but the
   * collect-then-delete idiom keeps every deletion site in this class uniform
   * (see `evictOldestEntries`).
   */
  private cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    // Hard ceiling: a record is dropped once it exceeds absolute expiration,
    // regardless of recent activity or penalties. Checked first so it takes
    // precedence over the activity-based conditions below.
    const absoluteExpirationThreshold = now - ABSOLUTE_EXPIRATION_MS

    for (const [key, record] of this.store.entries()) {
      if (record.createdAt < absoluteExpirationThreshold) {
        keysToDelete.push(key)
        continue
      }

      // Remove completely expired records (no activity + no penalties + empty history)
      if (now > record.resetTime && record.penalties === 0 && record.requestHistory.length === 0) {
        keysToDelete.push(key)
        continue
      }

      // Remove records idle beyond the client-expiry window (inactivity sweep)
      if (now - record.lastAttempt > CLIENT_EXPIRY_TIME) {
        keysToDelete.push(key)
        continue
      }

      this.trimRequestHistory(record, now, REQUEST_HISTORY_RETENTION_MS)

      // Reduce penalties over time (penalty decay after 1 hour)
      if (record.penalties > 0 && now > record.lastAttempt + 60 * 60 * 1000) {
        record.penalties = Math.max(0, record.penalties - 1)
        record.suspicious = false // Reset suspicious flag
      }
    }

    // Batch delete expired records
    keysToDelete.forEach((key) => {
      this.store.delete(key)
    })

    if (keysToDelete.length > 0) {
      logger.debug('Rate limiter cleanup', {
        removedRecords: keysToDelete.length,
        remainingRecords: this.store.size,
      })
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
      activeClients: this.store.size,
    }
  }

  /**
   * Node.js 24: Explicit Resource Management - called automatically with 'using' keyword
   */
  [Symbol.dispose](): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.store.clear()
    // Reset analytics to prevent state accumulation between test runs
    this.analytics = {
      totalRequests: 0,
      blockedRequests: 0,
      uniqueClients: 0,
      avgRequestsPerClient: 0,
      suspiciousActivities: 0,
      topClients: [],
      trends: {
        hourly: new Array(24).fill(0),
        daily: new Array(7).fill(0),
      },
    }
  }
}

let _rateLimiter: RateLimiter | null = null

export function getRateLimiter(): RateLimiter {
  if (!_rateLimiter) {
    _rateLimiter = new RateLimiter()
  }
  return _rateLimiter
}
