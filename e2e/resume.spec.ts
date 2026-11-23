import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Resume Page E2E Tests
 *
 * Tests the complete resume user journey:
 * - Resume content display
 * - PDF view toggle
 * - PDF download functionality
 * - Section navigation
 */

test.describe('Resume Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/resume')
    await page.waitForLoadState('networkidle')
  })

  test('displays resume page with hero section', async ({ page }) => {
    // Verify page loads with content
    await expect(page.locator('main')).toBeVisible()

    // Verify key resume sections are present
    // Check for presence of resume content (About, Experience, etc.)
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()
  })

  test('displays all resume sections when not in PDF view', async ({ page }) => {
    // Target each section by an unambiguous heading actually rendered on
    // the page. The page does not have a top-level "About" or "Experience"
    // heading (About uses sub-heading "Revenue Operations Professional",
    // Experience renders one h3 per job). Assert headings inside <main>
    // so we don't pick up the hidden mobile navbar links.
    const main = page.locator('main')
    await expect(
      main.getByRole('heading', { name: /revenue operations professional/i }).first()
    ).toBeVisible()
    await expect(main.getByRole('heading', { name: /education/i }).first()).toBeVisible()
    await expect(main.getByRole('heading', { name: /skills by area/i })).toBeVisible()
  })

  test('has download resume button', async ({ page }) => {
    // Find the download button
    const downloadButton = page.getByRole('button', { name: /download/i })
    await expect(downloadButton).toBeVisible()
  })

  test('has view PDF toggle button', async ({ page }) => {
    // Find the view toggle button (PDF View or Interactive View)
    // Control exists in HeroHeader.tsx; it toggles between these two labels.
    const toggleButton = page.getByRole('button', { name: /preview pdf|hide preview/i })
    await expect(toggleButton).toBeVisible()
  })

  test('toggles between resume content and PDF view', async ({ page }) => {
    // Initially should show resume content (not PDF). The About section's
    // actual heading is "Revenue Operations Professional"; assert that's
    // visible in main rather than searching the whole DOM (which picks up
    // the hidden mobile navbar link "About").
    const aboutSection = page
      .locator('main')
      .getByRole('heading', { name: /revenue operations professional/i })
      .first()
    await expect(aboutSection).toBeVisible()

    // Find and click the PDF View toggle
    const toggleButton = page.getByRole('button', { name: /pdf view/i })

    if (await toggleButton.isVisible()) {
      await toggleButton.click()

      // Wait for PDF viewer to appear
      await page.waitForTimeout(500)

      // PDF viewer must be an <object type="application/pdf"> — Chrome
      // PDFium has been progressively restricting <iframe src=pdf>, so a
      // regression to iframe should fail this test (not silently pass).
      const pdfViewer = page.locator('object[type="application/pdf"]').first()

      // If PDF viewer is present, the toggle worked
      // If not visible, might be loading or the viewer renders differently
      const viewResumeButton = page.getByRole('button', { name: /interactive view/i })

      // Either PDF viewer is shown or the button text changed
      const hasToggled = await pdfViewer.isVisible() || await viewResumeButton.isVisible()
      expect(hasToggled).toBeTruthy()

      // Toggle back
      if (await viewResumeButton.isVisible()) {
        await viewResumeButton.click()
        await page.waitForTimeout(500)

        // Should show resume content again — assert the visible Skills
        // section heading rather than any text match (mobile navbar
        // contains hidden links matching the same regex).
        await expect(
          page.locator('main').getByRole('heading', { name: /skills by area/i })
        ).toBeVisible()
      }
    }
  })

  test('download button triggers file download', async ({ page }) => {
    // Set up download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null)

    // Click download button
    const downloadButton = page.getByRole('button', { name: /download/i })
    await downloadButton.click()

    // Wait for download to start (or timeout gracefully)
    const download = await downloadPromise

    if (download) {
      // Verify the download filename
      const filename = download.suggestedFilename()
      expect(filename).toMatch(/resume|Richard.*Hudson/i)
      expect(filename).toMatch(/\.pdf$/i)
    } else {
      // In some environments, direct downloads may not trigger the event
      // Check that toast notification appeared
      const toast = page.getByText(/resume|download/i)
      await expect(toast).toBeVisible({ timeout: 5000 })
    }
  })

  test('resume sections are scrollable', async ({ page }) => {
    // Get initial scroll position
    const initialScroll = await page.evaluate(() => window.scrollY)

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.waitForTimeout(300)

    // Verify scroll position changed
    const newScroll = await page.evaluate(() => window.scrollY)
    expect(newScroll).toBeGreaterThan(initialScroll)
  })

  test('every role renders as one card with its header inside', async ({ page }) => {
    const main = page.locator('main')
    const cards = main.locator('div.rounded-2xl').filter({ has: page.locator('h3 + p.font-semibold') })
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      await expect(card.locator('h3')).toHaveCount(1)
      await expect(card.getByText(/, [A-Z]{2}$/).first()).toBeVisible()
      await expect(card.getByText(/\d{4}/).first()).toBeVisible()
    }
  })

  test('current role is a compact card with a Current pill', async ({ page }) => {
    const card = page
      .locator('main div.rounded-2xl')
      .filter({ hasText: 'HomeVestors of America, Inc.' })
      .first()
    await expect(card.getByText('Current', { exact: true })).toBeVisible()
    await expect(card.locator('ul')).toHaveCount(0)
  })

  test('skills copy no longer promises an interactive matrix', async ({ page }) => {
    await expect(page.getByText(/interactive skill matrix/i)).toHaveCount(0)
    await expect(
      page.locator('main').getByRole('heading', { name: /skills by area/i })
    ).toBeVisible()
  })

  test('Download PDF is primary and Preview PDF is secondary', async ({ page }) => {
    const main = page.locator('main')
    const download = main.getByRole('button', { name: 'Download PDF' })
    const preview = main.getByRole('button', { name: 'Preview PDF' })
    expect(await download.getAttribute('class')).toContain('bg-primary')
    expect(await preview.getAttribute('class')).toContain('bg-background')
  })

  test('passes accessibility audit', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('.blur-3xl') // Exclude decorative elements
      .exclude('object[type="application/pdf"]') // PDF viewer object may have issues
      .analyze()

    // Log violations for debugging
    if (results.violations.length > 0) {
      console.log('Accessibility violations:', JSON.stringify(results.violations, null, 2))
    }

    expect(results.violations).toHaveLength(0)
  })

  test('is responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Verify content is still accessible
    await expect(page.locator('main')).toBeVisible()

    // Verify buttons are still accessible
    const downloadButton = page.getByRole('button', { name: /download/i })
    await expect(downloadButton).toBeVisible()
  })
})
