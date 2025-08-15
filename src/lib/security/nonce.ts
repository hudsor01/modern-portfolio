/**
 * Nonce Generation for Content Security Policy
 * Provides cryptographically secure nonces for inline scripts and styles
 * Edge Runtime compatible using Web Crypto API
 */

/**
 * Generate a cryptographically secure nonce using Web Crypto API
 * Compatible with Edge Runtime
 */
export function generateNonce(): string {
  // Use Web Crypto API which is available in Edge Runtime
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  
  // Convert to base64
  return btoa(String.fromCharCode(...array))
}

/**
 * Nonce context for React components
 */
export interface NonceContext {
  scriptNonce: string
  styleNonce: string
}

/**
 * Generate nonce context for a request
 */
export function generateNonceContext(): NonceContext {
  return {
    scriptNonce: generateNonce(),
    styleNonce: generateNonce(),
  }
}

/**
 * CSP directive builder with nonces
 */
export function buildCSPDirective(nonces: NonceContext): string {
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonces.scriptNonce}' https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com`,
    `style-src 'self' 'nonce-${nonces.styleNonce}' https://fonts.googleapis.com`,
    "img-src 'self' data: blob: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ]
  
  return directives.join('; ')
}

/**
 * Get nonce from headers (for client-side usage)
 */
export function getNonceFromHeaders(): NonceContext | null {
  if (typeof document === 'undefined') return null
  
  const metaScript = document.querySelector('meta[name="script-nonce"]')
  const metaStyle = document.querySelector('meta[name="style-nonce"]')
  
  if (!metaScript || !metaStyle) return null
  
  return {
    scriptNonce: metaScript.getAttribute('content') || '',
    styleNonce: metaStyle.getAttribute('content') || '',
  }
}