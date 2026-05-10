// @vitest-environment node
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'

// db.ts re-exports from @/db, which uses 'server-only'. Stub it out so the
// module can load under jsdom-isolated bundling.
vi.mock('server-only', () => ({}))

// Stub @neondatabase/serverless and drizzle so import-time client creation
// (Proxy.get triggers neon(url)) doesn't reach a live DB.
vi.mock('@neondatabase/serverless', () => ({
  neon: () => () => Promise.resolve([]),
}))

vi.mock('drizzle-orm/neon-http', async () => {
  return {
    drizzle: () => ({
      query: { __mock: true },
      select: () => ({ from: () => ({ where: () => Promise.resolve([]) }) }),
      insert: () => ({ values: () => ({ returning: () => Promise.resolve([]) }) }),
      update: () => ({ set: () => ({ where: () => Promise.resolve() }) }),
      execute: () => Promise.resolve([]),
    }),
  }
})

const ORIG_DATABASE_URL = process.env.DATABASE_URL

beforeAll(() => {
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
})

afterAll(() => {
  if (ORIG_DATABASE_URL === undefined) {
    delete process.env.DATABASE_URL
  } else {
    process.env.DATABASE_URL = ORIG_DATABASE_URL
  }
  // Reset the drizzle singleton so other test files don't reuse the mock client
  ;(globalThis as unknown as { __drizzle: unknown }).__drizzle = undefined
})

describe('@/lib/db re-exports', () => {
  it('re-exports the Drizzle client and schema bindings from @/db', async () => {
    const lib = await import('@/lib/db')
    const root = await import('@/db')
    // db Proxy reference is the same singleton
    expect(lib.db).toBe(root.db)
    // table exports are forwarded (smoke check on a known table)
    expect(lib).toHaveProperty('blogPosts')
  })

  it('the db Proxy has expected query/select/insert/update fields lazily', async () => {
    const { db } = await import('@/lib/db')
    // Lazy Proxy — first property access triggers client init via the mocked
    // `drizzle()` factory above. We assert the Proxy forwards the access (any
    // truthy value confirms Reflect.get(getClient(), ...) ran without throwing).
    expect((db as unknown as { query: unknown }).query).toBeDefined()
    expect(typeof (db as unknown as { select: unknown }).select).toBe('function')
    expect(typeof (db as unknown as { insert: unknown }).insert).toBe('function')
    expect(typeof (db as unknown as { update: unknown }).update).toBe('function')
  })

  it('throws DATABASE_URL is required when env var is unset', async () => {
    ;(globalThis as unknown as { __drizzle: unknown }).__drizzle = undefined
    delete process.env.DATABASE_URL
    vi.resetModules()
    const { db } = await import('@/db')
    expect(() => (db as unknown as { query: unknown }).query).toThrow(/DATABASE_URL is required/)
    // restore for subsequent tests
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
  })
})
