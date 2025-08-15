/**
 * Environment Variable Validation
 * Validates critical environment variables at startup to prevent runtime failures
 */

import { z } from 'zod'

// Define the environment schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  FROM_EMAIL: z.string().email('FROM_EMAIL must be a valid email').default('contact@richardwhudsonjr.com'),
  TO_EMAIL: z.string().email('TO_EMAIL must be a valid email').default('hello@richardwhudsonjr.com'),
  NEXT_PUBLIC_VERCEL_URL: z.string().url().optional(),
  VERCEL_URL: z.string().optional(),
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

// Export validated environment for use throughout the app
export const env = getValidatedEnv()