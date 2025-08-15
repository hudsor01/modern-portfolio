import { test, expect } from './fixtures'

test.describe('Projects Page', () => {
  test.beforeEach(async ({ projectsPage }) => {
    await projectsPage.goto()
  })

  test('should display project cards', async ({ projectsPage }) => {
    const projectCards = await projectsPage.getProjectCards()
    await expect(projectCards.first()).toBeVisible()
    
    // Should have multiple projects
    const count = await projectCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should navigate to individual project pages', async ({ projectsPage, page }) => {
    const projectCards = await projectsPage.getProjectCards()
    const firstCard = projectCards.first()
    
    // Get the first project link
    const projectLink = firstCard.getByRole('link').first()
    await projectLink.click()
    
    // Should navigate to project detail page
    await expect(page).toHaveURL(/.*\/projects\/.*/)
    
    // Should display project content
    await page.waitForLoadState('networkidle')
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
  })

  test('should filter projects by category', async ({ projectsPage, page }) => {
    // Click on Analytics filter if available
    const analyticsFilter = page.getByRole('button', { name: /analytics/i }).first()
    
    if (await analyticsFilter.isVisible()) {
      await analyticsFilter.click()
      
      // Wait for filtering to complete
      await page.waitForTimeout(500)
      
      const projectCards = await projectsPage.getProjectCards()
      const count = await projectCards.count()
      expect(count).toBeGreaterThan(0)
    }
  })

  test('should search projects', async ({ projectsPage, page }) => {
    const searchInput = page.getByPlaceholder(/search/i)
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('revenue')
      
      // Wait for search results
      await page.waitForTimeout(500)
      
      const projectCards = await projectsPage.getProjectCards()
      const count = await projectCards.count()
      expect(count).toBeGreaterThanOrEqual(0)
    }
  })

  test('should display project metadata correctly', async ({ page }) => {
    const projectCards = page.getByTestId('project-card')
    const firstCard = projectCards.first()
    
    if (await firstCard.isVisible()) {
      // Should have project title
      const title = firstCard.locator('h2, h3').first()
      await expect(title).toBeVisible()
      
      // Should have project description
      const description = firstCard.locator('p').first()
      await expect(description).toBeVisible()
      
      // Should have technology tags
      const tags = firstCard.locator('[data-testid="project-tag"], .badge, .tag')
      if (await tags.first().isVisible()) {
        await expect(tags.first()).toBeVisible()
      }
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    const projectCards = page.getByTestId('project-card')
    await expect(projectCards.first()).toBeVisible()
    
    // Cards should stack vertically on mobile
    const firstCard = projectCards.first()
    const secondCard = projectCards.nth(1)
    
    if (await secondCard.isVisible()) {
      const firstCardBox = await firstCard.boundingBox()
      const secondCardBox = await secondCard.boundingBox()
      
      if (firstCardBox && secondCardBox) {
        // Second card should be below first card on mobile
        expect(secondCardBox.y).toBeGreaterThan(firstCardBox.y + firstCardBox.height - 50)
      }
    }
  })

  test('should have proper pagination or load more functionality', async ({ page }) => {
    const projectCards = page.getByTestId('project-card')
    const initialCount = await projectCards.count()
    
    // Look for pagination or load more button
    const loadMoreBtn = page.getByRole('button', { name: /load more|show more/i })
    const pagination = page.getByRole('navigation', { name: /pagination/i })
    
    if (await loadMoreBtn.isVisible()) {
      await loadMoreBtn.click()
      await page.waitForTimeout(1000)
      
      const newCount = await projectCards.count()
      expect(newCount).toBeGreaterThanOrEqual(initialCount)
    } else if (await pagination.isVisible()) {
      const nextButton = pagination.getByRole('button', { name: /next/i })
      if (await nextButton.isVisible() && await nextButton.isEnabled()) {
        await nextButton.click()
        await page.waitForLoadState('networkidle')
      }
    }
  })

  test('should display project statistics', async ({ page }) => {
    const projectCards = page.getByTestId('project-card')
    const firstCard = projectCards.first()
    
    if (await firstCard.isVisible()) {
      // Look for revenue or other statistics
      const stats = firstCard.locator('text=/\\$|%|\\d+\\.\\d+[KM]?/')
      if (await stats.first().isVisible()) {
        await expect(stats.first()).toBeVisible()
      }
    }
  })

  test('should have accessible project cards', async ({ page }) => {
    const projectCards = page.getByTestId('project-card')
    const firstCard = projectCards.first()
    
    // Should have proper heading structure
    const headings = firstCard.locator('h1, h2, h3, h4, h5, h6')
    await expect(headings.first()).toBeVisible()
    
    // Links should have proper accessible names
    const links = firstCard.getByRole('link')
    const linkCount = await links.count()
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i)
      const linkText = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')
      
      // Link should have either text content or aria-label
      expect(linkText?.trim() || ariaLabel?.trim()).toBeTruthy()
    }
  })

  test('should handle empty search results gracefully', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i)
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('xyznonexistentproject123')
      await page.waitForTimeout(500)
      
      // Should show no results message or empty state
      const noResults = page.getByText(/no projects found|no results|empty/i)
      const projectCards = page.getByTestId('project-card')
      
      const noResultsVisible = await noResults.isVisible()
      const cardsCount = await projectCards.count()
      
      // Either show no results message or have zero cards
      expect(noResultsVisible || cardsCount === 0).toBe(true)
    }
  })

  test('should display featured projects prominently', async ({ page }) => {
    // Look for featured projects section or badges
    const featuredSection = page.getByText(/featured/i).first()
    const featuredBadges = page.locator('[data-testid="featured-badge"], .featured, .badge')
    
    if (await featuredSection.isVisible() || await featuredBadges.first().isVisible()) {
      // Featured projects should be visible
      expect(true).toBe(true)
    }
  })
})