import { test, expect } from '@playwright/test'
import { getOnly } from './_helpers/settle'

/**
 * Contact Page E2E Tests
 *
 * Distinct from `contact-form.spec.ts` (which exercises form mechanics).
 * This spec covers the page-level surface: social cards, privacy policy
 * link and the noscript fallback when
 * JavaScript is disabled (regression #5).
 */

test.describe('/contact page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
  })

  test('LinkedIn and GitHub cards render with secure social-link attributes', async ({ page }) => {
    const linkedin = page.locator('a[href*="linkedin.com/in/hudsor01"]').first()
    await expect(linkedin).toBeVisible()
    await expect(linkedin).toHaveAttribute('target', '_blank')
    await expect(linkedin).toHaveAttribute('rel', /noopener/)
    await expect(linkedin).toHaveAttribute('rel', /noreferrer/)

    const github = page.locator('a[href*="github.com/hudsor01"]').first()
    await expect(github).toBeVisible()
    await expect(github).toHaveAttribute('target', '_blank')
    await expect(github).toHaveAttribute('rel', /noopener/)
    await expect(github).toHaveAttribute('rel', /noreferrer/)
  })

  test('email mailto link present (in noscript fallback within form)', async ({ page }) => {
    // The mailto fallback lives inside <noscript> on the form; assert it's
    // present in the static HTML (noscript content is not visible to
    // JS-enabled DOM but is in the source). Use evaluate to check the
    // markup directly.
    const hasMailto = await page.evaluate(() => {
      return document.documentElement.outerHTML.includes('mailto:hudsor01@icloud.com')
    })
    expect(hasMailto).toBe(true)
  })

  test('privacy notice links to the privacy policy page', async ({ page }) => {
    // Exact name: the footer has its own "Privacy Policy" link.
    const privacyLink = page.getByRole('link', {
      name: /^privacy policy \(opens in a new tab\)$/i,
    })
    await expect(privacyLink).toBeVisible()
    await expect(privacyLink).toHaveAttribute('href', '/privacy')
    await expect(privacyLink).toHaveAttribute('target', '_blank')

    const response = await page.request.get('/privacy')
    expect(response.status()).toBe(200)
  })
})

test.describe('/contact page (no JavaScript)', () => {
  // Regression assertion (audit fix #5): when JS is disabled, the noscript
  // fallback message must show users where to email instead. We open a
  // fresh browser context with `javaScriptEnabled: false` so React never
  // hydrates and the <noscript> content renders into the visible tree.
  test('noscript fallback is visible when JavaScript is disabled', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    try {
      await page.goto('/contact')
      // No networkidle — without JS, fewer requests fire and the page
      // settles immediately. `domcontentloaded` is sufficient.
      await page.waitForLoadState('domcontentloaded')

      // The <noscript> contents become real DOM when JS is disabled,
      // so we can assert visibility on the fallback message.
      await expect(
        page.getByText(/this form requires javascript/i)
      ).toBeVisible()

      // And the mailto link inside the fallback should be reachable.
      const mailto = page.locator('a[href="mailto:hudsor01@icloud.com"]').first()
      await expect(mailto).toBeVisible()
    } finally {
      await context.close()
    }
  })
})

test('contact shows one canonical revenue data-stat and no other', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'checked once, on chromium')
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/contact')
  await page.waitForLoadState('networkidle')
  await expect(page.locator('[data-stat="revenue"]')).toHaveCount(1)
  await expect(page.locator('[data-stat-label="revenue"]')).toHaveText('Revenue Impact')
  await expect(page.locator('[data-stat]')).toHaveCount(1)
})

test('contact Featured Work lists three previews as aria-hidden thumbnails', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'checked once, on chromium')
  const hits = await getOnly(page)
  await page.goto('/contact')
  await page.waitForLoadState('networkidle')

  const heading = page.getByRole('heading', { name: 'Featured Work' })
  await expect(heading).toBeVisible()
  const container = heading.locator('xpath=..')
  const links = container.locator('a[href^="/projects/"]')
  await expect(links).toHaveCount(3)
  expect(await links.evaluateAll((els) => els.map((el) => el.getAttribute('href')))).toEqual([
    '/projects/revenue-kpi',
    '/projects/forecast-pipeline-intelligence',
    '/projects/partnership-program-implementation',
  ])
  await expect(container.locator('img')).toHaveCount(0)
  const previews = container.locator('[data-slot="project-preview"]')
  await expect(previews).toHaveCount(3)
  for (let i = 0; i < 3; i += 1) await expect(previews.nth(i)).toHaveAttribute('aria-hidden', 'true')
  await expect(page.getByText('$240K')).toHaveCount(0)
  expect(hits.serverActions, 'no server action may reach the network').toBe(0)
})
