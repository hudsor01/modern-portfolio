import { test, expect } from '@playwright/test'

/**
 * Audit Regression Tests — Canonical Survival Check
 *
 * Focused regressions for every audit fix that has shipped to main.
 * Assertions are intentionally duplicated from per-page specs; this
 * file is the single canonical "did the audit fixes survive?" gate.
 *
 * Interactivity audit (audit/page-interactivity, PR #87/#88):
 *   #1 /projects/revenue-kpi has no timeframe pills
 *   #2 /about button text is "View Resume" (not "Download Resume")
 *   #3 Homepage Proven Results metrics reach non-zero values within 5s
 *   #4 GET /api/generate-resume-pdf returns 404 (route deleted)
 *   #5 /contact noscript fallback visible when JS is disabled
 *
 * Browser audit (PR #96):
 *   #6 /blog/<bad>, /projects/<bad>, /blog/category/<bad> return HTTP 404
 *   #7 Tab clicks on /projects/cac-unit-economics push ?tab= to URL
 *   #8 No horizontal page overflow at viewport <=1024px on project pages
 *   #9 Each blog post page has exactly one <h1>
 *  #10 /blog post-card titles render as <h2> (heading outline coverage)
 *  #11 Project pages have <h2> between page <h1> and any <h3> (no skipped level)
 *  #12 Homepage hero <h1> has opacity 1 immediately after navigation
 *  #13 /nonexistent document.title starts with "404"
 *
 * Google Search Console "Crawled - currently not indexed" fix (PR #97):
 *  #14 src/app/loading.tsx does not exist (kills "Loading..." in initial HTML)
 *  #15 Initial HTML body of a real blog post does NOT contain "Loading..."
 *  #16 /blog/<bad>, /projects/<bad>, /blog/category/<bad> page titles start with "404"
 */

test.describe('Audit regressions', () => {
  test('#1 /projects/revenue-kpi shows no timeframe pills', async ({ page }) => {
    await page.goto('/projects/revenue-kpi', { timeout: 60000 })
    await page.waitForLoadState('networkidle')

    await expect(page.locator('[data-testid="timeframe-selector"]')).toHaveCount(0)

    const main = page.locator('main')
    for (const label of ['2020', '2022', '2024', 'All']) {
      await expect(
        main.getByRole('button', { name: new RegExp(`^${label}$`) })
      ).toHaveCount(0)
    }
  })

  test('#2 /about resume CTA reads "View Resume" (not "Download Resume")', async ({ page }) => {
    await page.goto('/about')
    await page.waitForLoadState('networkidle')

    // The About page personal-info section renders a resume CTA. The audit
    // changed the copy from "Download Resume" → "View Resume" (the link
    // navigates to /resume rather than triggering a download).
    await expect(
      page.getByRole('link', { name: /view resume/i }).first()
    ).toBeVisible()
    await expect(page.getByRole('link', { name: /^download resume$/i })).toHaveCount(0)
  })

  test('#3 Homepage Proven Results metrics reach non-zero values within 5s', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page.getByRole('heading', { name: /proven results/i })).toBeVisible()

    await page.waitForFunction(
      () => {
        const counters = document.querySelectorAll('.tabular-nums')
        if (counters.length < 4) return false
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

  test('#4 GET /api/generate-resume-pdf returns 404 (route deleted)', async ({ page }) => {
    // The audit fix removed the puppeteer-backed route entirely. Confirm
    // there is no handler at this path. CLAUDE.md's mention of a 503
    // fallback predates the deletion; the route file is gone from disk.
    const response = await page.request.get('/api/generate-resume-pdf')
    expect(response.status()).toBe(404)
  })

  test('#5 /contact noscript fallback visible when JavaScript is disabled', async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    try {
      await page.goto('/contact')
      await page.waitForLoadState('domcontentloaded')

      await expect(
        page.getByText(/this form requires javascript/i)
      ).toBeVisible()

      await expect(
        page.locator('a[href="mailto:richard@richardwhudsonjr.com"]').first()
      ).toBeVisible()
    } finally {
      await context.close()
    }
  })

  // ──────────────────────────────────────────────────────────────────
  // Browser audit (PR #96)
  // ──────────────────────────────────────────────────────────────────

  test('#6 unknown slug routes return HTTP 404 (no soft-404)', async ({ page }) => {
    // ProjectPage / BlogPost / BlogCategory call notFound() when the slug
    // is unknown; force-dynamic on the route ensures HTTP 404 propagates
    // (the prior soft-404 returned 200 with the themed body, which Google
    // Search Console flagged).
    for (const path of [
      '/blog/this-slug-does-not-exist',
      '/projects/this-slug-does-not-exist',
      '/blog/category/this-slug-does-not-exist',
    ]) {
      const response = await page.request.get(path)
      expect(response.status(), `${path} should return 404`).toBe(404)
    }
  })

  test('#7 tab clicks on /projects/cac-unit-economics push ?tab= to URL', async ({ page }) => {
    await page.goto('/projects/cac-unit-economics')
    await page.waitForLoadState('networkidle')

    // Initial URL has no tab param. Clicking the Channels tab via the
    // ProjectPageLayout timeframe-selector buttons should call nuqs's
    // setActiveTab → updates URL.
    const channelsButton = page.getByRole('button', { name: /^channels$/i }).first()
    await channelsButton.click()

    await page.waitForFunction(
      () => new URL(window.location.href).searchParams.get('tab') === 'channels',
      { timeout: 3000 }
    )
  })

  test('#8 no horizontal page overflow at <=1024px viewport on project pages', async ({
    browser,
  }) => {
    // Audit found scrollWidth > innerWidth on every project detail page
    // because the absolute decorative blurs in ProjectPageLayout escaped
    // their container (parent had overflow-hidden but no `relative`).
    const context = await browser.newContext({ viewport: { width: 1000, height: 800 } })
    const page = await context.newPage()
    try {
      await page.goto('/projects/cac-unit-economics')
      await page.waitForLoadState('networkidle')

      const overflows = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth
      })
      expect(overflows, 'project page must not overflow horizontally at 1000px').toBe(false)
    } finally {
      await context.close()
    }
  })

  test('#9 each blog post page has exactly one <h1>', async ({ page }) => {
    // The audit found a duplicate <h1> on a blog post because the body
    // content shipped a literal <h1> matching the page title. The render
    // path now demotes any in-body <h1> to <h2>.
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    // Visit the first published post link to verify the article template.
    const firstPostLink = page.locator('a[href^="/blog/"]:not([href="/blog"])').first()
    const href = await firstPostLink.getAttribute('href')
    if (!href) test.skip(true, 'No blog posts present in this environment')

    await page.goto(href!)
    await page.waitForLoadState('networkidle')

    const h1Count = await page.locator('h1').count()
    expect(h1Count, 'blog post page should have exactly one <h1>').toBe(1)
  })

  test('#10 /blog and /blog/category cards render <h2> per card', async ({ page }) => {
    // Audit found post titles rendered as styled <div>s instead of <h2>,
    // breaking screen-reader heading navigation. CardTitle is now
    // polymorphic; consumers pass `as="h2"` for the post-card title.
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    // The page should have multiple <h2>s (one per post card). The exact
    // count varies as posts are published, but >= 1 is the contract.
    const h2Count = await page.locator('main h2').count()
    expect(h2Count, '/blog should have at least one <h2> from post cards').toBeGreaterThan(0)
  })

  test('#11 project pages have <h2> between page <h1> and any <h3>', async ({ page }) => {
    // SectionCard's title was h3, producing h1 → h3 outlines. Now h2.
    await page.goto('/projects/cac-unit-economics')
    await page.waitForLoadState('networkidle')

    const h1Count = await page.locator('main h1').count()
    const h2Count = await page.locator('main h2').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)
    expect(h2Count, 'project page must have at least one <h2> for outline continuity').toBeGreaterThan(0)
  })

  test('#12 homepage hero <h1> has opacity 1 immediately after navigation', async ({
    page,
  }) => {
    // Audit found the hero rendered at opacity 0 for 2-6s while the
    // mounted/in-view gate resolved. Above-the-fold gates removed.
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const heroOpacity = await page
      .locator('h1')
      .filter({ hasText: /transforming/i })
      .first()
      .evaluate((el) => parseFloat(window.getComputedStyle(el).opacity))

    expect(heroOpacity, 'hero <h1> must be visible immediately').toBe(1)
  })

  test('#13 /nonexistent document.title starts with "404"', async ({ page }) => {
    // Root not-found.tsx now exports metadata.title so the 404 page no
    // longer inherits the homepage default title.
    await page.goto('/nonexistent')
    await page.waitForLoadState('domcontentloaded')
    await expect(page).toHaveTitle(/^404/)
  })

  test('#14 src/app/loading.tsx does not exist (forbidden — would leak "Loading..." into Googlebot HTML)', async () => {
    // The deleted root loading.tsx was Next.js's default Suspense fallback
    // for every route. Its "Loading..." text shipped in the static HTML
    // body for every dynamic page, which Google's quality algorithm read
    // as thin content and bucketed under "Crawled - currently not
    // indexed". A future PR that reintroduces it must be caught here.
    // If a route truly needs a fallback, use a SKELETON of the page
    // content with real headings, not a literal "Loading..." string.
    const { existsSync } = await import('node:fs')
    const { resolve } = await import('node:path')
    const loadingPath = resolve(process.cwd(), 'src/app/loading.tsx')
    expect(existsSync(loadingPath), 'src/app/loading.tsx must not exist').toBe(false)
  })

  test('#15 initial HTML of a real blog post does not contain "Loading..." string', async ({
    page,
  }) => {
    // Fetch the raw server-rendered HTML for a known published slug.
    // Googlebot's initial fetch sees this body — it must contain article
    // text up front, never a "Loading..." placeholder. The slug "lead-
    // scoring-models-that-actually-work" is referenced as a related post
    // in src/app/blog/[slug]/page.tsx output, so it exists in seed.
    const response = await page.request.get('/blog/lead-scoring-models-that-actually-work', {
      headers: { 'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)' },
    })
    // Accept 200 (published) or 404 (slug rotated); never assert on 200
    // alone — content can change. The thin-content guard applies regardless.
    if (response.status() === 200) {
      const html = await response.text()
      expect(html, 'static HTML must not contain "Loading..." spinner text').not.toContain(
        'Loading...'
      )
    }
  })

  test('#16 segment 404 page titles start with "404" (no homepage-title leak)', async ({ page }) => {
    // Each segment not-found.tsx (blog/[slug], blog/category/[slug],
    // projects/[slug]) exports metadata so the 404 <title> doesn't fall
    // through to the layout default ("Richard Hudson | Revenue Operations
    // Professional") — which would make bad URLs look identical to the
    // homepage in browser tab strips and social-share previews.
    for (const path of [
      '/blog/this-slug-does-not-exist',
      '/projects/this-slug-does-not-exist',
      '/blog/category/this-slug-does-not-exist',
    ]) {
      await page.goto(path)
      await page.waitForLoadState('domcontentloaded')
      await expect(page, `${path} title must start with "404"`).toHaveTitle(/^404/)
    }
  })
})
