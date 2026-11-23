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
 * Second and later posts sharing a cover URL get a deterministic /api/og
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
    if (!seen.has(url)) {
      seen.add(url)
      return post
    }
    return { ...post, featuredImage: buildOgCoverUrl(post.title, categoryOf(post)) }
  })
}
