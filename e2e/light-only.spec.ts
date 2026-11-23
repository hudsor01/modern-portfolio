import { expect, test } from '@playwright/test'

/**
 * UX-05 guard: with the OS in dark mode, pages and toasts still render light.
 * Colour strings are compared between a dark-scheme and a light-scheme context
 * rather than parsed. Never touches the contact form.
 */

test.use({ colorScheme: 'dark' })

const PAGES = ['/', '/contact', '/privacy', '/blog', '/projects', '/resume']
const SKIP_REASON = 'colour-scheme emulation parity checked once in Chromium'

for (const path of PAGES) {
  test(`${path} renders light under OS dark`, async ({ page, browser }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', SKIP_REASON)

    await page.goto(path)
    await page.waitForLoadState('networkidle')

    expect(await page.evaluate(() => matchMedia('(prefers-color-scheme: dark)').matches)).toBe(true)

    const dark = await page.evaluate(() => ({
      background: getComputedStyle(document.body).backgroundColor,
      colorScheme: getComputedStyle(document.documentElement).colorScheme,
    }))
    expect(dark.colorScheme).toBe('light')
    await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', 'light')
    await expect(page.locator('meta[name="theme-color"]').first()).toHaveAttribute(
      'content',
      '#ffffff',
    )

    const context = await browser.newContext({
      colorScheme: 'light',
      baseURL: testInfo.project.use.baseURL,
    })
    try {
      const lightPage = await context.newPage()
      await lightPage.goto(path)
      await lightPage.waitForLoadState('networkidle')
      const light = await lightPage.evaluate(
        () => getComputedStyle(document.body).backgroundColor,
      )
      expect(dark.background).toBe(light)
    } finally {
      await context.close()
    }
  })
}

test('resume download toast is light under OS dark', async ({ page, browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', SKIP_REASON)

  await page.goto('/resume')
  await page.waitForLoadState('networkidle')

  const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null)
  await page.getByRole('button', { name: /download/i }).click()

  await expect(page.locator('[data-sonner-toaster]')).toHaveAttribute('data-sonner-theme', 'light')
  const toast = page.locator('[data-sonner-toast]').first()
  await expect(toast).toBeVisible()
  const toastBackground = await toast.evaluate((el) => getComputedStyle(el).backgroundColor)
  await downloadPromise

  const context = await browser.newContext({
    colorScheme: 'light',
    baseURL: testInfo.project.use.baseURL,
  })
  try {
    const lightPage = await context.newPage()
    await lightPage.goto('/resume')
    await lightPage.waitForLoadState('networkidle')
    const light = await lightPage.evaluate(() => getComputedStyle(document.body).backgroundColor)
    expect(toastBackground).toBe(light)
  } finally {
    await context.close()
  }
})
