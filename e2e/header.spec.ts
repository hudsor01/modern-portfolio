import { expect, test } from '@playwright/test'

/**
 * UI-02: one banner landmark, a "Richard Hudson" Playfair 17.5px/600 wordmark
 * linking to /, hamburger right-aligned on mobile.
 * A11Y-06: aria-current on the active link only.
 * The geometry case measures the real seven-item main nav (UX-01 added
 * Tools), not a simulation. GET-only.
 */

const EXPECTED_ITEMS = ['Home', 'About', 'Projects', 'Blog', 'Tools', 'Resume', 'Contact']

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

  test('mobile menu locks page scroll and releases it on close, navigation, back and desktop resize (F-20)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const rootOverflow = () =>
      page.evaluate(() => getComputedStyle(document.documentElement).overflow)
    const menu = page.locator('#mobile-menu')
    const openToggle = page.getByRole('button', { name: 'Open menu' })

    const gutter = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollbarGutter,
    )
    expect(gutter).toContain('stable')
    const widthBefore = await page.evaluate(() => document.documentElement.clientWidth)

    await openToggle.click()
    await expect.poll(rootOverflow).toBe('hidden')
    expect(await page.evaluate(() => document.documentElement.clientWidth)).toBe(widthBefore)

    await page.mouse.move(195, 700)
    await page.mouse.wheel(0, 600)
    await expect
      .poll(async () => {
        await page.waitForTimeout(100)
        return page.evaluate(() => window.scrollY)
      })
      .toBe(0)

    const fits = await menu.evaluate((el) => {
      const rect = el.getBoundingClientRect()
      return rect.bottom <= window.innerHeight || el.scrollHeight > el.clientHeight
    })
    expect(fits).toBe(true)

    await page.getByRole('button', { name: 'Close menu' }).click()
    await expect.poll(rootOverflow).not.toBe('hidden')

    // Navigation by link
    await openToggle.click()
    await expect.poll(rootOverflow).toBe('hidden')
    await menu.getByRole('link', { name: 'About' }).click()
    await expect(page).toHaveURL(/\/about$/)
    await expect.poll(rootOverflow).not.toBe('hidden')
    await expect(openToggle).toHaveAttribute('aria-expanded', 'false')

    // Browser back while open
    await openToggle.click()
    await expect.poll(rootOverflow).toBe('hidden')
    await page.goBack()
    await expect(page).toHaveURL(/^[^?#]*\/(?:[?#].*)?$/)
    await expect.poll(rootOverflow).not.toBe('hidden')
    await expect(menu).toBeHidden()

    // Desktop resize while open
    await openToggle.click()
    await expect.poll(rootOverflow).toBe('hidden')
    await page.setViewportSize({ width: 1024, height: 800 })
    await expect.poll(rootOverflow).not.toBe('hidden')
    await page.setViewportSize({ width: 390, height: 844 })
    await expect(openToggle).toHaveAttribute('aria-expanded', 'false')
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
    const nav = page.getByRole('navigation', { name: 'Main', exact: true })
    await expect(nav).toHaveCount(1)
    await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page')
    await expect(nav.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current', /.*/)
    // The active-link underline indicator exists and is hidden from the a11y tree.
    await expect(
      nav.getByRole('link', { name: 'About' }).locator('span[aria-hidden="true"]'),
    ).toHaveCount(1)
  })

  test('aria-current marks the parent section on detail routes', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/projects/revenue-kpi')
    const nav = page.getByRole('navigation', { name: 'Main', exact: true })
    await expect(nav.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'true')
    await expect(nav.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current', /.*/)
  })

  test('aria-current marks the active mobile link', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/about')
    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(
      page.locator('#mobile-menu').getByRole('link', { name: 'About' }),
    ).toHaveAttribute('aria-current', 'page')
  })

  test('aria-current marks Tools on the hub and its tool pages', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    const nav = page.getByRole('navigation', { name: 'Main', exact: true })
    await page.goto('/tools')
    await expect(nav.getByRole('link', { name: 'Tools' })).toHaveAttribute('aria-current', 'page')
    await expect(nav.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current', /.*/)
    await page.goto('/tools/pipeline-coverage-calculator')
    await expect(nav.getByRole('link', { name: 'Tools' })).toHaveAttribute('aria-current', 'true')
  })

  test('mobile menu lists the seven items with Tools current on /tools', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/tools')
    await page.getByRole('button', { name: 'Open menu' }).click()
    const links = page.locator('#mobile-menu').getByRole('link')
    await expect(links).toHaveText([...EXPECTED_ITEMS, "Let's Talk"])
    await expect(
      page.locator('#mobile-menu').getByRole('link', { name: 'Tools' }),
    ).toHaveAttribute('aria-current', 'page')
  })

  for (const width of [768, 1024, 1280, 1440]) {
    test(`${width}px nav fits 7 items`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      const list = page.locator('header nav[aria-label="Main"] [data-testid="main-nav-list"]')
      await expect(list).toBeVisible()

      const m = await page.evaluate(() => {
        const rect = (el: Element | null) => {
          const r = el?.getBoundingClientRect()
          return r ? { left: r.left, right: r.right, width: r.width, height: r.height } : null
        }
        const header = document.querySelector('header')
        const nav = document.querySelector('header nav[aria-label="Main"]')
        const wordmark = document.querySelector('header a[href="/"]')
        const cta = Array.from(document.querySelectorAll('header a[href="/contact"]')).find(
          (el) => !el.closest('nav') && (el as HTMLElement).checkVisibility(),
        )
        const row = nav?.parentElement
        const container = header?.firstElementChild ?? header
        const links = Array.from(
          document.querySelectorAll('header nav[aria-label="Main"] [data-testid="main-nav-list"] > a'),
        )
        return {
          texts: links.map((a) => (a.textContent ?? '').trim()),
          links: links.map((a) => rect(a)),
          wordmark: rect(wordmark ?? null),
          nav: rect(nav ?? null),
          cta: rect(cta ?? null),
          container: rect(container ?? null),
          rowOverflow: row ? row.scrollWidth - row.clientWidth : 0,
          docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        }
      })

      expect(m.texts).toEqual(EXPECTED_ITEMS)
      const boxes = m.links.flatMap((l) => (l ? [l] : []))
      expect(boxes).toHaveLength(EXPECTED_ITEMS.length)
      for (const b of boxes) {
        expect(b.width).toBeGreaterThan(0)
        expect(b.height).toBeGreaterThan(0)
      }
      const sorted = [...boxes].sort((a, b) => a.left - b.left)
      let prev: (typeof sorted)[number] | undefined
      for (const [i, b] of sorted.entries()) {
        if (prev) expect(prev.right, `link ${i - 1} vs ${i}`).toBeLessThanOrEqual(b.left)
        prev = b
      }

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
})
