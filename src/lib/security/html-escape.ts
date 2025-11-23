/**
 * HTML Entity Escaping Utility
 * Prevents XSS attacks by escaping special HTML characters
 * Reference: OWASP - Escaping
 */

/**
 * Escape HTML special characters to prevent XSS attacks
 * @param text - The text to escape
 * @returns Escaped HTML-safe text
 */
export function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }

  return text.replace(/[&<>"'\/]/g, (char) => htmlEscapeMap[char] || char)
}

/**
 * Escape text for use in URLs (encodeURIComponent wrapper)
 * @param url - The URL string to escape
 * @returns URL-encoded string
 */
export function escapeUrl(url: string): string {
  try {
    return encodeURIComponent(url)
  } catch {
    return ''
  }
}

/**
 * Escape text for use in JavaScript strings
 * @param text - The text to escape
 * @returns JavaScript-safe string
 */
export function escapeJavaScript(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
}

/**
 * Escape text for CSS context
 * @param text - The text to escape
 * @returns CSS-safe string
 */
export function escapeCSS(text: string): string {
  return text.replace(/[^a-zA-Z0-9]/g, (char) => {
    const hex = char.charCodeAt(0).toString(16)
    return '\\' + ('000000' + hex).slice(-6)
  })
}

/**
 * Validate if a URL is safe (prevents javascript: and data: protocols)
 * @param url - The URL to validate
 * @returns True if URL is safe, false otherwise
 */
export function isSafeUrl(url: string): boolean {
  const lowerUrl = url.toLowerCase().trim()

  // Block dangerous protocols
  if (lowerUrl.startsWith('javascript:') ||
      lowerUrl.startsWith('data:') ||
      lowerUrl.startsWith('vbscript:')) {
    return false
  }

  return true
}

/**
 * Sanitize a string for use in HTML attributes
 * @param text - The text to sanitize
 * @returns Sanitized text safe for HTML attributes
 */
export function sanitizeAttribute(text: string): string {
  return escapeHtml(text).replace(/"/g, '&quot;')
}
