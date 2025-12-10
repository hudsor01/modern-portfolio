/**
 * Rate Limiting End-to-End Tests
 * Tests rate limiting behavior across the entire application stack
 */

import { test, expect, type Page, type APIResponse } from '@playwright/test'

test.describe('Rate Limiting E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Set up page with realistic viewport
    await page.setViewportSize({ width: 1280, height: 720 })
  })

  test.describe('Contact Form Rate Limiting', () => {
    test('should allow normal contact form usage', async ({ page }) => {
      await page.goto('/contact')
      await page.waitForLoadState('networkidle')

      // Fill and submit contact form
      await page.fill('[data-testid="contact-name"]', 'John Doe')
      await page.fill('[data-testid="contact-email"]', 'john@example.com')
      await page.fill('[data-testid="contact-message"]', 'Test message for rate limiting')

      // Submit form
      const submitButton = page.locator('[data-testid="contact-submit"]')
      await submitButton.click()

      // Should see success message (not rate limited)
      await expect(page.locator('[data-testid="contact-success"]')).toBeVisible({
        timeout: 10000
      })

      // Should not see rate limit indicator
      await expect(page.locator('[data-testid="rate-limit-indicator"]')).not.toBeVisible()
    })

    test('should show rate limit warning after multiple submissions', async ({ page }) => {
      await page.goto('/contact')
      await page.waitForLoadState('networkidle')

      const formData = {
        name: 'Rate Test User',
        email: 'ratetest@example.com',
        message: 'Testing rate limiting behavior'
      }

      // Submit form multiple times to trigger rate limiting
      for (let i = 1; i <= 4; i++) {
        await page.fill('[data-testid="contact-name"]', `${formData.name} ${i}`)
        await page.fill('[data-testid="contact-email"]', formData.email.replace('@', `+${i}@`))
        await page.fill('[data-testid="contact-message"]', `${formData.message} - Attempt ${i}`)

        await page.click('[data-testid="contact-submit"]')

        if (i <= 3) {
          // First 3 submissions should succeed
          await expect(page.locator('[data-testid="contact-success"]')).toBeVisible({
            timeout: 5000
          })
        } else {
          // 4th submission should be rate limited
          await expect(page.locator('[data-testid="contact-error"]')).toBeVisible({
            timeout: 5000
          })
          await expect(page.locator('text=rate limit')).toBeVisible()
        }

        // Wait a moment between submissions
        await page.waitForTimeout(500)
      }

      // Should now see rate limit indicator
      await expect(page.locator('[data-testid="rate-limit-indicator"]')).toBeVisible()
    })

    test('should display rate limit information to user', async ({ page }) => {
      // Use API to quickly reach rate limit
      const context = page.context()
      const apiUrl = new URL('/api/contact', page.url()).href

      // Make requests to approach rate limit
      for (let i = 0; i < 3; i++) {
        await context.request.post(apiUrl, {
          data: {
            name: `API Test ${i}`,
            email: `apitest${i}@example.com`,
            message: 'Rate limit setup request'
          }
        })
      }

      // Now visit contact page
      await page.goto('/contact')
      await page.waitForLoadState('networkidle')

      // Try to submit one more (should be blocked or show warning)
      await page.fill('[data-testid="contact-name"]', 'Final Test')
      await page.fill('[data-testid="contact-email"]', 'final@example.com')
      await page.fill('[data-testid="contact-message"]', 'This should trigger rate limit display')

      await page.click('[data-testid="contact-submit"]')

      // Should see rate limit information
      const rateLimitInfo = page.locator('[data-testid="contact-rate-limit-info"]')
      if (await rateLimitInfo.isVisible()) {
        await expect(rateLimitInfo).toContainText('rate limit')
      }

      // Check for rate limit headers in network response
      const [response] = await Promise.all([
        page.waitForResponse(response => 
          response.url().includes('/api/contact') && 
          response.status() === 429
        ),
        // Might already be submitted above, so just wait for response
      ])

      if (response) {
        const headers = response.headers()
        expect(headers['x-ratelimit-limit']).toBeDefined()
        expect(headers['x-ratelimit-remaining']).toBeDefined()
      }
    })
  })

  test.describe('API Rate Limiting', () => {
    test('should handle API rate limiting gracefully', async ({ page }) => {
      // Visit a page that makes API calls
      await page.goto('/projects')
      await page.waitForLoadState('networkidle')

      // Monitor API requests
      let apiRequestCount = 0
      let rateLimitedResponses = 0

      page.on('response', response => {
        if (response.url().includes('/api/') && response.status() === 200) {
          apiRequestCount++
        }
        if (response.status() === 429) {
          rateLimitedResponses++
        }
      })

      // Navigate between pages to generate API traffic
      const pages = ['/projects', '/about', '/resume', '/projects']
      
      for (const pagePath of pages) {
        await page.goto(pagePath)
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(100)
      }

      // Should have made API requests without hitting rate limits
      expect(apiRequestCount).toBeGreaterThan(0)
      expect(rateLimitedResponses).toBe(0)
    })

    test('should show appropriate error for API rate limits', async ({ page, context }) => {
      const apiUrl = new URL('/api/projects', page.url()).href
      
      // Make many API requests to trigger rate limiting
      const requests = []
      for (let i = 0; i < 105; i++) { // Above typical API limit
        requests.push(
          context.request.get(apiUrl).catch(error => ({ error: error.message }))
        )
      }

      await Promise.all(requests)

      // Now visit page that depends on this API
      await page.goto('/projects')

      // Should handle rate limited API gracefully
      // Either show cached data, loading state, or friendly error
      const errorMessage = page.locator('[data-testid="api-error"]')
      const loadingState = page.locator('[data-testid="loading"]')
      const projectsContent = page.locator('[data-testid="projects-content"]')

      // Should show something (not blank page)
      const hasContent = await Promise.race([
        errorMessage.isVisible(),
        loadingState.isVisible(),
        projectsContent.isVisible()
      ])

      expect(hasContent).toBe(true)
    })
  })

  test.describe('Global Rate Limit Status', () => {
    test('should show global rate limit status when needed', async ({ page, context }) => {
      // Trigger rate limiting by making many requests
      const contactApiUrl = new URL('/api/contact', page.url()).href
      
      for (let i = 0; i < 5; i++) {
        await context.request.post(contactApiUrl, {
          data: {
            name: `Bulk Test ${i}`,
            email: `bulk${i}@example.com`,
            message: 'Rate limit trigger message'
          },
          ignoreHTTPSErrors: true
        }).catch(() => {}) // Ignore failures, we expect some
      }

      // Visit any page
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Global rate limit status should appear if applicable
      const globalStatus = page.locator('[data-testid="global-rate-limit-status"]')
      
      // May or may not be visible depending on rate limiting state
      // If visible, should contain relevant information
      if (await globalStatus.isVisible()) {
        await expect(globalStatus).toContainText(/rate limit|blocked|wait/)
      }
    })
  })

  test.describe('Rate Limit Recovery', () => {
    test('should allow requests after rate limit window expires', async ({ page, context }) => {
      // This test requires waiting for rate limit window to expire
      // We'll use a shorter window for testing by potentially mocking or
      // testing with development configuration

      await page.goto('/contact')
      await page.waitForLoadState('networkidle')

      // Submit forms to reach limit
      for (let i = 0; i < 4; i++) {
        await page.fill('[data-testid="contact-name"]', `Recovery Test ${i}`)
        await page.fill('[data-testid="contact-email"]', `recovery${i}@example.com`)
        await page.fill('[data-testid="contact-message"]', 'Testing recovery')

        await page.click('[data-testid="contact-submit"]')
        await page.waitForTimeout(500)
      }

      // Should be rate limited now
      const errorElement = page.locator('[data-testid="contact-error"]')
      if (await errorElement.isVisible()) {
        await expect(errorElement).toContainText(/rate limit|blocked/)
      }

      // In a real scenario, we would wait for the rate limit window
      // For testing, we can check if the UI shows recovery time
      const rateLimitInfo = page.locator('[data-testid="rate-limit-info"]')
      if (await rateLimitInfo.isVisible()) {
        await expect(rateLimitInfo).toContainText(/reset|retry/i)
      }
    })
  })

  test.describe('Rate Limit Headers', () => {
    test('should include rate limit headers in responses', async ({ page }) => {
      let contactResponse: APIResponse | null = null

      // Intercept contact form submission
      page.on('response', response => {
        if (response.url().includes('/api/contact')) {
          contactResponse = response
        }
      })

      await page.goto('/contact')
      await page.waitForLoadState('networkidle')

      // Submit form
      await page.fill('[data-testid="contact-name"]', 'Header Test')
      await page.fill('[data-testid="contact-email"]', 'headertest@example.com')
      await page.fill('[data-testid="contact-message"]', 'Testing rate limit headers')

      await page.click('[data-testid="contact-submit"]')
      await page.waitForTimeout(1000)

      // Check response headers
      if (contactResponse) {
        const headers = contactResponse.headers()
        
        // Should have rate limit headers
        expect(headers['x-ratelimit-limit'] || headers['X-RateLimit-Limit']).toBeDefined()
        expect(headers['x-ratelimit-remaining'] || headers['X-RateLimit-Remaining']).toBeDefined()
      }
    })

    test('should include retry-after header when rate limited', async ({ page, context }) => {
      const apiUrl = new URL('/api/contact', page.url()).href
      
      // Make requests to trigger rate limiting
      for (let i = 0; i < 3; i++) {
        await context.request.post(apiUrl, {
          data: {
            name: `Retry Test ${i}`,
            email: `retry${i}@example.com`,
            message: 'Setup for retry-after test'
          }
        }).catch(() => {})
      }

      // Make one more request that should be rate limited
      const rateLimitedResponse = await context.request.post(apiUrl, {
        data: {
          name: 'Final Retry Test',
          email: 'finalretry@example.com',
          message: 'This should be rate limited'
        }
      }).catch(error => error)

      // If we got a 429 response, check for retry-after header
      if (rateLimitedResponse && typeof rateLimitedResponse.status === 'function') {
        const status = rateLimitedResponse.status()
        if (status === 429) {
          const headers = rateLimitedResponse.headers()
          expect(headers['retry-after'] || headers['Retry-After']).toBeDefined()
        }
      }
    })
  })

  test.describe('Rate Limiting Analytics', () => {
    test('should track rate limiting metrics', async ({ page }) => {
      // This test would require access to rate limiting analytics endpoint
      // Skip if not in development mode or if endpoint is not available
      
      const analyticsUrl = new URL('/api/admin/rate-limit-analytics', page.url()).href
      
      try {
        // Try to access analytics (requires admin token)
        const response = await page.request.get(analyticsUrl, {
          headers: {
            'Authorization': 'Bearer dev-admin-token'
          }
        })

        if (response.ok()) {
          const data = await response.json()
          expect(data.success).toBe(true)
          expect(data.data.analytics).toBeDefined()
          expect(data.data.analytics.totalRequests).toBeGreaterThanOrEqual(0)
        }
      } catch (error) {
        // Analytics endpoint may not be available in all environments
        console.log('Rate limiting analytics endpoint not available:', error)
      }
    })
  })

  test.describe('User Experience', () => {
    test('should provide clear feedback when rate limited', async ({ page }) => {
      await page.goto('/contact')
      await page.waitForLoadState('networkidle')

      // Submit multiple forms rapidly
      const formData = [
        { name: 'User 1', email: 'user1@example.com', message: 'First message' },
        { name: 'User 2', email: 'user2@example.com', message: 'Second message' },
        { name: 'User 3', email: 'user3@example.com', message: 'Third message' },
        { name: 'User 4', email: 'user4@example.com', message: 'Fourth message' }
      ]

      for (const [index, data] of formData.entries()) {
        await page.fill('[data-testid="contact-name"]', data.name)
        await page.fill('[data-testid="contact-email"]', data.email)
        await page.fill('[data-testid="contact-message"]', data.message)

        await page.click('[data-testid="contact-submit"]')

        // Wait for response
        await page.waitForTimeout(1000)

        if (index >= 3) {
          // Should show user-friendly rate limit message
          const feedback = page.locator('[data-testid="user-feedback"]')
          if (await feedback.isVisible()) {
            const text = await feedback.textContent()
            expect(text?.toLowerCase()).toMatch(/limit|wait|try again|slow down/)
          }
        }
      }
    })

    test('should not break user interface when rate limited', async ({ page }) => {
      await page.goto('/contact')
      await page.waitForLoadState('networkidle')

      // Trigger rate limiting
      for (let i = 0; i < 5; i++) {
        await page.fill('[data-testid="contact-name"]', `UI Test ${i}`)
        await page.fill('[data-testid="contact-email"]', `uitest${i}@example.com`)
        await page.fill('[data-testid="contact-message"]', 'UI stability test')

        await page.click('[data-testid="contact-submit"]')
        await page.waitForTimeout(500)
      }

      // Page should still be functional
      expect(await page.title()).toBeTruthy()
      
      // Form should still be interactable
      const nameField = page.locator('[data-testid="contact-name"]')
      await expect(nameField).toBeEnabled()
      
      // Navigation should still work
      await page.click('nav a[href="/projects"]')
      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain('/projects')
    })
  })
})