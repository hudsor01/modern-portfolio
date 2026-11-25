import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { settleTransitions } from './_helpers/settle'
import { PROJECT_COUNT, PROJECT_SLUGS_ON_DISK } from './_helpers/project-slugs'

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
    // The metric cards fade in (staggered up to 300ms delay + 500ms). Axe reads
    // computed colors, so sampling mid-fade reports text at ~1:1 contrast.
    await settleTransitions(page)

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

const FEATURED_ORDER = [
  '/projects/revenue-kpi',
  '/projects/forecast-pipeline-intelligence',
  '/projects/partnership-program-implementation',
  '/projects/sales-enablement',
]

const ALL_PROJECT_SLUGS = PROJECT_SLUGS_ON_DISK

const PREVIEW_LABEL = /^(Results chart|Key metrics)\. .+\.$/

test.describe('Projects showcase (UI-05, UI-06)', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'checked once, on chromium')
  })

  test('/projects renders one photo-free card per project with previews, chips and 4 featured badges', async ({
    page,
  }) => {
    await page.goto('/projects')
    await page.waitForLoadState('networkidle')

    const cards = page.locator('main article')
    await expect(cards).toHaveCount(PROJECT_COUNT)
    await expect(page.locator('main article img')).toHaveCount(0)

    const badges = page.locator('main [data-slot="featured-badge"]')
    await expect(badges).toHaveCount(4)

    const cardHrefs = await page
      .locator('main a[href^="/projects/"]')
      .filter({ has: page.locator('article') })
      .evaluateAll((els) => els.map((el) => el.getAttribute('href')))
    expect(cardHrefs).toHaveLength(PROJECT_COUNT)
    expect(cardHrefs.slice(0, 4)).toEqual(FEATURED_ORDER)

    const labels = await cards.evaluateAll((els) =>
      els.map((el) => {
        const previews = el.querySelectorAll('[data-slot="project-preview"][role="img"]')
        return { count: previews.length, label: previews[0]?.getAttribute('aria-label') ?? '' }
      }),
    )
    expect(labels).toHaveLength(PROJECT_COUNT)
    for (const { count, label } of labels) {
      expect(count).toBe(1)
      expect(label).toMatch(PREVIEW_LABEL)
    }

    const chips = page.locator('main [data-slot="client-chip"]')
    await expect(chips).toHaveCount(PROJECT_COUNT)
    const chipTexts = (await chips.allInnerTexts()).map((t) => t.trim())
    expect(chipTexts).toHaveLength(PROJECT_COUNT)
    for (const text of chipTexts) {
      expect(text.length, `chip "${text}" length`).toBeGreaterThanOrEqual(8)
      expect(text.length, `chip "${text}" length`).toBeLessThanOrEqual(36)
      expect(text, `chip "${text}" has no legal suffix`).not.toMatch(/\b(Inc|Co|LLC|Corp|Ltd)\b\.?/i)
    }
  })

  for (const path of ['/projects', '/', '/contact']) {
    test(`${path} requests no project photos or stock images`, async ({ page }) => {
      const urls: string[] = []
      page.on('request', (req) => {
        if (req.resourceType() !== 'image') return
        const raw = req.url()
        urls.push(decodeURIComponent(raw))
        const inner = new URL(raw).searchParams.get('url')
        if (inner) urls.push(decodeURIComponent(inner))
      })
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      // Home legitimately loads /images/richard.jpg, which proves the listener sees
      // image requests; /projects and /contact are photo-free, so zero is the pass state.
      if (path === '/') expect(urls.length, 'home issued image requests').toBeGreaterThan(0)
      for (const url of urls) expect(url).not.toMatch(/images\/projects\//)
      if (path !== '/') {
        for (const url of urls) expect(new URL(url, 'http://x').host).not.toBe('images.unsplash.com')
      }
    })
  }
})

test.describe('Project OG cards (UI-06)', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'checked once, on chromium')
  })

  test('all project cards render as 1200x630 PNG', async ({ request }) => {
    expect(ALL_PROJECT_SLUGS.length).toBeGreaterThan(0)
    for (const slug of ALL_PROJECT_SLUGS) {
      const res = await request.get(`/api/og?project=${slug}&title=Fixture`)
      expect(res.status(), slug).toBe(200)
      expect(res.headers()['content-type'], slug).toMatch(/^image\/png/)
      const body = await res.body()
      expect(body.readUInt32BE(16), `${slug} width`).toBe(1200)
      expect(body.readUInt32BE(20), `${slug} height`).toBe(630)
    }
  })

  test('unknown project slug falls through to a generic PNG', async ({ request }) => {
    const res = await request.get('/api/og?project=nope')
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toMatch(/^image\/png/)
  })
})
