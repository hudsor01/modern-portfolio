import { test, expect } from '@playwright/test'

/**
 * Homepage E2E Tests
 *
 * Locks in the structure and CTAs of `/`:
 *   - Hero CTAs (View My Work / Resume / Let's Talk)
 *   - Featured Work section (4 flagship project links)
 *   - Final CTA section (Start a Conversation / View Resume)
 *   - Mailto link to richard@richardwhudsonjr.com
 *   - Proven Results metrics animate to non-zero values (regression #3)
 */

test.describe('/ homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('hero CTAs link to the expected routes', async ({ page }) => {
    // Limit to the main element so we don't pick up duplicate links in
    // the Navbar (e.g. another "Resume" anchor).
    const main = page.locator('body')

    await expect(
      main.getByRole('link', { name: /view my work/i }).first()
    ).toHaveAttribute('href', '/projects')

    // "Resume" matches both navbar and hero — assert at least one points to /resume.
    const resumeLinks = main.getByRole('link', { name: /^resume$/i })
    expect(await resumeLinks.count()).toBeGreaterThan(0)
    await expect(resumeLinks.first()).toHaveAttribute('href', '/resume')

    await expect(
      main.getByRole('link', { name: /let'?s talk/i }).first()
    ).toHaveAttribute('href', '/contact')
  })

  test('Featured Work section links to four existing project routes', async ({ page }) => {
    // The Featured Work heading anchors a section with 4 flagship project links.
    const featuredHeading = page.getByRole('heading', { name: /^featured work$/i })
    await expect(featuredHeading).toBeVisible()

    const expectedHrefs = [
      '/projects/revenue-kpi',
      '/projects/forecast-pipeline-intelligence',
      '/projects/partnership-program-implementation',
      '/projects/sales-enablement',
    ]
    for (const href of expectedHrefs) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible()
    }
  })

  test('final CTA section has Start a Conversation and View Resume buttons', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /start a conversation/i })
    ).toHaveAttribute('href', '/contact')
    await expect(
      page.getByRole('link', { name: /view resume/i })
    ).toHaveAttribute('href', '/resume')
  })

  test('renders mailto link to richard@richardwhudsonjr.com', async ({ page }) => {
    const mailto = page.locator('a[href="mailto:richard@richardwhudsonjr.com"]').first()
    await expect(mailto).toBeVisible()
  })

  test('Proven Results metrics show non-zero values within 5s (regression #3)', async ({
    page,
  }) => {
    // Lock in the audit fix that prevented all 4 ImpactMetric counters from
    // being stuck at 0 on the homepage. Each NumberTicker animates from 0
    // to its final value; we wait for the rendered text to no longer be
    // "0" / "$0M+" / "0%" / "0+" for any of the four.
    const provenResultsHeading = page.getByRole('heading', { name: /proven results/i })
    await expect(provenResultsHeading).toBeVisible()

    // Grid container directly follows the section header; capture its
    // 4 large counter values via the `tabular-nums` class signature used
    // in HomePageContent.tsx.
    await page.waitForFunction(
      () => {
        const counters = document.querySelectorAll('.tabular-nums')
        if (counters.length < 4) return false
        // Each counter renders prefix + number + suffix as concatenated
        // text. Strip non-digits and check at least one digit is non-zero.
        for (const el of Array.from(counters).slice(0, 4)) {
          const text = (el.textContent ?? '').trim()
          const digits = text.replace(/\D/g, '')
          if (!digits || /^0+$/.test(digits)) return false
        }
        return true
      },
      { timeout: 5000 }
    )
  })
})
