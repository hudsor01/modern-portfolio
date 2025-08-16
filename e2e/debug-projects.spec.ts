import { test, expect } from './fixtures'

test.describe('Debug Projects Page', () => {
  test('should debug project page structure', async ({ page }) => {
    await page.goto('http://localhost:3001/projects')
    await page.waitForLoadState('networkidle')
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-projects.png' })
    
    // Check what's actually on the page
    const pageContent = await page.content()
    console.log('Page title:', await page.title())
    
    // Look for any buttons or links
    const allLinks = page.locator('a')
    const linkCount = await allLinks.count()
    console.log('Total links found:', linkCount)
    
    // Look for blue buttons specifically
    const blueButtons = page.locator('a').filter({ hasText: /Come Find|See Revenue|Pipeline|Track|Meet|Calculate|Enter|Predict|Optimize|Follow|Explore/ })
    const blueCount = await blueButtons.count()
    console.log('Blue buttons found:', blueCount)
    
    // If no blue buttons, let's see what buttons we do have
    if (blueCount === 0) {
      const allButtons = page.locator('button, a[class*="bg-blue"]')
      const buttonCount = await allButtons.count()
      console.log('Total buttons/blue links found:', buttonCount)
      
      // Get text of first few links/buttons
      for (let i = 0; i < Math.min(5, linkCount); i++) {
        const link = allLinks.nth(i)
        const text = await link.textContent()
        const href = await link.getAttribute('href')
        console.log(`Link ${i}:`, text?.trim().substring(0, 50), href)
      }
    }
    
    // Basic assertions
    await expect(page.locator('h1')).toBeVisible()
  })
})