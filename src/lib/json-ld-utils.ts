/**
 * JSON-LD Serialization Utilities
 *
 * SECURITY NOTE: All JSON-LD injection uses safeJsonLdStringify() which escapes
 * </ sequences to prevent </script> breakout attacks. The browser treats
 * <script type="application/ld+json"> content as opaque data, and JSON.stringify
 * does not inject HTML tags, so the XSS risk is minimal. The <\/ replacement is
 * a defense-in-depth measure per OWASP guidelines.
 */

/**
 * Safe JSON-LD serialization that prevents </script> breakout attacks.
 * Replaces </ with <\/ per OWASP XSS Prevention Cheat Sheet.
 *
 * Can be used in both server components and client components.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeJsonLdStringify(data: Record<string, any>): string {
  return JSON.stringify(data).replace(/<\//g, '<\\/')
}
