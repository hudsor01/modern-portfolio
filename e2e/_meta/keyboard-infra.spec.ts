import { test, expect } from '@playwright/test'

/**
 * Browser keyboard-navigation infrastructure tests.
 *
 * Single source of truth for the cross-browser fixture-input check that
 * was previously duplicated in `blog.spec.ts` and `resume.spec.ts`. The
 * test verifies that Tab moves focus between focusable elements at the
 * engine level, regardless of Safari's "Tab focuses links" default
 * (which excludes <a> and <button> from Tab order — only <input>s and
 * other text-input form controls are reliably included cross-browser).
 *
 * The fixtures are injected via `evaluate()` and removed in the same
 * call, so the test has zero coupling to production UI; it isn't trying
 * to verify any one page's tab order. Per-page tab-order regressions
 * (e.g. a stray `tabindex="-1"` on every form field) are covered by
 * `e2e/contact-form.spec.ts → "Tab from a real form input stays inside
 * the page DOM (regression gate)"`, which exercises the actual page DOM.
 */

test('Tab advances focus between two injected inputs', async ({ page }) => {
  // Page choice is incidental — the test runs entirely against fixtures
  // appended to <body>. Use `/` so we have a known-cheap page.
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const startedOnFirstFixture = await page.evaluate(() => {
    // Off-screen so headed debug runs don't flash the inputs.
    const offscreen = 'position:fixed;left:-9999px;top:-9999px;'
    const a = document.createElement('input')
    a.id = '__kbd_test_a'
    a.type = 'text'
    a.style.cssText = offscreen
    const b = document.createElement('input')
    b.id = '__kbd_test_b'
    b.type = 'text'
    b.style.cssText = offscreen
    document.body.append(a, b)
    a.focus()
    return document.activeElement?.id === '__kbd_test_a'
  })
  expect(startedOnFirstFixture).toBe(true)

  await page.keyboard.press('Tab')

  const movedToSecondFixture = await page.evaluate(() => {
    const moved = document.activeElement?.id === '__kbd_test_b'
    document.getElementById('__kbd_test_a')?.remove()
    document.getElementById('__kbd_test_b')?.remove()
    return moved
  })
  expect(movedToSecondFixture).toBe(true)
})
