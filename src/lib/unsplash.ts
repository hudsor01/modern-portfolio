/**
 * Canonical Unsplash URL builder. Input is the photo's image-host slug
 * — the `1542744173-05336fcc7ad4` portion of
 * `https://images.unsplash.com/photo-1542744173-…`.
 *
 * Two presets cover every current call site:
 *   - 'blog'    → 1200×630 (16:9, OG aspect; blog cards + hero)
 *   - 'project' → 1200×800 (3:2; project cards)
 *
 * Centralising URL construction means bumping the canonical format
 * (add `fm=webp`, swap to retina source, change quality) is a one-line
 * change rather than touching 30+ hand-written URLs across
 * `src/data/`, `drizzle/seed.ts`, and `scripts/`.
 */

const PRESETS = {
  blog: 'w=1200&h=630&fit=crop&q=80',
  project: 'w=1200&h=800&fit=crop&crop=center&q=85',
} as const

export type UnsplashPreset = keyof typeof PRESETS

export function unsplashUrl(photoSlug: string, preset: UnsplashPreset = 'blog'): string {
  return `https://images.unsplash.com/photo-${photoSlug}?${PRESETS[preset]}`
}
