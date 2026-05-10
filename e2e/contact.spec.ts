import { test, expect } from '@playwright/test'

/**
 * Contact Page E2E Tests
 *
 * Distinct from `contact-form.spec.ts` (which exercises form mechanics).
 * This spec covers the page-level surface: social cards, privacy policy
 * disclosure, submit-button gating, and the noscript fallback when
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
      return document.documentElement.outerHTML.includes('mailto:richard@richardwhudsonjr.com')
    })
    expect(hasMailto).toBe(true)
  })

  test('privacy policy disclosure expands and collapses', async ({ page }) => {
    const privacyButton = page.getByRole('button', { name: /privacy policy/i })
    await expect(privacyButton).toBeVisible()
    await expect(privacyButton).toHaveAttribute('aria-expanded', 'false')

    await privacyButton.click()
    await expect(privacyButton).toHaveAttribute('aria-expanded', 'true')
    await expect(
      page.getByText(/your information will be used solely/i)
    ).toBeVisible()

    await privacyButton.click()
    await expect(privacyButton).toHaveAttribute('aria-expanded', 'false')
  })

  test('privacy checkbox toggles agreement state', async ({ page }) => {
    const checkbox = page.getByRole('checkbox', { name: /agree/i })
    await expect(checkbox).not.toBeChecked()

    await checkbox.check()
    await expect(checkbox).toBeChecked()

    await checkbox.uncheck()
    await expect(checkbox).not.toBeChecked()
  })

  test('submit button stays disabled until privacy checkbox is checked', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /send message/i })
    await expect(submitButton).toBeDisabled()

    await page.getByRole('checkbox', { name: /agree/i }).check()
    await expect(submitButton).toBeEnabled()

    await page.getByRole('checkbox', { name: /agree/i }).uncheck()
    await expect(submitButton).toBeDisabled()
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
      const mailto = page.locator('a[href="mailto:richard@richardwhudsonjr.com"]').first()
      await expect(mailto).toBeVisible()
    } finally {
      await context.close()
    }
  })
})
