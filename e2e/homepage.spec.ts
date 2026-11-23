import { test, expect } from '@playwright/test'

/**
 * Homepage E2E Tests
 *
 * Locks in the structure and CTAs of `/`:
 *   - Hero CTAs (View My Work / Resume / Let's Talk)
 *   - Featured Work section (4 flagship project links)
 *   - Final CTA section (Start a Conversation / View Resume)
 *   - Mailto link to the real contact address (TO_EMAIL default)
 *   - Proven Results metrics animate to non-zero values (regression #3)
 *   - Proven Results metrics carry their final values in the server HTML
 *   - A <main id="main-content"> landmark (skip-link target)
 */

test.describe('/ homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('hero CTAs link to the expected routes', async ({ page }) => {
    // Limit to the main element so we don't pick up duplicate links in
    // the Navbar (e.g. another "Resume" anchor).
    const main = page.locator('body')

    await expect(
      main.getByRole('link', { name: /view my work/i }).first()
    ).toHaveAttribute('href', '/projects')

    // "Resume" matches both navbar and hero — assert at least one points to /resume.
    const resumeLinks = main.getByRole('link', { name: /^resume$/i })
    expect(await resumeLinks.count()).toBeGreaterThan(0)
    await expect(resumeLinks.first()).toHaveAttribute('href', '/resume')

    await expect(
      main.getByRole('link', { name: /let'?s talk/i }).first()
    ).toHaveAttribute('href', '/contact')
  })

  test('Featured Work section links to four existing project routes', async ({ page }) => {
    // The Featured Work heading anchors a section with 4 flagship project links.
    const featuredHeading = page.getByRole('heading', { name: /^featured work$/i })
    await expect(featuredHeading).toBeVisible()

    const expectedHrefs = [
      '/projects/revenue-kpi',
      '/projects/forecast-pipeline-intelligence',
      '/projects/partnership-program-implementation',
      '/projects/sales-enablement',
    ]
    for (const href of expectedHrefs) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible()
    }
  })

  test('final CTA section has Start a Conversation and View Resume buttons', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /start a conversation/i })
    ).toHaveAttribute('href', '/contact')
    await expect(
      page.getByRole('link', { name: /view resume/i })
    ).toHaveAttribute('href', '/resume')
  })

  test('renders mailto link to the real contact address', async ({ page }) => {
    const mailto = page.locator('a[href="mailto:hudsor01@icloud.com"]').first()
    await expect(mailto).toBeVisible()
  })

  test('Proven Results metrics show non-zero values within 5s (regression #3)', async ({
    page,
  }) => {
    // Lock in the audit fix that prevented all 4 ImpactMetric counters from
    // being stuck at 0 on the homepage. Each NumberTicker animates from 0
    // to its final value; we wait for the rendered text to no longer be
    // "0" / "$0M+" / "0%" / "0+" for any of the four.
    const provenResultsHeading = page.getByRole('heading', { name: /proven results/i })
    await expect(provenResultsHeading).toBeVisible()

    // The counters render their final values in the server HTML (asserted
    // below) and only re-count client-side once scrolled into view. Scroll
    // them in so this checks the post-animation state on every viewport:
    // `waitForFunction` polls in-page and does NOT auto-scroll.
    await provenResultsHeading.scrollIntoViewIfNeeded()

    // Grid container directly follows the section header; capture its
    // 4 large counter values via the `tabular-nums` class signature used
    // in HomePageContent.tsx.
    await page.waitForFunction(
      () => {
        const counters = document.querySelectorAll('.tabular-nums')
        if (counters.length < 4) return false
        // Each counter renders prefix + number + suffix as concatenated
        // text. Strip non-digits and check at least one digit is non-zero.
        for (const el of Array.from(counters).slice(0, 4)) {
          const text = (el.textContent ?? '').trim()
          const digits = text.replace(/\D/g, '')
          if (!digits || /^0+$/.test(digits)) return false
        }
        return true
      },
      { timeout: 5000 }
    )
  })

  test('server HTML carries the final Proven Results values, not zeros', async ({ page }) => {
    // Crawlers, link previews and no-JS visitors only ever see the server
    // HTML. NumberTicker used to emit its start value there ("$0M+ / 0% / 0%
    // / 0+"); it now renders the final figure and animates client-side only.
    const html = await (await page.request.get('/')).text()
    const counters = [
      ...html.matchAll(/<span class="inline-block tabular-nums tracking-tight">([^<]*)<\/span>/g),
    ].map((m) => m[1] ?? '')
    expect(counters).toHaveLength(4)
    for (const value of counters) {
      expect(value.replace(/\D/g, '')).not.toMatch(/^0*$/)
    }
  })

  test('has a main landmark that the skip link targets', async ({ page }) => {
    await expect(page.locator('main#main-content')).toHaveCount(1)
    await expect(page.locator('a[href="#main-content"]')).toHaveCount(1)
  })

  test.describe('layout contracts (chromium)', () => {
    test.beforeEach(({}, testInfo) => {
      test.skip(testInfo.project.name !== 'chromium', 'geometry checked once, on chromium')
    })

    test('each headline stat renders once with its canonical label', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      const labels: Record<string, string> = {
        revenue: 'Revenue Impact',
        'transaction-growth': 'Transaction Growth',
        'network-growth': 'Network Growth',
        years: 'Years Experience',
      }
      for (const [key, label] of Object.entries(labels)) {
        await expect(page.locator(`[data-stat="${key}"]`)).toHaveCount(1)
        await expect(page.locator(`[data-stat-label="${key}"]`)).toHaveText(label)
      }
      await expect(
        page.getByText('On track year-over-year, per the Revenue KPI case study')
      ).toHaveCount(1)
    })

    test('hero CTAs stack full width at 390', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      const hero = page.locator('main section').first()
      const links = [
        hero.getByRole('link', { name: /view my work/i }),
        hero.getByRole('link', { name: /^resume$/i }),
        hero.getByRole('link', { name: /let'?s talk/i }),
      ]
      const boxes = []
      for (const l of links) {
        const box = await l.boundingBox()
        expect(box).not.toBeNull()
        boxes.push(box!)
      }
      const wrapper = await links[0]!.locator('xpath=..').boundingBox()
      expect(wrapper).not.toBeNull()
      for (const b of boxes) {
        expect(Math.abs(b.width - boxes[0]!.width)).toBeLessThanOrEqual(1)
        expect(Math.abs(b.width - wrapper!.width)).toBeLessThanOrEqual(1)
      }
      expect(new Set(boxes.map((b) => Math.round(b.y))).size).toBe(3)
    })

    test('non-hero sections share one rhythm at 1440', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      const sections = page.locator('main#main-content > section')
      const count = await sections.count()
      expect(count).toBeGreaterThan(2)
      let prevBottom: number | null = null
      for (let i = 0; i < count; i++) {
        const sec = sections.nth(i)
        const box = await sec.boundingBox()
        expect(box).not.toBeNull()
        if (i > 0) {
          const pad = await sec.evaluate((el) => {
            const cs = getComputedStyle(el)
            return [cs.paddingTop, cs.paddingBottom]
          })
          expect(pad).toEqual(['56px', '56px'])
          expect(Math.abs(box!.y - prevBottom!)).toBeLessThanOrEqual(1)
        }
        prevBottom = box!.y + box!.height
      }
    })

    test('Featured Work uses ProjectCards', async ({ page }) => {
      const section = page.locator('main section', {
        has: page.getByRole('heading', { level: 2, name: 'Featured Work' }),
      })
      for (const slug of [
        'revenue-kpi',
        'forecast-pipeline-intelligence',
        'partnership-program-implementation',
        'sales-enablement',
      ]) {
        const card = section.locator(`a[href="/projects/${slug}"]`).first()
        await expect(card).toBeVisible()
        await expect(card.locator('img').first()).toHaveCount(1)
        await expect(card.getByRole('heading', { level: 3 })).toHaveCount(1)
      }
    })
  })
})
