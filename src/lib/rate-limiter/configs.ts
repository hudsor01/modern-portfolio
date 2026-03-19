/**
 * Rate Limiter Configs
 * Preset EnhancedRateLimitConfigs for common use cases
 */

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
      maxBurstRequests: 2,
    },
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
      maxBurstRequests: 20,
    },
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
      maxBurstRequests: 3,
    },
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
      maxBurstRequests: 3,
    },
  },
} as const
