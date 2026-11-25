import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/**
 * Pipeline coverage calculator validation (F-17): letters (incl. 1e6, 1.5M) read
 * "Enter numbers only" while a negative has its own message, money fields cap at
 * $10B, malformed text in a percent field (validity.badInput) is flagged on that
 * field, an empty or zero required field (target, win rate) is flagged on the
 * field too, the results panel names and focuses the failing field, and extreme
 * inputs render as a ceiling ("$1T+") rather than an absurd figure. Values are
 * never silently rewritten, and typing mid-string keeps the caret on the digit.
 */

const NEG = 'Negative amounts are not allowed. Enter a positive number.'
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice']

test.describe('pipeline coverage amount validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/pipeline-coverage-calculator')
    await page.waitForLoadState('networkidle')
  })

  for (const [typed, message] of [
    ['-5', NEG],
    ['1e6', 'Enter numbers only'],
    ['1.5M', 'Enter numbers only'],
    ['abc-12,5e3x', 'Enter numbers only'],
    ['10000000001', 'Enter a target up to $10B'],
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
      await expect(page.getByText('Fix “Revenue target” to see your coverage.')).toBeVisible()

      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
      expect(results.violations).toEqual([])

      await target.fill('2500000')
      await expect(target).toHaveValue('2,500,000')
      await expect(target).toHaveAttribute('aria-invalid', 'false')
      await expect(page.locator('main').getByRole('alert')).toHaveCount(0)
    })
  }

  test('letters and a negative give different messages', async ({ page }) => {
    const target = page.getByLabel('Revenue target (this period)')
    const alert = page.locator('main').getByRole('alert')
    await target.fill('abc')
    await expect(alert).toHaveText('Enter numbers only')
    const letters = await alert.innerText()
    await target.fill('-5')
    await expect(alert).toHaveText(NEG)
    expect(await alert.innerText()).not.toBe(letters)
  })

  test('exactly $10B is accepted', async ({ page }) => {
    const target = page.getByLabel('Revenue target (this period)')
    await target.fill('10000000000')
    await expect(target).toHaveValue('10,000,000,000')
    await expect(target).toHaveAttribute('aria-invalid', 'false')
    await expect(page.locator('main').getByRole('alert')).toHaveCount(0)
    await expect(page.locator('main [aria-live="polite"]')).toContainText('4.0×')
  })

  test('malformed win rate is flagged on the percent field', async ({ page }) => {
    const win = page.getByLabel('Win rate')
    await win.fill('')
    await win.pressSequentially('-25e')
    expect(await win.evaluate((e: HTMLInputElement) => e.validity.badInput)).toBe(true)
    await expect(win).toHaveAttribute('aria-invalid', 'true')
    const alert = page.getByRole('alert').filter({ hasText: 'Enter numbers only' })
    await expect(alert).toBeVisible()
    expect(await win.getAttribute('aria-describedby')).toBe(await alert.getAttribute('id'))
    expect(await win.getAttribute('class')).toContain('border-destructive')
    await expect(page.getByText('Fix “Win rate” to see your coverage.')).toBeVisible()

    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
    expect(results.violations).toEqual([])

    await page
      .locator('main [aria-live="polite"]')
      .getByRole('button', { name: 'Win rate' })
      .click()
    await expect(win).toBeFocused()

    await win.fill('30')
    await expect(win).toHaveAttribute('aria-invalid', 'false')
    await expect(page.locator('main').getByRole('alert')).toHaveCount(0)
  })

  // A malformed number input reports value '' just like an empty one, so these
  // keystrokes change validity.badInput without changing the value.
  test('a lone "e" in an empty percent field is flagged, and clearing it drops the flag', async ({
    page,
  }) => {
    const alert = page.locator('main').getByRole('alert')
    const panel = page.locator('main [aria-live="polite"]')
    const win = page.getByLabel('Win rate')
    await win.fill('')
    await expect(alert).toHaveText('Enter a win rate.')
    await win.press('e')
    expect(await win.evaluate((e: HTMLInputElement) => e.validity.badInput)).toBe(true)
    await expect(alert).toHaveText('Enter numbers only')
    await expect(win).toHaveAttribute('aria-invalid', 'true')
    await expect(panel).toContainText('Fix “Win rate” to see your coverage.')
    await win.press('Backspace')
    expect(await win.evaluate((e: HTMLInputElement) => e.validity.badInput)).toBe(false)
    await expect(alert).toHaveText('Enter a win rate.')
    await win.fill('25')
    await expect(alert).toHaveCount(0)

    const qualified = page.getByLabel('% truly qualified')
    await qualified.fill('')
    await qualified.pressSequentially('-25e')
    await expect(alert).toHaveText('Enter numbers only')
    await expect(qualified).toHaveAttribute('aria-invalid', 'true')
    await qualified.press('ControlOrMeta+a')
    await qualified.press('Delete')
    await expect(qualified).toHaveValue('')
    expect(await qualified.evaluate((e: HTMLInputElement) => e.validity.badInput)).toBe(false)
    await expect(qualified).toHaveAttribute('aria-invalid', 'false')
    await expect(alert).toHaveCount(0)
    await expect(panel).toContainText('Required coverage')
  })

  test('an empty required field is flagged on the field and named in the panel', async ({
    page,
  }) => {
    const alert = page.locator('main').getByRole('alert')
    const target = page.getByLabel('Revenue target (this period)')
    await target.fill('')
    await expect(target).toHaveAttribute('aria-invalid', 'true')
    await expect(alert).toHaveText('Enter a revenue target greater than $0.')
    await expect(page.getByText('Fix “Revenue target” to see your coverage.')).toBeVisible()

    await target.fill('1000000')
    const win = page.getByLabel('Win rate')
    await win.fill('')
    await expect(win).toHaveAttribute('aria-invalid', 'true')
    await expect(alert).toHaveText('Enter a win rate.')
    expect(await win.getAttribute('aria-describedby')).toBe(await alert.getAttribute('id'))
    await page
      .locator('main [aria-live="polite"]')
      .getByRole('button', { name: 'Win rate' })
      .click()
    await expect(win).toBeFocused()
  })

  test('out-of-range qualified rate is flagged', async ({ page }) => {
    const qualified = page.getByLabel('% truly qualified')
    await qualified.fill('150')
    await expect(qualified).toHaveAttribute('aria-invalid', 'true')
    await expect(
      page.getByRole('alert').filter({ hasText: 'Enter a percentage up to 100%.' })
    ).toBeVisible()
    await expect(page.getByText('Fix “% truly qualified” to see your coverage.')).toBeVisible()
  })

  test('extreme inputs never print absurd figures', async ({ page }) => {
    await page.getByLabel('Revenue target (this period)').fill('10000000000')
    await page.getByLabel('Win rate').fill('0.0001')
    const text = await page.locator('main [aria-live="polite"]').innerText()
    expect(text).toContain('$1T+')
    expect(text).toContain('1,000×+')
    expect(text).not.toMatch(/[\d,]{5,}T/)
  })

  test('typing a digit mid-string keeps the caret next to it', async ({ page }) => {
    const target = page.getByLabel('Revenue target (this period)')
    await target.fill('999')
    // Place the caret with the selection API: the Home key is a page scroll in
    // macOS Firefox/WebKit, so it would leave the caret at the end there.
    await target.evaluate((e: HTMLInputElement) => {
      e.focus()
      e.setSelectionRange(0, 0)
    })
    await target.press('1')
    await expect(target).toHaveValue('1,999')
    await target.press('2')
    await expect(target).toHaveValue('12,999')
    expect(await target.evaluate((e: HTMLInputElement) => e.selectionStart)).toBe(2)
  })
})
