import type { Locator, Page } from '@playwright/test'

/**
 * The post cards on a blog listing: each is a link to `/blog/<slug>` wrapping
 * the post's `<h2>` title (src/app/blog/_components/blog-list.tsx).
 *
 * A bare `a[href*="/blog/"]` is not a substitute. It also matches the footer's
 * hard-coded post and category links (src/components/layout/footer.tsx), so
 * with no database it walked tests onto pages that error, and they still
 * passed because their assertions sat behind `if (await link.isVisible())`.
 */
export function postCards(page: Page): Locator {
  return page
    .locator('main a[href^="/blog/"]')
    .filter({ has: page.getByRole('heading', { level: 2 }) })
}
