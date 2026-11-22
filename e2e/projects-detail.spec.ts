import { test, expect } from '@playwright/test'

/**
 * Project Detail Pages E2E Tests
 *
 * Parametric coverage across all 14 project subroutes (note: the original
 * task brief said "13 slugs" but partnership-program-implementation is a
 * separate top-level route in addition to the other 13 — list both).
 * For each slug:
 *   - Page returns 200
 *   - Has a back-to-projects link
 *   - Renders the project's title in an <h1>
 *
 * Plus regression assertion (audit fix #1):
 *   - /projects/revenue-kpi has NO timeframe pills
 *
 * Plus tab-switcher routes (per CLAUDE.md):
 *   - cac-unit-economics, commission-optimization, customer-lifetime-value,
 *     multi-channel-attribution, partner-performance, revenue-operations-center
 *   Click a non-default timeframe and assert the URL `?tab=` updates.
 */

const PROJECT_SLUGS = [
  'cac-unit-economics',
  'churn-retention',
  'commission-optimization',
  'customer-lifetime-value',
  'deal-funnel',
  'forecast-pipeline-intelligence',
  'lead-attribution',
  'multi-channel-attribution',
  'partner-performance',
  'partnership-program-implementation',
  'quota-territory-management',
  'revenue-kpi',
  'revenue-operations-center',
  'sales-enablement',
] as const

const TAB_SWITCHER_SLUGS = [
  'cac-unit-economics',
  'commission-optimization',
  'customer-lifetime-value',
  'multi-channel-attribution',
  'partner-performance',
  'revenue-operations-center',
] as const

test.describe('Project detail pages — basic load + nav', () => {
  for (const slug of PROJECT_SLUGS) {
    test(`/projects/${slug} returns 200, renders <h1>, and has back-to-projects link`, async ({
      page,
    }) => {
      // Heavy chart pages can take time to render server-side.
      const response = await page.goto(`/projects/${slug}`, { timeout: 60000 })
      expect(response).not.toBeNull()
      expect(response?.status()).toBe(200)

      await page.waitForLoadState('networkidle')
      await expect(page.locator('main')).toBeVisible()

      // ProjectPageLayout renders exactly one <h1>.
      const h1 = page.getByRole('heading', { level: 1 }).first()
      await expect(h1).toBeVisible()
      const h1Text = (await h1.textContent())?.trim() ?? ''
      expect(h1Text.length).toBeGreaterThan(0)

      // Back button links back to /projects (BackButton wraps a Next Link).
      //
      // Target the BackButton by its own test id, NOT `a[href="/projects"]`.
      // Four elements match that href on a detail page, in DOM order:
      //   0. navbar desktop link   — inside `<nav class="hidden md:flex">`, so
      //      hidden below the `md` breakpoint
      //   1. navbar mobile-menu link — inside a collapsed `[hidden]` drawer
      //   2. the BackButton         — the one we actually mean
      //   3. footer link
      // `.first()` therefore resolved the *desktop navbar* link, which is
      // correctly hidden at the Pixel 5 viewport — so this assertion failed on
      // mobile-chrome for every project slug while passing on desktop by
      // coincidence of ordering. The test id is unique (count 1) and
      // viewport-independent. Note the button lives in `<header>`, not `<main>`,
      // and carries role="button", so neither a main-scoped locator nor
      // getByRole('link') can reach it.
      const backLink = page.getByTestId('back-button')
      await expect(backLink).toBeVisible()
      await expect(backLink).toHaveAttribute('href', '/projects')
    })
  }
})

test.describe('Project detail pages — regression assertions', () => {
  test('/projects/revenue-kpi has NO timeframe pills (regression #1)', async ({ page }) => {
    await page.goto('/projects/revenue-kpi', { timeout: 60000 })
    await page.waitForLoadState('networkidle')

    // ProjectPageLayout exposes the timeframe selector as
    // data-testid="timeframe-selector"; the audit removed it from
    // revenue-kpi by passing showTimeframes=false (default).
    await expect(page.locator('[data-testid="timeframe-selector"]')).toHaveCount(0)

    // Belt-and-braces: assert no buttons match the historical pill labels
    // ("2020", "2022", "2024", "All") inside the page header region.
    const main = page.locator('main')
    for (const label of ['2020', '2022', '2024', 'All']) {
      await expect(
        main.getByRole('button', { name: new RegExp(`^${label}$`) })
      ).toHaveCount(0)
    }
  })

  test('/projects/revenue-kpi charts: derived title, dual axis, compact ticks (BUG-03)', async ({
    page,
  }) => {
    await page.goto('/projects/revenue-kpi', { timeout: 60000 })
    await page.waitForLoadState('networkidle')

    const surfaces = page.locator('.recharts-surface')
    await surfaces.first().scrollIntoViewIfNeeded()
    await expect
      .poll(() => surfaces.count(), { message: 'expected >= 4 recharts surfaces', timeout: 30000 })
      .toBeGreaterThanOrEqual(4)

    // (a) derived trend title, no hardcoded 2024
    const trendTitle = page.getByText(/^(Quarterly|Monthly) Revenue · .+/).first()
    await expect(trendTitle, 'trend title is derived from data').toBeVisible()
    expect(await trendTitle.textContent(), 'trend title has no hardcoded 2024').not.toContain(
      '2024'
    )

    // (b) dual axis on Revenue Growth Metrics
    const growthCard = page
      .locator('.portfolio-card')
      .filter({ hasText: 'Revenue Growth Metrics' })
      .first()
    await expect(growthCard.locator('.recharts-yAxis'), 'two Y axes').toHaveCount(2)
    await expect(growthCard.getByText('Revenue / Commissions ($M)')).toBeVisible()
    await expect(growthCard.getByText('Transactions (K)').first()).toBeVisible()

    // (c) no non-compact currency ticks like $3600K
    const ticks = await page.locator('.recharts-cartesian-axis-tick-value').allTextContents()
    for (const tick of ticks) {
      expect(tick, `tick "${tick}" must be compact`).not.toMatch(/\$\d{4,}K/)
    }

    // (d) charts are not collapsed
    const heights = await surfaces.evaluateAll((els) =>
      els.map((el) => el.getBoundingClientRect().height)
    )
    for (const h of heights) {
      expect(h, 'chart surface height >= 200').toBeGreaterThanOrEqual(200)
    }
  })
})

test.describe('Project detail pages — tab switcher updates URL', () => {
  for (const slug of TAB_SWITCHER_SLUGS) {
    test(`/projects/${slug} clicking a tab updates ?tab= via useQueryState`, async ({ page }) => {
      await page.goto(`/projects/${slug}`, { timeout: 60000 })
      await page.waitForLoadState('networkidle')

      const selector = page.locator('[data-testid="timeframe-selector"]')
      await expect(selector).toBeVisible()

      const tabButtons = selector.getByRole('button')
      const count = await tabButtons.count()
      expect(count).toBeGreaterThanOrEqual(2)

      // Find the first non-active tab button. The active one has variant
      // "default" → bg-primary class; non-active ones use ghost/muted.
      let clickedLabel: string | null = null
      for (let i = 0; i < count; i++) {
        const btn = tabButtons.nth(i)
        const className = (await btn.getAttribute('class')) ?? ''
        if (!className.includes('bg-primary')) {
          clickedLabel = ((await btn.textContent()) ?? '').trim()
          await btn.click()
          break
        }
      }
      expect(clickedLabel).not.toBeNull()

      // useQueryState writes the lowercase tab name into ?tab=. Allow a
      // tick for the navigation to propagate.
      await page.waitForFunction(() => new URL(location.href).searchParams.has('tab'), {
        timeout: 5000,
      })

      const url = new URL(page.url())
      const tabParam = url.searchParams.get('tab')
      expect(tabParam).not.toBeNull()
      expect(tabParam).toBe(clickedLabel?.toLowerCase())
    })
  }
})
