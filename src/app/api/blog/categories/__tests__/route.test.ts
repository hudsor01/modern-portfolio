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
        values: () => ({ returning: () => dbMocks.insertReturning() }),
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

  it('returns 400 when name missing', async () => {
    const res = await POST(reqPost({}))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body).toMatchObject({ success: false, error: 'Missing required field: name' })
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
})
