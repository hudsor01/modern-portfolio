// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/env-validation', () => ({
  env: {
    NODE_ENV: 'development',
    ADMIN_API_TOKEN: undefined,
    ALLOW_SEED_IN_PRODUCTION: undefined,
  },
}))

// db is a Proxy over a lazy drizzle client — we mock the public surface
// the route actually touches: db.select(...).from(...) for the count,
// db.insert(...).values(...).returning() for inserts, db.update(...).set(...).where(...).
// Stub the chain to short-circuit at .from() and reuse the chain helpers.
const dbMocks = {
  selectCount: vi.fn(),
  insertReturning: vi.fn(),
  insertVoid: vi.fn(),
  update: vi.fn(),
}
vi.mock('@/lib/db', () => {
  // Drizzle query builders are thenable AND chainable. The seed route uses:
  //   db.select(...).from(t)                    → Promise<rows>
  //   db.select(...).from(t).where(...)         → Promise<rows>
  //   db.insert(t).values(v).returning()        → Promise<rows>
  //   db.insert(t).values(v)                    → Promise<void>  (no returning)
  //   db.update(t).set(s).where(...)            → Promise<void>
  // So every chain node implements both `.then` (await directly) AND a
  // continuation method like `.where`/`.returning`.
  const fromBuilder = () => {
    const promise = dbMocks.selectCount()
    return {
      where: () => promise,
      then: (...args: Parameters<Promise<unknown>['then']>) => promise.then(...args),
      catch: (...args: Parameters<Promise<unknown>['catch']>) => promise.catch(...args),
    }
  }
  const select = () => ({ from: () => fromBuilder() })
  const insertChain = () => ({
    values: () => {
      const voidPromise = dbMocks.insertVoid()
      return {
        returning: () => dbMocks.insertReturning(),
        then: (...args: Parameters<Promise<unknown>['then']>) => voidPromise.then(...args),
        catch: (...args: Parameters<Promise<unknown>['catch']>) => voidPromise.catch(...args),
      }
    },
  })
  const update = () => ({
    set: () => ({ where: () => dbMocks.update() }),
  })
  return {
    db: { select, insert: insertChain, update },
  }
})

vi.mock('@/lib/api-admin-auth', () => ({
  isAdminRequest: vi.fn(),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  createContextLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}))

import { env } from '@/lib/env-validation'
import { isAdminRequest } from '@/lib/api-admin-auth'

function req(headers: Record<string, string> = {}) {
  return new NextRequest('http://localhost:3000/api/seed', {
    method: 'POST',
    headers: { 'x-forwarded-for': '1.2.3.4', ...headers },
  })
}

describe('POST /api/seed', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(env as Record<string, unknown>).NODE_ENV = 'development'
    ;(env as Record<string, unknown>).ALLOW_SEED_IN_PRODUCTION = undefined
    vi.mocked(isAdminRequest).mockReturnValue(false)
    dbMocks.selectCount.mockResolvedValue([{ value: 0 }])
    dbMocks.insertReturning.mockResolvedValue([])
    dbMocks.insertVoid.mockResolvedValue(undefined)
    dbMocks.update.mockResolvedValue(undefined)
  })

  it('returns 404 in production without ALLOW_SEED_IN_PRODUCTION', async () => {
    ;(env as Record<string, unknown>).NODE_ENV = 'production'
    const { POST } = await import('@/app/api/seed/route')
    const res = await POST(req())
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body).toMatchObject({ success: false, error: 'Not found' })
  })

  it('returns 404 in production when ALLOW_SEED_IN_PRODUCTION is "false"', async () => {
    ;(env as Record<string, unknown>).NODE_ENV = 'production'
    ;(env as Record<string, unknown>).ALLOW_SEED_IN_PRODUCTION = 'false'
    const { POST } = await import('@/app/api/seed/route')
    const res = await POST(req())
    expect(res.status).toBe(404)
  })

  it('returns 401 when admin auth fails', async () => {
    ;(env as Record<string, unknown>).NODE_ENV = 'development'
    vi.mocked(isAdminRequest).mockReturnValue(false)
    const { POST } = await import('@/app/api/seed/route')
    const res = await POST(req())
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body).toMatchObject({ success: false, error: 'Unauthorized' })
  })

  it('returns 200 success:false when posts already exist', async () => {
    vi.mocked(isAdminRequest).mockReturnValue(true)
    dbMocks.selectCount.mockResolvedValueOnce([{ value: 5 }])

    const { POST } = await import('@/app/api/seed/route')
    const res = await POST(req())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({ success: false, message: 'Database already has data' })
  })

  it('returns 200 success on happy path with admin token', async () => {
    vi.mocked(isAdminRequest).mockReturnValue(true)
    // Empty database
    dbMocks.selectCount.mockResolvedValue([{ value: 0 }])
    // Author insert returns 1 row, then categories insert returns 2 rows.
    dbMocks.insertReturning.mockResolvedValueOnce([{ id: 'author-id-1' }]).mockResolvedValueOnce([
      { id: 'cat-id-1', name: 'Revenue Operations' },
      { id: 'cat-id-2', name: 'Data Analytics' },
    ])

    const { POST } = await import('@/app/api/seed/route')
    const res = await POST(req())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({
      success: true,
      message: 'Database seeded successfully',
      data: { author: 1, categories: 2, posts: 2 },
    })
  })
})
