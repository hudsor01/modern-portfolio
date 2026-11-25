import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, test } from '@playwright/test'
import { settleTransitions } from './_helpers/settle'

/**
 * Mobile menu dismissal (review WR-06): Escape closes it and puts focus back on
 * the toggle, the scrim closes it, and the open state stays axe clean.
 */

const rootOverflow = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.documentElement).overflow)

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice']

test.describe('mobile menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*', (route) =>
      route.request().method() === 'GET' || route.request().method() === 'HEAD'
        ? route.continue()
        : route.abort(),
    )
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/about')
    await page.waitForLoadState('networkidle')
  })

  test('opens as a disclosure and is axe clean', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'axe gate runs once, in Chromium')
    const toggle = page.getByRole('button', { name: 'Open menu' })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(toggle).toHaveAttribute('aria-controls', 'mobile-menu')
    await toggle.click()
    const close = page.getByRole('button', { name: 'Close menu' })
    await expect(close).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('#mobile-menu')).toBeVisible()
    await settleTransitions(page)
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
    expect(results.violations).toEqual([])
  })

  test('Escape closes the menu and returns focus to the toggle (keyboard only)', async ({
    page,
  }) => {
    const toggle = page.getByRole('button', { name: 'Open menu' })
    await toggle.focus()
    await page.keyboard.press('Enter')
    const menu = page.locator('#mobile-menu')
    await expect(menu).toBeVisible()
    await expect.poll(() => rootOverflow(page)).toBe('hidden')
    // Move focus into the menu, then dismiss from inside it. Focus is placed
    // directly: macOS WebKit's default Tab order skips links (Safari's "Tab
    // highlights each item" is off), so a Tab press would not land on one there.
    const firstLink = menu.getByRole('link').first()
    await firstLink.focus()
    await expect(firstLink).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    await expect.poll(() => rootOverflow(page)).not.toBe('hidden')
    const reopened = page.getByRole('button', { name: 'Open menu' })
    await expect(reopened).toHaveAttribute('aria-expanded', 'false')
    await expect(reopened).toBeFocused()
  })

  test('clicking the scrim closes the menu', async ({ page }) => {
    await page.getByRole('button', { name: 'Open menu' }).click()
    const menu = page.locator('#mobile-menu')
    await expect(menu).toBeVisible()
    await expect.poll(() => rootOverflow(page)).toBe('hidden')
    const panel = await menu.boundingBox()
    expect(panel).not.toBeNull()
    // Below the panel, over the dimmed page.
    await page.mouse.click(195, Math.min(835, (panel?.y ?? 0) + (panel?.height ?? 0) + 40))
    await expect(menu).toBeHidden()
    await expect.poll(() => rootOverflow(page)).not.toBe('hidden')
    await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })
})
