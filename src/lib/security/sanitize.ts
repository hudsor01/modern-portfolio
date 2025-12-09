/**
 * Server-Side HTML Sanitization
 * Uses isomorphic-dompurify for SSR-safe sanitization
 *
 * This module MUST be used for any user-generated or external content
 * that will be rendered as HTML.
 */
import 'server-only'
import DOMPurify from 'isomorphic-dompurify'

// ============================================================================
// Sanitization Configs
// ============================================================================

/**
 * Configuration for blog content sanitization
 * Allows semantic HTML while removing dangerous content
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
 * Strict configuration for user comments/input
 * Only allows basic formatting
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
 * Sanitize blog content HTML
 * Allows rich formatting while blocking XSS vectors
 */
export function sanitizeBlogContent(html: string): string {
  const result = DOMPurify.sanitize(html, BLOG_CONFIG)
  return typeof result === 'string' ? result : String(result)
}

/**
 * Sanitize user-generated content
 * More restrictive than blog content
 */
export function sanitizeUserContent(html: string): string {
  const result = DOMPurify.sanitize(html, USER_INPUT_CONFIG)
  return typeof result === 'string' ? result : String(result)
}

/**
 * Strip ALL HTML tags, leaving only text
 * Use for plain text outputs like meta descriptions
 */
export function stripHtml(html: string): string {
  const result = DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
  return typeof result === 'string' ? result : String(result)
}

/**
 * Sanitize URL to prevent javascript: and data: URLs
 */
export function sanitizeUrl(url: string): string {
  // Check for dangerous protocols
  const normalizedUrl = url.toLowerCase().trim()
  if (
    normalizedUrl.startsWith('javascript:') ||
    normalizedUrl.startsWith('data:') ||
    normalizedUrl.startsWith('vbscript:')
  ) {
    return ''
  }

  // Let DOMPurify handle remaining sanitization
  const result = DOMPurify.sanitize(`<a href="${url}"></a>`, { ALLOWED_TAGS: ['a'], ALLOWED_ATTR: ['href'] })
  const sanitizedResult = typeof result === 'string' ? result : String(result)
  const match = sanitizedResult.match(/href="([^"]*)"/)
  return match?.[1] || ''
}

/**
 * Escape HTML entities for safe display
 * Does NOT allow any HTML - converts < to &lt; etc.
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
