// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Control NODE_ENV via env-validation mock — production must 404, dev must
// return the debug payload.
vi.mock('@/lib/env-validation', () => ({
  env: {
    NODE_ENV: 'development',
  },
}))

vi.mock('@/lib/api-rate-limit', () => ({
  checkRateLimitOrRespond: vi.fn(() => null),
  RateLimitPresets: { read: {}, write: {}, sensitive: {} },
}))

vi.mock('@sentry/nextjs', () => ({
  getClient: vi.fn(() => ({
    getOptions: () => ({
      dsn: 'https://abc@o123.ingest.sentry.io/456',
      enabled: true,
      environment: 'test',
      tracesSampleRate: 0.1,
      integrations: [{}, {}, {}],
    }),
  })),
}))

import { env } from '@/lib/env-validation'

function req() {
  return new NextRequest('http://localhost:3000/api/sentry-debug', {
    headers: { 'x-forwarded-for': '1.2.3.4' },
  })
}

describe('GET /api/sentry-debug', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(env as Record<string, unknown>).NODE_ENV = 'development'
  })

  it('returns 404 in production (route hidden)', async () => {
    ;(env as Record<string, unknown>).NODE_ENV = 'production'
    const { GET } = await import('@/app/api/sentry-debug/route')
    const res = await GET(req())
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body).toMatchObject({ success: false })
  })

  it('returns 200 with sentry config snapshot in development', async () => {
    ;(env as Record<string, unknown>).NODE_ENV = 'development'
    const { GET } = await import('@/app/api/sentry-debug/route')
    const res = await GET(req())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toMatchObject({
      sentryConfigured: true,
      enabled: true,
      environment: 'test',
    })
    // DSN must NEVER appear verbatim — only the marker + host.
    expect(body.dsn).toBe('SET (hidden for security)')
    expect(JSON.stringify(body)).not.toContain('@o123.ingest.sentry.io/456')
  })

  it('reports DSN host (not raw DSN) when configured', async () => {
    ;(env as Record<string, unknown>).NODE_ENV = 'development'
    const { GET } = await import('@/app/api/sentry-debug/route')
    const res = await GET(req())
    const body = await res.json()
    expect(body.dsnHost).toBe('o123.ingest.sentry.io')
  })
})
