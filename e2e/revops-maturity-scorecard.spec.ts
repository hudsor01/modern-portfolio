import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { getOnly } from './_helpers/settle'

/**
 * RevOps maturity scorecard (TOOL-02 / TOOL-03, QA F-18): it opens unanswered
 * with an "N of 16 answered" count, shows no level until every pillar has an
 * answer, names only the tied pillars in tie advice (and no lowest pillar when
 * all four tie), resets to unanswered, and makes no percentile or B2B-benchmark
 * claim.
 */

const URL = '/tools/revops-maturity-scorecard'
const PROMPT = 'Answer at least one question in each area to see your level.'
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice']

/** Radios are sr-only, so click the visible label of the nth option. */
async function answer(page: Page, pillarIndex: number, questionIndex: number, value: number) {
  await page
    .locator('fieldset')
    .nth(pillarIndex)
    .getByRole('radiogroup')
    .nth(questionIndex)
    .locator('label')
    .nth(value - 1)
    .click()
}

test.describe('revops maturity scorecard', () => {
  test.beforeEach(async ({ page }) => {
    await getOnly(page)
    await page.goto(URL)
    await page.waitForLoadState('networkidle')
  })

  test('opens unanswered with no level', async ({ page }) => {
    const result = page.locator('main [aria-live="polite"]')
    await expect(page.getByRole('radio', { checked: true })).toHaveCount(0)
    await expect(result).toContainText('0 of 16 answered')
    await expect(result).toContainText(PROMPT)
    await expect(result.getByText('Highest-ROI next move')).toHaveCount(0)
    await expect(result.getByText(/Overall score/)).toHaveCount(0)
    await expect(page.locator('main')).not.toContainText(/percentile|B2B teams/i)
    const scan = await new AxeBuilder({ page }).withTags(TAGS).analyze()
    expect(scan.violations).toEqual([])
  })

  test('shows a level only once every area has an answer', async ({ page }) => {
    const result = page.locator('main [aria-live="polite"]')
    await answer(page, 0, 0, 4)
    await answer(page, 1, 0, 4)
    await answer(page, 2, 0, 4)
    await expect(result).toContainText('3 of 16 answered')
    await expect(result).toContainText(PROMPT)
    await answer(page, 3, 0, 4)
    await expect(result).toContainText('4 of 16 answered')
    await expect(result.getByText(PROMPT)).toHaveCount(0)
    await expect(result).toContainText('Overall score 4.0 / 5')
    await expect(result).toContainText('Managed')
    const scan = await new AxeBuilder({ page }).withTags(TAGS).analyze()
    expect(scan.violations).toEqual([])
  })

  test('tie advice names only the tied pillars', async ({ page }) => {
    const result = page.locator('main [aria-live="polite"]')
    for (let q = 0; q < 4; q++) {
      await answer(page, 0, q, 5)
      for (const pillar of [1, 2, 3]) await answer(page, pillar, q, 1)
    }
    const move = result.getByText('Highest-ROI next move').locator('xpath=..')
    await expect(move).toContainText('Data, Technology and Alignment')
    await expect(move).not.toContainText(/process/i)
  })

  test('an even profile names no lowest pillar', async ({ page }) => {
    const result = page.locator('main [aria-live="polite"]')
    for (let q = 0; q < 4; q++) {
      for (const pillar of [0, 1, 2, 3]) await answer(page, pillar, q, 5)
    }
    await expect(result).toContainText('16 of 16 answered')
    await expect(result).toContainText('Optimized')
    const move = result.getByText('Highest-ROI next move').locator('xpath=..')
    await expect(move).toContainText('top of the scale')
    await expect(move).not.toContainText(/lowest|tied|document the process|clean the data/i)
    await expect(result.getByText('weakest', { exact: true })).toHaveCount(0)
  })

  test('Reset answers returns to unanswered', async ({ page }) => {
    const result = page.locator('main [aria-live="polite"]')
    await answer(page, 0, 0, 2)
    await answer(page, 1, 1, 3)
    await page.getByRole('button', { name: 'Reset answers' }).click()
    await expect(page.getByRole('radio', { checked: true })).toHaveCount(0)
    await expect(result).toContainText('0 of 16 answered')
    await expect(result).toContainText(PROMPT)
  })
})
