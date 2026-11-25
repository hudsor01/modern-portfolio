import { expect, test } from '@playwright/test'

/**
 * PERF-01 proof kept in the repo: Sentry Replay (rrweb) must stay out of first-load JS.
 *
 * Fetches each page's HTML, collects every `<script src>` the document loads up front,
 * fetches those chunks and requires that none carries the `__rrweb` marker. The replay
 * integration is added after the load event from a separate chunk, so it never appears in
 * this list. A positive control loads the page and requires that some `/_next/static` chunk
 * fetched after idle DOES carry `__rrweb`, so a Sentry upgrade that renames the marker fails
 * the suite instead of letting the negative check pass vacuously. The control runs only when the build
 * inlined a DSN (without one the SDK, and so replay, is disabled by design). Runs against the production
 * build only (a dev server bundles differently).
 */

const ROUTES = ['/', '/contact']

/** A Sentry DSN as the build inlines it into client JS (`https://<key>@o<org>.ingest.<region>.sentry.io/<project>`). */
const INLINED_DSN = /https:\/\/[0-9a-f]+@o\d+\.ingest\.(?:[a-z]+\.)?sentry\.io\/\d+/

/** Every `/_next/static/` script the route's HTML loads up front. */
async function initialScripts(
  request: import('@playwright/test').APIRequestContext,
  route: string,
): Promise<string[]> {
  const html = await (await request.get(route)).text()
  return [
    ...new Set(
      [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)].map((m) =>
        (m[1] ?? '').replace(/&amp;/g, '&'),
      ),
    ),
  ].filter((src) => src.startsWith('/_next/static/'))
}

test.describe('replay stays out of first-load JS', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'bundle contents are browser-independent; checked once')
  })

  for (const route of ROUTES) {
    test(`no initial <script src> chunk on ${route} contains __rrweb`, async ({ request }) => {
      const srcs = await initialScripts(request, route)
      // A page this size ships several framework + app chunks; zero means the parse broke.
      expect(srcs.length, `initial script chunks found on ${route}`).toBeGreaterThan(3)

      const offenders: string[] = []
      for (const src of srcs) {
        const response = await request.get(src)
        expect(response.status(), src).toBe(200)
        if ((await response.text()).includes('__rrweb')) offenders.push(src)
      }
      expect(offenders, `first-load chunks containing __rrweb on ${route}`).toEqual([])
    })
  }

  test('positive control: a chunk loaded after idle carries the __rrweb marker', async ({
    page,
    request,
  }) => {
    // Replay only loads when the browser SDK is enabled, i.e. the build inlined
    // NEXT_PUBLIC_SENTRY_DSN. CI builds without Sentry secrets have none, so
    // there is nothing to load; with a DSN present the chunk must arrive.
    let hasDsn = false
    for (const src of await initialScripts(request, '/')) {
      if (INLINED_DSN.test(await (await request.get(src)).text())) {
        hasDsn = true
        break
      }
    }
    test.skip(!hasDsn, 'build has no NEXT_PUBLIC_SENTRY_DSN, so the browser SDK (and replay) is disabled')

    const chunks = new Set<string>()
    page.on('response', (response) => {
      const { pathname } = new URL(response.url())
      if (pathname.startsWith('/_next/static/') && pathname.endsWith('.js')) chunks.add(response.url())
    })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // Replay is added from its own chunk once the browser is idle, so poll until it has loaded.
    await expect
      .poll(
        async () => {
          for (const url of chunks) {
            const response = await request.get(url)
            if (response.ok() && (await response.text()).includes('__rrweb')) return true
          }
          return false
        },
        { message: 'no loaded /_next/static chunk contains __rrweb', timeout: 30_000 },
      )
      .toBe(true)
  })
})
