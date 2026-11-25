// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// The route imports `server-only`, which throws under Vitest's client context.
vi.mock('server-only', () => ({}))

const { withMonitorMock } = vi.hoisted(() => ({
  withMonitorMock: vi.fn(<T>(_slug: string, cb: () => T, _cfg?: unknown): T => cb()),
}))
vi.mock('@sentry/nextjs', () => ({ withMonitor: withMonitorMock }))

vi.mock('@/lib/logger', () => ({
  createContextLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  }),
}))

const { envMock, returningMock } = vi.hoisted(() => ({
  envMock: { CRON_SECRET: undefined as string | undefined },
  returningMock: vi.fn(),
}))

vi.mock('@/lib/env-validation', () => ({ env: envMock }))

// db.update(...).set(...).where(...).returning()
vi.mock('@/lib/db', () => ({
  db: {
    update: () => ({ set: () => ({ where: () => ({ returning: returningMock }) }) }),
  },
}))

import { GET } from '../route'

const vercelSchedule = (path: string) =>
  (
    JSON.parse(readFileSync(join(process.cwd(), 'vercel.json'), 'utf8')) as {
      crons: { path: string; schedule: string }[]
    }
  ).crons.find((c) => c.path === path)?.schedule

const SECRET = 'x'.repeat(48)
const req = (auth?: string) =>
  new Request('http://test/api/cron/publish-scheduled', {
    headers: auth ? { authorization: auth } : {},
  })

beforeEach(() => {
  envMock.CRON_SECRET = SECRET
  returningMock.mockReset().mockResolvedValue([])
  withMonitorMock.mockClear()
})

describe('GET /api/cron/publish-scheduled', () => {
  it('publishes due posts and reports their slugs', async () => {
    returningMock.mockResolvedValue([
      { id: '1', slug: 'first-post' },
      { id: '2', slug: 'second-post' },
    ])

    const response = await GET(req(`Bearer ${SECRET}`))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      published: 2,
      slugs: ['first-post', 'second-post'],
    })
  })

  it('is a no-op when nothing is due', async () => {
    const response = await GET(req(`Bearer ${SECRET}`))
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ published: 0, slugs: [] })
  })

  it('never caches — a cached 200 would make later runs edge no-ops', async () => {
    const response = await GET(req(`Bearer ${SECRET}`))
    expect(response.headers.get('cache-control')).toBe('no-store')
  })

  it('rejects a missing Authorization header', async () => {
    const response = await GET(req())
    expect(response.status).toBe(401)
    expect(returningMock).not.toHaveBeenCalled()
  })

  it('rejects a wrong token', async () => {
    const response = await GET(req(`Bearer ${'y'.repeat(48)}`))
    expect(response.status).toBe(401)
    expect(returningMock).not.toHaveBeenCalled()
  })

  it('rejects a non-Bearer scheme', async () => {
    const response = await GET(req(SECRET))
    expect(response.status).toBe(401)
    expect(returningMock).not.toHaveBeenCalled()
  })

  // Fails closed. An unset secret must not mean "no auth required" — this
  // endpoint is a public URL, and an open version would let anyone
  // force-publish embargoed drafts.
  it('rejects every caller when CRON_SECRET is unset', async () => {
    envMock.CRON_SECRET = undefined
    expect((await GET(req())).status).toBe(401)
    expect((await GET(req('Bearer '))).status).toBe(401)
    expect((await GET(req('Bearer undefined'))).status).toBe(401)
    expect(returningMock).not.toHaveBeenCalled()
  })

  it('returns 500 rather than leaking a DB error', async () => {
    returningMock.mockRejectedValue(new Error('connection refused'))
    const response = await GET(req(`Bearer ${SECRET}`))
    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({ error: 'Internal Server Error' })
  })

  it('runs inside a Sentry cron monitor whose schedule matches vercel.json', async () => {
    await GET(req(`Bearer ${SECRET}`))

    expect(withMonitorMock).toHaveBeenCalledTimes(1)
    const [slug, , config] = withMonitorMock.mock.calls[0] as unknown as [
      string,
      unknown,
      { schedule: { type: string; value: string } },
    ]
    expect(slug).toBe('publish-scheduled')
    expect(config.schedule).toEqual({
      type: 'crontab',
      value: vercelSchedule('/api/cron/publish-scheduled'),
    })
  })

  it('does not create a check-in for an unauthenticated call', async () => {
    await GET(req())
    expect(withMonitorMock).not.toHaveBeenCalled()
  })
})
