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
    burstWindow: number
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
  confidence?: number
  analytics?: {
    clientRisk: number
    globalLoad: number
  }
}
