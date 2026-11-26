import { expect, test } from '@playwright/test'
import { databaseAvailable, NEEDS_DATABASE } from './_helpers/database'

/**
 * Phase 15 review group B (blog, blog post, contact, resume) geometry checks.
 * Pixel claims that unit tests cannot make: these need real layout.
 */

test.describe('review B geometry', () => {
  test('blog cards: cover is flush with the card top and dates share a baseline per row (B-1, B-2)', async ({
    page,
  }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
    const cards = page.locator('[data-slot="card"]')
    const n = await cards.count()
    expect(n).toBeGreaterThan(2)
    const rows = new Map<number, number[]>()
    for (let i = 0; i < n; i++) {
      const card = cards.nth(i)
      const box = await card.boundingBox()
      const date = await card.locator('time').boundingBox()
      if (!box || !date) continue
      const img = card.locator('img').first()
      if (await img.count()) {
        const ib = await img.boundingBox()
        // Border is 1px; nothing else may sit between the card edge and the cover.
        expect(ib!.y - box.y).toBeLessThanOrEqual(2)
      }
      const key = Math.round(box.y)
      rows.set(key, [...(rows.get(key) ?? []), Math.round(date.y)])
    }
    for (const ys of rows.values()) expect(Math.max(...ys) - Math.min(...ys)).toBeLessThanOrEqual(1)
  })

  test('contact: field icons centre on their inputs and the columns end together at 1440 (B-9, B-10)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    for (const id of ['name', 'email', 'company', 'phone']) {
      const input = await page.locator(`#${id}`).boundingBox()
      const icon = await page.locator(`#${id}`).locator('xpath=./preceding-sibling::div[1]//*[local-name()="svg"]').boundingBox()
      expect(Math.abs(icon!.y + icon!.height / 2 - (input!.y + input!.height / 2))).toBeLessThanOrEqual(1)
    }
    const form = await page.locator('form').locator('xpath=ancestor::div[contains(@class,"rounded-2xl")][1]').boundingBox()
    const featured = await page.getByRole('heading', { name: 'Featured Work' }).locator('xpath=ancestor::div[contains(@class,"rounded-2xl")][1]').boundingBox()
    expect(Math.abs(form!.y + form!.height - (featured!.y + featured!.height))).toBeLessThanOrEqual(1)
  })

  test('contact at 390: the three stats stack with no orphan and the form is close below (B-12)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    const ys = await page.locator('[data-stat="revenue"]').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().y))
    expect(ys).toHaveLength(1)
    const stat = await page.locator('[data-stat="revenue"]').boundingBox()
    const form = await page.locator('form').boundingBox()
    expect(form!.y - (stat!.y + stat!.height)).toBeLessThan(200)
  })

  test('blog post: title appears once above the body and related reading sits on the article grid (B-3, B-6)', async ({
    page,
  }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
    const href = await page.locator('main a[href^="/blog/"]').first().getAttribute('href')
    await page.goto(href as string)
    await page.waitForLoadState('networkidle')
    const title = (await page.locator('h1').first().textContent())?.trim() ?? ''
    const same = await page.locator('main h1, main h2, main h3').evaluateAll(
      (els, t) => els.filter((e) => (e.textContent ?? '').trim() === t).length,
      title
    )
    expect(same).toBe(1)
    const related = page.locator('#related-posts-heading')
    if (await related.count()) {
      const article = await page.locator('article header').boundingBox()
      const rb = await related.boundingBox()
      expect(Math.abs(rb!.x - article!.x)).toBeLessThanOrEqual(1)
    }
  })

  test('resume at 390: hero pill is one line (B-15)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/resume')
    await page.waitForLoadState('networkidle')
    const pill = await page.locator('main p.look-h2 span').first().boundingBox()
    expect(pill!.height).toBeLessThan(48)
  })
})
