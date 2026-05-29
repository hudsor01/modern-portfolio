/**
 * Shared JSON-LD <script> wrapper
 *
 * Encapsulates the single dangerouslySetInnerHTML usage so that SAST scanners
 * only need to flag this one file, and all consumers inherit the same
 * defense-in-depth guarantees from safeJsonLdStringify.
 */

import { safeJsonLdStringify } from '@/lib/json-ld-utils'

interface JsonLdScriptProps {
  json: Record<string, unknown>
  nonce?: string | null
}

export function JsonLdScript({ json, nonce }: JsonLdScriptProps) {
  return (
    <script
      type="application/ld+json"
      nonce={nonce ?? undefined}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: server-generated JSON-LD escaped by safeJsonLdStringify (</script breakout prevented); Next.js official JSON-LD pattern, no user input
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(json) }}
    />
  )
}
