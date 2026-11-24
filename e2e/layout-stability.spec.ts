import { expect, test } from '@playwright/test'
import { postCards } from './_helpers/blog'
import { databaseAvailable, NEEDS_DATABASE } from './_helpers/database'
import { settlePage } from './_helpers/settle'
import { PROJECT_COUNT } from './_helpers/project-slugs'

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

/** Card preview padding that the rows must fit inside: `pt-12` (48px, clears the legend and arrow) + `pb-3` (12px). */
const CARD_PREVIEW_PADDING_Y = 48 + 12

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

type Box = { x: number; y: number; width: number; height: number }

function intersects(a: Box, b: Box): boolean {
  return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height
}

test.describe('Project preview geometry (UI-06)', () => {
  const VIEWPORTS = [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]
  for (const viewport of VIEWPORTS) {
    for (const [path, expected] of [
      ['/projects', PROJECT_COUNT],
      ['/', 4],
    ] as const) {
      test(`preview boxes keep 16:10 on ${path} @${viewport.width}px`, async ({ browser }, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium', 'checked once, on chromium')
        const context = await browser.newContext({ viewport, reducedMotion: 'reduce' })
        try {
          const page = await context.newPage()
          await page.goto(path)
          await settlePage(page)
          const media = page.locator('[data-slot="project-media"]')
          await expect(media).toHaveCount(expected)
          const boxes = await media.evaluateAll((els) =>
            els.map((el) => {
              const r = el.getBoundingClientRect()
              return { width: r.width, height: r.height }
            }),
          )
          expect(boxes).toHaveLength(expected)
          for (const b of boxes) {
            expect(b.width).toBeGreaterThan(0)
            expect(Math.abs(b.height - b.width / 1.6)).toBeLessThanOrEqual(1)
          }
        } finally {
          await context.close()
        }
      })
    }
  }

  test('preview content fits under the badge band and clears legend and badge @390px', async ({
    browser,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'checked once, on chromium')
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: 'reduce',
    })
    try {
      const page = await context.newPage()
      await page.goto('/projects')
      await settlePage(page)
      const cards = page.locator('main article')
      await expect(cards).toHaveCount(PROJECT_COUNT)

      const report = await cards.evaluateAll((els) => {
        const box = (el: Element | null) => {
          if (!el) return null
          const r = el.getBoundingClientRect()
          return { x: r.x, y: r.y, width: r.width, height: r.height }
        }
        return els.map((el) => ({
          media: box(el.querySelector('[data-slot="project-media"]')),
          rows: box(el.querySelector('[data-slot="preview-rows"]')),
          rowBoxes: Array.from(el.querySelectorAll('[data-slot="preview-row"]')).map((r) => box(r)),
          legend: box(el.querySelector('[data-slot="preview-legend"]')),
          badge: box(el.querySelector('[data-slot="featured-badge"]')),
          metrics: box(el.querySelector('[data-slot="preview-metrics"]')),
        }))
      })
      expect(report).toHaveLength(PROJECT_COUNT)

      let rowCards = 0
      let metricCards = 0
      for (const card of report) {
        expect(card.media).not.toBeNull()
        const media = card.media as Box
        if (card.rows) {
          rowCards += 1
          expect(card.rows.height).toBeLessThanOrEqual(media.height - CARD_PREVIEW_PADDING_Y)
          for (const row of card.rowBoxes as Box[]) {
            if (card.legend) expect(intersects(row, card.legend)).toBe(false)
            if (card.badge) expect(intersects(row, card.badge)).toBe(false)
          }
        }
        if (card.metrics) {
          metricCards += 1
          const m = card.metrics
          expect(m.x).toBeGreaterThanOrEqual(media.x)
          expect(m.y).toBeGreaterThanOrEqual(media.y)
          expect(m.x + m.width).toBeLessThanOrEqual(media.x + media.width)
          expect(m.y + m.height).toBeLessThanOrEqual(media.y + media.height)
        }
      }
      // Both preview kinds must be exercised or the loop above proves nothing.
      expect(rowCards).toBeGreaterThan(0)
      expect(metricCards).toBeGreaterThan(0)
    } finally {
      await context.close()
    }
  })
})
