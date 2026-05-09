import { test, expect } from '@playwright/test'

/**
 * About Page E2E Tests
 *
 * Locks in the 5-section structure introduced by the about-page tighten:
 *   1. Hero (Personal Information)
 *   2. What I Bring
 *   3. Impact & Experience Stats
 *   4. Expertise + Certifications (one section, two grouped subsections)
 *   5. Final CTA
 */

test.describe('/about page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about')
    await page.waitForLoadState('networkidle')
  })

  test('renders all five sections by their accessible labels', async ({ page }) => {
    await expect(page.getByRole('region', { name: /introduction/i })).toBeVisible()
    await expect(page.getByRole('region', { name: /working principles/i })).toBeVisible()
    await expect(page.getByRole('region', { name: /impact metrics/i })).toBeVisible()
    await expect(page.getByRole('region', { name: /expertise and certifications/i })).toBeVisible()
    await expect(page.getByRole('region', { name: /^contact$/i })).toBeVisible()
  })

  test('hero shows name and primary CTAs', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Richard Hudson')
    await expect(page.getByRole('link', { name: /view case studies/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /download resume/i })).toBeVisible()
  })

  test('shows core stats once each on the page', async ({ page }) => {
    // Stats grid is the canonical location for these numbers; expertise narrative
    // should not restate them. Asserting once-and-only-once locks in the dedupe.
    await expect(page.getByText('432%')).toHaveCount(1)
    await expect(page.getByText('2,217%')).toHaveCount(1)
  })

  test('final CTA links to projects and contact', async ({ page }) => {
    const finalCta = page.getByRole('region', { name: /^contact$/i })
    await expect(finalCta.getByRole('link', { name: /view case studies/i })).toHaveAttribute(
      'href',
      '/projects'
    )
    await expect(finalCta.getByRole('link', { name: /get in touch/i })).toHaveAttribute(
      'href',
      '/contact'
    )
  })

  test('does not render orphaned/removed sections', async ({ page }) => {
    // Sections that were removed in this PR — guard against accidental re-introduction.
    await expect(page.getByText('Key Strengths & Differentiators')).toHaveCount(0)
    await expect(page.getByText('Core Competencies')).toHaveCount(0)
    // StickyCTA was a fixed-position mobile element; it should no longer mount.
    await expect(page.locator('div.fixed.bottom-0.lg\\:hidden')).toHaveCount(0)
  })

  test('emits FAQ and Breadcrumb structured data', async ({ page }) => {
    const ldScripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const blob = ldScripts.join('\n')
    expect(blob).toContain('"@type":"FAQPage"')
    expect(blob).toContain('"@type":"BreadcrumbList"')
  })
})
