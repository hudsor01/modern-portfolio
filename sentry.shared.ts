// Shared helpers for the three Sentry runtime configs. The config FILES must
// stay separate — @sentry/nextjs loads sentry.{server,client,edge}.config.ts as
// distinct per-runtime instrumentation entry points, and each must call
// Sentry.init() itself — but these pure, runtime-agnostic helpers need not be
// triplicated. Keep this module free of Node/browser/edge-specific APIs so it
// imports cleanly into all three runtimes.

/**
 * Parse a 0–1 sample-rate env var: clamp to [0,1], fall back when unset/NaN.
 */
export const parseSampleRate = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback

  const parsed = Number.parseFloat(value)
  if (Number.isNaN(parsed)) return fallback

  return Math.min(1, Math.max(0, parsed))
}

/**
 * Next.js throws sentinels for redirect()/notFound()/HTTP-error control flow.
 * These are not bugs and would otherwise drown real errors. Shared by the
 * server + edge configs; the client config ignores its own browser-specific
 * subset inline.
 */
export const NEXTJS_CONTROL_FLOW_ERRORS = [
  /^NEXT_REDIRECT/,
  /^NEXT_NOT_FOUND$/,
  /^NEXT_HTTP_ERROR_FALLBACK$/,
]
