import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { postCards } from './_helpers/blog'
import { databaseAvailable, NEEDS_DATABASE } from './_helpers/database'

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Opens the first post card on /blog and returns its href. Needs a database. */
async function openFirstPost(page: Page): Promise<string> {
  await page.goto('/blog')
  await page.waitForLoadState('networkidle')

  const card = postCards(page).first()
  const href = (await card.getAttribute('href')) ?? ''
  expect(href).toMatch(/^\/blog\/[^/]+$/)

  await card.click()
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveURL(new RegExp(`${escapeRegExp(href)}$`))
  return href
}

/**
 * Blog Browsing and Reading E2E Tests
 *
 * Tests the complete blog user journey:
 * - Blog listing page
 * - Category filtering
 * - Blog post reading
 * - Navigation between posts
 */

test.describe('Blog Listing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
  })

  test('displays blog page with proper heading', async ({ page }) => {
    // Verify page has main content
    await expect(page.locator('main')).toBeVisible()

    // Target the page H1 specifically. The earlier `getByText(/blog/i).first()`
    // matched any element containing the word — on mobile viewports it picked
    // up a hidden navigation/menu element with the word "blog" in it.
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    await expect(heading).toContainText(/blog|insights|articles/i)
  })

  test('displays blog posts or empty state', async ({ page }) => {
    // With a database the grid shows post cards; without one getBlogPosts
    // returns [] and BlogList renders its empty state.
    const emptyState = page.getByText('No posts found matching your filters.')
    await expect(postCards(page).first().or(emptyState)).toBeVisible()
  })

  test('blog posts are clickable links', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
    const cards = postCards(page)
    await expect(cards.first()).toBeVisible()

    const hrefs = await cards.evaluateAll((links) => links.map((a) => a.getAttribute('href')))
    for (const href of hrefs) expect(href).toMatch(/^\/blog\/[^/]+$/)
  })

  test('shows the category filter', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
    // BlogTagFilter always leads with an "All" button (plus its post count).
    await expect(page.getByRole('button', { name: /^All\b/ })).toBeVisible()
  })

  test('post cards show a title and publish date', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
    const card = postCards(page).first()
    await expect(card.getByRole('heading', { level: 2 })).not.toBeEmpty()
    await expect(card.locator('time')).not.toBeEmpty()
  })

  test('passes accessibility audit', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('.blur-3xl')
      .analyze()

    if (results.violations.length > 0) {
      console.log('Accessibility violations:', JSON.stringify(results.violations, null, 2))
    }

    expect(results.violations).toHaveLength(0)
  })
})

test.describe('Blog search (server-side full text)', () => {
  const cards = (page: import('@playwright/test').Page) =>
    page.locator('a.group.block[href^="/blog/"]')
  // The card heading is CardTitle, which is polymorphic — assert on its stable
  // data-slot rather than a tag name, so a future `as=` change doesn't break this.
  const cardTitles = (page: import('@playwright/test').Page) =>
    cards(page).locator('[data-slot="card-title"]')

  test('a body-only term returns posts the old client filter could not find', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)

    // "onboarding" appears in several posts' body content but in no title and
    // no excerpt. The substring filter this replaced only ever saw title and
    // excerpt — the field it needs is never shipped to the browser — so it
    // returned nothing for this query. Matching here proves the search is
    // running in Postgres against blog_posts.search_vector.
    await page.goto('/blog?q=onboarding')
    await page.waitForLoadState('networkidle')
    expect(await cards(page).count()).toBeGreaterThan(0)

    const titles = await cardTitles(page).allTextContents()
    const noneMentionItInTheTitle = titles.every((t) => !/onboarding/i.test(t))
    expect(noneMentionItInTheTitle, `titles: ${JSON.stringify(titles)}`).toBe(true)
  })

  test('tolerates a misspelling via trigram fallback', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)

    // 'atribution' is not a word in any post; it reaches
    // "Multi-Touch Attribution Modeling" only through word_similarity (0.769,
    // above the 0.45 threshold). The previous `%` operator compared the query
    // to the whole title and scored ~0, so this returned nothing.
    await page.goto('/blog?q=atribution')
    await page.waitForLoadState('networkidle')

    expect(await cards(page).count()).toBeGreaterThan(0)
    await expect(cardTitles(page).first()).toContainText(/attribution/i)
  })

  test('an unrelated term matches nothing and shows the empty state', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)

    // Guards the other direction: a 0.45 similarity threshold low enough to
    // catch typos must still reject unrelated words (measured ~0.15).
    await page.goto('/blog?q=photosynthesis')
    await page.waitForLoadState('networkidle')

    await expect(cards(page)).toHaveCount(0)
    await expect(page.getByText(/no posts found/i)).toBeVisible()
  })

  test('a repeated ?q= does not 500', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)

    // Next resolves a repeated key to string[], not string. The page typed the
    // param as `{ q?: string }` and called q.trim(), so this URL — trivially
    // hand-craftable, and crawlers do generate them — returned HTTP 500.
    const response = await page.goto('/blog?q=attribution&q=revenue')
    expect(response?.status()).toBe(200)
    await page.waitForLoadState('networkidle')
    // First value wins, so it behaves like ?q=attribution rather than erroring.
    expect(await cards(page).count()).toBeGreaterThan(0)
  })

  test('an overlong query is bounded, not passed through', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)

    const response = await page.goto(`/blog?q=${'a'.repeat(5000)}`)
    expect(response?.status()).toBe(200)
    await page.waitForLoadState('networkidle')
    await expect(cards(page)).toHaveCount(0)
  })

  test('no query renders the full index', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)

    // Compare totals, not visible cards: both renders are paged, so page 1 of
    // a broad search can hold as many cards as page 1 of the index.
    const resultCount = async () =>
      Number.parseInt((await page.getByTestId('blog-result-count').textContent()) ?? '', 10)

    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
    const all = await resultCount()

    await page.goto('/blog?q=attribution')
    await page.waitForLoadState('networkidle')
    const filtered = await resultCount()

    expect(await cards(page).count()).toBeGreaterThan(0)
    expect(all).toBeGreaterThan(0)
    expect(filtered).toBeGreaterThan(0)
    expect(filtered).toBeLessThan(all)
  })
})

test.describe('Blog pagination', () => {
  test('every post in the sitemap is reachable from the /blog page links', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)

    // The index used to stop at the newest 50 posts with no way to the rest,
    // while the sitemap listed every published post.
    const sitemap = await (await page.request.get('/sitemap.xml')).text()
    const sitemapPosts = [...sitemap.matchAll(/<loc>[^<]*?(\/blog\/(?!category\/)[^<]+)<\/loc>/g)]
      .map((m) => m[1])
      .filter((path): path is string => Boolean(path))
    expect(sitemapPosts.length).toBeGreaterThan(0)

    const listed = new Set<string>()
    let url: string | null = '/blog'
    for (let guard = 0; url && guard < 50; guard++) {
      await page.goto(url)
      await page.waitForLoadState('networkidle')
      for (const href of await postCards(page).evaluateAll((links) =>
        links.map((a) => a.getAttribute('href') ?? '')
      )) {
        listed.add(href)
      }
      const next = page.getByRole('navigation', { name: 'Blog pages' }).getByRole('link', {
        name: 'Next',
      })
      url = (await next.count()) > 0 ? await next.getAttribute('href') : null
    }

    const missing = sitemapPosts.filter((path) => !listed.has(path))
    expect(missing, `in the sitemap but not reachable from /blog: ${missing.join(', ')}`).toEqual(
      []
    )
  })

  test('a page past the end is a 404', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
    const response = await page.request.get('/blog?page=9999')
    expect(response.status()).toBe(404)
  })

  test('a junk page param renders the first page', async ({ page }) => {
    const response = await page.goto('/blog?page=abc')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})

test.describe('Blog Post Reading', () => {
  test('can navigate from listing to blog post', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
    await openFirstPost(page)
    await expect(page.locator('main')).toBeVisible()
  })

  test('blog post page has proper structure', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
    await openFirstPost(page)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('article').first()).toBeVisible()
  })

  test('blog post shows the author', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
    await openFirstPost(page)
    // BlogPostLayout prints the author's name in the post header, falling back
    // to 'Richard Hudson' (also the seeded author) when the post has none.
    await expect(page.locator('article header').getByText('Richard Hudson', { exact: true })).toBeVisible()
  })

  test('blog post is scrollable and content loads', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
    await openFirstPost(page)

    // The post body is the canonical "rich content" surface. Asserting that
    // it has a meaningful body length and that the document is taller than
    // the viewport is more robust than measuring scroll-position deltas
    // (which Next.js' scroll restoration can race with after navigation).
    const isScrollable = await page.evaluate(() => {
      const docHeight = document.documentElement.scrollHeight
      const viewHeight = window.innerHeight
      return docHeight > viewHeight + 200
    })
    expect(isScrollable).toBe(true)
  })

  test('blog post has navigation back to blog listing', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
    await openFirstPost(page)

    await page.getByRole('link', { name: 'Back to Blog' }).click()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/blog\/?$/)
  })

  test('blog post page passes accessibility audit', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
    await openFirstPost(page)

    // The body mounts with a 0.5s fade-in (`animate-fade-in-up`). axe derives
    // contrast from the rendered opacity, so auditing mid-fade reported dark
    // text at 1.38:1 against the background.
    await page
      .locator('.blog-content')
      .evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)).then(() => undefined))

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('.blur-3xl')
      .analyze()

    if (results.violations.length > 0) {
      console.log('Accessibility violations:', JSON.stringify(results.violations, null, 2))
    }

    expect(results.violations).toHaveLength(0)
  })
})

test.describe('Blog Mobile Experience', () => {
  test.use({ viewport: { width: 375, height: 667 }, hasTouch: true })

  test('blog listing is responsive on mobile', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('main')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('blog posts are tappable on mobile', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const card = postCards(page).first()
    const href = (await card.getAttribute('href')) ?? ''
    await card.tap()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(new RegExp(`${escapeRegExp(href)}$`))
  })
})

test.describe('Blog Keyboard Navigation', () => {
  test('can activate blog post link with keyboard', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const card = postCards(page).first()
    const href = (await card.getAttribute('href')) ?? ''
    await card.focus()
    await expect(card).toBeFocused()

    await page.keyboard.press('Enter')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(new RegExp(`${escapeRegExp(href)}$`))
  })
})

test.describe('Blog SEO and Meta', () => {
  test('blog listing has proper meta tags', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    // Check for title
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)

    // Check for meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
    expect(metaDescription?.length).toBeGreaterThan(0)
  })

  test('blog post has BlogPosting structured data', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
    await openFirstPost(page)

    const types = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts.map((el) => (JSON.parse(el.textContent ?? '{}') as { '@type'?: unknown })['@type'])
      )
    expect(types).toContain('BlogPosting')
  })
})

test.describe('Blog list cards (UI-07)', () => {
  /**
   * Image identity for a rendered cover: unwrap /_next/image?url=…, then use
   * host + path (the pipeline reuses one photo with different query params).
   * Generated /api/og covers keep their query, which is what makes them unique.
   */
  const coverKeys = (imgs: Element[]) =>
    imgs.map((img) => {
      const src = img.getAttribute('src') ?? ''
      const outer = new URL(src, location.origin)
      const inner = outer.pathname === '/_next/image' ? (outer.searchParams.get('url') ?? '') : src
      const u = new URL(inner, location.origin)
      return u.pathname === '/api/og' ? `${u.pathname}${u.search}` : `${u.host}${u.pathname}`
    })

  test.beforeEach(({ browserName }) => {
    test.skip(browserName !== 'chromium', 'chromium-gated')
  })

  test('every card has one chip, a 3-line title clamp and a unique cover', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)

    const checkPage = async (url: string) => {
      await page.goto(url)
      const cards = postCards(page)
      await expect(cards.first()).toBeVisible()
      const count = await cards.count()
      for (let i = 0; i < count; i++) {
        const card = cards.nth(i)
        const chip = card.locator('span.uppercase.text-primary')
        await expect(chip).toHaveCount(1)
        expect(((await chip.textContent()) ?? '').trim().length).toBeGreaterThan(0)
        await expect(card.locator('h2')).toHaveClass(/line-clamp-3/)
      }
      const keys = await page.locator('main a[href^="/blog/"] img').evaluateAll(coverKeys)
      expect(keys.length).toBeGreaterThan(0)
      expect(new Set(keys).size, keys.join('\n')).toBe(keys.length)
      // No card excerpt may open with the author-bio boilerplate.
      await expect(cards.filter({ hasText: /Texas Army National Guard/ })).toHaveCount(0)
    }

    await checkPage('/blog')
    const next = page.locator('a[href*="page=2"]').first()
    if ((await next.count()) > 0) await checkPage('/blog?page=2')
  })

  test('category page cards have a chip and unique covers', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
    await page.goto('/blog')
    // /blog has no category links inside <main>; the footer's RevOps link is the stable entry.
    const link = page.locator('a[href^="/blog/category/"]').first()
    await expect(link).toBeAttached()
    const href = (await link.getAttribute('href')) ?? ''
    await page.goto(href)
    const cards = page.locator('main a.group[href^="/blog/"]')
    await expect(cards.first()).toBeVisible()
    const count = await cards.count()
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i).locator('span.uppercase.text-primary')).toHaveCount(1)
    }
    const keys = await cards.locator('img').evaluateAll(coverKeys)
    expect(keys.length).toBeGreaterThan(0)
    expect(new Set(keys).size, keys.join('\n')).toBe(keys.length)
    await expect(cards.filter({ hasText: /Texas Army National Guard/ })).toHaveCount(0)
  })

  test('/api/og card is served directly as an image', async ({ request }) => {
    const res = await request.get('/api/og?title=Probe&category=Revenue%20Operations')
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toMatch(/^image\//)
  })
})

test.describe('Blog post layout (UI-10)', () => {
  test.beforeEach(({ browserName }) => {
    test.skip(browserName !== 'chromium', 'chromium-gated')
  })

  test('back link sits under the header; date and reading time appear once', async ({ page }) => {
    test.skip(!(await databaseAvailable(page.request)), NEEDS_DATABASE)
    await page.setViewportSize({ width: 1440, height: 900 })
    await openFirstPost(page)

    const box = await page.getByRole('link', { name: 'Back to Blog' }).boundingBox()
    expect(box).not.toBeNull()
    expect(box?.y ?? Infinity).toBeLessThanOrEqual(86)

    const aside = page.locator('article aside')
    await expect(aside.getByText('Published')).toHaveCount(0)
    await expect(aside.getByText('Reading time')).toHaveCount(0)
    await expect(page.locator('article header time')).toHaveCount(1)
    await expect(page.locator('article header').getByText(/\d+ min read/)).toHaveCount(1)
  })
})
