import { test, expect } from '@playwright/test'

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for fonts and CSS to load
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000) // Additional time for animations/fonts
  })

  test('should match home page screenshot', async ({ page }) => {
    // Hide dynamic elements that might cause flakiness
    await page.addStyleTag({
      content: `
        .animate-pulse,
        .animate-spin,
        .animate-bounce,
        [data-testid="loading"],
        .loading {
          animation: none !important;
        }
      `
    })

    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      threshold: 0.2, // Allow for minor differences
    })
  })

  test('should match home page mobile screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.addStyleTag({
      content: `
        .animate-pulse,
        .animate-spin,
        .animate-bounce,
        [data-testid="loading"],
        .loading {
          animation: none !important;
        }
      `
    })

    await expect(page).toHaveScreenshot('home-page-mobile.png', {
      fullPage: true,
      threshold: 0.2,
    })
  })

  test('should match projects page screenshot', async ({ page }) => {
    await page.goto('/projects')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    await page.addStyleTag({
      content: `
        .animate-pulse,
        .animate-spin,
        .animate-bounce,
        [data-testid="loading"],
        .loading {
          animation: none !important;
        }
      `
    })

    await expect(page).toHaveScreenshot('projects-page.png', {
      fullPage: true,
      threshold: 0.2,
    })
  })

  test('should match contact page screenshot', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    await expect(page).toHaveScreenshot('contact-page.png', {
      fullPage: true,
      threshold: 0.2,
    })
  })

  test('should match individual project page screenshot', async ({ page }) => {
    await page.goto('/projects/revenue-kpi')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000) // Extra time for charts to render

    // Hide chart animations
    await page.addStyleTag({
      content: `
        .recharts-wrapper *,
        [data-testid="chart"] *,
        .animate-pulse,
        .animate-spin,
        .animate-bounce {
          animation: none !important;
          transition: none !important;
        }
      `
    })

    await expect(page).toHaveScreenshot('project-detail-page.png', {
      fullPage: true,
      threshold: 0.3, // Charts might have slight variations
    })
  })

  test('should match navigation components', async ({ page }) => {
    // Test header/navigation
    const navigation = page.locator('nav, header').first()
    await expect(navigation).toHaveScreenshot('navigation.png', {
      threshold: 0.1,
    })
  })

  test('should match project card components', async ({ page }) => {
    await page.goto('/projects')
    await page.waitForLoadState('networkidle')
    
    const projectCard = page.getByTestId('project-card').first()
    if (await projectCard.isVisible()) {
      await expect(projectCard).toHaveScreenshot('project-card.png', {
        threshold: 0.2,
      })
    }
  })

  test('should match theme variations', async ({ page }) => {
    // Test dark theme
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Find and click theme toggle
    const themeToggle = page.getByRole('button', { name: /theme/i })
    if (await themeToggle.isVisible()) {
      await themeToggle.click()
      await page.waitForTimeout(500)
      
      await expect(page).toHaveScreenshot('home-page-light-theme.png', {
        fullPage: true,
        threshold: 0.3,
      })
    }
  })

  test('should match modal/dialog components', async ({ page }) => {
    // Open contact modal
    const contactButton = page.getByRole('button', { name: /contact/i }).first()
    if (await contactButton.isVisible()) {
      await contactButton.click()
      
      const modal = page.getByRole('dialog')
      if (await modal.isVisible()) {
        await expect(modal).toHaveScreenshot('contact-modal.png', {
          threshold: 0.2,
        })
      }
    }
  })

  test('should match chart components', async ({ page }) => {
    await page.goto('/projects/revenue-kpi')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Hide animations
    await page.addStyleTag({
      content: `
        .recharts-wrapper *,
        [data-testid="chart"] * {
          animation: none !important;
          transition: none !important;
        }
      `
    })

    const chart = page.locator('.recharts-wrapper, [data-testid="chart"]').first()
    if (await chart.isVisible()) {
      await expect(chart).toHaveScreenshot('revenue-chart.png', {
        threshold: 0.3,
      })
    }
  })

  test('should match error states', async ({ page }) => {
    // Mock API to return error
    await page.route('/api/contact', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Server error',
        }),
      })
    })

    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    
    // Fill and submit form to trigger error
    await page.getByLabel(/name/i).fill('Test User')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/subject/i).fill('Test')
    await page.getByLabel(/message/i).fill('Test message')
    await page.getByRole('button', { name: /send|submit/i }).click()
    
    // Wait for error to appear
    await page.waitForTimeout(1000)
    
    const errorMessage = page.getByText(/error/i)
    if (await errorMessage.isVisible()) {
      await expect(page).toHaveScreenshot('contact-error-state.png', {
        fullPage: true,
        threshold: 0.2,
      })
    }
  })

  test('should match loading states', async ({ page }) => {
    // Mock API to delay response
    await page.route('/api/contact', (route) => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Success',
          }),
        })
      }, 2000)
    })

    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    
    // Fill and submit form
    await page.getByLabel(/name/i).fill('Test User')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/subject/i).fill('Test')
    await page.getByLabel(/message/i).fill('Test message')
    await page.getByRole('button', { name: /send|submit/i }).click()
    
    // Wait briefly for loading state
    await page.waitForTimeout(500)
    
    const loadingIndicator = page.locator('[data-testid="loading"], .loading, .spinner')
    if (await loadingIndicator.isVisible()) {
      await expect(page).toHaveScreenshot('contact-loading-state.png', {
        fullPage: true,
        threshold: 0.2,
      })
    }
  })

  test('should match responsive breakpoints', async ({ page }) => {
    const breakpoints = [
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1024, height: 768 },
      { name: 'large-desktop', width: 1440, height: 900 },
    ]

    for (const breakpoint of breakpoints) {
      await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height })
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)

      await expect(page).toHaveScreenshot(`home-page-${breakpoint.name}.png`, {
        fullPage: true,
        threshold: 0.2,
      })
    }
  })
})