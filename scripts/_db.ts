/**
 * Shared Drizzle bootstrap for `scripts/*` and `drizzle/seed.ts`.
 *
 * Why this exists: `src/db/index.ts` is gated by `'server-only'` and so
 * cannot be imported from Node CLI contexts. Each one-off script used
 * to repeat ~10 lines of neon+drizzle wiring; this collapses them to
 * one import and one call.
 */
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

/**
 * Create a Drizzle client bound to the given schema. Throws synchronously
 * if `DATABASE_URL` is unset so the failure surfaces at script start
 * rather than at first query.
 */
export function createScriptDb<TSchema extends Record<string, unknown>>(schema: TSchema) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not set')
  }
  return drizzle(neon(process.env.DATABASE_URL), { schema })
}
