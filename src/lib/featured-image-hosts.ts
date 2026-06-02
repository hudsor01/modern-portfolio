/**
 * Hosts allowed as `featuredImage` / `ogImage` / `twitterImage`.
 *
 * Kept as a leaf constant (zero Next.js imports) because this module is
 * pulled in by `src/lib/schemas.ts`, which is reachable from the
 * contact form's `'use client'` boundary. Importing `next.config.js`
 * here instead would drag the `withSentryConfig` wrapper into the
 * client bundle.
 *
 * This list MUST match `images.remotePatterns` in `next.config.js`.
 * Drift is enforced at test time by
 * `src/lib/__tests__/featured-image-hosts.test.ts`, which is the only
 * module that touches `next.config.js` directly.
 */
export const FEATURED_IMAGE_ALLOWED_HOSTS = ['images.unsplash.com'] as const
