/**
 * Rate Limiter Helper Functions
 * Standalone helper functions for common rate limiting use cases
 */

import type { RateLimitResult } from '@/types/security'
import { RateLimitConfigs } from './configs'
import { getRateLimiter } from './store'

/**
 * Check rate limit for contact form submissions
 */
export function checkContactFormRateLimit(
  identifier: string,
  context?: { userAgent?: string; path?: string }
): RateLimitResult {
  // Validate identifier is non-empty
  if (!identifier || typeof identifier !== 'string' || identifier.trim().length === 0) {
    return {
      allowed: false,
      blocked: true,
      reason: 'invalid_identifier',
      confidence: 1.0,
      retryAfter: Date.now() + 60000,
    }
  }
  return getRateLimiter().checkLimit(identifier.trim(), RateLimitConfigs.contactForm, context)
}
