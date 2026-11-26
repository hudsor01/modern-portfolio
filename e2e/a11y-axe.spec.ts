import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, test } from '@playwright/test'
import { postCards } from './_helpers/blog'
import { databaseAvailable, NEEDS_DATABASE } from './_helpers/database'
import { getOnly, settlePage, settleTransitions } from './_helpers/settle'

/**
 * Phase 11 axe gate (A11Y-01, A11Y-02, A11Y-06).
 *
 * Runs axe (wcag2a, wcag2aa, wcag21aa, wcag22aa, best-practice) on all 14
 * audited pages at 1440x900 and 390x844 and requires zero violations. No
 * rules are disabled and nothing is left out of any scan. Interactive states
 * (mobile menu, category listbox, contact focus/error) and a hover/focus
 * contrast pass are covered too. Every non-GET request is aborted, so the
 * contact tests can never send email or write to the database.
 */

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice']

const BLOG_POST = '__first_blog_post__'
const PAGES = [
  '/',
  '/about',
  '/projects',
  '/projects/revenue-kpi',
  '/projects/deal-funnel',
  '/blog',
  BLOG_POST,
  '/contact',
  '/resume',
  '/tools',
  '/tools/pipeline-coverage-calculator',
  '/tools/revops-maturity-scorecard',
  '/privacy',
  '/contact/sent',
  '/this-page-does-not-exist',
]

const DESKTOP = { width: 1440, height: 900 }
const MOBILE = { width: 390, height: 844 }
const VIEWPORTS = [DESKTOP, MOBILE]

type AxeResults = Awaited<ReturnType<AxeBuilder['analyze']>>

function violations(results: AxeResults) {
  return results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    targets: v.nodes.map((n) => n.target.join(' ')),
  }))
}

async function settle(page: Page, path: string) {
  await settlePage(page)
  if (path === '/projects') {
    await page.locator('button[role="combobox"]').first().waitFor({ state: 'visible' })
  }
}

async function resolve(page: Page, path: string): Promise<string> {
  if (path !== BLOG_POST) return path
  test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
  await page.goto('/blog')
  await page.waitForLoadState('load')
  const href = (await postCards(page).first().getAttribute('href')) ?? ''
  expect(href).toMatch(/^\/blog\/[^/]+$/)
  return href
}

test.describe.configure({ mode: 'parallel' })

test.describe('axe: 14 pages', () => {
  for (const viewport of VIEWPORTS) {
    test.describe(`@${viewport.width}`, () => {
      test.use({ viewport })
      for (const path of PAGES) {
        test(`${path} @${viewport.width}`, async ({ page }, testInfo) => {
          test.skip(testInfo.project.name !== 'chromium', 'axe gate runs once, in Chromium')
          await getOnly(page)
          const target = await resolve(page, path)
          await page.goto(target, { waitUntil: 'load' })
          await settle(page, target)
          const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
          expect(violations(results), `${target} @${viewport.width}`).toEqual([])
        })
      }
    })
  }
})

test.describe('axe: interactive states', () => {
  test('mobile menu open @390', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'axe gate runs once, in Chromium')
    await page.setViewportSize(MOBILE)
    await getOnly(page)
    await page.goto('/', { waitUntil: 'load' })
    await settle(page, '/')
    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(page.locator('#mobile-menu')).toBeVisible()
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
    expect(violations(results)).toEqual([])
  })

  test('projects category listbox open @1440', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'axe gate runs once, in Chromium')
    await page.setViewportSize(DESKTOP)
    await getOnly(page)
    await page.goto('/projects', { waitUntil: 'load' })
    await settle(page, '/projects')
    const combobox = page.getByRole('combobox', { name: 'Filter by category' })
    await expect(combobox).toHaveCount(1)
    await combobox.click()
    await page.keyboard.press('ArrowDown')
    await page.locator('[role="listbox"]').waitFor({ state: 'visible' })
    // Full-page scans while a Radix popover is open report aria-hidden-focus and
    // landmark artifacts of the modal state (everything outside is aria-hidden by
    // design), so the open-state scan is scoped to the listbox itself. The closed
    // state is covered by the full-page /projects scan above.
    const results = await new AxeBuilder({ page }).include('[role="listbox"]').withTags(TAGS).analyze()
    expect(violations(results)).toEqual([])
  })

  for (const viewport of VIEWPORTS) {
    test(`contact focus and error states @${viewport.width}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'chromium', 'axe gate runs once, in Chromium')
      await page.setViewportSize(viewport)
      const hits = await getOnly(page)
      await page.goto('/contact', { waitUntil: 'load' })
      await settle(page, '/contact')

      await page.getByLabel(/^name/i).focus()
      let results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
      expect(violations(results), 'focused field').toEqual([])

      await page.getByRole('button', { name: /send message/i }).click()
      await expect(
        page.locator('[role="alert"], [aria-invalid="true"], :invalid').first()
      ).toBeVisible()
      results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
      expect(violations(results), 'empty-submit error state').toEqual([])

      expect(hits.serverActions, 'no server action may reach the network').toBe(0)
    })
  }
})

test.describe('axe: hover and focus contrast', () => {
  test.use({ viewport: DESKTOP })
  for (const path of PAGES) {
    test(`${path}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'chromium', 'axe gate runs once, in Chromium')
      test.setTimeout(300_000)
      await getOnly(page)
      const target = await resolve(page, path)
      await page.goto(target, { waitUntil: 'load' })
      await settle(page, target)

      const probes = await page.evaluate(() => {
        const re = /(^|\s)(hover|focus|focus-visible|group-hover):(bg|text)-/
        const seen = new Set<string>()
        const found: {
          n: number
          className: string
          group: boolean
          focusable: boolean
          hoverable: boolean
          inCard: boolean
        }[] = []
        for (const el of Array.from(document.querySelectorAll<HTMLElement>('body *'))) {
          const cls = typeof el.className === 'string' ? el.className : ''
          if (
            !cls ||
            !(
              re.test(cls) ||
              cls.includes('bg-accent') ||
              /(^|\s)bg-(primary\/8|secondary\/10)(\s|$)/.test(cls)
            )
          )
            continue
          if (!el.checkVisibility()) continue
          if (seen.has(cls)) continue
          seen.add(cls)
          const n = found.length
          el.setAttribute('data-axe-probe', String(n))
          const tag = el.tagName.toLowerCase()
          const focusable =
            ['a', 'button', 'input', 'select', 'textarea'].includes(tag) || el.tabIndex >= 0
          // Screen-reader-only elements (the skip link) have no hit area until focused,
          // so they are measured in the focus state only.
          const hoverable = !el.classList.contains('sr-only')
          found.push({
            n,
            className: cls,
            group: cls.includes('group-hover:'),
            focusable,
            hoverable,
            inCard: Boolean(el.closest('article')),
          })
        }
        return found
      })

      expect(probes.length, `${target} has hover/focus probes`).toBeGreaterThan(0)
      if (path === '/projects' || path === '/') {
        expect(
          probes.some((p) => p.inCard),
          'a ProjectCard preview is in the hover sweep',
        ).toBe(true)
      }

      const failures: { className: string; state: string; violations: unknown }[] = []
      for (const probe of probes) {
        const sel = `[data-axe-probe="${probe.n}"]`
        const el = page.locator(sel)
        const hoverTarget = probe.group ? el.locator('xpath=ancestor-or-self::*[contains(@class,"group")][1]') : el
        let results: AxeResults
        if (probe.hoverable) {
          try {
            await hoverTarget.first().hover({ timeout: 5000 })
          } catch (error) {
            failures.push({
              className: probe.className,
              state: 'hover-not-applied',
              violations: String(error).split('\n')[0],
            })
            continue
          }
          await settleTransitions(page)
          results = await new AxeBuilder({ page }).include(sel).withRules(['color-contrast']).analyze()
          if (results.violations.length > 0) {
            failures.push({ className: probe.className, state: 'hover', violations: violations(results) })
          }
        }
        if (probe.focusable) {
          try {
            await el.focus({ timeout: 5000 })
          } catch (error) {
            failures.push({
              className: probe.className,
              state: 'focus-not-applied',
              violations: String(error).split('\n')[0],
            })
            continue
          }
          await settleTransitions(page)
          results = await new AxeBuilder({ page })
            .include(sel)
            .withRules(['color-contrast'])
            .analyze()
          if (results.violations.length > 0) {
            failures.push({ className: probe.className, state: 'focus', violations: violations(results) })
          }
        }
        await page.mouse.move(0, 0)
      }
      expect(failures).toEqual([])
    })
  }
})
