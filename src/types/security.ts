/**
 * Security Types - Centralized for rate limiting and security
 * Consolidated from src/lib/security/rate-limiter.ts
 */

export interface RateLimitRecord {
  count: number
  resetTime: number
  lastAttempt: number
  penalties: number
  requestHistory: number[]
  userAgent?: string
  suspicious: boolean
  createdAt: number
}

export interface BurstProtectionConfig {
  enabled: boolean
  burstWindow: number
  maxBurstRequests: number
}

export interface RateLimitConfig {
  windowMs: number
  maxAttempts: number
  // Optional behavioral knobs — presets may omit them; checkRateLimitOrRespond
  // fills the defaults (`?? false` / `?? 0`, adaptiveThreshold/antiAbuse true)
  // before the config reaches the rate-limiter store.
  progressivePenalty?: boolean
  blockDuration?: number
  adaptiveThreshold?: boolean
  antiAbuse?: boolean
  whitelist?: string[]
  blacklist?: string[]
  burstProtection?: BurstProtectionConfig
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
  confidence?: number
  analytics?: {
    clientRisk: number
    globalLoad: number
  }
}
