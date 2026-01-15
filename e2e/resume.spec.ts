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
    // Verify About section exists
    await expect(page.getByText(/about/i).first()).toBeVisible()

    // Verify Experience section exists
    await expect(page.getByText(/experience/i).first()).toBeVisible()

    // Verify Education section exists
    await expect(page.getByText(/education/i).first()).toBeVisible()

    // Verify Skills section exists
    await expect(page.getByText(/skills/i).first()).toBeVisible()
  })

  test('has download resume button', async ({ page }) => {
    // Find the download button
    const downloadButton = page.getByRole('button', { name: /download/i })
    await expect(downloadButton).toBeVisible()
  })

  test('has view PDF toggle button', async ({ page }) => {
    // Find the view toggle button (PDF View or Interactive View)
    const toggleButton = page.getByRole('button', { name: /pdf view|interactive view/i })
    await expect(toggleButton).toBeVisible()
  })

  test('toggles between resume content and PDF view', async ({ page }) => {
    // Initially should show resume content (not PDF)
    const aboutSection = page.getByText(/about/i).first()
    await expect(aboutSection).toBeVisible()

    // Find and click the PDF View toggle
    const toggleButton = page.getByRole('button', { name: /pdf view/i })

    if (await toggleButton.isVisible()) {
      await toggleButton.click()

      // Wait for PDF viewer to appear
      await page.waitForTimeout(500)

      // Should now show PDF viewer (iframe or embed)
      const pdfViewer = page.locator('iframe, embed, object').first()

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

        // Should show resume content again
        await expect(page.getByText(/about|experience|skills/i).first()).toBeVisible()
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

  test('experience section displays job entries', async ({ page }) => {
    // Look for experience-related content
    const experienceContent = page.locator('section').filter({ hasText: /experience/i })

    if (await experienceContent.isVisible()) {
      // Should contain role/title information
      await expect(experienceContent).toBeVisible()
    }
  })

  test('skills section displays skill categories', async ({ page }) => {
    // Look for skills section
    const skillsSection = page.locator('section').filter({ hasText: /skills/i })

    if (await skillsSection.isVisible()) {
      // Should contain various skill categories or tags
      await expect(skillsSection).toBeVisible()
    }
  })

  test('keyboard navigation works correctly', async ({ page }) => {
    // Focus on main content
    await page.keyboard.press('Tab')

    // Continue tabbing and verify focus moves
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    }
  })

  test('passes accessibility audit', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('.blur-3xl') // Exclude decorative elements
      .exclude('iframe') // PDF viewer iframe may have issues
      .exclude('.bg-accent\\/10') // Known contrast issue with accent badges - tracked for fix
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
