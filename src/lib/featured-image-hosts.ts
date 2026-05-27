/**
 * Hosts allowed as `featuredImage`. Kept as a leaf constant (no
 * framework imports) because `featuredImageSchema` lives in
 * `src/lib/schemas.ts`, which is reachable from a `'use client'`
 * boundary (`contact-client.tsx → useContactForm → contactFormSchema`).
 * Earlier versions tried to derive this list at import time from
 * `next.config.js`, which dragged `withSentryConfig` and the entire
 * Sentry build graph into the client bundle.
 *
 * This list MUST match the `images.remotePatterns` array in
 * `next.config.js`. Drift is enforced by a unit test
 * (`src/lib/__tests__/featured-image-hosts.test.ts`).
 */
export const FEATURED_IMAGE_ALLOWED_HOSTS = ['images.unsplash.com'] as const

export type AllowedImageHost = (typeof FEATURED_IMAGE_ALLOWED_HOSTS)[number]
