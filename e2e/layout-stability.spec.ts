import { expect, test } from '@playwright/test'
import { postCards } from './_helpers/blog'
import { databaseAvailable, NEEDS_DATABASE } from './_helpers/database'

/**
 * BUG-02 + BUG-05 guard: no horizontal overflow and CLS < 0.1 on every audited
 * page at four widths. Layout-shift entries are Chromium-only.
 */

declare global {
  interface Window {
    __cls: number
  }
}

const BLOG_POST = '__first_blog_post__'
const PAGES = [
  '/',
  '/about',
  '/projects',
  '/projects/revenue-kpi',
  '/projects/deal-funnel',
  '/blog',
  BLOG_POST,
  '/contact',
  '/resume',
  '/tools',
  '/tools/pipeline-coverage-calculator',
  '/tools/revops-maturity-scorecard',
  '/privacy',
  '/this-page-does-not-exist',
]
const WIDTHS = [360, 390, 768, 1440]

test.describe.configure({ mode: 'parallel' })

for (const path of PAGES) {
  for (const width of WIDTHS) {
    test(`${path} @${width}px`, async ({ browser }, testInfo) => {
      test.skip(testInfo.project.name !== 'chromium', 'layout-shift API is Chromium-only')

      const context = await browser.newContext({ viewport: { width, height: 900 } })
      try {
        await context.addInitScript(() => {
          window.__cls = 0
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number }
              if (!shift.hadRecentInput) window.__cls += shift.value
            }
          }).observe({ type: 'layout-shift', buffered: true })
        })
        const page = await context.newPage()

        let target = path
        if (path === BLOG_POST) {
          test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
          await page.goto('/blog')
          await page.waitForLoadState('networkidle')
          target = (await postCards(page).first().getAttribute('href')) ?? ''
          expect(target).toMatch(/^\/blog\/[^/]+$/)
        }

        await page.goto(target)
        await page.waitForLoadState('networkidle')

        const total = await page.evaluate(() => document.documentElement.scrollHeight)
        for (let y = 0; y < total; y += 900) {
          await page.mouse.wheel(0, 900)
          await page.waitForTimeout(150)
        }
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.waitForTimeout(1500)

        const { cls, scrollWidth, clientWidth } = await page.evaluate(() => ({
          cls: window.__cls,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }))
        expect(cls, `${target} @${width}px CLS`).toBeLessThan(0.1)
        expect(scrollWidth, `${target} @${width}px horizontal overflow`).toBeLessThanOrEqual(
          clientWidth
        )
      } finally {
        await context.close()
      }
    })
  }
}

test('deal-funnel first paint has content, no spinner (BUG-05)', async ({ request }) => {
  const html = await (await request.get('/projects/deal-funnel')).text()
  expect(html).toContain('Total Opportunities')
  expect(html).not.toContain('aria-label="Loading"')
})
