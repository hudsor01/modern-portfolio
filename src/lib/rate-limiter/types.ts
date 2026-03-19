/**
 * Rate Limiter Types
 * Re-exports shared security types and config used across rate-limiter modules
 */

import type { RateLimitRecord, EnhancedRateLimitConfig, RateLimitAnalytics, RateLimitResult } from '@/types/security'
import { securityConfig } from '@/lib/security'

export type { RateLimitRecord, EnhancedRateLimitConfig, RateLimitAnalytics, RateLimitResult }
export { securityConfig }
