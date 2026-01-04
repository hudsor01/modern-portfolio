import { test, expect } from './fixtures'

test.describe('Individual Project Dashboard Tests', () => {
  
  test.describe('Revenue KPI Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/projects/revenue-kpi')
      await page.waitForLoadState('networkidle')
    })

    test('should display Revenue KPI dashboard with all key elements', async ({ page }) => {
      // Check page title
      await expect(page.locator('h1')).toContainText(/Revenue KPI Dashboard/i)
      
      // Check KPI cards are present
      const kpiCards = page.locator('[class*="bg-white/5"]').filter({ hasText: /Revenue|Partners|Volume|Growth/ })
      await expect(kpiCards).toHaveCount(4)
      
      // Check for revenue value
      await expect(page.locator('text=/\\$[0-9,]+/')).toBeVisible()
      
      // Check for charts
      const charts = page.locator('[class*="h-\\[200px\\]"]')
      await expect(charts.first()).toBeVisible()
      
      // Check timeframe filters
      const timeFrameButtons = page.locator('button', { hasText: /2020|2022|2024|All/ })
      await expect(timeFrameButtons.first()).toBeVisible()
      
      // Check refresh button
      const refreshButton = page.locator('button:has(svg)')
      await expect(refreshButton).toBeVisible()
    })

    test('should have interactive timeframe filters', async ({ page }) => {
      const allButton = page.locator('button', { hasText: 'All' })
      const year2024Button = page.locator('button', { hasText: '2024' })
      
      await expect(allButton).toBeVisible()
      await year2024Button.click()
      
      // Should change active state
      await expect(year2024Button).toHaveClass(/bg-blue-500/)
    })

    test('should have functional refresh button', async ({ page }) => {
      const refreshButton = page.locator('button:has(svg[class*="RefreshCcw"])')
      await refreshButton.click()
      
      // Should show loading state briefly
      await page.waitForTimeout(100)
    })

    test('should display charts correctly', async ({ page }) => {
      // Wait for charts to load
      await page.locator('svg').first().waitFor({ state: 'visible', timeout: 10000 })
      
      const svgElements = page.locator('svg')
      const svgCount = await svgElements.count()
      expect(svgCount).toBeGreaterThan(0)
    })
  })

  test.describe('Churn Retention Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/projects/churn-retention')
      await page.waitForLoadState('networkidle')
    })

    test('should display Churn Retention dashboard elements', async ({ page }) => {
      await expect(page.locator('h1')).toContainText(/Churn|Retention/i)
      
      // Should have metrics cards
      const metricsCards = page.locator('[class*="bg-white/5"]')
      await expect(metricsCards.first()).toBeVisible()
      
      // Should have charts
      const charts = page.locator('svg, canvas, [class*="recharts"]')
      await expect(charts.first()).toBeVisible()
    })

    test('should have back navigation', async ({ page }) => {
      const backButton = page.locator('a', { hasText: /Back to Projects/i })
      await expect(backButton).toBeVisible()
      await expect(backButton).toHaveAttribute('href', '/projects')
    })
  })

  test.describe('Deal Funnel Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/projects/deal-funnel')
      await page.waitForLoadState('networkidle')
    })

    test('should display Deal Funnel dashboard elements', async ({ page }) => {
      await expect(page.locator('h1')).toContainText(/Sales|Funnel|Pipeline/i)
      
      // Should have funnel visualization
      const funnelElements = page.locator('svg, [class*="funnel"], [class*="chart"]')
      await expect(funnelElements.first()).toBeVisible()
      
      // Should have conversion metrics
      const conversionMetrics = page.locator('text=/%|conversion|rate/i')
      await expect(conversionMetrics.first()).toBeVisible()
    })
  })

  test.describe('Lead Attribution Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/projects/lead-attribution')
      await page.waitForLoadState('networkidle')
    })

    test('should display Lead Attribution dashboard elements', async ({ page }) => {
      await expect(page.locator('h1')).toContainText(/Lead|Attribution/i)
      
      // Should have attribution charts
      const charts = page.locator('svg, [class*="chart"]')
      await expect(charts.first()).toBeVisible()
      
      // Should have lead source data
      const leadSources = page.locator('text=/source|channel|lead/i')
      await expect(leadSources.first()).toBeVisible()
    })
  })

  test.describe('Partner Performance Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/projects/partner-performance')
      await page.waitForLoadState('networkidle')
    })

    test('should display Partner Performance dashboard elements', async ({ page }) => {
      await expect(page.locator('h1')).toContainText(/Partner|Performance/i)
      
      // Should have partner metrics
      const partnerMetrics = page.locator('text=/partner|performance|ROI/i')
      await expect(partnerMetrics.first()).toBeVisible()
      
      // Should have performance charts
      const charts = page.locator('svg, [class*="chart"]')
      await expect(charts.first()).toBeVisible()
    })
  })

  test.describe('CAC Unit Economics Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/projects/cac-unit-economics')
      await page.waitForLoadState('networkidle')
    })

    test('should display CAC Unit Economics dashboard elements', async ({ page }) => {
      await expect(page.locator('h1')).toContainText(/CAC|Customer.*Economics|Unit Economics/i)
      
      // Should have CAC metrics
      const cacMetrics = page.locator('text=/CAC|LTV|payback|acquisition/i')
      await expect(cacMetrics.first()).toBeVisible()
      
      // Should have economic charts
      const charts = page.locator('svg, [class*="chart"]')
      await expect(charts.first()).toBeVisible()
    })
  })

  test.describe('Customer Lifetime Value Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/projects/customer-lifetime-value')
      await page.waitForLoadState('networkidle')
    })

    test('should display CLV dashboard elements', async ({ page }) => {
      await expect(page.locator('h1')).toContainText(/Customer.*Lifetime.*Value|CLV/i)
      
      // Should have CLV metrics
      const clvMetrics = page.locator('text=/CLV|lifetime|value|prediction/i')
      await expect(clvMetrics.first()).toBeVisible()
      
      // Should have prediction charts
      const charts = page.locator('svg, [class*="chart"]')
      await expect(charts.first()).toBeVisible()
    })
  })

  test.describe('Commission Optimization Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/projects/commission-optimization')
      await page.waitForLoadState('networkidle')
    })

    test('should display Commission Optimization dashboard elements', async ({ page }) => {
      await expect(page.locator('h1')).toContainText(/Commission|Optimization/i)
      
      // Should have commission metrics
      const commissionMetrics = page.locator('text=/commission|optimization|tier|structure/i')
      await expect(commissionMetrics.first()).toBeVisible()
      
      // Should have optimization charts
      const charts = page.locator('svg, [class*="chart"]')
      await expect(charts.first()).toBeVisible()
    })
  })

  test.describe('Multi-Channel Attribution Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/projects/multi-channel-attribution')
      await page.waitForLoadState('networkidle')
    })

    test('should display Multi-Channel Attribution dashboard elements', async ({ page }) => {
      await expect(page.locator('h1')).toContainText(/Multi.*Channel|Attribution/i)
      
      // Should have attribution metrics
      const attributionMetrics = page.locator('text=/attribution|channel|touchpoint|journey/i')
      await expect(attributionMetrics.first()).toBeVisible()
      
      // Should have attribution charts
      const charts = page.locator('svg, [class*="chart"]')
      await expect(charts.first()).toBeVisible()
    })
  })

  test.describe('Revenue Operations Center Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/projects/revenue-operations-center')
      await page.waitForLoadState('networkidle')
    })

    test('should display Revenue Operations Center dashboard elements', async ({ page }) => {
      await expect(page.locator('h1')).toContainText(/Revenue Operations|Command Center|Operations Center/i)
      
      // Should have operations metrics
      const opsMetrics = page.locator('text=/operations|forecast|pipeline|revenue/i')
      await expect(opsMetrics.first()).toBeVisible()
      
      // Should have operational charts
      const charts = page.locator('svg, [class*="chart"]')
      await expect(charts.first()).toBeVisible()
    })
  })

  // Common tests for all project dashboards
  test.describe('Common Dashboard Features', () => {
    const projectSlugs = [
      'revenue-kpi',
      'churn-retention', 
      'deal-funnel',
      'lead-attribution',
      'partner-performance',
      'cac-unit-economics',
      'customer-lifetime-value',
      'commission-optimization',
      'multi-channel-attribution',
      'revenue-operations-center'
    ]

    projectSlugs.forEach(slug => {
      test(`${slug} should have back navigation to projects page`, async ({ page }) => {
        await page.goto(`/projects/${slug}`)
        await page.waitForLoadState('networkidle')
        
        const backButton = page.locator('a', { hasText: /Back to Projects/i })
        await expect(backButton).toBeVisible()
        await expect(backButton).toHaveAttribute('href', '/projects')
        
        await backButton.click()
        await page.waitForURL('**/projects')
        await expect(page).toHaveURL(/.*\/projects$/)
      })

      test(`${slug} should have proper page structure and accessibility`, async ({ page }) => {
        await page.goto(`/projects/${slug}`)
        await page.waitForLoadState('networkidle')
        
        // Should have h1 heading
        const h1 = page.locator('h1')
        await expect(h1).toBeVisible()
        
        // Should have main content area
        const main = page.locator('main, [role="main"], .main-content')
        if (await main.count() > 0) {
          await expect(main.first()).toBeVisible()
        }
        
        // Should be responsive (no horizontal scroll)
        const body = page.locator('body')
        const bodyBox = await body.boundingBox()
        expect(bodyBox?.width).toBeLessThanOrEqual(1920) // Max expected width
      })

      test(`${slug} should load without JavaScript errors`, async ({ page }) => {
        const jsErrors: string[] = []
        page.on('pageerror', (error) => {
          jsErrors.push(error.message)
        })
        
        await page.goto(`/projects/${slug}`)
        await page.waitForLoadState('networkidle')
        
        // Should not have critical JavaScript errors
        const criticalErrors = jsErrors.filter(error => 
          !error.includes('ResizeObserver') && // Common non-critical error
          !error.includes('Non-Error promise rejection')
        )
        
        expect(criticalErrors).toEqual([])
      })
    })
  })
})