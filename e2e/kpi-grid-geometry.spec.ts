import { expect, test } from '@playwright/test'
import { PROJECT_SLUGS_ON_DISK } from './_helpers/project-slugs'

/**
 * QA F-21a guard (A11Y-06): every four-column KPI grid lays out ceil(n/4) rows
 * with min(n, 4) cards in the first row at 1024, 1129 and 1280px (no 3+1 wrap),
 * and at 1024px (the narrowest four-across width) no card's value, label or
 * trend overflows the card.
 */

test.describe.configure({ mode: 'parallel' })

const WIDTHS = [1024, 1129, 1280]

for (const width of WIDTHS) {
  for (const slug of PROJECT_SLUGS_ON_DISK) {
    test(`/projects/${slug} KPI rows of four @${width}px`, async ({ browser }, testInfo) => {
      test.skip(testInfo.project.name !== 'chromium', 'geometry checked once, on chromium')

      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: 'reduce',
      })
      try {
        await context.route('**/*', (route) => {
          const method = route.request().method()
          return method === 'GET' || method === 'HEAD' ? route.continue() : route.abort()
        })
        const page = await context.newPage()
        await page.goto(`/projects/${slug}`)

        const grids = page.locator(
          '[data-testid="metrics-grid"][data-columns="4"]:not([data-loading])'
        )
        await expect(grids.first().locator('[data-slot="metric-value"]').first()).toBeVisible()
        const gridCount = await grids.count()
        expect(gridCount, `${slug}: four-column grids`).toBeGreaterThan(0)

        for (let g = 0; g < gridCount; g++) {
          const result = await grids.nth(g).evaluate((grid, checkFit) => {
            const cards = Array.from(grid.children) as HTMLElement[]
            // offsetTop is layout-only: the cards' fade-in-up animation moves getBoundingClientRect().top
            const tops = cards.map((c) => c.offsetTop)
            const firstTop = tops[0]
            const overflows: string[] = []
            if (checkFit) {
              for (const card of cards) {
                const cardRect = card.getBoundingClientRect()
                if (card.scrollWidth > card.clientWidth) {
                  overflows.push(`card "${card.textContent?.trim().slice(0, 40)}"`)
                }
                for (const slot of ['metric-value', 'metric-label', 'metric-trend']) {
                  for (const el of Array.from(
                    card.querySelectorAll<HTMLElement>(`[data-slot="${slot}"]`)
                  )) {
                    const r = el.getBoundingClientRect()
                    const outside =
                      r.left < cardRect.left - 0.5 ||
                      r.right > cardRect.right + 0.5 ||
                      r.top < cardRect.top - 0.5 ||
                      r.bottom > cardRect.bottom + 0.5
                    if (el.scrollWidth > el.clientWidth || outside) {
                      overflows.push(`${slot} "${el.textContent?.trim()}"`)
                    }
                  }
                }
              }
            }
            return {
              n: cards.length,
              rows: new Set(tops).size,
              firstRow: tops.filter((t) => t === firstTop).length,
              overflows,
            }
          }, width === 1024)

          expect(result.rows, `${slug} @${width}px grid ${g}: rows for ${result.n} cards`).toBe(
            Math.ceil(result.n / 4)
          )
          expect(
            result.firstRow,
            `${slug} @${width}px grid ${g}: cards in first row of ${result.n}`
          ).toBe(Math.min(result.n, 4))
          expect(
            result.overflows,
            `${slug} @${width}px grid ${g}: overflowing KPI content`
          ).toEqual([])
        }
      } finally {
        await context.close()
      }
    })
  }
}
