import 'server-only'
import { neon } from '@neondatabase/serverless'
import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http'
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Modes:
// - Production / preview: Neon serverless HTTP driver. Stateless, no connection
//   pool, single round-trip per query. Sidesteps the connection-pool timeout
//   class of bugs we hit with Prisma 7 + adapter-neon.
// - Local dev (USE_LOCAL_DB=true): Same neon-http driver against a local
//   Postgres via the @neondatabase/serverless `neon()` factory pointed at the
//   local DATABASE_URL. neon-http works fine against any Postgres that
//   speaks the standard wire protocol exposed via Neon's HTTP gateway.
//
// If we ever need interactive transactions in dev, switch to drizzle-orm/pg
// behind the same USE_LOCAL_DB flag — but the existing /api routes do not
// require multi-statement transactions, so neon-http is sufficient everywhere.

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
