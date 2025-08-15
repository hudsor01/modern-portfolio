import { test, expect } from './fixtures'

test.describe('Contact Form', () => {
  test.beforeEach(async ({ contactPage }) => {
    await contactPage.goto()
  })

  test('should display contact form', async ({ page }) => {
    // Check for form elements using name attributes
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('select[name="subject"]')).toBeVisible()
    await expect(page.locator('textarea[name="message"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should validate required fields', async ({ contactPage, page }) => {
    // Try to submit empty form
    await contactPage.submitForm()
    
    // Check for HTML5 validation or custom validation
    // Since the form has required attributes, browser validation should kick in
    const nameInput = page.locator('input[name="name"]')
    const emailInput = page.locator('input[name="email"]')
    const subjectSelect = page.locator('select[name="subject"]')
    const messageTextarea = page.locator('textarea[name="message"]')
    
    // Check if any of the required fields are invalid
    const nameValidity = await nameInput.evaluate((el: HTMLInputElement) => el.validity.valid)
    const emailValidity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid)
    const subjectValidity = await subjectSelect.evaluate((el: HTMLSelectElement) => el.validity.valid)
    const messageValidity = await messageTextarea.evaluate((el: HTMLTextAreaElement) => el.validity.valid)
    
    // At least one field should be invalid due to being empty and required
    const hasValidationErrors = !nameValidity || !emailValidity || !subjectValidity || !messageValidity
    expect(hasValidationErrors).toBe(true)
  })

  test('should validate email format', async ({ contactPage, page }) => {
    await contactPage.fillContactForm({
      name: 'John Doe',
      email: 'invalid-email',
      subject: 'general',
      message: 'Test message content',
    })
    
    await contactPage.submitForm()
    
    // Check for email validation error using browser validity
    const emailInput = page.locator('input[name="email"]')
    const emailValidity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid)
    expect(emailValidity).toBe(false)
  })

  test('should submit valid form successfully', async ({ contactPage, page }) => {
    // Mock the API endpoint to avoid actually sending emails
    await page.route('/api/contact', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Form submitted successfully',
        }),
      })
    })

    await contactPage.fillContactForm({
      name: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'general',
      message: 'This is a test message for the contact form.',
    })
    
    await contactPage.submitForm()
    
    // Should show success message
    const successMessage = await contactPage.getSuccessMessage()
    await expect(successMessage).toBeVisible()
  })

  test('should handle server errors gracefully', async ({ contactPage, page }) => {
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

    await contactPage.fillContactForm({
      name: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'general',
      message: 'Test message',
    })
    
    await contactPage.submitForm()
    
    // Should show error message
    const errorMessage = await contactPage.getErrorMessage()
    await expect(errorMessage).toBeVisible()
  })

  test('should be accessible', async ({ page }) => {
    // Check form inputs have proper attributes
    const nameInput = page.locator('input[name="name"]')
    const emailInput = page.locator('input[name="email"]')
    const messageInput = page.locator('textarea[name="message"]')
    
    await expect(nameInput).toBeVisible()
    await expect(emailInput).toBeVisible()
    await expect(messageInput).toBeVisible()
    
    // Check for proper input types
    await expect(emailInput).toHaveAttribute('type', 'email')
    
    // Check for required attributes
    await expect(nameInput).toHaveAttribute('required')
    await expect(emailInput).toHaveAttribute('required')
    await expect(messageInput).toHaveAttribute('required')
  })

  test('should be responsive on mobile', async ({ contactPage, page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Form should still be visible and usable
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('textarea[name="message"]')).toBeVisible()
    
    // Should be able to fill form on mobile
    await contactPage.fillContactForm({
      name: 'Mobile User',
      email: 'mobile@test.com',
      subject: 'general',
      message: 'Testing on mobile device',
    })
    
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
  })

  test('should handle long messages', async ({ contactPage, page }) => {
    const longMessage = 'This is a very long message that should test the textarea handling. '.repeat(20)
    
    await contactPage.fillContactForm({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'general',
      message: longMessage,
    })
    
    const messageField = page.locator('textarea[name="message"]')
    const value = await messageField.inputValue()
    expect(value).toBe(longMessage)
  })

  test('should retain form data on validation errors', async ({ contactPage, page }) => {
    const formData = {
      name: 'John Doe',
      email: 'invalid-email', // Invalid email to trigger validation
      subject: 'general',
      message: 'Test message content that should be retained',
    }
    
    await contactPage.fillContactForm(formData)
    await contactPage.submitForm()
    
    // After validation error, form should retain the data
    await expect(page.locator('input[name="name"]')).toHaveValue(formData.name)
    await expect(page.locator('input[name="email"]')).toHaveValue(formData.email)
    await expect(page.locator('select[name="subject"]')).toHaveValue(formData.subject)
    await expect(page.locator('textarea[name="message"]')).toHaveValue(formData.message)
  })
})