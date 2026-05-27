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
 *
 * Schema is `Record<string, unknown>` rather than a tighter generic
 * because callers use the table-arg form (`db.update(table)`,
 * `db.select().from(table)`) which gets its types from the table arg
 * itself, not the schema parameter. No caller uses `db.query.<table>`
 * (which would benefit from a propagated schema type), so the generic
 * was erased in practice — using `unknown` keeps the type honest.
 */
export function createScriptDb(schema: Record<string, unknown>) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not set')
  }
  return drizzle(neon(process.env.DATABASE_URL), { schema })
}
