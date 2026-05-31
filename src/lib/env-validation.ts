/**
 * Environment Variable Validation
 * Validates critical environment variables at startup to prevent runtime failures
 */

import { z } from 'zod'
import { createContextLogger } from '@/lib/logger'

const envLogger = createContextLogger('EnvValidation')

// Define the environment schema with enhanced security validation
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // Database - Required at runtime, optional at build time (CI may not have it)
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required')
    .refine(
      (url) => url.startsWith('postgresql://') || url.startsWith('postgres://'),
      'DATABASE_URL must be a valid PostgreSQL connection string'
    )
    .optional(),
  // Email service. Optional — when absent, emailService falls back to mock IDs
  // in development and returns a 503-shape "service not available" result in
  // production. The `.min(1)` only fires when the var is explicitly set to an
  // empty string (e.g. `RESEND_API_KEY=` in a .env file), which is almost
  // always a misconfiguration; reject loudly with a precise message rather
  // than silently treating empty as absent.
  RESEND_API_KEY: z
    .string()
    .min(
      1,
      'RESEND_API_KEY must be a non-empty string when set (use absent/unset to disable email)'
    )
    .optional(),
  // Resend sender — must be on the Resend-verified domain (richardwhudsonjr.com),
  // not a real mailbox. `noreply@` makes that explicit. Do NOT set this to the
  // icloud address: Resend can only send FROM a verified domain.
  FROM_EMAIL: z.email('FROM_EMAIL must be a valid email').default('noreply@richardwhudsonjr.com'),
  // Delivery recipient for contact-form submissions — a REAL inbox. The previous
  // default (hello@richardwhudsonjr.com) doesn't exist, so submissions had no
  // deliverable destination.
  TO_EMAIL: z.email('TO_EMAIL must be a valid email').default('hudsor01@icloud.com'),
  NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
  ADMIN_API_TOKEN: z.string().min(32, 'ADMIN_API_TOKEN must be at least 32 characters').optional(),
  // Production seed gate — /api/seed returns 404 in production unless set to 'true'
  ALLOW_SEED_IN_PRODUCTION: z.enum(['true', 'false']).optional(),
  // Metrics API authentication
  METRICS_API_TOKEN: z
    .string()
    .min(32, 'METRICS_API_TOKEN must be at least 32 characters')
    .optional(),
  // Site URL validation for CSP and CORS
  NEXT_PUBLIC_SITE_URL: z
    .url('NEXT_PUBLIC_SITE_URL must be a valid URL')
    .refine(
      (url) => url.startsWith('https://') || process.env.NODE_ENV === 'development',
      'NEXT_PUBLIC_SITE_URL must use HTTPS in production'
    )
    .default(
      process.env.NODE_ENV === 'production'
        ? 'https://richardwhudsonjr.com'
        : 'http://localhost:3000'
    ),
  // Local database toggle
  USE_LOCAL_DB: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
})

export type EnvConfig = z.infer<typeof envSchema>

/**
 * Validates environment variables at startup
 * Throws detailed error if validation fails
 */
export function validateEnvironment(): EnvConfig {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n')
      throw new Error(`Environment validation failed:\n${missingVars}`, { cause: error })
    }
    throw error
  }
}

/**
 * Safe environment getter with validation
 * Returns validated environment variables
 */
export function getValidatedEnv(): EnvConfig {
  return validateEnvironment()
}

/**
 * Security-focused environment checks
 * Performs additional security validations beyond schema
 */
export function performSecurityChecks(env: EnvConfig): void {
  const warnings: string[] = []
  const errors: string[] = []

  // Check for production security requirements
  if (env.NODE_ENV === 'production') {
    if (!env.ADMIN_API_TOKEN) {
      warnings.push(
        'ADMIN_API_TOKEN unset in production — /api/seed and all blog mutation endpoints (POST/PUT/DELETE) will return 401 to every caller, including legitimate admins'
      )
    } else if (env.ADMIN_API_TOKEN.length < 64) {
      warnings.push('Production ADMIN_API_TOKEN should be at least 64 characters')
    }

    if (env.METRICS_API_TOKEN && env.METRICS_API_TOKEN.length < 64) {
      warnings.push('Production METRICS_API_TOKEN should be at least 64 characters')
    }

    if (!env.NEXT_PUBLIC_SITE_URL?.startsWith('https://')) {
      errors.push('Production site URL must use HTTPS')
    }
  }

  // Log warnings
  if (warnings.length > 0) {
    envLogger.warn('[SECURITY WARNINGS]', { warnings })
  }

  // Throw on errors
  if (errors.length > 0) {
    throw new Error(`Security validation failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`)
  }
}

// Export validated environment for use throughout the app
let env: EnvConfig
try {
  env = getValidatedEnv()
  performSecurityChecks(env)
} catch (error) {
  envLogger.error('[ENVIRONMENT VALIDATION FAILED]', error instanceof Error ? error : undefined)
  throw error
}

export { env }
