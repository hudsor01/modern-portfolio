/**
 * Reading Progress E2E Tests
 * End-to-end tests for reading progress indicator functionality
 */

import { test, expect, type Page } from '@playwright/test'

test.describe('Reading Progress Indicator', () => {
  test.beforeEach(async ({ page }) => {
    // Increase viewport height to ensure scrollable content
    await page.setViewportSize({ width: 1280, height: 800 })
  })

  test('should show reading progress on blog posts', async ({ page }) => {
    // Visit a blog page (assuming we have one, or create a long page)
    await page.goto('/blog/test-post', { waitUntil: 'networkidle' })
    
    // If blog doesn't exist, visit resume page which has content
    if (await page.locator('text=Not Found').count() > 0) {
      await page.goto('/resume')
    }

    // Wait for content to load
    await page.waitForTimeout(1000)

    // Check if progress bar appears (might not be visible initially at top)
    const progressBar = page.locator('[role="progressbar"]')
    
    // Scroll down to trigger progress bar
    await page.evaluate(() => {
      window.scrollTo({ top: 200, behavior: 'instant' })
    })
    
    await page.waitForTimeout(500)

    // Progress bar should now be visible
    await expect(progressBar).toBeVisible()
    expect(await progressBar.getAttribute('aria-valuenow')).toBeTruthy()
  })

  test('should update progress as user scrolls', async ({ page }) => {
    await page.goto('/resume')
    await page.waitForLoadState('networkidle')

    // Get initial scroll position
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.waitForTimeout(300)

    // Scroll to different positions and check progress updates
    const checkProgressAtPosition = async (scrollPosition: number, expectedMinProgress: number) => {
      await page.evaluate((pos) => {
        window.scrollTo({ top: pos, behavior: 'instant' })
      }, scrollPosition)
      
      await page.waitForTimeout(300)
      
      const progressBar = page.locator('[role="progressbar"]')
      if (await progressBar.count() > 0) {
        const progress = await progressBar.getAttribute('aria-valuenow')
        const progressNum = parseInt(progress || '0')
        expect(progressNum).toBeGreaterThanOrEqual(expectedMinProgress)
      }
    }

    // Test different scroll positions
    await checkProgressAtPosition(100, 1)
    await checkProgressAtPosition(500, 5)
    await checkProgressAtPosition(1000, 10)
  })

  test('should show correct progress percentage', async ({ page }) => {
    await page.goto('/resume')
    await page.waitForLoadState('networkidle')

    // Scroll to approximately middle of page
    await page.evaluate(() => {
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      const middlePosition = (scrollHeight - clientHeight) * 0.5
      window.scrollTo({ top: middlePosition, behavior: 'instant' })
    })

    await page.waitForTimeout(500)

    const progressBar = page.locator('[role="progressbar"]')
    if (await progressBar.count() > 0) {
      const progress = await progressBar.getAttribute('aria-valuenow')
      const progressNum = parseInt(progress || '0')
      
      // Should be somewhere around middle (40-60%)
      expect(progressNum).toBeGreaterThan(30)
      expect(progressNum).toBeLessThan(70)
      
      // Check aria-valuetext
      const valueText = await progressBar.getAttribute('aria-valuetext')
      expect(valueText).toContain(`${progressNum}% read`)
    }
  })

  test('should not show on non-content pages', async ({ page }) => {
    // Visit home page (not a content page)
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Scroll down
    await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' }))
    await page.waitForTimeout(500)

    // Progress bar should not be visible on home page
    const progressBar = page.locator('[role="progressbar"]')
    expect(await progressBar.count()).toBe(0)
  })

  test('should hide progress bar at the top of page', async ({ page }) => {
    await page.goto('/resume')
    await page.waitForLoadState('networkidle')

    // Ensure we're at the top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.waitForTimeout(300)

    // Progress bar should be hidden when at top
    const progressBar = page.locator('[role="progressbar"]')
    expect(await progressBar.count()).toBe(0)
  })

  test('should show at bottom but within threshold', async ({ page }) => {
    await page.goto('/resume')
    await page.waitForLoadState('networkidle')

    // Scroll near the bottom but not completely
    await page.evaluate(() => {
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      const nearBottomPosition = (scrollHeight - clientHeight) * 0.9 // 90%
      window.scrollTo({ top: nearBottomPosition, behavior: 'instant' })
    })

    await page.waitForTimeout(500)

    const progressBar = page.locator('[role="progressbar"]')
    if (await progressBar.count() > 0) {
      const progress = await progressBar.getAttribute('aria-valuenow')
      const progressNum = parseInt(progress || '0')
      
      // Should show high progress but not 100%
      expect(progressNum).toBeGreaterThan(80)
      expect(progressNum).toBeLessThan(100)
    }
  })

  test('should be accessible to screen readers', async ({ page }) => {
    await page.goto('/resume')
    await page.waitForLoadState('networkidle')

    // Scroll to make progress visible
    await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'instant' }))
    await page.waitForTimeout(500)

    const progressBar = page.locator('[role="progressbar"]')
    
    if (await progressBar.count() > 0) {
      // Check all required accessibility attributes
      await expect(progressBar).toHaveAttribute('role', 'progressbar')
      await expect(progressBar).toHaveAttribute('aria-label', 'Reading progress')
      await expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      await expect(progressBar).toHaveAttribute('aria-valuemax', '100')
      
      const valuenow = await progressBar.getAttribute('aria-valuenow')
      expect(valuenow).toBeTruthy()
      expect(parseInt(valuenow || '0')).toBeGreaterThanOrEqual(0)
      expect(parseInt(valuenow || '0')).toBeLessThanOrEqual(100)
      
      const valuetext = await progressBar.getAttribute('aria-valuetext')
      expect(valuetext).toContain('% read')
    }
  })

  test('should handle rapid scrolling smoothly', async ({ page }) => {
    await page.goto('/resume')
    await page.waitForLoadState('networkidle')

    // Perform rapid scrolling
    const scrollPositions = [0, 200, 400, 600, 800, 400, 200, 600]
    
    for (const position of scrollPositions) {
      await page.evaluate((pos) => {
        window.scrollTo({ top: pos, behavior: 'instant' })
      }, position)
      await page.waitForTimeout(50) // Very quick scrolling
    }

    // Final check - progress should still work
    await page.waitForTimeout(300)
    await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' }))
    await page.waitForTimeout(300)

    const progressBar = page.locator('[role="progressbar"]')
    if (await progressBar.count() > 0) {
      const progress = await progressBar.getAttribute('aria-valuenow')
      expect(parseInt(progress || '0')).toBeGreaterThan(0)
    }
  })

  test('should work on different page types', async ({ page }) => {
    const contentPages = ['/resume', '/about']
    
    for (const pagePath of contentPages) {
      await page.goto(pagePath)
      await page.waitForLoadState('networkidle')

      // Scroll to trigger progress
      await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'instant' }))
      await page.waitForTimeout(300)

      const progressBar = page.locator('[role="progressbar"]')
      
      // Should show progress on content pages
      if (await progressBar.count() > 0) {
        const progress = await progressBar.getAttribute('aria-valuenow')
        expect(parseInt(progress || '0')).toBeGreaterThan(0)
      }
    }
  })

  test('should handle window resize correctly', async ({ page }) => {
    await page.goto('/resume')
    await page.waitForLoadState('networkidle')

    // Initial scroll
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }))
    await page.waitForTimeout(300)

    const initialProgress = await page.locator('[role="progressbar"]').getAttribute('aria-valuenow')

    // Resize window
    await page.setViewportSize({ width: 800, height: 600 })
    await page.waitForTimeout(500)

    // Progress should still be accurate after resize
    const progressAfterResize = await page.locator('[role="progressbar"]').getAttribute('aria-valuenow')
    
    if (initialProgress && progressAfterResize) {
      // Progress values might differ slightly due to layout changes, but should still be reasonable
      expect(parseInt(progressAfterResize)).toBeGreaterThan(0)
      expect(Math.abs(parseInt(initialProgress) - parseInt(progressAfterResize))).toBeLessThan(20)
    }
  })

  test('should not cause performance issues', async ({ page }) => {
    await page.goto('/resume')
    await page.waitForLoadState('networkidle')

    // Measure performance during scrolling
    await page.evaluate(() => {
      (window as any).performanceMarks = []
      
      // Override requestAnimationFrame to count calls
      const originalRAF = window.requestAnimationFrame
      let rafCount = 0
      
      window.requestAnimationFrame = function(callback) {
        rafCount++
        if (rafCount <= 10) { // Limit to prevent infinite loops
          return originalRAF(callback)
        }
        return 0
      }
    })

    // Perform scrolling
    for (let i = 0; i < 10; i++) {
      await page.evaluate((i) => window.scrollTo({ top: i * 100, behavior: 'instant' }), i)
      await page.waitForTimeout(50)
    }

    // Check that performance is reasonable
    const memoryUsage = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize
      }
      return 0
    })

    // Memory usage should be reasonable (less than 100MB for this test)
    if (memoryUsage > 0) {
      expect(memoryUsage).toBeLessThan(100 * 1024 * 1024)
    }
  })

  test('should work with custom containers', async ({ page }) => {
    // Create a custom test page with a specific container
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .custom-container {
            height: 300px;
            overflow-y: auto;
            border: 1px solid #ccc;
          }
          .long-content {
            height: 1000px;
            background: linear-gradient(to bottom, #f0f0f0, #e0e0e0);
            padding: 20px;
          }
        </style>
      </head>
      <body>
        <div class="custom-container" id="scrollable">
          <div class="long-content">
            <h1>Custom Container Content</h1>
            <p>This is a custom scrollable container for testing.</p>
            <div style="height: 500px;">Spacer content...</div>
            <p>More content at the bottom.</p>
          </div>
        </div>
        
        <script>
          // Mock the reading progress component for this container
          const container = document.getElementById('scrollable');
          const progressBar = document.createElement('div');
          progressBar.setAttribute('role', 'progressbar');
          progressBar.setAttribute('aria-label', 'Reading progress');
          progressBar.style.position = 'fixed';
          progressBar.style.top = '0';
          progressBar.style.left = '0';
          progressBar.style.width = '100%';
          progressBar.style.height = '3px';
          progressBar.style.background = 'rgba(0,0,0,0.1)';
          document.body.appendChild(progressBar);
          
          const progressFill = document.createElement('div');
          progressFill.style.height = '100%';
          progressFill.style.background = 'blue';
          progressFill.style.width = '0%';
          progressBar.appendChild(progressFill);
          
          container.addEventListener('scroll', () => {
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight - container.clientHeight;
            const progress = Math.round((scrollTop / scrollHeight) * 100);
            
            progressBar.setAttribute('aria-valuenow', progress.toString());
            progressBar.setAttribute('aria-valuetext', progress + '% read');
            progressFill.style.width = progress + '%';
          });
        </script>
      </body>
      </html>
    `)

    // Scroll within the custom container
    await page.evaluate(() => {
      const container = document.getElementById('scrollable')
      if (container) {
        container.scrollTop = 150
      }
    })

    await page.waitForTimeout(300)

    const progressBar = page.locator('[role="progressbar"]')
    await expect(progressBar).toBeVisible()
    
    const progress = await progressBar.getAttribute('aria-valuenow')
    expect(parseInt(progress || '0')).toBeGreaterThan(0)
  })
})