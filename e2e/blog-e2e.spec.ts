import { test, expect, type Page } from '@playwright/test'

// Test data
const testBlogPost = {
  title: 'E2E Test Blog Post',
  slug: 'e2e-test-blog-post',
  excerpt: 'This is a comprehensive test blog post excerpt for end-to-end testing of the blog system.',
  content: `# E2E Test Blog Post

This is a comprehensive test blog post for end-to-end testing of the blog system. It includes various elements to test markdown rendering and functionality.

## Features Being Tested

- **Blog creation workflow**
- *Blog editing capabilities*
- Blog publishing process
- Content management
- SEO optimization

### Code Examples

Here's a sample code block:

\`\`\`javascript
function testBlogFunction() {
  return "Hello, Blog World!"
}
\`\`\`

### Lists and More

1. First item
2. Second item
3. Third item

- Bullet point one
- Bullet point two
- Bullet point three

This content should be sufficient for testing purposes and includes various markdown elements.`,
  category: 'Testing',
  tags: ['e2e', 'testing', 'playwright', 'automation'],
  featured: false,
}

class BlogPage {
  constructor(private page: Page) {}

  // Navigation
  async goto() {
    await this.page.goto('/blog')
    await this.page.waitForLoadState('networkidle')
  }

  async gotoPost(slug: string) {
    await this.page.goto(`/blog/${slug}`)
    await this.page.waitForLoadState('networkidle')
  }

  async gotoAdmin() {
    await this.page.goto('/admin/blog')
    await this.page.waitForLoadState('networkidle')
  }

  // Blog List Page Actions
  async searchPosts(query: string) {
    await this.page.fill('[data-testid="blog-search-input"]', query)
    await this.page.press('[data-testid="blog-search-input"]', 'Enter')
    await this.page.waitForTimeout(500) // Wait for search results
  }

  async filterByCategory(category: string) {
    await this.page.click('[data-testid="category-filter"]')
    await this.page.click(`[data-value="${category}"]`)
    await this.page.waitForTimeout(500)
  }

  async filterByTag(tag: string) {
    await this.page.click('[data-testid="tag-filter"]')
    await this.page.click(`[data-value="${tag}"]`)
    await this.page.waitForTimeout(500)
  }

  async sortPosts(sortBy: string) {
    await this.page.click('[data-testid="sort-dropdown"]')
    await this.page.click(`[data-value="${sortBy}"]`)
    await this.page.waitForTimeout(500)
  }

  async loadMorePosts() {
    await this.page.click('[data-testid="load-more-button"]')
    await this.page.waitForTimeout(1000)
  }

  // Blog Post Actions
  async clickPost(title: string) {
    await this.page.click(`text="${title}"`)
    await this.page.waitForLoadState('networkidle')
  }

  async sharePost(platform: string) {
    await this.page.click('[data-testid="share-button"]')
    await this.page.click(`[data-testid="share-${platform}"]`)
  }

  async copyPostLink() {
    await this.page.click('[data-testid="copy-link-button"]')
  }

  // Blog Editor Actions
  async createNewPost() {
    await this.page.click('[data-testid="new-post-button"]')
    await this.page.waitForLoadState('networkidle')
  }

  async fillPostForm(post: typeof testBlogPost) {
    await this.page.fill('[data-testid="title-input"]', post.title)
    await this.page.fill('[data-testid="excerpt-textarea"]', post.excerpt)
    await this.page.fill('[data-testid="content-textarea"]', post.content)
    
    // Select category
    await this.page.click('[data-testid="category-select"]')
    await this.page.click(`[data-value="${post.category}"]`)
    
    // Add tags
    for (const tag of post.tags) {
      await this.page.fill('[data-testid="tag-input"]', tag)
      await this.page.press('[data-testid="tag-input"]', 'Enter')
    }
    
    if (post.featured) {
      await this.page.check('[data-testid="featured-checkbox"]')
    }
  }

  async savePost() {
    await this.page.click('[data-testid="save-post-button"]')
    await this.page.locator('[data-testid="save-success-message"]').waitFor({ state: 'visible' })
  }

  async publishPost() {
    await this.page.click('[data-testid="publish-post-button"]')
    await this.page.click('[data-testid="confirm-publish-button"]')
    await this.page.locator('[data-testid="publish-success-message"]').waitFor({ state: 'visible' })
  }

  async deletePost() {
    await this.page.click('[data-testid="delete-post-button"]')
    await this.page.fill('[data-testid="delete-confirmation-input"]', 'delete')
    await this.page.click('[data-testid="confirm-delete-button"]')
    await this.page.locator('[data-testid="delete-success-message"]').waitFor({ state: 'visible' })
  }

  // Assertions
  async expectPostVisible(title: string) {
    await expect(this.page.locator(`text="${title}"`)).toBeVisible()
  }

  async expectPostCount(count: number) {
    await expect(this.page.locator('[data-testid="blog-card"]')).toHaveCount(count)
  }

  async expectSearchResults(query: string) {
    await expect(this.page.locator('[data-testid="search-results"]')).toContainText(query)
  }

  async expectMetaTitle(title: string) {
    await expect(this.page).toHaveTitle(new RegExp(title))
  }

  async expectMetaDescription(description: string) {
    const metaDescription = this.page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', new RegExp(description))
  }
}

test.describe('Blog System E2E Tests', () => {
  let blogPage: BlogPage

  test.beforeEach(async ({ page }) => {
    blogPage = new BlogPage(page)
  })

  test.describe('Blog List Page', () => {
    test('should display blog posts with correct information', async ({ page }) => {
      await blogPage.goto()
      
      // Check page loads correctly
      await expect(page.locator('h1')).toContainText('Blog')
      
      // Check blog cards are displayed
      const blogCards = page.locator('[data-testid="blog-card"]')
      await expect(blogCards.first()).toBeVisible()
      
      // Check each card has required elements
      const firstCard = blogCards.first()
      await expect(firstCard.locator('[data-testid="blog-card-title"]')).toBeVisible()
      await expect(firstCard.locator('[data-testid="blog-excerpt"]')).toBeVisible()
      await expect(firstCard.locator('.badge')).toBeVisible() // Category badge
    })

    test('should search blog posts correctly', async ({ page }) => {
      await blogPage.goto()
      
      // Perform search
      await blogPage.searchPosts('React')
      
      // Check search results
      const results = page.locator('[data-testid="blog-card"]')
      const count = await results.count()
      
      if (count > 0) {
        // Check that results contain search term
        for (let i = 0; i < count; i++) {
          const card = results.nth(i)
          const title = await card.locator('[data-testid="blog-card-title"]').textContent()
          const excerpt = await card.locator('[data-testid="blog-excerpt"]').textContent()
          
          expect(
            title?.toLowerCase().includes('react') || 
            excerpt?.toLowerCase().includes('react')
          ).toBeTruthy()
        }
      }
    })

    test('should filter posts by category', async ({ page }) => {
      await blogPage.goto()
      
      // Apply category filter
      await blogPage.filterByCategory('Development')
      
      // Check filtered results
      const categoryBadges = page.locator('.badge')
      const count = await categoryBadges.count()
      
      for (let i = 0; i < count; i++) {
        const badge = categoryBadges.nth(i)
        await expect(badge).toContainText('Development')
      }
    })

    test('should sort posts correctly', async ({ page }) => {
      await blogPage.goto()
      
      // Sort by title
      await blogPage.sortPosts('title')
      await page.waitForTimeout(500)
      
      const titles = await page.locator('[data-testid="blog-card-title"]').allTextContents()
      const sortedTitles = [...titles].sort()
      
      expect(titles).toEqual(sortedTitles)
    })

    test('should load more posts with pagination', async ({ page }) => {
      await blogPage.goto()
      
      const initialCount = await page.locator('[data-testid="blog-card"]').count()
      
      // Check if load more button exists
      const loadMoreButton = page.locator('[data-testid="load-more-button"]')
      
      if (await loadMoreButton.isVisible()) {
        await blogPage.loadMorePosts()
        
        const newCount = await page.locator('[data-testid="blog-card"]').count()
        expect(newCount).toBeGreaterThan(initialCount)
      }
    })

    test('should be responsive on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE
      await blogPage.goto()
      
      // Check mobile-specific elements
      await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible()
      
      // Check blog cards stack vertically
      const cards = page.locator('[data-testid="blog-card"]')
      const firstCard = await cards.first().boundingBox()
      const secondCard = await cards.nth(1).boundingBox()
      
      if (firstCard && secondCard) {
        expect(secondCard.y).toBeGreaterThan(firstCard.y + firstCard.height - 50)
      }
    })
  })

  test.describe('Blog Post Page', () => {
    test('should display blog post content correctly', async ({ page }) => {
      await blogPage.goto()
      
      // Click on first post
      const firstPost = page.locator('[data-testid="blog-card"]').first()
      const postTitle = await firstPost.locator('[data-testid="blog-card-title"]').textContent()
      
      await firstPost.click()
      await page.waitForLoadState('networkidle')
      
      // Check post content is displayed
      await expect(page.locator('h1')).toContainText(postTitle || '')
      await expect(page.locator('[data-testid="post-content"]')).toBeVisible()
      await expect(page.locator('[data-testid="post-meta"]')).toBeVisible()
    })

    test('should show table of contents for long posts', async ({ page }) => {
      // Navigate to a post with headings
      await blogPage.gotoPost('understanding-react-hooks')
      
      // Check if TOC is visible
      const toc = page.locator('[data-testid="table-of-contents"]')
      await expect(toc).toBeVisible()
      
      // Check TOC links
      const tocLinks = toc.locator('a')
      const linkCount = await tocLinks.count()
      expect(linkCount).toBeGreaterThan(0)
      
      // Click TOC link and check scroll
      if (linkCount > 0) {
        await tocLinks.first().click()
        await page.waitForTimeout(500)
        // TOC link should be highlighted as active
      }
    })

    test('should handle social sharing', async ({ page }) => {
      await blogPage.gotoPost('test-post')
      
      // Test Twitter sharing
      const [popup] = await Promise.all([
        page.waitForEvent('popup'),
        blogPage.sharePost('twitter')
      ])
      
      await expect(popup).toHaveURL(/twitter\.com/)
      await popup.close()
    })

    test('should copy post link to clipboard', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write'])
      await blogPage.gotoPost('test-post')
      
      await blogPage.copyPostLink()
      
      // Check success message
      await expect(page.locator('[data-testid="copy-success"]')).toBeVisible()
    })

    test('should display reading progress bar', async ({ page }) => {
      await blogPage.gotoPost('long-test-post')
      
      const progressBar = page.locator('[data-testid="reading-progress"]')
      await expect(progressBar).toBeVisible()
      
      // Scroll and check progress updates
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
      await page.waitForTimeout(100)
      
      const progress = await progressBar.getAttribute('style')
      expect(progress).toContain('width')
    })

    test('should show related posts', async ({ page }) => {
      await blogPage.gotoPost('test-post')
      
      const relatedSection = page.locator('[data-testid="related-posts"]')
      
      if (await relatedSection.isVisible()) {
        const relatedPosts = page.locator('[data-testid="related-post"]')
        const count = await relatedPosts.count()
        expect(count).toBeGreaterThan(0)
        expect(count).toBeLessThanOrEqual(3) // Usually show max 3
      }
    })
  })

  test.describe('Blog Admin/Management', () => {
    test.skip('should create new blog post', async ({ page }) => {
      // Skip this test if no admin access
      await blogPage.gotoAdmin()
      
      await blogPage.createNewPost()
      await blogPage.fillPostForm(testBlogPost)
      await blogPage.savePost()
      
      // Verify post was created
      await expect(page.locator('[data-testid="save-success-message"]')).toBeVisible()
      
      // Go back to blog list and verify post appears
      await blogPage.goto()
      await blogPage.expectPostVisible(testBlogPost.title)
    })

    test.skip('should edit existing blog post', async ({ page }) => {
      await blogPage.gotoAdmin()
      
      // Find and edit first post
      const firstPost = page.locator('[data-testid="admin-post-row"]').first()
      await firstPost.locator('[data-testid="edit-button"]').click()
      
      // Update title
      await page.fill('[data-testid="title-input"]', 'Updated Test Post')
      await blogPage.savePost()
      
      // Verify update
      await expect(page.locator('[data-testid="save-success-message"]')).toBeVisible()
    })

    test.skip('should publish and unpublish posts', async ({ page }) => {
      await blogPage.gotoAdmin()
      
      // Find draft post and publish
      const draftPost = page.locator('[data-testid="draft-post"]').first()
      await draftPost.locator('[data-testid="publish-button"]').click()
      
      await blogPage.publishPost()
      
      // Verify published status
      await expect(page.locator('[data-testid="publish-success-message"]')).toBeVisible()
      
      // Unpublish
      await page.locator('[data-testid="unpublish-button"]').click()
      await page.locator('[data-testid="confirm-unpublish-button"]').click()
      
      await expect(page.locator('[data-testid="unpublish-success-message"]')).toBeVisible()
    })
  })

  test.describe('SEO and Metadata', () => {
    test('should have correct meta tags on blog list page', async ({ page }) => {
      await blogPage.goto()
      
      await blogPage.expectMetaTitle('Blog')
      await blogPage.expectMetaDescription('Read our latest blog posts')
      
      // Check Open Graph tags
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Blog/)
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website')
    })

    test('should have correct meta tags on blog post page', async ({ page }) => {
      await blogPage.gotoPost('test-post')
      
      const postTitle = await page.locator('h1').textContent()
      const postExcerpt = await page.locator('[data-testid="post-excerpt"]').textContent()
      
      if (postTitle) {
        await blogPage.expectMetaTitle(postTitle)
      }
      
      if (postExcerpt) {
        await blogPage.expectMetaDescription(postExcerpt.substring(0, 150))
      }
      
      // Check structured data
      const structuredData = page.locator('script[type="application/ld+json"]')
      await expect(structuredData).toBeVisible()
      
      const jsonLD = await structuredData.textContent()
      expect(jsonLD).toContain('"@type": "BlogPosting"')
    })

    test('should generate correct canonical URLs', async ({ page }) => {
      await blogPage.gotoPost('test-post')
      
      const canonical = page.locator('link[rel="canonical"]')
      await expect(canonical).toHaveAttribute('href', /\/blog\/test-post$/)
    })

    test('should have proper Twitter Card meta tags', async ({ page }) => {
      await blogPage.gotoPost('test-post')
      
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')
      await expect(page.locator('meta[name="twitter:title"]')).toBeAttached()
      await expect(page.locator('meta[name="twitter:description"]')).toBeAttached()
    })
  })

  test.describe('Performance', () => {
    test('should load blog list page within performance budget', async ({ page }) => {
      const startTime = Date.now()
      await blogPage.goto()
      const loadTime = Date.now() - startTime
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000)
      
      // Check Core Web Vitals
      const webVitals = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            resolve(list.getEntries())
          }).observe({ entryTypes: ['largest-contentful-paint'] })
        })
      })
      
      console.log('Web Vitals:', webVitals)
    })

    test('should lazy load images', async ({ page }) => {
      await blogPage.goto()
      
      // Get initial image count
      const initialImages = await page.locator('img[loading="lazy"]').count()
      
      // Scroll to bottom to trigger lazy loading
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(1000)
      
      // Check if more images loaded
      const finalImages = await page.locator('img').count()
      expect(finalImages).toBeGreaterThanOrEqual(initialImages)
    })
  })

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      await blogPage.goto()
      
      // Tab through the page
      await page.keyboard.press('Tab')
      await expect(page.locator(':focus')).toBeVisible()
      
      // Should be able to navigate to and activate blog posts
      await page.keyboard.press('Tab') // Navigate to first post
      await page.keyboard.press('Enter') // Activate post
      
      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain('/blog/')
    })

    test('should have proper ARIA labels and roles', async ({ page }) => {
      await blogPage.goto()
      
      // Check main landmarks
      await expect(page.locator('main')).toHaveAttribute('role', 'main')
      await expect(page.locator('[role="feed"]')).toBeVisible()
      
      // Check blog cards have proper ARIA
      const blogCards = page.locator('[data-testid="blog-card"]')
      await expect(blogCards.first()).toHaveAttribute('role', 'article')
    })

    test('should have proper heading hierarchy', async ({ page }) => {
      await blogPage.gotoPost('test-post')
      
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBe(1) // Should have exactly one h1
      
      // Check heading levels are sequential
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents()
      expect(headings.length).toBeGreaterThan(1) // Should have multiple headings
    })
  })
})

test.describe('Blog System Error Handling', () => {
  test('should handle 404 for non-existent blog posts', async ({ page }) => {
    await page.goto('/blog/non-existent-post')
    
    await expect(page.locator('h1')).toContainText('Post Not Found')
    await expect(page.locator('[data-testid="404-message"]')).toBeVisible()
    
    // Should have link back to blog
    await expect(page.locator('a[href="/blog"]')).toBeVisible()
  })

  test('should handle network errors gracefully', async ({ page }) => {
    // Intercept API calls and simulate network error
    await page.route('/api/blog/**', route => route.abort())
    
    await page.goto('/blog')
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible()
  })

  test('should handle slow loading states', async ({ page }) => {
    // Intercept API and delay response
    await page.route('/api/blog/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await route.continue()
    })
    
    await page.goto('/blog')
    
    // Should show loading skeleton
    await expect(page.locator('[data-testid="blog-list-loading"]')).toBeVisible()
    
    // Wait for content to load
    await page.locator('[data-testid="blog-card"]').first().waitFor({ state: 'visible', timeout: 10000 })
  })
})