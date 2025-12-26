/**
 * Server-Side HTML Sanitization Module
 *
 * This module provides comprehensive HTML sanitization for server-side rendering.
 * It uses isomorphic-dompurify for SSR-safe sanitization across all environments.
 *
 * @module sanitize
 * @since 2025
 *
 * ## Security Levels (from most to least permissive)
 *
 * 1. **sanitizeBlogContent** - For trusted CMS/admin-created content
 *    - Allows rich HTML including tables, images, code blocks
 *    - Use for: Blog posts, documentation, admin-created pages
 *
 * 2. **sanitizeUserContent** - For user-submitted content
 *    - Only basic formatting (bold, italic, links, inline code)
 *    - Use for: Comments, user profiles, forum posts
 *
 * 3. **stripHtml** - For plain text only contexts
 *    - Removes ALL HTML, returns plain text
 *    - Use for: Meta descriptions, search indexing, notifications
 *
 * 4. **escapeHtml** - For literal text display
 *    - Converts HTML characters to entities (< becomes &lt;)
 *    - Use for: Displaying code, showing raw input
 *
 * ## Usage Examples
 *
 * ```typescript
 * import { sanitizeBlogContent, sanitizeUserContent, stripHtml, escapeHtml } from '@/lib/security/sanitize'
 *
 * // Blog post from CMS
 * const safeHtml = sanitizeBlogContent(rawBlogContent)
 *
 * // User comment
 * const safeComment = sanitizeUserContent(userInput)
 *
 * // Meta description (no HTML)
 * const metaDesc = stripHtml(postExcerpt)
 *
 * // Display code literally
 * const displayCode = escapeHtml('<script>alert("hi")</script>')
 * // Result: '&lt;script&gt;alert("hi")&lt;/script&gt;'
 * ```
 */
import 'server-only'
import DOMPurify from 'isomorphic-dompurify'

// ============================================================================
// Constants
// ============================================================================

/** Maximum number of results for API pagination */
export const MAX_PAGINATION_LIMIT = 100

/** Default number of results for API pagination */
export const DEFAULT_PAGINATION_LIMIT = 10

// ============================================================================
// Sanitization Configs
// ============================================================================

/**
 * Configuration for blog content sanitization.
 * Allows semantic HTML while removing dangerous content.
 * @internal
 */
const BLOG_CONFIG = {
  ALLOWED_TAGS: [
    // Headings
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    // Paragraphs and blocks
    'p', 'br', 'hr', 'div', 'span',
    // Formatting
    'em', 'strong', 'b', 'i', 'u', 's', 'del', 'ins', 'mark',
    // Code
    'code', 'pre', 'kbd', 'samp', 'var',
    // Links
    'a',
    // Lists
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    // Quotes
    'blockquote', 'q', 'cite',
    // Media
    'img', 'figure', 'figcaption',
    // Tables
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'colgroup', 'col',
    // Semantic
    'section', 'article', 'aside', 'header', 'footer', 'nav',
    'details', 'summary',
    // Misc
    'abbr', 'time', 'sup', 'sub',
  ],
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title',
    'class', 'id', 'name',
    'data-language', 'data-line',
    'target', 'rel',
    'loading', 'decoding',
    'width', 'height',
    'datetime',
    'colspan', 'rowspan', 'scope',
    'open',
  ],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onsubmit'],
}

/**
 * Strict configuration for user-submitted content.
 * Only allows basic formatting - no images, tables, or structural elements.
 * @internal
 */
const USER_INPUT_CONFIG = {
  ALLOWED_TAGS: ['p', 'br', 'em', 'strong', 'b', 'i', 'a', 'code'],
  ALLOWED_ATTR: ['href', 'rel', 'target'],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
}

// ============================================================================
// Sanitization Functions
// ============================================================================

/**
 * Sanitizes blog content HTML while preserving rich formatting.
 *
 * Use this function for content created by trusted sources (CMS, admin users).
 * It allows rich HTML elements like tables, images, and code blocks while
 * blocking XSS vectors like scripts and event handlers.
 *
 * @param html - The raw HTML content to sanitize
 * @returns Sanitized HTML string safe for rendering with dangerouslySetInnerHTML
 *
 * @example
 * ```typescript
 * // In a Server Component
 * const sanitizedContent = sanitizeBlogContent(post.content)
 * return <article dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
 * ```
 *
 * @security
 * - Blocks: script, style, iframe, object, embed, form, input, button tags
 * - Blocks: All event handler attributes (onclick, onerror, etc.)
 * - Allows: Semantic HTML, formatting, tables, images, code blocks
 */
export function sanitizeBlogContent(html: string): string {
  const result = DOMPurify.sanitize(html, BLOG_CONFIG)
  return typeof result === 'string' ? result : String(result)
}

/**
 * Sanitizes user-generated content with strict restrictions.
 *
 * Use this function for content submitted by untrusted users (comments,
 * profile bios, forum posts). Only allows basic text formatting.
 *
 * @param html - The raw HTML/text content to sanitize
 * @returns Sanitized HTML string with only basic formatting preserved
 *
 * @example
 * ```typescript
 * // Sanitize a user comment before storing
 * const safeComment = sanitizeUserContent(userInput)
 * await db.comment.create({ data: { content: safeComment } })
 * ```
 *
 * @security
 * - Only allows: p, br, em, strong, b, i, a, code tags
 * - Only allows: href, rel, target attributes
 * - Blocks: ALL other HTML elements and attributes
 */
export function sanitizeUserContent(html: string): string {
  const result = DOMPurify.sanitize(html, USER_INPUT_CONFIG)
  return typeof result === 'string' ? result : String(result)
}

/**
 * Strips ALL HTML tags, returning only plain text.
 *
 * Use this function when you need text-only output with no HTML allowed,
 * such as meta descriptions, search indexes, or plain text previews.
 *
 * @param html - The HTML content to strip
 * @returns Plain text with all HTML tags removed
 *
 * @example
 * ```typescript
 * // Generate meta description from blog content
 * const metaDescription = stripHtml(post.content).slice(0, 160)
 *
 * // Create search index entry
 * const searchableText = stripHtml(document.body)
 * ```
 */
export function stripHtml(html: string): string {
  const result = DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
  return typeof result === 'string' ? result : String(result)
}

/**
 * Sanitizes a URL to prevent javascript: and data: protocol attacks.
 *
 * Use this function when handling user-provided URLs that will be
 * used in href attributes or redirects.
 *
 * @param url - The URL to sanitize
 * @returns Sanitized URL string, or empty string if URL is dangerous
 *
 * @example
 * ```typescript
 * // Sanitize user-provided link
 * const safeUrl = sanitizeUrl(userProfile.website)
 * if (safeUrl) {
 *   return <a href={safeUrl}>Website</a>
 * }
 * ```
 *
 * @security
 * - Blocks: javascript:, data:, vbscript: protocols
 * - Allows: http:, https:, mailto:, tel:, relative URLs
 */
export function sanitizeUrl(url: string): string {
  const normalizedUrl = url.toLowerCase().trim()

  // Block dangerous protocols
  if (
    normalizedUrl.startsWith('javascript:') ||
    normalizedUrl.startsWith('data:') ||
    normalizedUrl.startsWith('vbscript:')
  ) {
    return ''
  }

  // Use DOMPurify to handle edge cases
  const result = DOMPurify.sanitize(`<a href="${url}"></a>`, {
    ALLOWED_TAGS: ['a'],
    ALLOWED_ATTR: ['href']
  })
  const sanitizedResult = typeof result === 'string' ? result : String(result)
  const match = sanitizedResult.match(/href="([^"]*)"/)
  return match?.[1] || ''
}

/**
 * Applies pagination limits to prevent API abuse.
 *
 * @param requestedLimit - The limit requested by the client
 * @param defaultLimit - Default limit if none specified (default: 10)
 * @param maxLimit - Maximum allowed limit (default: 100)
 * @returns Safe pagination limit within bounds
 *
 * @example
 * ```typescript
 * const limit = applyPaginationLimit(
 *   parseInt(searchParams.get('limit') || '10', 10)
 * )
 * ```
 */
export function applyPaginationLimit(
  requestedLimit: number,
  defaultLimit: number = DEFAULT_PAGINATION_LIMIT,
  maxLimit: number = MAX_PAGINATION_LIMIT
): number {
  if (isNaN(requestedLimit) || requestedLimit < 1) {
    return defaultLimit
  }
  return Math.min(requestedLimit, maxLimit)
}
