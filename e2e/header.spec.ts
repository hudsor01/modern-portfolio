import { expect, test } from '@playwright/test'

/**
 * UI-02: one banner landmark, a "Richard Hudson" Playfair 17.5px/600 wordmark
 * linking to /, hamburger right-aligned on mobile.
 * A11Y-06: aria-current on the active link only.
 * The 7-item geometry case reserves room for the Phase 14 Tools link: a
 * temporary in-page clone of the first nav link, never shipped. GET-only.
 */

const SKIP = 'layout geometry checked once, in Chromium'

test.describe('header', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', SKIP)
    await page.route('**/*', (route) =>
      route.request().method() === 'GET' || route.request().method() === 'HEAD'
        ? route.continue()
        : route.abort(),
    )
  })

  for (const [width, height] of [
    [1440, 900],
    [390, 844],
  ] as const) {
    test(`banner and wordmark at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')
      await expect(page.getByRole('banner')).toHaveCount(1)
      const wordmark = page.getByRole('banner').getByRole('link', { name: 'Richard Hudson' })
      await expect(wordmark).toHaveAttribute('href', '/')
      await expect(wordmark).not.toHaveAttribute('aria-current', /.*/)
      const style = await wordmark.evaluate((el) => {
        const cs = getComputedStyle(el)
        return { family: cs.fontFamily, size: cs.fontSize, weight: cs.fontWeight }
      })
      expect(style.family).toMatch(/playfair/i)
      expect(style.size).toBe('17.5px')
      expect(style.weight).toBe('600')
    })
  }

  test('hamburger is right-aligned on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const hamburger = page.getByRole('button', { name: 'Open menu' })
    await expect(hamburger).toBeVisible()
    const burger = await hamburger.boundingBox()
    const word = await page
      .getByRole('banner')
      .getByRole('link', { name: 'Richard Hudson' })
      .boundingBox()
    if (!burger || !word) throw new Error('header boxes missing')
    expect(burger.x + burger.width).toBeGreaterThanOrEqual(390 - 32)
    expect(word.x).toBeLessThanOrEqual(32)
    expect(word.x + word.width).toBeLessThan(burger.x)
  })

  test('aria-current marks only the active desktop link', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/about')
    const nav = page.getByRole('navigation', { name: 'Main' }).filter({ visible: true })
    await expect(nav).toHaveCount(1)
    await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page')
    await expect(nav.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current', /.*/)
    await expect(
      nav.getByRole('link', { name: 'About' }).locator('span[aria-hidden="true"]').first(),
    ).toHaveAttribute('aria-hidden', 'true')
  })

  test('aria-current marks the active mobile link', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/about')
    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(
      page.locator('#mobile-menu').getByRole('link', { name: 'About' }),
    ).toHaveAttribute('aria-current', 'page')
  })

  for (const width of [768, 1024, 1280]) {
    for (const count of [6, 7]) {
      test(`${width}px ${count} items`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.goto('/')
        const list = page.locator('header nav[aria-label="Main"] [data-testid="main-nav-list"]')
        await expect(list).toBeVisible()
        if (count === 7) {
          await list.evaluate((el) => {
            const first = el.firstElementChild
            if (first) el.appendChild(first.cloneNode(true))
          })
        }

        const m = await page.evaluate(() => {
          const rect = (el: Element | null) => {
            const r = el?.getBoundingClientRect()
            return r ? { left: r.left, right: r.right } : null
          }
          const header = document.querySelector('header')
          const nav = document.querySelector('header nav[aria-label="Main"]')
          const wordmark = document.querySelector('header a[href="/"]')
          const cta = Array.from(document.querySelectorAll('header a[href="/contact"]')).find(
            (el) => !el.closest('nav') && (el as HTMLElement).checkVisibility(),
          )
          const row = nav?.parentElement
          const container = header?.firstElementChild ?? header
          return {
            wordmark: rect(wordmark ?? null),
            nav: rect(nav ?? null),
            cta: rect(cta ?? null),
            container: rect(container ?? null),
            rowOverflow: row ? row.scrollWidth - row.clientWidth : 0,
            docOverflow:
              document.documentElement.scrollWidth - document.documentElement.clientWidth,
          }
        })

        if (!m.wordmark || !m.nav || !m.cta || !m.container) throw new Error('header rects missing')
        expect(m.wordmark.right + 8, 'wordmark vs nav').toBeLessThanOrEqual(m.nav.left)
        expect(m.nav.right + 8, 'nav vs CTA').toBeLessThanOrEqual(m.cta.left)
        expect(m.rowOverflow, 'nav row overflow').toBeLessThanOrEqual(0)
        expect(m.docOverflow, 'document overflow').toBeLessThanOrEqual(0)
        const navCenter = (m.nav.left + m.nav.right) / 2
        const containerCenter = (m.container.left + m.container.right) / 2
        expect(Math.abs(navCenter - containerCenter)).toBeLessThanOrEqual(2)
      })
    }
  }
})
