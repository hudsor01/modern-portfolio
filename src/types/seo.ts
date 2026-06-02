/**
 * SEO Types
 * Contains all SEO-related interfaces consolidated from across the application
 */

/**
 * Site configuration for SEO
 */
// Note: `url` / `author.url` deliberately omitted — site origin is owned
// by `SITE_ORIGIN` in `src/lib/absolute-url.ts` (pinned to prod for
// canonical correctness). Two sources for the same URL is drift bait:
// the 2026-05-07 incident was exactly an env-aware `siteConfig.url`
// falling back to localhost on a preview deploy and leaking into JSON-LD.
// Import `SITE_ORIGIN` directly in any code that needs the prod URL.
export interface SiteConfig {
  name: string
  description: string
  links: {
    github: string
    linkedin: string
    twitter?: string
  }
  author: {
    name: string
    email: string
  }
}
