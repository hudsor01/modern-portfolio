import type { Page } from '@playwright/test'

/**
 * Shared page-settling and request-guard helpers for the Phase 11 a11y specs.
 * Everything waits on a condition (frames painted, fonts ready, animations
 * finished), never on a fixed sleep.
 */

/** Resolve after two animation frames: layout, IntersectionObserver and style work has flushed. */
async function nextFrames(page: Page): Promise<void> {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
}

/** Wait for every finite Web Animation / CSS transition on the page to finish. */
export async function settleTransitions(page: Page): Promise<void> {
  await nextFrames(page)
  await page.evaluate(async () => {
    const finite = document.getAnimations().filter((a) => {
      const timing = a.effect?.getComputedTiming()
      return timing !== undefined && timing.iterations !== Infinity
    })
    // Bounded: a finite animation that never resolves must not hang the test.
    await Promise.race([
      Promise.all(finite.map((a) => a.finished.catch(() => undefined))),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ])
  })
}

/**
 * Scroll the whole page one viewport at a time so lazily-mounted content
 * (charts, below-the-fold sections) renders, then return to the top and wait
 * for fonts and animations to settle. The scroll height is re-read each step
 * because lazy content grows it.
 */
export async function settlePage(page: Page): Promise<void> {
  await page.waitForLoadState('load')
  await page.evaluate(() => document.fonts.ready)
  let y = 0
  // Hard cap so a page whose height keeps growing fails loudly instead of
  // hanging until the test timeout (the tallest audited page is ~20 viewports).
  const MAX_STEPS = 60
  for (let steps = 0; ; steps += 1) {
    const { total, step } = await page.evaluate(() => ({
      total: document.documentElement.scrollHeight,
      step: window.innerHeight,
    }))
    if (y >= total) break
    if (steps >= MAX_STEPS) {
      throw new Error(`settlePage: page height still growing after ${MAX_STEPS} viewports (${total}px)`)
    }
    y += step
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
    await nextFrames(page)
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await settleTransitions(page)
}

/** Abort every non-GET/HEAD request. Call once per test: each call adds a route handler. */
export async function getOnly(page: Page): Promise<{ aborted: number; serverActions: number }> {
  const counter = { aborted: 0, serverActions: 0 }
  await page.route('**/*', async (route) => {
    const request = route.request()
    if (request.method() !== 'GET' && request.method() !== 'HEAD') {
      counter.aborted += 1
      if (request.headers()['next-action']) counter.serverActions += 1
      await route.abort()
      return
    }
    await route.continue()
  })
  return counter
}
