/**
 * Input and HTML sanitization utilities
 * Security-focused content cleaning
 */

/** Maximum length for user input fields */
const MAX_USER_INPUT_LENGTH = 10000

/** Maximum length for HTML content */
const MAX_HTML_CONTENT_LENGTH = 50000

/** Patterns for dangerous content that should be removed */
const DANGEROUS_PATTERNS = {
  scripts: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  iframes: /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  forms: /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
  objects: /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  embeds: /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  meta: /<meta[^>]*>/gi,
  javascript: /javascript:/gi,
  vbscript: /vbscript:/gi,
  dataUri: /data:/gi,
  eventHandlers: /on\w+="[^"]*"/gi,
}

/**
 * Sanitize user input by removing potentially dangerous content
 * Removes scripts, event handlers, and limits length
 */
export function sanitizeUserInput(input: string): string {
  return input
    .trim()
    .replace(DANGEROUS_PATTERNS.scripts, '')
    .replace(DANGEROUS_PATTERNS.javascript, '')
    .replace(DANGEROUS_PATTERNS.vbscript, '')
    .replace(DANGEROUS_PATTERNS.dataUri, '')
    .replace(DANGEROUS_PATTERNS.eventHandlers, '')
    .replace(DANGEROUS_PATTERNS.iframes, '')
    .replace(DANGEROUS_PATTERNS.forms, '')
    .substring(0, MAX_USER_INPUT_LENGTH)
}

/**
 * Sanitize HTML content by removing dangerous elements
 * Allows basic HTML but removes scripts, iframes, and executable content
 */
export function sanitizeHtml(html: string): string {
  return html
    .substring(0, MAX_HTML_CONTENT_LENGTH)
    .replace(DANGEROUS_PATTERNS.scripts, '')
    .replace(DANGEROUS_PATTERNS.iframes, '')
    .replace(DANGEROUS_PATTERNS.meta, '')
    .replace(DANGEROUS_PATTERNS.objects, '')
    .replace(DANGEROUS_PATTERNS.embeds, '')
}
