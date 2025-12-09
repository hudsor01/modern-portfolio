/**
 * Client-Safe HTML Sanitization
 * For use in Client Components where server-only can't be imported
 */
'use client'

import DOMPurify from 'isomorphic-dompurify'

// ============================================================================
// Client-Side Sanitization Config
// ============================================================================

const BLOG_SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'em', 'strong', 'b', 'i', 'u', 's', 'del', 'ins',
    'a', 'code', 'pre', 'kbd', 'samp', 'var',
    'blockquote', 'q', 'cite',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'colgroup', 'col',
    'div', 'span', 'section', 'article', 'aside', 'header', 'footer', 'nav',
    'details', 'summary',
    'abbr', 'mark', 'time', 'sup', 'sub',
  ],
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title',
    'class', 'id', 'name',
    'data-language',
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
 * Sanitize HTML content for blog posts (client-side)
 * This runs in both SSR and client thanks to isomorphic-dompurify
 */
export function sanitizeBlogHtml(html: string): string {
  const result = DOMPurify.sanitize(html, BLOG_SANITIZE_CONFIG)
  return typeof result === 'string' ? result : String(result)
}

/**
 * Strip all HTML and return plain text
 */
export function stripAllHtml(html: string): string {
  const result = DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
  return typeof result === 'string' ? result : String(result)
}
