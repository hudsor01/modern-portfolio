// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { APIRequestContext } from '@playwright/test'

// Contract test: the REAL /api/health GET() output feeds the REAL e2e
// databaseAvailable() gate. If the gate ever reads a body field the trimmed
// payload no longer has, every DB-gated e2e spec would skip silently while CI
// stays green — this test fails first.
vi.mock('@/lib/db', () => ({
  db: {
    execute: vi.fn(),
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
  createContextLogger: () => ({
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  }),
}))

async function load() {
  // Fresh module graph = fresh `cached` promise in the helper.
  vi.resetModules()
  const { GET } = await import('@/app/api/health/route')
  const { databaseAvailable } = await import('../../../../../e2e/_helpers/database')
  const get = vi.fn(async (_url: string) => {
    const res = await GET()
    return { ok: () => res.ok, status: () => res.status, json: () => res.json() }
  })
  return { databaseAvailable, get, stub: { get } as unknown as APIRequestContext }
}

describe('e2e databaseAvailable() against the real /api/health', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('resolves true when the db ping succeeds', async () => {
    const { databaseAvailable, get, stub } = await load()
    // Re-import resets modules, so the db mock instance is the freshly mocked one.
    const { db: freshDb } = await import('@/lib/db')
    vi.mocked(freshDb.execute).mockResolvedValue({ rows: [] } as never)

    await expect(databaseAvailable(stub)).resolves.toBe(true)
    expect(get).toHaveBeenCalledTimes(1)
    expect(get).toHaveBeenCalledWith('/api/health')
  })

  it('resolves false when the db ping fails', async () => {
    const { databaseAvailable, stub } = await load()
    const { db: freshDb } = await import('@/lib/db')
    vi.mocked(freshDb.execute).mockRejectedValue(new Error('connection refused'))

    await expect(databaseAvailable(stub)).resolves.toBe(false)
  })

  it('resolves false when the request itself throws', async () => {
    const { databaseAvailable } = await load()
    const stub = {
      get: vi.fn(async () => {
        throw new Error('ECONNREFUSED')
      }),
    } as unknown as APIRequestContext

    await expect(databaseAvailable(stub)).resolves.toBe(false)
  })

  it('caches: two calls issue one request', async () => {
    const { databaseAvailable, get, stub } = await load()
    const { db: freshDb } = await import('@/lib/db')
    vi.mocked(freshDb.execute).mockResolvedValue({ rows: [] } as never)

    await databaseAvailable(stub)
    await databaseAvailable(stub)
    expect(get).toHaveBeenCalledTimes(1)
  })
})
