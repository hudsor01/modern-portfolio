// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

vi.mock('@/lib/api-csrf', () => ({
  validateCSRFOrRespond: vi.fn(async () => null),
}))
vi.mock('@/lib/api-admin-auth', () => ({
  isAdminRequest: vi.fn(() => true),
}))
vi.mock('@/lib/api-rate-limit', () => ({
  checkRateLimitOrRespond: vi.fn(() => null),
  RateLimitPresets: { read: {}, write: {}, sensitive: {} },
}))

const dbMocks = vi.hoisted(() => ({
  selectRows: vi.fn(),
  findFirst: vi.fn(),
  insertReturning: vi.fn(),
  insertValues: vi.fn(),
}))

vi.mock('@/lib/db', () => {
  // db.select().from(t).orderBy(...) — needs to be both thenable and chainable.
  const selectChain = () => {
    const node: Record<string, unknown> = {}
    node.from = () => node
    node.orderBy = () => dbMocks.selectRows()
    node.then = (...a: Parameters<Promise<unknown>['then']>) => dbMocks.selectRows().then(...a)
    return node
  }
  return {
    db: {
      query: { categories: { findFirst: dbMocks.findFirst } },
      select: selectChain,
      insert: () => ({
        values: (v: unknown) => {
          dbMocks.insertValues(v)
          return { returning: () => dbMocks.insertReturning() }
        },
      }),
    },
  }
})

vi.mock('@/lib/logger', () => ({
  createContextLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}))

import { fitMetaDescription } from '@/lib/blog-excerpt'
import { GET, POST } from '@/app/api/blog/categories/route'
import { validateCSRFOrRespond } from '@/lib/api-csrf'
import { isAdminRequest } from '@/lib/api-admin-auth'

const sampleCategory = {
  id: 'cat-1',
  name: 'Revenue Operations',
  slug: 'revenue-operations',
  description: null,
  color: '#6B7280',
  icon: null,
  postCount: 0,
  totalViews: 0,
  createdAt: new Date('2026-01-01T00:00:00Z'),
}

function reqPost(body: unknown) {
  return new NextRequest('http://localhost:3000/api/blog/categories', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('GET /api/blog/categories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    dbMocks.selectRows.mockResolvedValue([sampleCategory])
  })

  it('returns 200 with success+data', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({ success: true })
    expect(body.data[0]).toMatchObject({ slug: 'revenue-operations' })
  })

  it('sets public Cache-Control', async () => {
    const res = await GET()
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=300, s-maxage=600')
  })

  it('returns 500 with sanitized error on db throw', async () => {
    dbMocks.selectRows.mockRejectedValueOnce(new Error('boom at /var/db'))
    const res = await GET()
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(JSON.stringify(body)).not.toContain('/var/db')
  })
})

describe('POST /api/blog/categories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(isAdminRequest).mockReturnValue(true)
    vi.mocked(validateCSRFOrRespond).mockResolvedValue(null)
    dbMocks.findFirst.mockResolvedValue(undefined)
    dbMocks.insertReturning.mockResolvedValue([sampleCategory])
  })

  it('returns 401 when admin token missing', async () => {
    vi.mocked(isAdminRequest).mockReturnValueOnce(false)
    const res = await POST(reqPost({ name: 'Revenue Operations' }))
    expect(res.status).toBe(401)
    expect(vi.mocked(validateCSRFOrRespond)).not.toHaveBeenCalled()
    expect(dbMocks.findFirst).not.toHaveBeenCalled()
  })

  it('returns 403 when CSRF guard responds', async () => {
    vi.mocked(validateCSRFOrRespond).mockResolvedValueOnce(
      NextResponse.json({ success: false }, { status: 403 })
    )
    const res = await POST(reqPost({ name: 'x' }))
    expect(res.status).toBe(403)
    expect(dbMocks.findFirst).not.toHaveBeenCalled()
  })

  it('returns 400 when name missing (zod validation)', async () => {
    const res = await POST(reqPost({}))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body).toMatchObject({ success: false, error: 'Invalid request body' })
  })

  it('returns 409 when slug already exists', async () => {
    dbMocks.findFirst.mockResolvedValueOnce({ id: 'existing' })
    const res = await POST(reqPost({ name: 'Revenue Operations' }))
    expect(res.status).toBe(409)
  })

  it('returns 201 on happy path', async () => {
    const res = await POST(reqPost({ name: 'Revenue Operations' }))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body).toMatchObject({
      success: true,
      message: 'Blog category created successfully',
      data: { name: 'Revenue Operations' },
    })
  })

  const PROSE_META =
    'Pipeline data drifts from reality in seven predictable ways. Each one has a report that catches it and a weekly inspection that keeps it honest. Teams that skip the inspection end up forecasting from stale stages.'

  it('trims a 161+ character meta at a boundary and returns 201', async () => {
    expect(PROSE_META.length).toBeGreaterThan(160)
    const res = await POST(reqPost({ name: 'Revenue Operations', metaDescription: PROSE_META }))
    expect(res.status).toBe(201)
    const stored = dbMocks.insertValues.mock.calls[0]?.[0]?.metaDescription as string
    expect(stored.length).toBeLessThanOrEqual(160)
    expect(stored).toBe(fitMetaDescription(PROSE_META))
  })

  it('stores a meta of 160 characters or fewer unchanged and an omitted one as null', async () => {
    await POST(reqPost({ name: 'Revenue Operations', metaDescription: 'Short meta.' }))
    expect(dbMocks.insertValues.mock.calls[0]?.[0]?.metaDescription).toBe('Short meta.')
    await POST(reqPost({ name: 'Revenue Operations' }))
    expect(dbMocks.insertValues.mock.calls[1]?.[0]?.metaDescription).toBeNull()
  })

  it('accepts a 5000-character meta and stores at most 160 characters', async () => {
    const res = await POST(
      reqPost({ name: 'Revenue Operations', metaDescription: `${'word '.repeat(1000)}end` })
    )
    expect(res.status).toBe(201)
    const stored = dbMocks.insertValues.mock.calls[0]?.[0]?.metaDescription as string
    expect(stored.length).toBeLessThanOrEqual(160)
    expect(stored.match(/…/g)?.length ?? 0).toBeLessThanOrEqual(1)
  })

  it('accepts a 2000-character description and 15 keywords incl. a 70-char one', async () => {
    const res = await POST(
      reqPost({
        name: 'rev-ops',
        description: 'Revenue operations keeps the pipeline honest. '.repeat(45),
        keywords: [...Array.from({ length: 14 }, (_, i) => `kw${i}`), 'k'.repeat(70)],
      })
    )
    expect(res.status).toBe(201)
    const v = dbMocks.insertValues.mock.calls[0]?.[0]
    expect((v.description as string).length).toBeLessThanOrEqual(500)
    expect(v.keywords).toHaveLength(10)
  })

  it('still returns 400 for an icon over 50 characters', async () => {
    const res = await POST(reqPost({ name: 'rev-ops', icon: 'i'.repeat(51) }))
    expect(res.status).toBe(400)
  })
})
