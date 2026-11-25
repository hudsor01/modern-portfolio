import { brandTitle, stripBrandSuffix } from '@/app/shared-metadata'

/**
 * Roughly what Google shows of a title before truncating (it measures pixels,
 * ~600px, which is about 60 characters of mixed-case text).
 */
export const TITLE_BUDGET = 60

/**
 * The `<title>` segment for a blog post; the root template appends the brand.
 *
 * The pipeline's `metaTitle` is preferred. When it plus " | Richard Hudson"
 * runs past the budget, the post's own title is used instead if its branded
 * form is shorter, so search results show a whole title rather than a cut one.
 * If neither fits, the SEO title stays (Google then trims the brand).
 */
export function postDocumentTitle(metaTitle: string | null | undefined, title: string): string {
  const plain = stripBrandSuffix(title)
  const seo = stripBrandSuffix(metaTitle || '') || plain || 'Blog'
  if (brandTitle(seo).length <= TITLE_BUDGET) return seo
  if (plain && brandTitle(plain).length < brandTitle(seo).length) return plain
  return seo
}
