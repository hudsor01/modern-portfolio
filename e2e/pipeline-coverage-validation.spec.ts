import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/**
 * Pipeline coverage calculator money inputs (review WR-03): a negative, exponent
 * or letter-suffixed amount is flagged with an accessible message, never silently
 * rewritten, and typing mid-string keeps the caret on the digit being edited.
 */

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice']

test.describe('pipeline coverage amount validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/pipeline-coverage-calculator')
    await page.waitForLoadState('networkidle')
  })

  for (const [typed, message] of [
    ['-5', /negative/i],
    ['1e6', /exponent/i],
    ['1.5M', /digits only/i],
  ] as const) {
    test(`"${typed}" is flagged, kept as typed and described to assistive tech`, async ({
      page,
    }) => {
      const target = page.getByLabel('Revenue target (this period)')
      await target.fill(typed)
      await expect(target).toHaveValue(typed)
      await expect(target).toHaveAttribute('aria-invalid', 'true')
      const alert = page.getByRole('alert').filter({ hasText: message })
      await expect(alert).toBeVisible()
      const describedBy = await target.getAttribute('aria-describedby')
      expect(describedBy).toBe(await alert.getAttribute('id'))
      await expect(page.getByText('Fix the highlighted amount to see your coverage.')).toBeVisible()

      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
      expect(results.violations).toEqual([])

      await target.fill('2500000')
      await expect(target).toHaveValue('2,500,000')
      await expect(target).toHaveAttribute('aria-invalid', 'false')
      await expect(page.locator('main').getByRole('alert')).toHaveCount(0)
    })
  }

  test('typing a digit mid-string keeps the caret next to it', async ({ page }) => {
    const target = page.getByLabel('Revenue target (this period)')
    await target.fill('999')
    await target.press('Home')
    await target.press('1')
    await expect(target).toHaveValue('1,999')
    await target.press('2')
    await expect(target).toHaveValue('12,999')
    expect(await target.evaluate((e: HTMLInputElement) => e.selectionStart)).toBe(2)
  })
})
