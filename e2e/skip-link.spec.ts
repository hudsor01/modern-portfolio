import { expect, type Page, test } from '@playwright/test'
import { databaseAvailable, NEEDS_DATABASE } from './_helpers/database'
import { getOnly, settlePage } from './_helpers/settle'

/**
 * A11Y-04: the skip link is the first tab stop and moves focus to #main-content
 * on every route, including 404s.
 * A11Y-05: exactly one <main>, one h1, and no heading-level skips on every route
 * (covers revenue-kpi and the NarrativeSections h3s per RESEARCH Open Question 3;
 * no NarrativeSections edit, this test proves it). Lazy charts are mounted by
 * scrolling through the page first. GET-only: non-GET requests are aborted.
 */

const PROJECT_SLUGS = [
  'cac-unit-economics',
  'churn-retention',
  'commission-optimization',
  'customer-lifetime-value',
  'deal-funnel',
  'forecast-pipeline-intelligence',
  'lead-attribution',
  'multi-channel-attribution',
  'partner-performance',
  'partnership-program-implementation',
  'quota-territory-management',
  'revenue-kpi',
  'revenue-operations-center',
  'sales-enablement',
]

const STATIC_ROUTES = [
  '/',
  '/about',
  '/projects',
  ...PROJECT_SLUGS.map((slug) => `/projects/${slug}`),
  '/blog',
  '/contact',
  '/resume',
  '/resume/view',
  '/tools',
  '/tools/pipeline-coverage-calculator',
  '/tools/revops-maturity-scorecard',
  '/privacy',
  '/contact/sent',
  '/this-page-does-not-exist',
  '/projects/nope',
]

const DB_ROUTES = ['/blog/nope', '/blog/category/nope']

async function checkRoute(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: 'load' })

  await expect(page.locator('main'), `${path} <main> count`).toHaveCount(1)
  await expect(page.locator('#main-content'), `${path} #main-content count`).toHaveCount(1)
  await expect(page.locator('#main-content')).toHaveAttribute('tabindex', '-1')
  await expect(page.locator('a[href="#main-content"]')).toHaveCount(1)

  await page.keyboard.press('Tab')
  const skip = page.locator('a[href="#main-content"]')
  await expect(skip, `${path} skip link focus`).toBeFocused()
  // Focused is not enough: the link must be the topmost element at its own centre,
  // i.e. not painted underneath the fixed header (WCAG 2.4.11).
  await expect(skip, `${path} skip link visible`).toBeVisible()
  const box = await skip.boundingBox()
  expect(box, `${path} skip link has a box`).not.toBeNull()
  const topHref = await page.evaluate(
    ([x, y]) => document.elementFromPoint(x ?? 0, y ?? 0)?.closest('a')?.getAttribute('href') ?? null,
    [(box?.x ?? 0) + (box?.width ?? 0) / 2, (box?.y ?? 0) + (box?.height ?? 0) / 2],
  )
  expect(topHref, `${path} skip link is not obscured by the header`).toBe('#main-content')
  await page.keyboard.press('Enter')
  await expect(page.locator('#main-content'), `${path} main focus after Enter`).toBeFocused()

  await settlePage(page)

  const headings = await page.evaluate(() =>
    Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      .filter((el) => (el as HTMLElement).checkVisibility())
      .map((el) => ({
        level: Number(el.tagName.slice(1)),
        text: (el.textContent ?? '').trim().slice(0, 60),
      })),
  )

  expect(headings.length, `${path} has headings`).toBeGreaterThan(0)
  expect(headings[0]?.level, `${path} first heading is h1`).toBe(1)
  expect(
    headings.filter((h) => h.level === 1).length,
    `${path} h1 count`,
  ).toBe(1)

  const skips: string[] = []
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1]
    const cur = headings[i]
    if (prev && cur && cur.level > prev.level + 1) {
      skips.push(`h${prev.level} "${prev.text}" -> h${cur.level} "${cur.text}"`)
    }
  }
  expect(skips, `${path} heading skips`).toEqual([])
}

for (const path of STATIC_ROUTES) {
  test(`${path} skip link, single main, heading outline`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'route loop runs once, in Chromium')
    await getOnly(page)
    await checkRoute(page, path)
  })
}

for (const path of DB_ROUTES) {
  test(`${path} skip link, single main, heading outline`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'route loop runs once, in Chromium')
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
    await getOnly(page)
    await checkRoute(page, path)
  })
}

test('every other sitemap route passes the skip link and outline gate', async ({
  page,
  request,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'route loop runs once, in Chromium')
  test.skip(!(await databaseAvailable(request)), NEEDS_DATABASE)
  test.setTimeout(240_000)

  const xml = await (await request.get('/sitemap.xml')).text()
  const paths = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((m) => new URL(m[1] ?? '').pathname)
    .filter((p) => !STATIC_ROUTES.includes(p))

  await getOnly(page)
  for (const path of paths) {
    await test.step(path, async () => {
      await checkRoute(page, path)
    })
  }
})
