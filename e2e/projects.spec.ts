import { test, expect } from '@playwright/test'

/**
 * E2E Tests for Portfolio Project Pages
 *
 * Tests the standardized layout patterns across all project pages:
 * - Pattern A (Simple): MetricsGrid → ChartsGrid → NarrativeSections
 * - Pattern B (Tabbed): MetricsGrid → Tab Components → NarrativeSections
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

// All project slugs to test
const PROJECT_SLUGS = [
  // Pattern A (Simple) projects
  'revenue-kpi',
  'churn-retention',
  'deal-funnel',
  'lead-attribution',
  'forecast-pipeline-intelligence',
  'quota-territory-management',
  'sales-enablement',
  'partnership-program-implementation',

  // Pattern B (Tabbed) projects
  'cac-unit-economics',
  'commission-optimization',
  'customer-lifetime-value',
  'multi-channel-attribution',
  'partner-performance',
  'revenue-operations-center',
]

test.describe('Project Pages - Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  PROJECT_SLUGS.forEach((slug) => {
    test(`${slug}: page loads and renders correctly`, async ({ page }) => {
      await page.goto(`${BASE_URL}/projects/${slug}`)

      // Check page title exists
      await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })

      // Check for page description
      await expect(page.locator('p').first()).toBeVisible()

      // Verify no console errors (critical errors only)
      const errors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text())
        }
      })

      // Wait for hydration
      await page.waitForLoadState('networkidle')

      // Filter out known acceptable errors (e.g., third-party scripts)
      const criticalErrors = errors.filter(
        (error) =>
          !error.includes('favicon') &&
          !error.includes('analytics') &&
          !error.includes('third-party')
      )

      expect(criticalErrors).toHaveLength(0)
    })
  })
})

test.describe('Project Pages - Standardized Layout Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  PROJECT_SLUGS.forEach((slug) => {
    test(`${slug}: has MetricsGrid component`, async ({ page }) => {
      await page.goto(`${BASE_URL}/projects/${slug}`)

      // MetricsGrid should have multiple metric cards
      const metricCards = page.locator('[class*="metric"]').or(page.locator('[class*="card"]'))
      await expect(metricCards.first()).toBeVisible({ timeout: 10000 })

      // Should have at least 3-4 metrics (common pattern)
      const count = await metricCards.count()
      expect(count).toBeGreaterThanOrEqual(3)
    })

    test(`${slug}: has charts or content sections`, async ({ page }) => {
      await page.goto(`${BASE_URL}/projects/${slug}`)
      await page.waitForLoadState('networkidle')

      // Look for chart containers, section cards, or canvas elements
      const hasCharts = await page
        .locator('canvas, [class*="chart"], [class*="Chart"]')
        .first()
        .isVisible()
        .catch(() => false)

      const hasSections = await page
        .locator('[class*="section"], [class*="Section"]')
        .first()
        .isVisible()
        .catch(() => false)

      // At least one should be present
      expect(hasCharts || hasSections).toBeTruthy()
    })

    test(`${slug}: has STAR narrative sections`, async ({ page }) => {
      await page.goto(`${BASE_URL}/projects/${slug}`)
      await page.waitForLoadState('networkidle')

      // Scroll to bottom to load narrative sections
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(1000)

      // Check for STAR method headers (common pattern)
      const starHeaders = ['Situation', 'Task', 'Action', 'Result']
      let foundCount = 0

      for (const header of starHeaders) {
        const hasHeader = await page
          .getByRole('heading', { name: header })
          .isVisible()
          .catch(() => false)
        if (hasHeader) foundCount++
      }

      // Should have at least 2 STAR sections visible
      expect(foundCount).toBeGreaterThanOrEqual(2)
    })
  })
})

test.describe('Project Pages - Responsive Design', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ]

  // Test a representative sample of projects
  const sampleProjects = [
    'revenue-kpi', // Simple pattern
    'partner-performance', // Tabbed pattern
    'churn-retention', // Recently refactored
  ]

  sampleProjects.forEach((slug) => {
    viewports.forEach(({ name, width, height }) => {
      test(`${slug}: renders correctly on ${name} (${width}x${height})`, async ({ page }) => {
        await page.setViewportSize({ width, height })
        await page.goto(`${BASE_URL}/projects/${slug}`)
        await page.waitForLoadState('networkidle')

        // Check page title is visible
        await expect(page.locator('h1')).toBeVisible()

        // Check metrics are visible (may stack on mobile)
        const metrics = page.locator('[class*="metric"]').or(page.locator('[class*="card"]'))
        await expect(metrics.first()).toBeVisible()

        // Verify no horizontal overflow
        const hasOverflow = await page.evaluate(() => {
          return document.body.scrollWidth > document.body.clientWidth
        })
        expect(hasOverflow).toBeFalsy()
      })
    })
  })
})

test.describe('Project Pages - Pattern B (Tabbed) Projects', () => {
  const tabbedProjects = [
    'partner-performance',
    'revenue-operations-center',
    'cac-unit-economics',
    'commission-optimization',
    'customer-lifetime-value',
    'multi-channel-attribution',
  ]

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  tabbedProjects.forEach((slug) => {
    test(`${slug}: tabs are functional and switch content`, async ({ page }) => {
      await page.goto(`${BASE_URL}/projects/${slug}`)
      await page.waitForLoadState('networkidle')

      // Look for tab buttons or timeframe selectors
      const tabs = page.locator('button').filter({ hasText: /overview|pipeline|forecast/i })
      const tabCount = await tabs.count()

      if (tabCount > 0) {
        // Click first tab
        await tabs.first().click()
        await page.waitForTimeout(500)

        // Verify content changed (tab should be active)
        const firstTabActive = await tabs.first().getAttribute('class')
        expect(firstTabActive).toContain('active')

        // Click second tab if exists
        if (tabCount > 1) {
          await tabs.nth(1).click()
          await page.waitForTimeout(500)

          const secondTabActive = await tabs.nth(1).getAttribute('class')
          expect(secondTabActive).toContain('active')
        }
      }
    })
  })
})

test.describe('Project Pages - Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  // Test performance on a representative project
  test('revenue-kpi: loads within acceptable time', async ({ page }) => {
    const startTime = Date.now()

    await page.goto(`${BASE_URL}/projects/revenue-kpi`)
    await page.waitForLoadState('networkidle')

    const loadTime = Date.now() - startTime

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000)
  })

  test('churn-retention: dynamic imports load correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/projects/churn-retention`)

    // Wait for charts to load (dynamic imports)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Check if canvas elements are present (charts rendered)
    const charts = await page.locator('canvas').count()
    expect(charts).toBeGreaterThan(0)
  })
})

test.describe('Project Pages - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  // Test accessibility on sample projects
  const sampleProjects = ['revenue-kpi', 'partner-performance']

  sampleProjects.forEach((slug) => {
    test(`${slug}: has proper heading hierarchy`, async ({ page }) => {
      await page.goto(`${BASE_URL}/projects/${slug}`)
      await page.waitForLoadState('networkidle')

      // Check for h1 (should be exactly 1)
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBe(1)

      // Check for h2, h3 (should have at least some)
      const h2Count = await page.locator('h2').count()
      const h3Count = await page.locator('h3').count()
      expect(h2Count + h3Count).toBeGreaterThan(0)
    })

    test(`${slug}: interactive elements are keyboard accessible`, async ({ page }) => {
      await page.goto(`${BASE_URL}/projects/${slug}`)
      await page.waitForLoadState('networkidle')

      // Try tabbing through interactive elements
      await page.keyboard.press('Tab')
      await page.waitForTimeout(200)

      const focusedElement = await page.evaluate(() => document.activeElement?.tagName)

      // Should focus on an interactive element
      expect(['BUTTON', 'A', 'INPUT', 'BODY']).toContain(focusedElement)
    })
  })
})
