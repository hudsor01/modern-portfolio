'use client'

/**
 * Client-Safe HTML Sanitization
 * Used in Client Components to avoid Vercel serverless costs
 * For use in Client Components only - do NOT import in Server Components
 */

import DOMPurify from 'isomorphic-dompurify'

// ============================================================================
// Configs
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

// ============================================================================
// Sanitization Functions
// ============================================================================

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"'/]/g, (char) => {
    switch (char) {
      case '&': return '&'
      case '<': return '<'
      case '>': return '>'
      case '"': return '"'
      case "'": return '&#x27;'
      case '/': return '&#x2F;'
      default: return char
    }
  })
}

export function sanitizeBlogHtml(html: string): string {
  const result = DOMPurify.sanitize(html, BLOG_SANITIZE_CONFIG)
  return typeof result === 'string' ? result : String(result)
}

export function stripHtml(html: string): string {
  const result = DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
  return typeof result === 'string' ? result : String(result)
}

export function isSafeUrl(url: string): boolean {
  const lowerUrl = url.toLowerCase().trim()
  if (
    lowerUrl.startsWith('javascript:') ||
    lowerUrl.startsWith('data:') ||
    lowerUrl.startsWith('vbscript:')
  ) {
    return false
  }
  return true
}

export function sanitizeAttribute(text: string): string {
  return escapeHtml(text).replace(/"/g, '"')
}
