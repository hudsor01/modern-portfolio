import { test, expect } from './fixtures'

test.describe('Projects Page - Blue CTA Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects')
    await page.waitForLoadState('networkidle')
    await page.waitForSelector('h1', { timeout: 30000 })
  })

  test('should display all project cards with blue CTA buttons', async ({ page }) => {
    // Wait for project content to load
    await page.waitForSelector('h1', { timeout: 10000 })
    
    // Get all blue CTA buttons 
    const blueButtons = page.locator('a').filter({ 
      hasText: /Come Find|See Revenue|Pipeline|Track|Meet|Calculate|Enter|Predict|Optimize|Follow|Explore/ 
    })
    
    const buttonCount = await blueButtons.count()
    expect(buttonCount).toBeGreaterThan(0)
    
    // Each button should be visible and have blue styling
    for (let i = 0; i < buttonCount; i++) {
      const button = blueButtons.nth(i)
      await expect(button).toBeVisible()
      await expect(button).toHaveClass(/bg-blue-600/)
    }
  })

  test('should navigate to revenue-kpi dashboard when clicking "See Revenue Magic Happen!" button', async ({ page }) => {
    const revenueButton = page.locator('a', { hasText: /See Revenue Magic Happen!/ })
    await expect(revenueButton).toBeVisible()
    
    await revenueButton.click()
    await page.waitForURL('**/projects/revenue-kpi')
    await page.waitForLoadState('networkidle')
    
    // Verify we're on the Revenue KPI dashboard
    await expect(page.locator('h1')).toContainText(/Revenue KPI Dashboard/i)
    await expect(page).toHaveURL(/.*\/projects\/revenue-kpi/)
  })

  test('should navigate to churn-retention dashboard when clicking "Come Find the Customer Churn!" button', async ({ page }) => {
    const churnButton = page.locator('a', { hasText: /Come Find the Customer Churn!/ })
    await expect(churnButton).toBeVisible()
    
    await churnButton.click()
    await page.waitForURL('**/projects/churn-retention')
    await page.waitForLoadState('networkidle')
    
    // Verify we're on the Churn Retention dashboard
    await expect(page.locator('h1')).toContainText(/Churn|Retention/i)
    await expect(page).toHaveURL(/.*\/projects\/churn-retention/)
  })

  test('should navigate to deal-funnel dashboard when clicking "The Sales Pipeline is This Way!" button', async ({ page }) => {
    const funnelButton = page.locator('a', { hasText: /The Sales Pipeline is This Way!/ })
    await expect(funnelButton).toBeVisible()
    
    await funnelButton.click()
    await page.waitForURL('**/projects/deal-funnel')
    await page.waitForLoadState('networkidle')
    
    // Verify we're on the Deal Funnel dashboard
    await expect(page.locator('h1')).toContainText(/Sales|Funnel|Pipeline/i)
    await expect(page).toHaveURL(/.*\/projects\/deal-funnel/)
  })

  test('should navigate to lead-attribution dashboard when clicking "Track Those Leads Here!" button', async ({ page }) => {
    const leadButton = page.locator('a', { hasText: /Track Those Leads Here!/ })
    await expect(leadButton).toBeVisible()
    
    await leadButton.click()
    await page.waitForURL('**/projects/lead-attribution')
    await page.waitForLoadState('networkidle')
    
    // Verify we're on the Lead Attribution dashboard
    await expect(page.locator('h1')).toContainText(/Lead|Attribution/i)
    await expect(page).toHaveURL(/.*\/projects\/lead-attribution/)
  })

  test('should navigate to partner-performance dashboard when clicking "Meet Your Performance Partners!" button', async ({ page }) => {
    const partnerButton = page.locator('a', { hasText: /Meet Your Performance Partners!/ })
    
    if (await partnerButton.isVisible()) {
      await partnerButton.click()
      await page.waitForURL('**/projects/partner-performance')
      await page.waitForLoadState('networkidle')
      
      // Verify we're on the Partner Performance dashboard
      await expect(page.locator('h1')).toContainText(/Partner|Performance/i)
      await expect(page).toHaveURL(/.*\/projects\/partner-performance/)
    }
  })

  test('should navigate to cac-unit-economics dashboard when clicking "Calculate Your Customer Worth!" button', async ({ page }) => {
    const cacButton = page.locator('a', { hasText: /Calculate Your Customer Worth!/ })
    
    if (await cacButton.isVisible()) {
      await cacButton.click()
      await page.waitForURL('**/projects/cac-unit-economics')
      await page.waitForLoadState('networkidle')
      
      // Verify we're on the CAC Unit Economics dashboard
      await expect(page.locator('h1')).toContainText(/CAC|Customer|Economics/i)
      await expect(page).toHaveURL(/.*\/projects\/cac-unit-economics/)
    }
  })

  test('should navigate to revenue-operations-center when clicking "Enter the Revenue Command Center!" button', async ({ page }) => {
    const revenueOpsButton = page.locator('a', { hasText: /Enter the Revenue Command Center!/ })
    
    if (await revenueOpsButton.isVisible()) {
      await revenueOpsButton.click()
      await page.waitForURL('**/projects/revenue-operations-center')
      await page.waitForLoadState('networkidle')
      
      // Verify we're on the Revenue Operations Center
      await expect(page.locator('h1')).toContainText(/Revenue Operations|Command Center/i)
      await expect(page).toHaveURL(/.*\/projects\/revenue-operations-center/)
    }
  })

  test('should ensure all blue CTA buttons are centered and styled correctly', async ({ page }) => {
    const blueButtons = page.locator('a').filter({ 
      hasText: /See Revenue Magic|Come Find|Pipeline|Track|Meet|Calculate|Enter|Predict|Optimize|Follow|Explore/ 
    })
    
    const buttonCount = await blueButtons.count()
    expect(buttonCount).toBeGreaterThan(0)
    
    // Check each button's styling and position
    for (let i = 0; i < buttonCount; i++) {
      const button = blueButtons.nth(i)
      
      // Should have blue background
      await expect(button).toHaveClass(/bg-blue-600/)
      
      // Should have proper padding and border radius
      await expect(button).toHaveClass(/px-8|py-3|rounded-lg/)
      
      // Should be visible and clickable
      await expect(button).toBeVisible()
      await expect(button).toBeEnabled()
      
      // Parent should have centering classes
      const parent = button.locator('..')
      const parentClasses = await parent.getAttribute('class')
      expect(parentClasses).toContain('justify-center')
    }
  })

  test('should have proper hover effects on blue CTA buttons', async ({ page }) => {
    const firstBlueButton = page.locator('a').filter({ 
      hasText: /See Revenue Magic|Come Find|Pipeline|Track|Meet|Calculate|Enter|Predict|Optimize|Follow|Explore/ 
    }).first()
    
    await expect(firstBlueButton).toBeVisible()
    
    // Hover over the button
    await firstBlueButton.hover()
    
    // Should have hover state class
    await expect(firstBlueButton).toHaveClass(/hover:bg-blue-500/)
    
    // Arrow should have transform on hover
    const arrow = firstBlueButton.locator('svg, [class*="arrow"]')
    if (await arrow.isVisible()) {
      await expect(arrow).toHaveClass(/group-hover:translate-x-1/)
    }
  })

  test('should navigate back to projects page from individual project pages', async ({ page }) => {
    // Click first blue button
    const firstBlueButton = page.locator('a').filter({ 
      hasText: /See Revenue Magic|Come Find|Pipeline|Track|Meet|Calculate|Enter|Predict|Optimize|Follow|Explore/ 
    }).first()
    
    await firstBlueButton.click()
    await page.waitForLoadState('networkidle')
    
    // Should be on project detail page
    await expect(page).toHaveURL(/.*\/projects\/.+/)
    
    // Find and click back button
    const backButton = page.locator('a', { hasText: /Back to Projects/i }).first()
    await expect(backButton).toBeVisible()
    await backButton.click()
    
    // Should be back on projects page
    await page.waitForURL('**/projects')
    await expect(page).toHaveURL(/.*\/projects$/)
    
    // Should see project cards again
    const projectCards = page.locator('.group, [data-testid="project-card"]')
    await expect(projectCards.first()).toBeVisible()
  })
})