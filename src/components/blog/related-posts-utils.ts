export interface RelatedPostInput {
  slug: string
  title: string
  tags: string[]
  publishedAt: string
}

/**
 * Select up to `limit` related posts:
 *   1. Posts sharing at least one tag with `current`, sorted by tag-overlap count desc
 *   2. Tiebreak by most-recent publishedAt
 *   3. Fall back to most-recent posts (without tag overlap) to fill remaining slots
 * Always excludes `current` itself.
 */
export function selectRelatedPosts<T extends RelatedPostInput>(
  all: T[],
  current: T,
  limit: number
): T[] {
  const others = all.filter((p) => p.slug !== current.slug)
  const currentTags = new Set(current.tags)
  const tagged = others
    .map((p) => ({
      post: p,
      overlap: p.tags.filter((t) => currentTags.has(t)).length,
    }))
    .filter((x) => x.overlap > 0)
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap
      return new Date(b.post.publishedAt).getTime() - new Date(a.post.publishedAt).getTime()
    })
    .slice(0, limit)
    .map((x) => x.post)

  if (tagged.length >= limit) return tagged

  const taggedSlugs = new Set(tagged.map((p) => p.slug))
  const fallback = others
    .filter((p) => !taggedSlugs.has(p.slug))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit - tagged.length)

  return [...tagged, ...fallback]
}
