import { expect, test } from '@playwright/test'

/**
 * Phase 15 review group C (tools, footer) geometry checks that need real layout.
 */

test.describe('review C geometry', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(
      !['chromium', 'mobile-chrome'].includes(testInfo.project.name),
      'layout geometry checked in Chromium',
    )
  })

  test('calculator: headline is a display figure, result card is content-height, money shows grouped digits (C-1, C-2, C-8)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/tools/pipeline-coverage-calculator')
    await page.waitForLoadState('networkidle')
    const target = page.getByLabel('Revenue target (this period)')
    await expect(target).toHaveValue('1,000,000')
    const result = page.getByRole('region', { name: 'Your coverage' })
    const headline = result.getByText('4.0×')
    const size = await headline.evaluate((e) => Number.parseFloat(getComputedStyle(e).fontSize))
    expect(size).toBeGreaterThanOrEqual(36)
    const inputs = await page.locator('div.grid > div').first().boundingBox()
    const card = await result.boundingBox()
    expect(card!.height).toBeLessThan(inputs!.height * 0.6)
  })

  test('tool pages: same left edge as the hub, Why prose as large as FAQ answers (C-3, C-4)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    const edges: number[] = []
    for (const path of [
      '/tools',
      '/tools/pipeline-coverage-calculator',
      '/tools/revops-maturity-scorecard',
    ]) {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      edges.push(
        await page.locator('main').evaluate((m) => Math.round(m.getBoundingClientRect().left)),
      )
    }
    expect(new Set(edges).size).toBe(1)
    for (const path of ['/tools/pipeline-coverage-calculator', '/tools/revops-maturity-scorecard']) {
      await page.goto(path)
      const [why, faq] = await page.evaluate(() => {
        const fs = (e: Element | null) => Number.parseFloat(getComputedStyle(e as Element).fontSize)
        return [fs(document.querySelector('section.mt-16 p')), fs(document.querySelector('dd'))]
      })
      expect(why).toBe(faq)
    }
  })

  test('scorecard: rating every statement the same flags no weakest pillar (C-5)', async ({
    page,
  }) => {
    await page.goto('/tools/revops-maturity-scorecard')
    await page.waitForLoadState('networkidle')
    const result = page.getByRole('region', { name: 'Your result' })
    await expect(result).toContainText('0 of 16 answered')
    const groups = page.getByRole('radiogroup')
    await expect(groups).toHaveCount(16)
    for (let i = 0; i < 16; i++) await groups.nth(i).locator('label').nth(2).click()
    await expect(result).toContainText('16 of 16 answered')
    await expect(result.getByText('weakest', { exact: true })).toHaveCount(0)
    await expect(result.getByText(/All four pillars score 3\.0/)).toBeVisible()
    await expect(result).not.toContainText(/lowest pillars/)
  })

  test('footer: no empty grid cell beside the last link column at 390 (C-9)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/tools')
    await page.waitForLoadState('networkidle')
    const boxes = await page
      .locator('footer nav[aria-label]')
      .evaluateAll((ns) => ns.map((n) => n.getBoundingClientRect()).map((r) => ({ x: r.x, y: r.y, w: r.width })))
    expect(boxes).toHaveLength(3)
    // First two share a row; the last sits alone and spans the full content width.
    expect(Math.abs(boxes[0]!.y - boxes[1]!.y)).toBeLessThan(2)
    expect(boxes[2]!.y).toBeGreaterThan(boxes[0]!.y)
    expect(boxes[2]!.w).toBeGreaterThan(boxes[0]!.w * 1.8)
  })
})
