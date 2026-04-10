/**
 * Structured Data / JSON-LD Components
 *
 * SECURITY NOTE: All JSON-LD injection uses safeJsonLdStringify() which escapes
 * </ sequences to prevent </script> breakout attacks. The browser treats
 * <script type="application/ld+json"> content as opaque data, and JSON.stringify
 * does not inject HTML tags, so the XSS risk is minimal. The <\/ replacement is
 * a defense-in-depth measure per OWASP guidelines.
 *
 * The two dangerouslySetInnerHTML usages in blog-post-article.tsx inject
 * DOMPurify-sanitized HTML and are separately mitigated.
 *
 * CSS injection in orbiting-circles.tsx and chart.tsx uses developer-controlled
 * static strings with no user input — no mitigation needed.
 */

import { safeJsonLdStringify } from '@/lib/json-ld-utils';

export { safeJsonLdStringify } from '@/lib/json-ld-utils';

// More specific types for structured data
type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
interface JsonObject extends Record<string, JsonValue> {}
interface JsonArray extends Array<JsonValue> {}

interface StructuredDataProps {
  data: JsonObject;
  nonce?: string | null;
}

export function StructuredData({ data, nonce }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      nonce={nonce ?? undefined}
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(data) }}
    />
  );
}
