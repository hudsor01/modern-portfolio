import { test, expect } from '@playwright/test'

/**
 * Audit Regression Tests — Canonical Survival Check
 *
 * Focused regressions for the 5 audit fixes that landed during the
 * audit/page-interactivity work. Some assertions are intentionally
 * duplicated from the per-page specs (homepage / contact / projects-detail
 * / security-headers); this file is the single canonical "did the audit
 * fixes survive?" gate. If a future change breaks any one of these, we
 * want it loud and obvious — not buried in a per-feature suite.
 *
 *   #1 /projects/revenue-kpi has no timeframe pills
 *   #2 /about button text is "View Resume" (not "Download Resume")
 *   #3 Homepage Proven Results metrics reach non-zero values within 5s
 *   #4 GET /api/generate-resume-pdf returns 404 (route deleted)
 *   #5 /contact noscript fallback visible when JS is disabled
 */

test.describe('Audit regressions', () => {
  test('#1 /projects/revenue-kpi shows no timeframe pills', async ({ page }) => {
    await page.goto('/projects/revenue-kpi', { timeout: 60000 })
    await page.waitForLoadState('networkidle')

    await expect(page.locator('[data-testid="timeframe-selector"]')).toHaveCount(0)

    const main = page.locator('main')
    for (const label of ['2020', '2022', '2024', 'All']) {
      await expect(
        main.getByRole('button', { name: new RegExp(`^${label}$`) })
      ).toHaveCount(0)
    }
  })

  test('#2 /about resume CTA reads "View Resume" (not "Download Resume")', async ({ page }) => {
    await page.goto('/about')
    await page.waitForLoadState('networkidle')

    // The About page personal-info section renders a resume CTA. The audit
    // changed the copy from "Download Resume" → "View Resume" (the link
    // navigates to /resume rather than triggering a download).
    await expect(
      page.getByRole('link', { name: /view resume/i }).first()
    ).toBeVisible()
    await expect(page.getByRole('link', { name: /^download resume$/i })).toHaveCount(0)
  })

  test('#3 Homepage Proven Results metrics reach non-zero values within 5s', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page.getByRole('heading', { name: /proven results/i })).toBeVisible()

    await page.waitForFunction(
      () => {
        const counters = document.querySelectorAll('.tabular-nums')
        if (counters.length < 4) return false
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

  test('#4 GET /api/generate-resume-pdf returns 404 (route deleted)', async ({ page }) => {
    // The audit fix removed the puppeteer-backed route entirely. Confirm
    // there is no handler at this path. CLAUDE.md's mention of a 503
    // fallback predates the deletion; the route file is gone from disk.
    const response = await page.request.get('/api/generate-resume-pdf')
    expect(response.status()).toBe(404)
  })

  test('#5 /contact noscript fallback visible when JavaScript is disabled', async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    try {
      await page.goto('/contact')
      await page.waitForLoadState('domcontentloaded')

      await expect(
        page.getByText(/this form requires javascript/i)
      ).toBeVisible()

      await expect(
        page.locator('a[href="mailto:richard@richardwhudsonjr.com"]').first()
      ).toBeVisible()
    } finally {
      await context.close()
    }
  })
})
