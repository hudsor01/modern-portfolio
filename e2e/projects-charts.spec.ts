import { test, expect, type Locator } from '@playwright/test'

/**
 * Case-study chart geometry (Phase 15 review A-3..A-12): nothing clipped, nothing
 * under the 12px floor, no truncated labels, one header per card.
 */

async function within(inner: Locator, outer: Locator, slack = 1) {
  const a = await inner.boundingBox()
  const b = await outer.boundingBox()
  expect(a, 'inner box').not.toBeNull()
  expect(b, 'outer box').not.toBeNull()
  if (!a || !b) return
  expect(a.x).toBeGreaterThanOrEqual(b.x - slack)
  expect(a.y).toBeGreaterThanOrEqual(b.y - slack)
  expect(a.x + a.width).toBeLessThanOrEqual(b.x + b.width + slack)
  expect(a.y + a.height).toBeLessThanOrEqual(b.y + b.height + slack)
}

test.describe('/projects/deal-funnel charts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects/deal-funnel')
    await page.waitForLoadState('networkidle')
  })

  test('funnel text stays at or above 12px and shows Closed Won as the won stage', async ({
    page,
  }) => {
    const sizes = await page
      .locator('[data-testid="funnel-stage"] span')
      .evaluateAll((els) => els.map((e) => Number.parseFloat(getComputedStyle(e).fontSize)))
    expect(sizes.length).toBeGreaterThan(0)
    for (const s of sizes) expect(s).toBeGreaterThanOrEqual(12)
    await expect(page.getByText('Closed Won').first()).toBeVisible()
  })

  test('funnel bar widths follow the stage counts (1,140 > 470 > 90)', async ({ page }) => {
    const bars = page.locator('[data-testid="funnel-stage"] > div')
    await expect(bars).toHaveCount(3)
    const widths = await bars.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().width))
    const [working = 0, won = 0, lost = 0] = widths
    expect(working).toBeGreaterThan(won)
    expect(won).toBeGreaterThan(lost)
    expect(lost).toBeGreaterThan(working * 0.25)
  })

  test('each chart card has exactly one header', async ({ page }) => {
    for (const name of [
      'Sales Pipeline Funnel',
      'Stage Conversion Rates',
      'Sales Velocity by Partner Tier',
    ]) {
      await expect(page.getByRole('heading', { name, exact: true })).toHaveCount(1)
    }
  })

  test('stage-conversion axis labels are inside the chart card', async ({ page }) => {
    const chart = page.getByTestId('conversion-chart')
    await chart.scrollIntoViewIfNeeded()
    const card = chart.locator('xpath=..')
    const ticks = chart.locator('.recharts-cartesian-axis-tick-labels text')
    await expect(ticks.first()).toBeVisible()
    for (const tick of await ticks.all()) await within(tick, card)
  })
})

test.describe('/projects/revenue-kpi charts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects/revenue-kpi')
    await page.waitForLoadState('networkidle')
  })

  test('top partner labels are not truncated with an ellipsis', async ({ page }) => {
    const card = page.getByRole('heading', { name: 'Top Partners by Revenue' }).locator('xpath=../../..')
    await card.scrollIntoViewIfNeeded()
    const ticks = card.locator('.recharts-cartesian-axis-tick-labels text')
    await expect(ticks.first()).toBeVisible()
    for (const text of await ticks.allTextContents()) expect(text).not.toMatch(/\.\.\.|…/)
  })

  test('top partner labels stay inside the chart and carry the full name as a title', async ({
    page,
  }) => {
    const card = page.getByRole('heading', { name: 'Top Partners by Revenue' }).locator('xpath=../../..')
    await card.scrollIntoViewIfNeeded()
    const svg = card.locator('svg.recharts-surface').first()
    const ticks = card.locator('.recharts-cartesian-axis-tick-labels text:has(title)')
    await expect(ticks.first()).toBeVisible()
    const box = await svg.boundingBox()
    expect(box, 'chart svg box').not.toBeNull()
    for (const tick of await ticks.all()) {
      const t = await tick.boundingBox()
      expect(t, 'tick box').not.toBeNull()
      if (!t || !box) continue
      expect(t.x).toBeGreaterThanOrEqual(box.x - 1)
      expect(t.x + t.width).toBeLessThanOrEqual(box.x + box.width + 1)
      expect((await tick.locator('title').textContent())?.length ?? 0).toBeGreaterThan(0)
    }
  })

  test('quarterly axis ticks are evenly strided', async ({ page }) => {
    const card = page.getByRole('heading', { name: /^Quarterly Revenue/ }).locator('xpath=../../..')
    await card.scrollIntoViewIfNeeded()
    const labels = card.locator('.recharts-cartesian-axis-tick-labels text')
    await expect(labels.first()).toBeVisible()
    // The x-axis is the lowest row of tick labels (the y-axis labels share a column).
    const boxes = await labels.evaluateAll((els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect()
        return { x: r.x, y: Math.round(r.y) }
      })
    )
    const bottom = Math.max(...boxes.map((b) => b.y))
    const xs = boxes
      .filter((b) => b.y === bottom)
      .map((b) => b.x)
      .sort((a, b) => a - b)
    expect(xs.length).toBeGreaterThan(1)
    const gaps = xs.slice(1).map((x, i) => x - (xs[i] ?? 0))
    const first = gaps[0] ?? 0
    for (const g of gaps) expect(Math.abs(g - first)).toBeLessThan(first * 0.25)
  })

  test('donut legend sits inside its card', async ({ page }) => {
    const card = page.getByRole('heading', { name: 'Partner Revenue Contribution' }).locator('xpath=../../..')
    await card.scrollIntoViewIfNeeded()
    const legend = card.locator('.recharts-legend-wrapper')
    await expect(legend).toBeVisible()
    await within(legend, card)
  })
})
