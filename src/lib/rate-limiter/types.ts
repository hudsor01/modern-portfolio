/**
 * Rate Limiter Types
 * Re-exports shared security types and config used across rate-limiter modules
 */

import type { RateLimitRecord } from '@/types/security'
import { EnhancedRateLimitConfig, RateLimitAnalytics, RateLimitResult } from '@/types/security'
import { securityConfig } from '@/lib/security'

export type { RateLimitRecord }
export { EnhancedRateLimitConfig, RateLimitAnalytics, RateLimitResult, securityConfig }
