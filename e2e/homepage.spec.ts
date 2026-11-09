import { test, expect } from '@playwright/test'

/**
 * Homepage E2E Tests
 *
 * Locks in the structure and CTAs of `/`:
 *   - Hero CTAs (View My Work / Resume / Let's Talk)
 *   - Featured Work section (4 flagship project links)
 *   - Final CTA section (Start a Conversation / View Resume)
 *   - Mailto link to the real contact address (TO_EMAIL default)
 *   - Proven Results metrics animate to non-zero values (regression #3)
 *   - Proven Results metrics carry their final values in the server HTML
 *   - A <main id="main-content"> landmark (skip-link target)
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

  test('renders mailto link to the real contact address', async ({ page }) => {
    const mailto = page.locator('a[href="mailto:hudsor01@icloud.com"]').first()
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

    // The counters render their final values in the server HTML (asserted
    // below) and only re-count client-side once scrolled into view. Scroll
    // them in so this checks the post-animation state on every viewport:
    // `waitForFunction` polls in-page and does NOT auto-scroll.
    await provenResultsHeading.scrollIntoViewIfNeeded()

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

  test('server HTML carries the final Proven Results values, not zeros', async ({ page }) => {
    // Crawlers, link previews and no-JS visitors only ever see the server
    // HTML. NumberTicker used to emit its start value there ("$0M+ / 0% / 0%
    // / 0+"); it now renders the final figure and animates client-side only.
    const html = await (await page.request.get('/')).text()
    const counters = [
      ...html.matchAll(/<span class="inline-block tabular-nums tracking-tight">([^<]*)<\/span>/g),
    ].map((m) => m[1] ?? '')
    expect(counters).toHaveLength(4)
    for (const value of counters) {
      expect(value.replace(/\D/g, '')).not.toMatch(/^0*$/)
    }
  })

  test('has a main landmark that the skip link targets', async ({ page }) => {
    await expect(page.locator('main#main-content')).toHaveCount(1)
    await expect(page.locator('a[href="#main-content"]')).toHaveCount(1)
  })
})
