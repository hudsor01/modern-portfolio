import { test, expect } from './fixtures'

test.describe('Home Page', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto()
  })

  test('should display hero section with main title', async ({ homePage }) => {
    const heroTitle = await homePage.getHeroTitle()
    await expect(heroTitle).toBeVisible()
    await expect(heroTitle).toContainText('Richard Hudson')
  })

  test('should have functional navigation to projects', async ({ homePage, page }) => {
    await homePage.clickViewProjects()
    await expect(page).toHaveURL(/.*\/projects/)
  })

  test('should open contact modal when contact button is clicked', async ({ homePage, page }) => {
    await homePage.clickContactButton()
    
    // Check for contact modal/dialog
    const contactDialog = page.getByRole('dialog')
    await expect(contactDialog).toBeVisible()
  })

  test('should have proper meta tags for SEO', async ({ page }) => {
    await expect(page).toHaveTitle(/Richard Hudson.*Revenue Operations Consultant/)
    
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /Revenue Operations Consultant/)
  })

  test('should load without performance issues', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForLoadState('networkidle')
    
    // Check that the page loads within reasonable time
    const startTime = Date.now()
    await page.reload()
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime
    
    expect(loadTime).toBeLessThan(5000) // Should load within 5 seconds
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    const heroTitle = page.locator('h1').first()
    await expect(heroTitle).toBeVisible()
    
    // Check that mobile navigation works
    const mobileMenuButton = page.getByRole('button', { name: /menu/i })
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click()
      const navigation = page.getByRole('navigation')
      await expect(navigation).toBeVisible()
    }
  })

  test('should have accessible navigation', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    
    // Check for alt text on images
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i)
      await expect(image).toHaveAttribute('alt')
    }
    
    // Check for proper link text
    const links = page.getByRole('link')
    const linkCount = await links.count()
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i)
      const linkText = await link.textContent()
      expect(linkText?.trim()).not.toBe('')
    }
  })

  test('should display key statistics', async ({ page }) => {
    // Look for revenue or project statistics on home page
    // The home page might have different stats than contact page
    const pageContent = page.locator('body')
    const hasStats = await pageContent.locator('text=/\\$|\\d+\\+|\\d+%/').first().isVisible()
    
    // Just verify that some statistics are displayed
    expect(hasStats).toBe(true)
  })

  test('should have working theme toggle', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /theme/i })
    
    if (await themeToggle.isVisible()) {
      // Get initial theme
      const html = page.locator('html')
      const initialClass = await html.getAttribute('class')
      
      // Click theme toggle
      await themeToggle.click()
      
      // Wait for theme change
      await page.waitForTimeout(100)
      
      // Verify theme changed
      const newClass = await html.getAttribute('class')
      expect(newClass).not.toBe(initialClass)
    }
  })

  test('should have proper structured data', async ({ page }) => {
    // Check for JSON-LD structured data
    const jsonLdScript = page.locator('script[type="application/ld+json"]')
    await expect(jsonLdScript).toHaveCount(1)
    
    const structuredData = await jsonLdScript.textContent()
    expect(structuredData).toContain('Person')
    expect(structuredData).toContain('Richard Hudson')
  })
})