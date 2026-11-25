// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PgDialect } from 'drizzle-orm/pg-core'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// The route imports `server-only`, which throws under Vitest's client context.
vi.mock('server-only', () => ({}))

const { loggerMock, envMock, returningMock, whereMock } = vi.hoisted(() => {
  const returningMock = vi.fn()
  return {
    loggerMock: {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
    },
    envMock: { CRON_SECRET: undefined as string | undefined },
    returningMock,
    whereMock: vi.fn(() => ({ returning: returningMock })),
  }
})

const { withMonitorMock } = vi.hoisted(() => ({
  withMonitorMock: vi.fn(<T>(_slug: string, cb: () => T, _cfg?: unknown): T => cb()),
}))
vi.mock('@sentry/nextjs', () => ({ withMonitor: withMonitorMock }))

vi.mock('@/lib/logger', () => ({ createContextLogger: () => loggerMock }))
vi.mock('@/lib/env-validation', () => ({ env: envMock }))

// db.delete(...).where(...).returning()
vi.mock('@/lib/db', () => ({
  db: { delete: () => ({ where: whereMock }) },
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
  new Request('http://test/api/cron/purge-contact-submissions', {
    headers: auth ? { authorization: auth } : {},
  })

beforeEach(() => {
  envMock.CRON_SECRET = SECRET
  returningMock.mockReset().mockResolvedValue([])
  whereMock.mockClear()
  loggerMock.info.mockClear()
  loggerMock.error.mockClear()
  withMonitorMock.mockClear()
})

describe('GET /api/cron/purge-contact-submissions', () => {
  it('rejects with an identical 401 body when CRON_SECRET is unset or the token is wrong', async () => {
    envMock.CRON_SECRET = undefined
    const unset = await GET(req(`Bearer ${SECRET}`))
    envMock.CRON_SECRET = SECRET
    const wrong = await GET(req(`Bearer ${'y'.repeat(48)}`))

    expect(unset.status).toBe(401)
    expect(wrong.status).toBe(401)
    expect(await unset.json()).toEqual(await wrong.json())
    expect(whereMock).not.toHaveBeenCalled()
    expect(withMonitorMock).not.toHaveBeenCalled()
  })

  it('rejects a missing Authorization header', async () => {
    const response = await GET(req())
    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' })
    expect(whereMock).not.toHaveBeenCalled()
  })

  it('reports the number of purged rows with no-store', async () => {
    returningMock.mockResolvedValue([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
    const response = await GET(req(`Bearer ${SECRET}`))

    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    await expect(response.json()).resolves.toEqual({ deleted: 3 })
    expect(loggerMock.info).toHaveBeenCalledWith('Purged contact submissions', { count: 3 })
  })

  it('is a no-op when nothing is old enough', async () => {
    const response = await GET(req(`Bearer ${SECRET}`))
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ deleted: 0 })
    expect(loggerMock.info).not.toHaveBeenCalled()
  })

  it('deletes only rows older than 24 months, with no request-controlled input', async () => {
    await GET(req(`Bearer ${SECRET}`))

    expect(whereMock).toHaveBeenCalledTimes(1)
    const [condition] = whereMock.mock.calls[0] as unknown as [
      Parameters<PgDialect['sqlToQuery']>[0],
    ]
    const { sql, params } = new PgDialect().sqlToQuery(condition)
    expect(sql).toMatch(/"createdAt" < now\(\) - interval '24 months'/)
    expect(params).toEqual([])
  })

  it('returns 500 and logs a PII-free error when the DB fails', async () => {
    returningMock.mockRejectedValue(new Error('connection refused'))
    const response = await GET(req(`Bearer ${SECRET}`))

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({ error: 'Internal Server Error' })
    expect(loggerMock.error).toHaveBeenCalledTimes(1)
  })

  it('runs inside a Sentry cron monitor whose schedule matches vercel.json', async () => {
    await GET(req(`Bearer ${SECRET}`))

    expect(withMonitorMock).toHaveBeenCalledTimes(1)
    const [slug, , config] = withMonitorMock.mock.calls[0] as unknown as [
      string,
      unknown,
      { schedule: { type: string; value: string } },
    ]
    expect(slug).toBe('purge-contact-submissions')
    expect(config.schedule).toEqual({
      type: 'crontab',
      value: vercelSchedule('/api/cron/purge-contact-submissions'),
    })
  })

  it('does not create a check-in for an unauthenticated call', async () => {
    await GET(req())
    expect(withMonitorMock).not.toHaveBeenCalled()
  })
})
