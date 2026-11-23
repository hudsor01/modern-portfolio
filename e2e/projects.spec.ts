import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Projects Browsing E2E Tests
 *
 * Tests the complete projects user journey:
 * - Projects listing and display
 * - Search and filter functionality
 * - Navigation to project details
 * - All project pages accessible
 */

// Known project slugs based on codebase analysis
const PROJECT_SLUGS = [
  'revenue-kpi',
  'partner-performance',
  'lead-attribution',
  'deal-funnel',
  'customer-lifetime-value',
  'churn-retention',
  'cac-unit-economics',
  'commission-optimization',
  'multi-channel-attribution',
  'quota-territory-management',
  'sales-enablement',
  'forecast-pipeline-intelligence',
  'revenue-operations-center',
]

test.describe('Projects Listing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects')
    await page.waitForLoadState('networkidle')
  })

  test('displays projects page with hero section', async ({ page }) => {
    // Verify page title
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/revenue operations/i)

    // Verify subheading
    await expect(page.getByText(/transforming data/i)).toBeVisible()
  })

  test('displays project stats section', async ({ page }) => {
    // Look for stats or metrics on the page
    const statsSection = page.locator('[class*="stats"], [class*="grid"]').first()
    await expect(statsSection).toBeVisible()
  })

  test('displays project cards grid', async ({ page }) => {
    const projectCards = page.locator('main article')
    await expect(projectCards.first()).toBeVisible()
    expect(await projectCards.count()).toBeGreaterThan(0)
  })

  test('search input filters projects', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i)
    await expect(searchInput).toBeVisible()

    const cards = page.locator('main article')
    await expect(cards.first()).toBeVisible()
    const initialCount = await cards.count()
    expect(initialCount).toBeGreaterThan(1)

    await searchInput.fill('revenue')
    await expect(page).toHaveURL(/search=revenue/)

    // Filtering must actually narrow the grid: some matches, but fewer than all.
    await expect.poll(async () => cards.count()).toBeLessThan(initialCount)
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('category filter works', async ({ page }) => {
    const cards = page.locator('main article')
    await expect(cards.first()).toBeVisible()
    const initialCount = await cards.count()
    expect(initialCount).toBeGreaterThan(1)

    const categoryTrigger = page.getByRole('combobox', { name: 'Filter by category' })
    await expect(categoryTrigger).toBeVisible()
    await categoryTrigger.click()

    const options = page.getByRole('option')
    await expect(options.nth(1)).toBeVisible()
    expect(await options.count()).toBeGreaterThan(1)
    // Click the first non-"all" option
    await options.nth(1).click()

    // nuqs makes the URL the source of truth: selecting a category writes ?category=…
    await expect(page).toHaveURL(/[?&]category=/)

    // The category narrows the grid to a non-empty subset of the full set.
    await expect.poll(async () => cards.count()).toBeLessThan(initialCount)
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('shows "no projects" message when search has no results', async ({ page }) => {
    // Search for something that won't match
    const searchInput = page.getByPlaceholder(/search/i)
    await searchInput.fill('xyznonexistentproject123')

    // Should show no results message
    const noResults = page.getByText(/no projects match|no projects yet/i)
    await expect(noResults).toBeVisible()
  })

  test('displays featured work section heading', async ({ page }) => {
    // Section heading is "All Case Studies"; the old "Featured Work" wording is gone.
    await expect(page.getByRole('heading', { name: /all case studies/i })).toBeVisible()
  })

  test('project count is displayed', async ({ page }) => {
    // Look for project count text
    const projectCount = page.getByText(/\d+\s*projects?/i)
    await expect(projectCount).toBeVisible()
  })

  test('passes accessibility audit', async ({ page }) => {
    // Entrance fades pass through low-contrast frames; audit the settled page.
    await page.evaluate(async () => {
      await document.fonts.ready
      const finite = document.getAnimations().filter((a) => {
        const timing = a.effect?.getComputedTiming()
        return timing !== undefined && timing.iterations !== Infinity
      })
      await Promise.all(finite.map((a) => a.finished.catch(() => undefined)))
    })
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('.blur-3xl')
      .analyze()

    if (results.violations.length > 0) {
      console.log('Accessibility violations:', JSON.stringify(results.violations, null, 2))
    }

    expect(results.violations).toHaveLength(0)
  })
})

test.describe('Project Detail Pages', () => {
  test('can navigate from listing to project detail', async ({ page }) => {
    await page.goto('/projects')
    await page.waitForLoadState('networkidle')

    // Find and click the first project card/link
    const projectLink = page.locator('a[href*="/projects/"]').first()

    if (await projectLink.isVisible()) {
      const href = await projectLink.getAttribute('href')
      await projectLink.click()

      // Verify navigation occurred
      await page.waitForLoadState('networkidle')

      if (href) {
        await expect(page).toHaveURL(new RegExp(href))
      }

      // Verify project detail page has content
      await expect(page.locator('main')).toBeVisible()
    }
  })

  // Test each known project page is accessible
  // Increase timeout for project detail pages with heavy chart rendering
  for (const slug of PROJECT_SLUGS) {
    test(`project page "${slug}" loads successfully`, async ({ page }) => {
      const response = await page.goto(`/projects/${slug}`, { timeout: 60000 })

      // Should not be a 404 or 500
      if (response) {
        expect(response.status()).toBeLessThan(400)
      }

      // Wait for page to load
      await page.waitForLoadState('networkidle')

      // Main content should be visible
      await expect(page.locator('main')).toBeVisible()

      // Should have a heading
      const heading = page.getByRole('heading', { level: 1 }).or(page.getByRole('heading', { level: 2 })).first()
      await expect(heading).toBeVisible()
    })
  }

  test('project detail page has back navigation', async ({ page }) => {
    // Go to a specific project (with extended timeout for chart rendering)
    await page.goto('/projects/revenue-kpi', { timeout: 60000 })
    await page.waitForLoadState('networkidle')

    // Look for back button or link
    // .first() — the /projects/i half matches the header, mobile and footer nav
    // links, so the bare locator is a strict-mode violation and the assertion
    // below never ran.
    const backButton = page
      .getByRole('button', { name: /back/i })
      .or(page.getByRole('link', { name: /back|projects/i }))
      .first()

    if (await backButton.isVisible()) {
      await backButton.click()
      await page.waitForLoadState('networkidle')

      // Should navigate back to projects list
      await expect(page).toHaveURL(/\/projects\/?$/)
    }
  })

  test('project detail page passes accessibility audit', async ({ page }) => {
    await page.goto('/projects/revenue-kpi', { timeout: 60000 })
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('.blur-3xl')
      .exclude('canvas') // Charts may have a11y issues
      .exclude('[class*="recharts"]') // Chart library elements
      .analyze()

    if (results.violations.length > 0) {
      console.log('Accessibility violations:', JSON.stringify(results.violations, null, 2))
    }

    expect(results.violations).toHaveLength(0)
  })
})

test.describe('Projects Mobile Experience', () => {
  test.use({ viewport: { width: 375, height: 667 }, hasTouch: true })

  test('projects page is responsive on mobile', async ({ page }) => {
    await page.goto('/projects')
    await page.waitForLoadState('networkidle')

    // Main content visible
    await expect(page.locator('main')).toBeVisible()

    // Search input accessible
    const searchInput = page.getByPlaceholder(/search/i)
    await expect(searchInput).toBeVisible()

    // Project cards visible
    const projectCards = page.locator('article, [class*="card"]').first()
    await expect(projectCards).toBeVisible()
  })

  test('project cards are tappable on mobile', async ({ page }) => {
    await page.goto('/projects')
    await page.waitForLoadState('networkidle')

    // Find a project link
    const projectLink = page.locator('a[href*="/projects/"]').first()

    if (await projectLink.isVisible()) {
      // Tap the project
      await projectLink.tap()
      await page.waitForLoadState('networkidle')

      // Should navigate to detail page
      await expect(page).toHaveURL(/\/projects\/[^/]+$/)
    }
  })
})

test.describe('Projects Keyboard Navigation', () => {
  test('can navigate projects with keyboard', async ({ page }) => {
    await page.goto('/projects')
    await page.waitForLoadState('networkidle')

    // Tab to search input
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Should eventually reach an interactive element
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('search input is keyboard accessible', async ({ page }) => {
    await page.goto('/projects')
    await page.waitForLoadState('networkidle')

    // Focus search input directly
    const searchInput = page.getByPlaceholder(/search/i)
    await searchInput.focus()
    await expect(searchInput).toBeFocused()

    // Type with keyboard
    await page.keyboard.type('revenue')

    // Verify search value
    await expect(searchInput).toHaveValue('revenue')
  })
})

test('projects shows canonical data-stat tiles once each', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'checked once, on chromium')
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/projects')
  await page.waitForLoadState('networkidle')
  for (const key of ['revenue', 'transaction-growth', 'network-growth']) {
    await expect(page.locator(`[data-stat="${key}"]`)).toHaveCount(1)
  }
  await expect(page.locator('[data-stat="years"]')).toHaveCount(0)
  await expect(page.getByText('Average Growth')).toHaveCount(0)
})
