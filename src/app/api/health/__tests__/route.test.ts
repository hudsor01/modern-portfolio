// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the db module before importing the route. The route calls
// `db.execute(sql\`SELECT 1\`)` for the liveness probe — we control the
// resolution to flip between ok / error paths.
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

import { GET } from '@/app/api/health/route'
import { db } from '@/lib/db'

describe('GET /api/health', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 with exactly { status: "ok" } on successful db ping', async () => {
    vi.mocked(db.execute).mockResolvedValueOnce({ rows: [{ '?column?': 1 }] } as never)

    const res = await GET()

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: 'ok' })
    expect(res.headers.get('Content-Type')).toContain('application/json')
  })

  it('returns 503 with exactly { status: "error" } when db.execute throws', async () => {
    vi.mocked(db.execute).mockRejectedValueOnce(new Error('connection refused'))

    const res = await GET()

    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body).toEqual({ status: 'error' })
    // Sanitized error contract — no stack or original message exposed.
    expect(JSON.stringify(body)).not.toContain('connection refused')
    expect(JSON.stringify(body)).not.toMatch(/at .+:\d+/)
  })

  it('sets Cache-Control: no-store on success', async () => {
    vi.mocked(db.execute).mockResolvedValueOnce({ rows: [] } as never)
    const res = await GET()
    expect(res.headers.get('Cache-Control')).toBe('no-store')
  })

  it('sets Cache-Control: no-store on failure', async () => {
    vi.mocked(db.execute).mockRejectedValueOnce(new Error('boom'))
    const res = await GET()
    expect(res.headers.get('Cache-Control')).toBe('no-store')
  })
})
