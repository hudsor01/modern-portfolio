/**
 * Shared interaction tracking utilities
 * Used by both blog and project interaction endpoints
 */

/**
 * Generate a unique visitor ID from IP address and user agent
 * Uses SHA-256 hash for privacy
 */
export async function generateVisitorId(ip: string, userAgent: string): Promise<string> {
  const data = `${ip}-${userAgent}`
  const encoder = new TextEncoder()
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data))
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .substring(0, 16)
}
