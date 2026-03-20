/**
 * API Rate Limiting — checkRateLimitOrRespond and RateLimitPresets
 */

import { NextRequest, NextResponse } from 'next/server'
import { getRateLimiter } from '@/lib/rate-limiter/store'
import { getClientIdentifier } from './api-request'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface RateLimitConfig {
  windowMs: number
  maxAttempts: number
  progressivePenalty?: boolean
  blockDuration?: number
  burstProtection?: {
    enabled: boolean
    burstWindow: number
    maxBurstRequests: number
  }
}

// ============================================================================
// RATE LIMIT PRESETS
// ============================================================================

/**
 * Preset rate limit configurations for common scenarios
 */
export const RateLimitPresets = {
  // For read operations (GET requests)
  read: {
    windowMs: 60 * 1000, // 1 minute
    maxAttempts: 100,
    progressivePenalty: false,
    blockDuration: 0,
    burstProtection: {
      enabled: true,
      burstWindow: 5 * 1000,
      maxBurstRequests: 120,
    },
  } as RateLimitConfig,

  // For write operations (POST, PUT, DELETE)
  write: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 30,
    progressivePenalty: true,
    blockDuration: 15 * 60 * 1000,
    burstProtection: {
      enabled: false,
      burstWindow: 10 * 1000,
      maxBurstRequests: 10,
    },
  } as RateLimitConfig,

  // For sensitive operations (contact form, auth)
  sensitive: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 10,
    progressivePenalty: true,
    blockDuration: 30 * 60 * 1000,
    burstProtection: {
      enabled: false,
      burstWindow: 10 * 1000,
      maxBurstRequests: 5,
    },
  } as RateLimitConfig,
}

// ============================================================================
// RATE LIMIT GUARD
// ============================================================================

/**
 * Check rate limit and return error response if exceeded.
 * Returns null if within limits, NextResponse if exceeded.
 */
export function checkRateLimitOrRespond(
  request: NextRequest,
  config: RateLimitConfig,
  path: string,
  method: string
): NextResponse | null {
  const clientId = getClientIdentifier(request)
  const rateLimiter = getRateLimiter()

  const result = rateLimiter.checkLimit(
    clientId,
    {
      windowMs: config.windowMs,
      maxAttempts: config.maxAttempts,
      progressivePenalty: config.progressivePenalty ?? false,
      blockDuration: config.blockDuration ?? 0,
      adaptiveThreshold: true,
      antiAbuse: true,
      burstProtection: config.burstProtection,
    },
    { path, method }
  )

  if (!result.allowed) {
    return NextResponse.json(
      {
        data: undefined as never,
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((result.retryAfter || 0) / 1000)),
          'X-RateLimit-Remaining': String(result.remaining || 0),
          'X-RateLimit-Reset': String(result.resetTime || 0),
        },
      }
    )
  }

  return null
}
