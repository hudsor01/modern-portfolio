import type { APIRequestContext } from '@playwright/test'

/**
 * Whether the server under test has a working database.
 *
 * Most of this suite needs no database — every test but 31 passes against an app
 * built and served with no `DATABASE_URL`, because the DB-backed routes degrade
 * to empty states. Those 31 (5 in audit-regressions, 20 in blog, 2 in timezone-hydration, 4 in layout-stability) genuinely need
 * seeded blog content: they read real post cards or posts, or assert 404
 * behaviour for a slug that has to be absent from a populated table.
 *
 * Locally that is invisible — `.env`, `.env.local` and `.env.development.local`
 * all carry a `DATABASE_URL`, and Next loads `.env.local` + `.env` itself even
 * for a production build, so the app always has a database no matter what the
 * shell environment says. In CI it has none unless an `E2E_DATABASE_URL` secret
 * is configured, and those tests fail with
 * `Error: DATABASE_URL is required` from src/lib/env-validation.ts.
 *
 * So the tests ask the running server rather than guessing from env vars — the
 * only signal that is true in both places. `/api/health` already reports
 * `{"database":"up"}`. Add the secret and they start running with no code change.
 *
 * Cached per worker process: this is one extra request, not one per test.
 */
let cached: Promise<boolean> | undefined

export function databaseAvailable(request: APIRequestContext): Promise<boolean> {
  cached ??= (async () => {
    try {
      const response = await request.get('/api/health')
      if (!response.ok()) return false
      const body = (await response.json()) as { database?: string }
      return body.database === 'up'
    } catch {
      // Health endpoint unreachable or non-JSON — treat as "no database" rather
      // than failing here, so the skip reason stays accurate.
      return false
    }
  })()
  return cached
}

export const NEEDS_DATABASE =
  'needs a seeded database; set the E2E_DATABASE_URL secret to run this in CI'
