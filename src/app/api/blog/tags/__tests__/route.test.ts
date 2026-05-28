// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

vi.mock('@/lib/api-csrf', () => ({
  validateCSRFOrRespond: vi.fn(async () => null),
}))
vi.mock('@/lib/api-admin-auth', () => ({
  isAdminRequest: vi.fn(() => true),
}))

const dbMocks = vi.hoisted(() => ({
  selectRows: vi.fn(),
  findFirst: vi.fn(),
  insertReturning: vi.fn(),
}))

vi.mock('@/lib/db', () => {
  // db.select().from(t).where(...).orderBy(...).limit?(...)
  const selectChain = () => {
    const node: Record<string, unknown> = {}
    node.from = () => node
    node.where = () => node
    node.orderBy = () => node
    node.limit = () => dbMocks.selectRows()
    node.then = (...a: Parameters<Promise<unknown>['then']>) => dbMocks.selectRows().then(...a)
    node.catch = (...a: Parameters<Promise<unknown>['catch']>) => dbMocks.selectRows().catch(...a)
    return node
  }
  return {
    db: {
      query: { tags: { findFirst: dbMocks.findFirst } },
      select: selectChain,
      insert: () => ({
        values: () => ({
          returning: () => dbMocks.insertReturning(),
        }),
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

import { GET, POST } from '@/app/api/blog/tags/route'
import { validateCSRFOrRespond } from '@/lib/api-csrf'
import { isAdminRequest } from '@/lib/api-admin-auth'

const sampleTag = {
  id: 'tag-1',
  name: 'rev-ops',
  slug: 'rev-ops',
  description: null,
  color: '#6B7280',
  postCount: 0,
  totalViews: 0,
  createdAt: new Date('2026-01-01T00:00:00Z'),
}

function reqGet(query = '') {
  return new NextRequest(`http://localhost:3000/api/blog/tags${query}`)
}
function reqPost(body: unknown) {
  return new NextRequest('http://localhost:3000/api/blog/tags', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('GET /api/blog/tags', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    dbMocks.selectRows.mockResolvedValue([sampleTag])
  })

  it('returns 200 with success+data array', async () => {
    const res = await GET(reqGet())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({ success: true })
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data[0]).toMatchObject({ name: 'rev-ops' })
  })

  it('sets public Cache-Control', async () => {
    const res = await GET(reqGet())
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=300, s-maxage=600')
  })

  it('returns 500 with sanitized error on db throw', async () => {
    dbMocks.selectRows.mockRejectedValueOnce(new Error('boom at /var/db'))
    const res = await GET(reqGet())
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(JSON.stringify(body)).not.toContain('/var/db')
  })
})

describe('POST /api/blog/tags', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(isAdminRequest).mockReturnValue(true)
    vi.mocked(validateCSRFOrRespond).mockResolvedValue(null)
    dbMocks.findFirst.mockResolvedValue(undefined)
    dbMocks.insertReturning.mockResolvedValue([sampleTag])
  })

  it('returns 401 when admin token missing', async () => {
    vi.mocked(isAdminRequest).mockReturnValueOnce(false)
    const res = await POST(reqPost({ name: 'rev-ops' }))
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
    const res = await POST(reqPost({ name: 'rev-ops' }))
    expect(res.status).toBe(409)
  })

  it('returns 201 on happy path', async () => {
    const res = await POST(reqPost({ name: 'rev-ops' }))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body).toMatchObject({
      success: true,
      message: 'Blog tag created successfully',
      data: { name: 'rev-ops' },
    })
  })
})
