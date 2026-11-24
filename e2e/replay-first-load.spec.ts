import { expect, test } from '@playwright/test'

/**
 * PERF-01 proof kept in the repo: Sentry Replay (rrweb) must stay out of first-load JS.
 *
 * Fetches each page's HTML, collects every `<script src>` the document loads up front,
 * fetches those chunks and requires that none carries the `__rrweb` marker. The replay
 * integration is added after the load event from a separate chunk, so it never appears in
 * this list. A positive control loads the page and requires that some `/_next/static` chunk
 * fetched after idle DOES carry `__rrweb`, so a Sentry upgrade that renames the marker fails
 * the suite instead of letting the negative check pass vacuously. Runs against the production build only (a dev server bundles differently).
 */

const ROUTES = ['/', '/contact']

test.describe('replay stays out of first-load JS', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'bundle contents are browser-independent; checked once')
  })

  for (const route of ROUTES) {
    test(`no initial <script src> chunk on ${route} contains __rrweb`, async ({ request }) => {
      const html = await (await request.get(route)).text()
      const srcs = [
        ...new Set(
          [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)].map((m) =>
            (m[1] ?? '').replace(/&amp;/g, '&'),
          ),
        ),
      ].filter((src) => src.startsWith('/_next/static/'))
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
