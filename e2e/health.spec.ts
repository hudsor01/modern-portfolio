import { expect, test } from '@playwright/test'
import { databaseAvailable } from './_helpers/database'

/** F-12 guard: /api/health publishes liveness only, and the DB gate agrees with it. */

test('/api/health body is only a status, never cached', async ({ request }) => {
  const response = await request.get('/api/health')
  const status = response.status()
  expect([200, 503]).toContain(status)

  const text = await response.text()
  const body = JSON.parse(text) as Record<string, unknown>

  if (status === 200) expect(body).toEqual({ status: 'ok' })
  else expect(body).toEqual({ status: 'error' })

  expect(Object.keys(body)).toHaveLength(1)
  for (const leaked of ['database', 'timestamp', 'version', 'uptime']) {
    expect(text).not.toContain(leaked)
  }
  expect(response.headers()['cache-control'] ?? '').toContain('no-store')
})

test('databaseAvailable() agrees with /api/health', async ({ request }) => {
  const response = await request.get('/api/health')
  expect(await databaseAvailable(request)).toBe(response.ok())
})

test('/api/health-check still answers plain OK', async ({ request }) => {
  const response = await request.get('/api/health-check')
  expect(response.status()).toBe(200)
  expect(await response.text()).toBe('OK')
})
