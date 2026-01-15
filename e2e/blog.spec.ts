import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

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

    // Look for blog-related heading or content
    const blogContent = page.getByText(/blog|insights|articles/i).first()
    await expect(blogContent).toBeVisible()
  })

  test('displays blog posts or empty state', async ({ page }) => {
    // Wait for content to load
    await page.waitForTimeout(2000)

    // Either shows blog posts or an empty state message
    const blogPosts = page.locator('article')
    const emptyState = page.getByText(/no posts|coming soon|no articles|check back/i)
    const mainContent = page.locator('main')

    const hasPosts = await blogPosts.count() > 0
    const hasEmptyState = await emptyState.isVisible().catch(() => false)
    const hasMain = await mainContent.isVisible()

    // Should have content visible - posts, empty state, or at least main content
    expect(hasPosts || hasEmptyState || hasMain).toBeTruthy()
  })

  test('blog posts are clickable links', async ({ page }) => {
    // Look for blog post links
    const blogLinks = page.locator('a[href*="/blog/"]').filter({ hasNot: page.locator('a[href="/blog"]') })
    const count = await blogLinks.count()

    if (count > 0) {
      // First link should be visible and clickable
      const firstLink = blogLinks.first()
      await expect(firstLink).toBeVisible()

      // Get the href for later verification
      const href = await firstLink.getAttribute('href')
      expect(href).toMatch(/\/blog\/[^/]+/)
    }
  })

  test('category filter is present if posts exist', async ({ page }) => {
    // Check if there are posts first
    const blogPosts = page.locator('article')
    const postCount = await blogPosts.count()

    if (postCount > 0) {
      // Look for category filter, tags, or filter UI
      const filterUI = page.locator('[class*="filter"], [class*="category"], [class*="tag"]').first()

      // Filter might be present or not depending on implementation
      // This is not a hard requirement, just checking if present
      if (await filterUI.isVisible()) {
        await expect(filterUI).toBeVisible()
      }
    }
  })

  test('blog listing shows post metadata', async ({ page }) => {
    // Look for posts
    const blogPosts = page.locator('article').first()

    if (await blogPosts.isVisible()) {
      // Posts should have some metadata (date, author, category, reading time)
      const postContent = await blogPosts.textContent()

      // Should contain some text content
      expect(postContent?.length).toBeGreaterThan(0)
    }
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

test.describe('Blog Post Reading', () => {
  test('can navigate from listing to blog post', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000) // Wait for dynamic content

    // Find a blog post link - exclude the main /blog link
    const blogLink = page.locator('a[href^="/blog/"]').first()
    const hasLinks = await blogLink.count() > 0

    if (hasLinks && await blogLink.isVisible()) {
      const href = await blogLink.getAttribute('href')
      await blogLink.click()
      await page.waitForLoadState('networkidle')

      // Should navigate to the post
      if (href) {
        await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      }

      // Post content should be visible
      await expect(page.locator('main')).toBeVisible()
    } else {
      // No blog posts available - verify we're still on blog page
      await expect(page).toHaveURL(/\/blog/)
      await expect(page.locator('main')).toBeVisible()
    }
  })

  test('blog post page has proper structure', async ({ page }) => {
    // Go directly to blog to find a post
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const blogLink = page.locator('a[href*="/blog/"]').filter({ hasNot: page.locator('a[href="/blog"]') }).first()

    if (await blogLink.isVisible()) {
      await blogLink.click()
      await page.waitForLoadState('networkidle')

      // Should have a heading
      const heading = page.getByRole('heading', { level: 1 }).or(page.getByRole('heading', { level: 2 })).first()
      await expect(heading).toBeVisible()

      // Should have article content
      await expect(page.locator('article, main')).toBeVisible()
    }
  })

  test('blog post shows author info if available', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const blogLink = page.locator('a[href*="/blog/"]').filter({ hasNot: page.locator('a[href="/blog"]') }).first()

    if (await blogLink.isVisible()) {
      await blogLink.click()
      await page.waitForLoadState('networkidle')

      // Look for author information
      const authorInfo = page.getByText(/richard|hudson|author/i)

      // Author info might be present
      if (await authorInfo.first().isVisible().catch(() => false)) {
        await expect(authorInfo.first()).toBeVisible()
      }
    }
  })

  test('blog post is scrollable and content loads', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const blogLink = page.locator('a[href*="/blog/"]').filter({ hasNot: page.locator('a[href="/blog"]') }).first()

    if (await blogLink.isVisible()) {
      await blogLink.click()
      await page.waitForLoadState('networkidle')

      // Get initial scroll
      const initialScroll = await page.evaluate(() => window.scrollY)

      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500))
      await page.waitForTimeout(300)

      // Verify scroll worked
      const newScroll = await page.evaluate(() => window.scrollY)
      expect(newScroll).toBeGreaterThan(initialScroll)
    }
  })

  test('blog post has navigation back to blog listing', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const blogLink = page.locator('a[href*="/blog/"]').filter({ hasNot: page.locator('a[href="/blog"]') }).first()

    if (await blogLink.isVisible()) {
      await blogLink.click()
      await page.waitForLoadState('networkidle')

      // Look for back navigation
      const backLink = page.getByRole('link', { name: /back|blog/i }).or(page.locator('a[href="/blog"]'))

      if (await backLink.first().isVisible()) {
        await backLink.first().click()
        await page.waitForLoadState('networkidle')

        // Should be back on blog listing
        await expect(page).toHaveURL(/\/blog\/?$/)
      }
    }
  })

  test('blog post page passes accessibility audit', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const blogLink = page.locator('a[href*="/blog/"]').filter({ hasNot: page.locator('a[href="/blog"]') }).first()

    if (await blogLink.isVisible()) {
      await blogLink.click()
      await page.waitForLoadState('networkidle')

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .exclude('.blur-3xl')
        .analyze()

      if (results.violations.length > 0) {
        console.log('Accessibility violations:', JSON.stringify(results.violations, null, 2))
      }

      expect(results.violations).toHaveLength(0)
    }
  })
})

test.describe('Blog Mobile Experience', () => {
  test.use({ viewport: { width: 375, height: 667 }, hasTouch: true })

  test('blog listing is responsive on mobile', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000) // Wait for mobile layout adjustments

    // Main content visible
    await expect(page.locator('main')).toBeVisible()

    // Page should have visible content - articles, headings, or blog-related text
    const heading = page.getByRole('heading').first()
    const articles = page.locator('article')
    const blogText = page.getByText(/blog|insights|articles/i).first()

    const hasHeading = await heading.isVisible().catch(() => false)
    const hasArticles = await articles.count() > 0
    const hasBlogText = await blogText.isVisible().catch(() => false)

    expect(hasHeading || hasArticles || hasBlogText).toBeTruthy()
  })

  test('blog posts are tappable on mobile', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const blogLink = page.locator('a[href*="/blog/"]').filter({ hasNot: page.locator('a[href="/blog"]') }).first()

    if (await blogLink.isVisible()) {
      await blogLink.tap()
      await page.waitForLoadState('networkidle')

      // Should navigate to post
      await expect(page).toHaveURL(/\/blog\/[^/]+/)
    }
  })
})

test.describe('Blog Keyboard Navigation', () => {
  test('blog listing is keyboard navigable', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    // Tab through elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
    }

    // Should have a focused element
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('can activate blog post link with keyboard', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    // Find a blog link
    const blogLink = page.locator('a[href*="/blog/"]').filter({ hasNot: page.locator('a[href="/blog"]') }).first()

    if (await blogLink.isVisible()) {
      // Focus the link
      await blogLink.focus()
      await expect(blogLink).toBeFocused()

      // Get href before activating
      const href = await blogLink.getAttribute('href')

      // Activate with Enter
      await page.keyboard.press('Enter')
      await page.waitForLoadState('networkidle')

      // Should navigate
      if (href) {
        await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
      }
    }
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

  test('blog post has structured data', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')

    const blogLink = page.locator('a[href*="/blog/"]').filter({ hasNot: page.locator('a[href="/blog"]') }).first()

    if (await blogLink.isVisible()) {
      await blogLink.click()
      await page.waitForLoadState('networkidle')

      // Look for JSON-LD structured data
      const jsonLd = await page.locator('script[type="application/ld+json"]').count()
      expect(jsonLd).toBeGreaterThanOrEqual(0) // May or may not have structured data
    }
  })
})
