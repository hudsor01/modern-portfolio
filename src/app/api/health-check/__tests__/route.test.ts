// @vitest-environment node
import { describe, it, expect } from 'vitest'

import { GET, HEAD } from '@/app/api/health-check/route'

describe('GET /api/health-check', () => {
  it('returns 200 with plain "OK" body', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('text/plain')
    const text = await res.text()
    expect(text).toBe('OK')
  })

  it('sets aggressive no-cache headers (CF/Vercel probe contract)', async () => {
    const res = await GET()
    expect(res.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate')
    expect(res.headers.get('Pragma')).toBe('no-cache')
    expect(res.headers.get('Expires')).toBe('0')
  })
})

describe('HEAD /api/health-check', () => {
  it('returns 200 with empty body', async () => {
    const res = await HEAD()
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('text/plain')
    // HEAD responses must not have a body. fetch streams a null body for
    // these — read it and confirm it's empty.
    const text = await res.text()
    expect(text).toBe('')
  })

  it('sets the same no-cache header set as GET', async () => {
    const res = await HEAD()
    expect(res.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate')
    expect(res.headers.get('Pragma')).toBe('no-cache')
    expect(res.headers.get('Expires')).toBe('0')
  })
})
