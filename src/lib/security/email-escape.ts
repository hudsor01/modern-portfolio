/**
 * Server-Side Email Escaping
 * For email template composition only - NOT for general HTML rendering
 * This file runs on server (email sending), not rendered in browser
 */

import 'server-only'

/**
 * Escape HTML special characters for email templates
 * Email templates are rendered on server and sent via API - no XSS risk to users
 */
export function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#x27;',
    '/': '&#x2F;',
  }

  return text.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char)
}
