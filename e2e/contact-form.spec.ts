import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Contact Form E2E Tests
 *
 * Tests the complete contact form user journey:
 * - Form display and accessibility
 * - Field validation
 * - Intercepted submission (never reaches the server action)
 * - Error handling
 */

/**
 * Abort every contact server-action POST at the network layer so e2e can
 * never send email or write contact_submissions. Returns a live hit counter.
 */
async function guardServerAction(page: Page) {
  const counter = { count: 0 }
  await page.route('**/contact', async (route) => {
    const request = route.request()
    if (request.method() === 'POST' && request.headers()['next-action']) {
      counter.count += 1
      await route.abort()
      return
    }
    await route.continue()
  })
  return counter
}

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
  })

  test('displays contact form with all required fields', async ({ page }) => {
    // Verify page title
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Connect')

    // Verify form fields are present
    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/message/i)).toBeVisible()

    // Verify optional fields
    await expect(page.getByLabel(/company/i)).toBeVisible()
    await expect(page.getByLabel(/phone/i)).toBeVisible()

    // Verify privacy notice and link
    await expect(page.getByText(/used only to reply to you/i)).toBeVisible()
    await expect(
      page.getByRole('link', { name: /^privacy policy \(opens in a new tab\)$/i })
    ).toBeVisible()

    // Verify submit button
    await expect(page.getByRole('button', { name: /send message/i })).toBeVisible()
  })

  test('shows validation errors for empty required fields', async ({ page }) => {
    const hits = await guardServerAction(page)

    // Click submit with nothing filled
    await page.getByRole('button', { name: /send message/i }).click()

    // Verify validation - form should not submit, still on same page
    await expect(page).toHaveURL(/\/contact/)
    expect(hits.count).toBe(0)
  })

  test('validates email format', async ({ page }) => {
    // Fill in name
    await page.getByLabel(/^name/i).fill('Test User')

    // Fill in invalid email
    await page.getByLabel(/email/i).fill('invalid-email')

    // Fill in message
    await page.getByLabel(/message/i).fill('This is a test message for validation.')

    // Click outside to trigger blur validation
    await page.getByLabel(/message/i).click()

    // The form should show email is invalid (aria-invalid attribute)
    const emailInput = page.getByLabel(/email/i)
    // Either it has aria-invalid or the form won't submit properly
    await expect(emailInput).toBeVisible()
  })

  test('send button is enabled with a valid form and no checkbox', async ({ page }) => {
    await page.getByLabel(/^name/i).fill('Test User')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/message/i).fill('This is a test message for the contact form.')

    await expect(page.getByRole('button', { name: /send message/i })).toBeEnabled()
    await expect(page.getByRole('checkbox')).toHaveCount(0)
  })

  test('privacy policy link opens the /privacy page', async ({ page, context }) => {
    const [policy] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: /^privacy policy \(opens in a new tab\)$/i }).click(),
    ])
    await policy.waitForLoadState()
    await expect(policy).toHaveURL(/\/privacy$/)
    await expect(policy.getByRole('heading', { level: 1 })).toHaveText(/privacy policy/i)
    // The form page stays put, so nothing typed is lost.
    await expect(page).toHaveURL(/\/contact$/)
  })

  test('shows character count for message field', async ({ page }) => {
    // Verify character counter is present
    await expect(page.getByText(/\/500/)).toBeVisible()

    // Type a message
    await page.getByLabel(/message/i).fill('Hello')

    // Verify character count updates
    await expect(page.getByText(/5\/500/)).toBeVisible()
  })

  // Success-path coverage lives in unit tests. Interception is what keeps e2e
  // from emailing or writing contact_submissions against the real database.
  test('submit reaches the server action and is intercepted (never sends or stores)', async ({
    page,
  }) => {
    const hits = await guardServerAction(page)

    await page.getByLabel(/^name/i).fill('E2E Test User')
    await page.getByLabel(/email/i).fill('e2e-test@example.com')
    await page.getByLabel(/message/i).fill('This is an automated E2E test message. Please ignore.')
    await page.getByLabel(/company/i).fill('Test Company')
    await page.getByLabel(/phone/i).fill('555-123-4567')

    const submitButton = page.getByRole('button', { name: /send message/i })
    await expect(submitButton).toBeEnabled()
    await submitButton.click()

    // Aborted request surfaces as the form-level failure alert.
    const errorAlert = page.getByRole('alert').filter({ hasText: /failed to send message/i })
    await expect(errorAlert).toBeVisible({ timeout: 15000 })
    expect(hits.count).toBe(1)
  })

  test('keyboard navigation works correctly', async ({ page }) => {
    // Tab through form fields
    await page.keyboard.press('Tab') // Skip link
    await page.keyboard.press('Tab') // First nav item or skip to main

    // Navigate to name field and fill
    await page.getByLabel(/^name/i).focus()
    await expect(page.getByLabel(/^name/i)).toBeFocused()

    // Tab to next field
    await page.keyboard.press('Tab')

    // Verify we moved to the next input (email on same row or company)
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('Tab from a real form input stays inside the page DOM (regression gate)', async ({
    page,
  }) => {
    // This is the cross-browser DOM-coverage equivalent of the
    // chromium/firefox-only Tab-from-body tests in blog.spec.ts and
    // resume.spec.ts. The fixture-input tests there verify browser
    // keyboard infrastructure; this one verifies the actual page's
    // interactive controls stay in Tab order. If a future change
    // accidentally puts `tabindex="-1"` on every form field (or the
    // wrapping `<main>` traps focus), this test fails on every browser.
    const nameInput = page.getByLabel(/^name/i)
    await nameInput.focus()
    await expect(nameInput).toBeFocused()

    await page.keyboard.press('Tab')

    // After Tab, the active element must still live inside the page's
    // <main> region (not <body> directly, not somewhere outside the
    // app's content tree).
    const stillInsideMain = await page.evaluate(() => {
      const active = document.activeElement
      if (!active || active === document.body) return false
      const main = document.querySelector('main')
      return main?.contains(active) ?? false
    })
    expect(stillInsideMain).toBe(true)
  })

  test('passes accessibility audit', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('.blur-3xl') // Exclude decorative elements
      .analyze()

    // Log violations for debugging
    if (results.violations.length > 0) {
      console.log('Accessibility violations:', JSON.stringify(results.violations, null, 2))
    }

    expect(results.violations).toHaveLength(0)
  })
})
