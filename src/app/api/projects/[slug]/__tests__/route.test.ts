// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/projects', () => ({
  getProject: vi.fn(),
}))
vi.mock('@/lib/api-rate-limit', () => ({
  checkRateLimitOrRespond: vi.fn(() => null),
  RateLimitPresets: { read: {}, write: {}, sensitive: {} },
}))

import { GET } from '@/app/api/projects/[slug]/route'
import { getProject } from '@/lib/projects'
import { checkRateLimitOrRespond } from '@/lib/api-rate-limit'

function ctx(slug: string) {
  return { params: Promise.resolve({ slug }) }
}
function req(slug: string) {
  return new NextRequest(`http://localhost:3000/api/projects/${slug}`, {
    headers: { 'x-forwarded-for': '1.2.3.4' },
  })
}

describe('GET /api/projects/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(checkRateLimitOrRespond).mockReturnValue(null)
  })

  it('returns 200 with the project on a known slug', async () => {
    vi.mocked(getProject).mockResolvedValueOnce({
      id: 'x',
      slug: 'revenue-kpi',
      title: 'Revenue Operations Dashboard',
    } as never)

    const res = await GET(req('revenue-kpi'), ctx('revenue-kpi'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({ success: true, data: { slug: 'revenue-kpi' } })
  })

  it('returns 404 with success:false when project not found', async () => {
    vi.mocked(getProject).mockResolvedValueOnce(null)
    const res = await GET(req('nope'), ctx('nope'))
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body).toMatchObject({ success: false, error: 'Project not found' })
  })

  it('returns 400 with validation error on slug containing illegal characters', async () => {
    // Route applies a regex `^[a-zA-Z0-9-_]+$` via slugSchema. A slash should
    // be rejected with a Zod validation error response (400).
    const res = await GET(req('bad/slug'), ctx('bad/slug'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.success).toBe(false)
  })

  it('returns 400 on empty slug', async () => {
    const res = await GET(req(''), ctx(''))
    expect(res.status).toBe(400)
  })

  it('returns 500 with sanitized error when getProject throws', async () => {
    vi.mocked(getProject).mockRejectedValueOnce(new Error('boom at /usr/local'))
    const res = await GET(req('foo'), ctx('foo'))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(JSON.stringify(body)).not.toContain('/usr/local')
  })
})
