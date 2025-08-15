/**
 * Form Auto-Save E2E Tests
 * End-to-end tests for form auto-save functionality
 */

import { test, expect, type Page } from '@playwright/test'

test.describe('Form Auto-Save', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.evaluateOnNewDocument(() => {
      localStorage.clear()
    })
    
    await page.goto('/')
  })

  test('should auto-save contact form data as user types', async ({ page }) => {
    // Open contact modal
    await page.click('[data-testid="contact-button"], [aria-label*="contact" i]')
    
    // Wait for modal to appear
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    // Fill form fields with delays to trigger auto-save
    await page.fill('input[name="name"]', 'John')
    await page.waitForTimeout(100) // Allow debounce

    await page.fill('input[name="name"]', 'John Doe')
    await page.waitForTimeout(400) // Wait for auto-save debounce

    await page.fill('input[name="email"]', 'john@example.com')
    await page.waitForTimeout(400)

    await page.fill('textarea[name="message"]', 'This is a test message for auto-save functionality.')
    await page.waitForTimeout(400)

    // Check for auto-save indicators
    await expect(page.locator('text=/saving|saved|auto.save/i')).toBeVisible({ timeout: 5000 })

    // Verify data is saved in localStorage
    const savedData = await page.evaluate(() => {
      const states = localStorage.getItem('form-auto-save-states')
      return states ? JSON.parse(states) : null
    })

    expect(savedData).toBeTruthy()
    expect(savedData['contact-form']).toBeTruthy()
    expect(savedData['contact-form'].data.name).toBe('John Doe')
    expect(savedData['contact-form'].data.email).toBe('john@example.com')
  })

  test('should restore form data on page reload', async ({ page }) => {
    // Pre-populate localStorage with saved form data
    await page.evaluateOnNewDocument(() => {
      const savedState = {
        'contact-form': {
          formId: 'contact-form',
          data: {
            name: 'Jane Smith',
            email: 'jane@example.com',
            subject: 'Restored Subject',
            message: 'This message should be restored after page reload.'
          },
          lastSaved: new Date().toISOString(),
          isDirty: true,
          isSaving: false,
          error: null,
          retryCount: 0
        }
      }
      localStorage.setItem('form-auto-save-states', JSON.stringify(savedState))
    })

    // Reload the page
    await page.reload()

    // Open contact modal
    await page.click('[data-testid="contact-button"], [aria-label*="contact" i]')
    
    // Wait for modal and restoration
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await page.waitForTimeout(1000) // Allow time for restoration

    // Check that form fields are populated with saved data
    await expect(page.locator('input[name="name"]')).toHaveValue('Jane Smith')
    await expect(page.locator('input[name="email"]')).toHaveValue('jane@example.com')
    await expect(page.locator('input[name="subject"]')).toHaveValue('Restored Subject')
    await expect(page.locator('textarea[name="message"]')).toHaveValue('This message should be restored after page reload.')

    // Check for restoration notification
    await expect(page.locator('text=/restored.*unsaved.*data/i')).toBeVisible({ timeout: 5000 })
  })

  test('should clear saved data after successful form submission', async ({ page }) => {
    // Mock successful API response
    await page.route('**/api/contact/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Message sent successfully' })
      })
    })

    // Open contact modal and fill form
    await page.click('[data-testid="contact-button"], [aria-label*="contact" i]')
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('textarea[name="message"]', 'Test message')
    
    // Wait for auto-save
    await page.waitForTimeout(400)

    // Verify data is saved
    const savedDataBefore = await page.evaluate(() => {
      const states = localStorage.getItem('form-auto-save-states')
      return states ? JSON.parse(states) : null
    })
    expect(savedDataBefore['contact-form']).toBeTruthy()

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for success message
    await expect(page.locator('text=/message sent|thank you|success/i')).toBeVisible({ timeout: 10000 })

    // Verify saved data is cleared
    const savedDataAfter = await page.evaluate(() => {
      const states = localStorage.getItem('form-auto-save-states')
      return states ? JSON.parse(states) : {}
    })
    expect(savedDataAfter['contact-form']).toBeFalsy()
  })

  test('should show visual feedback during auto-save states', async ({ page }) => {
    // Open contact modal
    await page.click('[data-testid="contact-button"], [aria-label*="contact" i]')
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    // Fill form to trigger dirty state
    await page.fill('input[name="name"]', 'Visual Test User')
    
    // Should show unsaved changes indicator
    await expect(page.locator('text=/unsaved.*changes/i')).toBeVisible({ timeout: 2000 })

    // Continue typing to trigger saving state
    await page.fill('input[name="email"]', 'visual@example.com')
    
    // Should show saving indicator (might be brief)
    await expect(page.locator('text=/saving/i')).toBeVisible({ timeout: 5000 })

    // Wait for save to complete and show saved state
    await page.waitForTimeout(1000)
    await expect(page.locator('text=/saved/i')).toBeVisible({ timeout: 5000 })
  })

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network failure for localStorage operations
    await page.evaluateOnNewDocument(() => {
      const originalSetItem = localStorage.setItem
      let failCount = 0
      
      // Mock localStorage failure for first few attempts
      localStorage.setItem = function(key: string, value: string) {
        if (key.includes('auto-save') && failCount < 2) {
          failCount++
          throw new Error('Storage quota exceeded')
        }
        return originalSetItem.call(this, key, value)
      }
    })

    // Open contact modal and try to trigger auto-save
    await page.click('[data-testid="contact-button"], [aria-label*="contact" i]')
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    await page.fill('input[name="name"]', 'Error Test User')
    await page.fill('input[name="email"]', 'error@example.com')
    
    // Wait for auto-save attempts
    await page.waitForTimeout(1000)

    // Should eventually succeed after retries
    await expect(page.locator('text=/saved/i')).toBeVisible({ timeout: 10000 })
  })

  test('should work across multiple form instances', async ({ page }) => {
    // Test if multiple forms can auto-save simultaneously
    await page.goto('/projects') // Assuming there might be forms on projects page

    // If there are multiple forms, test they don't interfere
    const forms = await page.locator('form').count()
    
    if (forms > 0) {
      // Fill first form
      await page.locator('form').first().locator('input').first().fill('First form data')
      await page.waitForTimeout(400)

      // Fill second form if it exists
      if (forms > 1) {
        await page.locator('form').nth(1).locator('input').first().fill('Second form data')
        await page.waitForTimeout(400)
      }

      // Verify both forms saved independently
      const savedStates = await page.evaluate(() => {
        const states = localStorage.getItem('form-auto-save-states')
        return states ? JSON.parse(states) : {}
      })

      expect(Object.keys(savedStates).length).toBeGreaterThan(0)
    }
  })

  test('should respect debounce timing', async ({ page }) => {
    // Open contact modal
    await page.click('[data-testid="contact-button"], [aria-label*="contact" i]')
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    // Make rapid changes
    await page.fill('input[name="name"]', 'A')
    await page.waitForTimeout(100)
    
    await page.fill('input[name="name"]', 'Ab')
    await page.waitForTimeout(100)
    
    await page.fill('input[name="name"]', 'Abc')
    await page.waitForTimeout(100)
    
    await page.fill('input[name="name"]', 'Abcd')
    
    // Should not show saving immediately (debounced)
    await expect(page.locator('text=/saving/i')).not.toBeVisible()
    
    // Wait for debounce to complete
    await page.waitForTimeout(400)
    
    // Now should show saving/saved
    await expect(page.locator('text=/saving|saved/i')).toBeVisible({ timeout: 2000 })
  })

  test('should maintain auto-save across browser navigation', async ({ page }) => {
    // Open contact modal and start filling form
    await page.click('[data-testid="contact-button"], [aria-label*="contact" i]')
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    await page.fill('input[name="name"]', 'Navigation Test')
    await page.fill('input[name="email"]', 'nav@example.com')
    await page.waitForTimeout(400)

    // Close modal and navigate away
    await page.keyboard.press('Escape')
    await page.goto('/projects')
    
    // Navigate back and check if data persists
    await page.goto('/')
    await page.click('[data-testid="contact-button"], [aria-label*="contact" i]')
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    
    // Data should be restored
    await expect(page.locator('input[name="name"]')).toHaveValue('Navigation Test')
    await expect(page.locator('input[name="email"]')).toHaveValue('nav@example.com')
  })
})

test.describe('Auto-Save Performance', () => {
  test('should not cause memory leaks with rapid typing', async ({ page }) => {
    await page.goto('/')
    
    // Monitor memory usage
    const initialMetrics = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize
      }
      return 0
    })

    // Open contact modal
    await page.click('[data-testid="contact-button"], [aria-label*="contact" i]')
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    // Rapid typing simulation
    const longText = 'This is a very long message that simulates rapid typing with many characters and repeated auto-save operations. '.repeat(50)
    
    await page.fill('textarea[name="message"]', longText)
    await page.waitForTimeout(1000)

    // Check memory usage hasn't increased dramatically
    const finalMetrics = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize
      }
      return 0
    })

    if (initialMetrics > 0 && finalMetrics > 0) {
      const memoryIncrease = finalMetrics - initialMetrics
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
    }
  })

  test('should handle concurrent auto-save operations efficiently', async ({ page }) => {
    await page.goto('/')

    // Open contact modal
    await page.click('[data-testid="contact-button"], [aria-label*="contact" i]')
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    // Fill multiple fields rapidly to trigger concurrent saves
    const promises = [
      page.fill('input[name="name"]', 'Concurrent User'),
      page.fill('input[name="email"]', 'concurrent@example.com'),
      page.fill('input[name="subject"]', 'Concurrent Test Subject'),
      page.fill('textarea[name="message"]', 'Concurrent test message with lots of content to trigger auto-save operations.')
    ]

    await Promise.all(promises)

    // Should handle all saves without conflicts
    await page.waitForTimeout(1000)
    await expect(page.locator('text=/saved/i')).toBeVisible({ timeout: 5000 })

    // Verify all data is saved correctly
    const savedData = await page.evaluate(() => {
      const states = localStorage.getItem('form-auto-save-states')
      return states ? JSON.parse(states) : null
    })

    expect(savedData['contact-form'].data.name).toBe('Concurrent User')
    expect(savedData['contact-form'].data.email).toBe('concurrent@example.com')
    expect(savedData['contact-form'].data.subject).toBe('Concurrent Test Subject')
  })
})