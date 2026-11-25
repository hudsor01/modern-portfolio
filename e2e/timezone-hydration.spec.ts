import { expect, test } from '@playwright/test'
import { postCards } from './_helpers/blog'
import { databaseAvailable, NEEDS_DATABASE } from './_helpers/database'

/**
 * BUG-01 guard: `<time>` text must be identical in the server HTML and after
 * hydration, whatever timezone the browser runs in. The server's own TZ is
 * never assumed (host TZ locally, UTC in CI).
 */

const HYDRATION_ERROR =
  /hydrat|Minified React error #(418|423|425)|did not match|server rendered HTML/i

function decode(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function normalise(text: string): string {
  return decode(text).replace(/\s+/g, ' ').trim()
}

function extractTimes(html: string): string[] {
  const out: string[] = []
  for (const match of html.matchAll(/<time\b[^>]*>([\s\S]*?)<\/time>/g)) {
    out.push(normalise((match[1] ?? '').replace(/<!--.*?-->/g, '').replace(/<[^>]*>/g, '')))
  }
  return out
}

async function checkParity(
  page: import('@playwright/test').Page,
  url: string,
  errors: string[],
  requireTimes: boolean
) {
  const ssr = extractTimes(await (await page.request.get(url)).text())
  await page.goto(url)
  await page.waitForLoadState('networkidle')
  const hydrated = (await page.locator('time').allTextContents()).map(normalise)
  if (requireTimes) expect(ssr.length, `${url} has no <time> in SSR HTML`).toBeGreaterThan(0)
  expect(hydrated, `${url} hydrated <time> text differs from SSR`).toEqual(ssr)
  expect(errors, `${url} produced hydration/page errors`).toEqual([])
}

for (const tz of ['Pacific/Auckland', 'America/Chicago']) {
  test.describe(`timezone ${tz}`, () => {
    test.use({ timezoneId: tz })

    test('blog list, post and category have SSR/hydrated date parity', async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name !== 'chromium', 'timezone matrix runs once, on chromium')
      test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)

      const errors: string[] = []
      page.on('pageerror', (e) => errors.push(e.message))
      page.on('console', (m) => {
        if (m.type() === 'error' && HYDRATION_ERROR.test(m.text())) errors.push(m.text())
      })

      await page.goto('/blog')
      await page.waitForLoadState('networkidle')
      const postHref = (await postCards(page).first().getAttribute('href')) ?? ''
      expect(postHref).toMatch(/^\/blog\/[^/]+$/)

      const sitemap = await (await page.request.get('/sitemap.xml')).text()
      const categoryLoc = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
        .map((m) => new URL(m[1] ?? '').pathname)
        .find((p) => p.startsWith('/blog/category/'))
      expect(categoryLoc, 'DB is up but sitemap has no blog category').toBeTruthy()

      for (const url of ['/blog', postHref, categoryLoc as string]) {
        errors.length = 0
        await checkParity(page, url, errors, true)
      }
    })

    test('/privacy has no hydration errors and date parity', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'chromium', 'timezone matrix runs once, on chromium')
      const errors: string[] = []
      page.on('pageerror', (e) => errors.push(e.message))
      page.on('console', (m) => {
        if (m.type() === 'error' && HYDRATION_ERROR.test(m.text())) errors.push(m.text())
      })
      await checkParity(page, '/privacy', errors, true)
    })
  })
}
