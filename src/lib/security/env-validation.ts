/**
 * Environment Variable Validation
 * Validates critical environment variables at startup to prevent runtime failures
 */

import { z } from 'zod'

// Define the environment schema with enhanced security validation
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  FROM_EMAIL: z.string().email('FROM_EMAIL must be a valid email').default('contact@richardwhudsonjr.com'),
  TO_EMAIL: z.string().email('TO_EMAIL must be a valid email').default('hello@richardwhudsonjr.com'),
  NEXT_PUBLIC_VERCEL_URL: z.string().url().optional(),
  VERCEL_URL: z.string().optional(),
  // Security-critical environment variables
  JWT_SECRET: z.string()
    .min(32, 'JWT_SECRET must be at least 32 characters for security')
    .max(512, 'JWT_SECRET must not exceed 512 characters')
    .refine(
      (secret) => !/^(test|dev|development|password|secret|default)$/i.test(secret),
      'JWT_SECRET must not use common weak values'
    ),
  JWT_EXPIRES_IN: z.string()
    .regex(/^\d+[smhd]$/, 'JWT_EXPIRES_IN must be in format: 1h, 30m, 7d, etc.')
    .default('1h'),
  ADMIN_API_TOKEN: z.string()
    .min(32, 'ADMIN_API_TOKEN must be at least 32 characters')
    .optional(),
  // Site URL validation for CSP and CORS
  NEXT_PUBLIC_SITE_URL: z.string()
    .url('NEXT_PUBLIC_SITE_URL must be a valid URL')
    .refine(
      (url) => url.startsWith('https://') || process.env.NODE_ENV === 'development',
      'NEXT_PUBLIC_SITE_URL must use HTTPS in production'
    )
    .default(process.env.NODE_ENV === 'production' 
      ? 'https://richardwhudsonjr.com' 
      : 'http://localhost:3000'
    ),
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
      const missingVars = error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join('\n')
      throw new Error(`Environment validation failed:\n${missingVars}`)
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
    if (!env.JWT_SECRET || env.JWT_SECRET.length < 64) {
      errors.push('Production JWT_SECRET should be at least 64 characters')
    }
    
    if (env.ADMIN_API_TOKEN && env.ADMIN_API_TOKEN.length < 64) {
      warnings.push('Production ADMIN_API_TOKEN should be at least 64 characters')
    }
    
    if (!env.NEXT_PUBLIC_SITE_URL?.startsWith('https://')) {
      errors.push('Production site URL must use HTTPS')
    }
  }

  // Check for weak or predictable secrets
  const weakPatterns = [
    /^(123|abc|test|dev|admin|password|secret|default)/i,
    /^.{1,10}$/,  // Too short
    /^(.)\1{10,}$/  // Repeated characters
  ]
  
  weakPatterns.forEach((pattern, index) => {
    if (pattern.test(env.JWT_SECRET)) {
      errors.push(`JWT_SECRET appears to be weak (pattern ${index + 1})`)
    }
  })

  // Log warnings
  if (warnings.length > 0) {
    console.warn('[SECURITY WARNINGS]:')
    warnings.forEach(warning => console.warn(`  - ${warning}`))
  }

  // Throw on errors
  if (errors.length > 0) {
    throw new Error(`Security validation failed:\n${errors.map(e => `  - ${e}`).join('\n')}`)
  }
}

// Export validated environment for use throughout the app
let env: EnvConfig
try {
  env = getValidatedEnv()
  performSecurityChecks(env)
} catch (error) {
  console.error('[ENVIRONMENT VALIDATION FAILED]:', error)
  throw error
}

export { env }