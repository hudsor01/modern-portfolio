import { expect, type Page, test } from '@playwright/test'

/**
 * F-20 / WR-01: locking page scroll must not shift the layout. Playwright
 * launches headless Chromium with --hide-scrollbars, which makes the gutter 0px
 * and every width comparison vacuous, so this file (and only this file) drops
 * that flag and turns off overlay scrollbars (macOS hosts default to them; Linux
 * CI already uses classic ones), so scrollbars take space on every host.
 * launchOptions is worker-scoped, and Playwright rejects worker options in a
 * describe group, hence a file of its own. Every test first asserts that the
 * scrollbar occupies space. GET-only.
 */
test.use({
  launchOptions: {
    ignoreDefaultArgs: ['--hide-scrollbars'],
    args: ['--disable-features=OverlayScrollbar'],
  },
})

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'layout geometry checked once, in Chromium')
  await page.route('**/*', (route) =>
    route.request().method() === 'GET' || route.request().method() === 'HEAD'
      ? route.continue()
      : route.abort(),
  )
})

/**
 * Layout edges, not documentElement.clientWidth: under overflow: hidden Chromium
 * reports the root clientWidth without the reserved gutter (it grows by the
 * gutter width) even though nothing moves.
 */
interface Edges {
  body: { left: number; right: number }
  main: { left: number; right: number }
  header: { left: number; right: number }
}

function edges(page: Page): Promise<Edges> {
  return page.evaluate(() => {
    const box = (selector: string) => {
      const el = document.querySelector(selector)
      if (!el) throw new Error(`${selector} missing`)
      const r = el.getBoundingClientRect()
      return { left: r.left, right: r.right }
    }
    return {
      body: box('body'),
      main: box('main#main-content'),
      header: box('header'),
    }
  })
}

async function expectVisibleGutter(page: Page): Promise<number> {
  const { gutter, style } = await page.evaluate(() => ({
    gutter: window.innerWidth - document.documentElement.clientWidth,
    style: getComputedStyle(document.documentElement).scrollbarGutter,
  }))
  expect(style).toContain('stable')
  expect(gutter, 'scrollbars must occupy space for this check to mean anything').toBeGreaterThan(0)
  return gutter
}

test('mobile menu scroll lock shifts no layout with visible scrollbars', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await expectVisibleGutter(page)
  const before = await edges(page)

  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).overflow))
    .toBe('hidden')
  expect(await edges(page)).toEqual(before)

  await page.getByRole('button', { name: 'Close menu' }).click()
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).overflow))
    .not.toBe('hidden')
  expect(await edges(page)).toEqual(before)
})

test('opening the /projects category Select shifts no layout with visible scrollbars (WR-01)', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/projects')
  await page.waitForLoadState('networkidle')
  const gutter = await expectVisibleGutter(page)
  const before = await edges(page)

  const trigger = page.getByRole('combobox', { name: 'Filter by category' })
  await trigger.click()
  await expect(page.getByRole('listbox')).toBeVisible()
  await expect(page.locator('body[data-scroll-locked]')).toHaveCount(1)

  // Non-vacuous: Radix's react-remove-scroll-bar did inject its gutter-sized
  // margin compensation, and the stable-gutter override cancels it.
  const injected = await page.evaluate(() =>
    Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent ?? '')
      .find((t) => t.includes('body[data-scroll-locked]') && t.includes('margin-right')),
  )
  expect(injected, 'react-remove-scroll-bar style present').toBeDefined()
  expect(injected).toMatch(new RegExp(`margin-right:\\s*${gutter}px\\s*!important`))
  expect(await page.evaluate(() => getComputedStyle(document.body).marginRight)).toBe('0px')
  expect(await edges(page)).toEqual(before)

  await page.keyboard.press('Escape')
  await expect(page.getByRole('listbox')).toBeHidden()
  await expect(page.locator('body[data-scroll-locked]')).toHaveCount(0)
  expect(await edges(page)).toEqual(before)
})
