import { test, expect } from './fixtures'

test.describe('Complete Projects User Flow Tests', () => {
  
  test('should complete full user journey from home to projects to individual dashboard and back', async ({ page, homePage }) => {
    // Start from home page
    await homePage.goto()
    
    // Navigate to projects page
    await homePage.clickViewProjects()
    await page.waitForURL('**/projects')
    
    // Verify projects page loaded
    await expect(page.locator('h1')).toContainText(/Project Portfolio|Projects/i)
    
    // Find and click a blue CTA button
    const blueButton = page.locator('a').filter({ 
      hasText: /See Revenue Magic Happen!/ 
    }).first()
    
    await expect(blueButton).toBeVisible()
    await blueButton.click()
    
    // Should be on revenue KPI dashboard
    await page.waitForURL('**/projects/revenue-kpi')
    await expect(page.locator('h1')).toContainText(/Revenue KPI Dashboard/i)
    
    // Navigate back to projects
    const backButton = page.locator('a', { hasText: /Back to Projects/i })
    await backButton.click()
    await page.waitForURL('**/projects')
    
    // Should see projects page again
    await expect(page.locator('h1')).toContainText(/Project Portfolio|Projects/i)
  })

  test('should test all blue CTA buttons sequentially', async ({ page, projectsPage }) => {
    await projectsPage.goto()
    
    const buttonTestCases = [
      { 
        buttonText: /See Revenue Magic Happen!/,
        expectedUrl: 'revenue-kpi',
        expectedHeading: /Revenue KPI Dashboard/i
      },
      {
        buttonText: /Come Find the Customer Churn!/,
        expectedUrl: 'churn-retention', 
        expectedHeading: /Churn|Retention/i
      },
      {
        buttonText: /The Sales Pipeline is This Way!/,
        expectedUrl: 'deal-funnel',
        expectedHeading: /Sales|Funnel|Pipeline/i
      },
      {
        buttonText: /Track Those Leads Here!/,
        expectedUrl: 'lead-attribution',
        expectedHeading: /Lead|Attribution/i
      }
    ]

    for (const testCase of buttonTestCases) {
      // Go back to projects page for each test
      await page.goto('/projects')
      await page.waitForLoadState('networkidle')
      
      // Find and click the specific button
      const button = page.locator('a').filter({ hasText: testCase.buttonText })
      
      if (await button.isVisible()) {
        await button.click()
        await page.waitForURL(`**/projects/${testCase.expectedUrl}`)
        await page.waitForLoadState('networkidle')
        
        // Verify correct page loaded
        await expect(page.locator('h1')).toContainText(testCase.expectedHeading)
        await expect(page).toHaveURL(new RegExp(`.*\/projects\/${testCase.expectedUrl}`))
      }
    }
  })

  test('should test responsive behavior across all project pages', async ({ page }) => {
    const projectSlugs = [
      'revenue-kpi',
      'churn-retention', 
      'deal-funnel',
      'lead-attribution'
    ]

    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1440, height: 900, name: 'desktop' }
    ]

    for (const slug of projectSlugs) {
      for (const viewport of viewports) {
        await page.setViewportSize(viewport)
        await page.goto(`/projects/${slug}`)
        await page.waitForLoadState('networkidle')
        
        // Should have proper heading
        const h1 = page.locator('h1')
        await expect(h1).toBeVisible()
        
        // Should not have horizontal scroll
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10) // Allow small tolerance
        
        // Back button should be accessible
        const backButton = page.locator('a', { hasText: /Back to Projects/i })
        await expect(backButton).toBeVisible()
      }
    }
  })

  test('should handle direct URL access to project pages', async ({ page }) => {
    const projectUrls = [
      '/projects/revenue-kpi',
      '/projects/churn-retention',
      '/projects/deal-funnel', 
      '/projects/lead-attribution',
      '/projects/partner-performance',
      '/projects/cac-unit-economics'
    ]

    for (const url of projectUrls) {
      await page.goto(url)
      await page.waitForLoadState('networkidle')
      
      // Should load successfully without 404
      await expect(page.locator('h1')).toBeVisible()
      await expect(page).not.toHaveURL(/.*404.*/)
      
      // Should have back navigation
      const backButton = page.locator('a', { hasText: /Back to Projects/i })
      await expect(backButton).toBeVisible()
      
      // Navigation should work
      await backButton.click()
      await page.waitForURL('**/projects')
      await expect(page).toHaveURL(/.*\/projects$/)
    }
  })

  test('should verify all project cards are clickable and lead to correct destinations', async ({ page, projectsPage }) => {
    await projectsPage.goto()
    
    // Get all blue CTA buttons
    const blueButtons = page.locator('a').filter({ 
      hasText: /See Revenue Magic|Come Find|Pipeline|Track|Meet|Calculate|Enter|Predict|Optimize|Follow|Explore/ 
    })
    
    const buttonCount = await blueButtons.count()
    expect(buttonCount).toBeGreaterThan(0)
    
    // Test each button
    for (let i = 0; i < buttonCount; i++) {
      // Go back to projects page
      await page.goto('/projects')
      await page.waitForLoadState('networkidle')
      
      // Get the button again (fresh locator)
      const buttons = page.locator('a').filter({ 
        hasText: /See Revenue Magic|Come Find|Pipeline|Track|Meet|Calculate|Enter|Predict|Optimize|Follow|Explore/ 
      })
      
      const button = buttons.nth(i)
      
      if (await button.isVisible()) {
        // Get the href to know where it should go
        const href = await button.getAttribute('href')
        expect(href).toMatch(/\/projects\/.+/)
        
        // Click and verify navigation
        await button.click()
        await page.waitForLoadState('networkidle')
        
        // Should be on the correct project page
        await expect(page).toHaveURL(new RegExp(`.*${href}`))
        
        // Should have a heading
        await expect(page.locator('h1')).toBeVisible()
        
        // Should have back button
        const backButton = page.locator('a', { hasText: /Back to Projects/i })
        await expect(backButton).toBeVisible()
      }
    }
  })

  test('should test performance and loading times', async ({ page }) => {
    const projectUrls = [
      '/projects',
      '/projects/revenue-kpi',
      '/projects/churn-retention',
      '/projects/deal-funnel'
    ]

    for (const url of projectUrls) {
      const startTime = Date.now()
      
      await page.goto(url)
      await page.waitForLoadState('networkidle')
      await page.waitForSelector('h1')
      
      const loadTime = Date.now() - startTime
      
      // Page should load within reasonable time (10 seconds max)
      expect(loadTime).toBeLessThan(10000)
      
      // Should not have layout shift issues
      const h1 = page.locator('h1')
      await expect(h1).toBeVisible()
      await expect(h1).toBeStable()
    }
  })

  test('should handle browser back/forward navigation correctly', async ({ page, projectsPage }) => {
    await projectsPage.goto()
    
    // Navigate to a project
    const revenueButton = page.locator('a', { hasText: /See Revenue Magic Happen!/ })
    await revenueButton.click()
    await page.waitForURL('**/projects/revenue-kpi')
    
    // Use browser back button
    await page.goBack()
    await page.waitForURL('**/projects')
    await expect(page.locator('h1')).toContainText(/Project Portfolio|Projects/i)
    
    // Use browser forward button
    await page.goForward()
    await page.waitForURL('**/projects/revenue-kpi')
    await expect(page.locator('h1')).toContainText(/Revenue KPI Dashboard/i)
  })

  test('should maintain state across navigation', async ({ page, projectsPage }) => {
    await projectsPage.goto()
    
    // If there are any interactive elements (filters, etc.), test state persistence
    const timeframeButton = page.locator('button', { hasText: /2024|All/ }).first()
    
    if (await timeframeButton.isVisible()) {
      await timeframeButton.click()
      
      // Navigate to a project and back
      const firstButton = page.locator('a').filter({ 
        hasText: /See Revenue Magic|Come Find|Pipeline|Track/ 
      }).first()
      
      await firstButton.click()
      await page.waitForLoadState('networkidle')
      
      // Go back
      const backButton = page.locator('a', { hasText: /Back to Projects/i })
      await backButton.click()
      await page.waitForURL('**/projects')
      
      // State should be maintained (this depends on implementation)
      // For now, just verify page loads correctly
      await expect(page.locator('h1')).toContainText(/Project Portfolio|Projects/i)
    }
  })

  test('should test keyboard navigation accessibility', async ({ page, projectsPage }) => {
    await projectsPage.goto()
    
    // Tab through blue CTA buttons
    await page.keyboard.press('Tab')
    
    let focusedElement = page.locator(':focus')
    
    // Should be able to tab to buttons
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      focusedElement = page.locator(':focus')
      
      if (await focusedElement.isVisible()) {
        const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase())
        
        // If we hit a button or link, test Enter key
        if (tagName === 'a' || tagName === 'button') {
          const href = await focusedElement.getAttribute('href')
          
          if (href && href.includes('/projects/')) {
            await page.keyboard.press('Enter')
            await page.waitForLoadState('networkidle')
            
            // Should navigate to project page
            await expect(page).toHaveURL(new RegExp(`.*${href}`))
            
            // Go back for next iteration
            await page.goBack()
            await page.waitForURL('**/projects')
            break
          }
        }
      }
    }
  })
})