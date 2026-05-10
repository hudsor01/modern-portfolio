// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/projects', () => ({
  getProjects: vi.fn(),
}))

// Disable rate limiting in tests — the real helper consults a singleton
// in-memory store with shared state; we bypass it entirely.
vi.mock('@/lib/api-rate-limit', () => ({
  checkRateLimitOrRespond: vi.fn(() => null),
  RateLimitPresets: {
    read: {},
    write: {},
    sensitive: {},
  },
}))

import { GET } from '@/app/api/projects/route'
import { getProjects } from '@/lib/projects'
import { checkRateLimitOrRespond } from '@/lib/api-rate-limit'

const fakeProjects = [
  { id: 'p1', slug: 'one', title: 'Project One' },
  { id: 'p2', slug: 'two', title: 'Project Two' },
]

function makeRequest() {
  return new NextRequest('http://localhost:3000/api/projects', {
    headers: { 'x-forwarded-for': '1.2.3.4' },
  })
}

describe('GET /api/projects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(checkRateLimitOrRespond).mockReturnValue(null)
    vi.mocked(getProjects).mockResolvedValue(fakeProjects as never)
  })

  it('returns 200 with success+data array shape', async () => {
    const res = await GET(makeRequest())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({ success: true })
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data).toHaveLength(2)
    expect(body.data[0]).toMatchObject({ slug: 'one' })
  })

  it('sets long Cache-Control on the public projects list', async () => {
    const res = await GET(makeRequest())
    // Per next.config.js / route source: 1h browser, 2h CDN.
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=7200')
  })

  it('returns 500 with sanitized error when getProjects throws', async () => {
    vi.mocked(getProjects).mockRejectedValueOnce(new Error('disk on fire at /var/db'))
    const res = await GET(makeRequest())
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.success).toBe(false)
    // Sensitive paths must not leak through.
    expect(JSON.stringify(body)).not.toContain('disk on fire')
    expect(JSON.stringify(body)).not.toContain('/var/db')
  })

  it('short-circuits when rate-limit guard returns a response', async () => {
    const { NextResponse } = await import('next/server')
    vi.mocked(checkRateLimitOrRespond).mockReturnValueOnce(
      NextResponse.json({ success: false, error: 'rate' }, { status: 429 })
    )
    const res = await GET(makeRequest())
    expect(res.status).toBe(429)
    expect(getProjects).not.toHaveBeenCalled()
  })
})
