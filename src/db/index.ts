import 'server-only'
import { neon } from '@neondatabase/serverless'
import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http'
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Modes:
// - Production / preview: Neon serverless HTTP driver. Stateless, no connection
//   pool, single round-trip per query. Sidesteps the connection-pool timeout
//   class of bugs we hit with Prisma 7 + adapter-neon.
// - Local dev: the same driver, so DATABASE_URL must point at a Neon branch.
//   neon-http sends each query as an HTTPS request to Neon's SQL-over-HTTP
//   endpoint for the URL's host; a plain local Postgres doesn't serve one, and
//   nothing here overrides `neonConfig.fetchEndpoint`.
//
// If we ever need interactive transactions, switch to drizzle-orm/node-postgres
// — but the existing /api routes do not require multi-statement transactions,
// so neon-http is sufficient everywhere.

declare global {
  // eslint-disable-next-line no-var
  var __drizzle: NeonHttpDatabase<typeof schema> | undefined
}

function createClient(): NeonHttpDatabase<typeof schema> {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is required')
  }
  const sql = neon(url)
  return drizzleHttp(sql, { schema, logger: process.env.NODE_ENV === 'development' })
}

function getClient(): NeonHttpDatabase<typeof schema> {
  if (!globalThis.__drizzle) {
    globalThis.__drizzle = createClient()
  }
  return globalThis.__drizzle
}

// Lazy proxy — preserves the previous `db.ts` contract: importing this module
// does not instantiate the client, so build workers that never query don't
// pay the init cost.
export const db: NeonHttpDatabase<typeof schema> = new Proxy(
  {} as NeonHttpDatabase<typeof schema>,
  {
    get(_target, prop, receiver) {
      return Reflect.get(getClient(), prop, receiver)
    },
  }
)

export { schema }
export * from './schema'
