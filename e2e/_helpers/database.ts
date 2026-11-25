import type { APIRequestContext } from '@playwright/test'

/**
 * Whether the server under test has a working database.
 *
 * Most of this suite needs no database — every test but 48 passes against an
 * app built and served with no `DATABASE_URL`, because the DB-backed routes
 * degrade to empty states. Those 48 (5 in audit-regressions, 25 in blog, 1 in
 * rss-feed, 2 in review-b-geometry, 2 in timezone-hydration, 4 in
 * layout-stability, 3 in a11y-axe, 3 in a11y-typography, 3 in skip-link)
 * genuinely need seeded blog content: they read real post cards or posts, or
 * assert 404 behaviour for a slug that has to be absent from a populated
 * table.
 *
 * Locally that is invisible — `.env`, `.env.local` and `.env.development.local`
 * all carry a `DATABASE_URL`, and Next loads `.env.local` + `.env` itself even
 * for a production build, so the app always has a database no matter what the
 * shell environment says. In CI it has none unless an `E2E_DATABASE_URL` secret
 * is configured, and those tests fail with
 * `Error: DATABASE_URL is required` from src/lib/env-validation.ts.
 *
 * So the tests ask the running server rather than guessing from env vars — the
 * only signal that is true in both places. `/api/health` answers 200 only
 * when a `SELECT 1` succeeds (503 otherwise), so a 2xx is the signal. Add the
 * secret and they start running with no code change.
 *
 * Cached per worker process: this is one extra request, not one per test.
 */
let cached: Promise<boolean> | undefined

export function databaseAvailable(request: APIRequestContext): Promise<boolean> {
  cached ??= (async () => {
    try {
      const response = await request.get('/api/health')
      return response.ok()
    } catch {
      // Health endpoint unreachable — treat as "no database" rather
      // than failing here, so the skip reason stays accurate.
      return false
    }
  })()
  return cached
}

export const NEEDS_DATABASE =
  'needs a seeded database; set the E2E_DATABASE_URL secret to run this in CI'
