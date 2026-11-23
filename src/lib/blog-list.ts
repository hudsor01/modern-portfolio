/**
 * Pure helpers for blog list cards: chip label fallback and cover
 * de-duplication. No DB access, no randomness, no dates.
 */

export const DEFAULT_CHIP_LABEL = 'Revenue Operations'

/** Chip text: category, else first tag, else the default label. */
export function getCategoryChipLabel(post: {
  categoryName: string | null
  tags: ReadonlyArray<{ name: string }>
}): string {
  return post.categoryName || post.tags[0]?.name || DEFAULT_CHIP_LABEL
}

/** Relative /api/og URL; same encoding as BlogFeaturedImage's fallback. */
export function buildOgCoverUrl(title: string, category: string): string {
  return `/api/og?${new URLSearchParams({ title, category }).toString()}`
}

/**
 * Identity of a cover image: host + path, ignoring the query string. The
 * publishing pipeline reuses one Unsplash photo with different `sig`/size
 * params, so full-URL equality would miss visible duplicates.
 */
function coverKey(url: string): string {
  try {
    const parsed = new URL(url, 'https://cover.invalid')
    return `${parsed.host}${parsed.pathname}`
  } catch {
    return url
  }
}

/**
 * Second and later posts sharing a cover image get a deterministic /api/og
 * cover. Returns a new array; replaced entries are new objects.
 */
export function resolveListCovers<T extends { title: string; featuredImage: string | null }>(
  posts: readonly T[],
  categoryOf: (post: T) => string
): T[] {
  const seen = new Set<string>()
  return posts.map((post) => {
    const url = post.featuredImage
    if (url === null) return post
    const key = coverKey(url)
    if (!seen.has(key)) {
      seen.add(key)
      return post
    }
    return { ...post, featuredImage: buildOgCoverUrl(post.title, categoryOf(post)) }
  })
}
