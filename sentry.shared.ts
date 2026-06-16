// Shared config for the three Sentry runtime entry points. The config FILES
// must stay separate — @sentry/nextjs loads sentry.{server,client,edge}.config.ts
// as distinct per-runtime instrumentation entry points, and each must call
// Sentry.init() ITSELF so it resolves its own runtime SDK at bundle time
// (@sentry/node for server, @sentry/vercel-edge for edge, browser for client).
// This module therefore holds NO `@sentry/*` import and no Node/browser/edge
// API, so all three runtimes — including the client bundle — import it safely;
// it only supplies pure helpers and a plain options object.

/**
 * Parse a 0–1 sample-rate env var: clamp to [0,1], fall back when unset/NaN.
 */
export const parseSampleRate = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback

  const parsed = Number.parseFloat(value)
  if (Number.isNaN(parsed)) return fallback

  return Math.min(1, Math.max(0, parsed))
}

// Next.js throws sentinels for redirect()/notFound()/HTTP-error control flow.
// These are not bugs and would otherwise drown real errors. Server + edge share
// this set; the client config ignores its own browser-specific subset inline.
const NEXTJS_CONTROL_FLOW_ERRORS = [
  /^NEXT_REDIRECT/,
  /^NEXT_NOT_FOUND$/,
  /^NEXT_HTTP_ERROR_FALLBACK$/,
]

/**
 * Sentry.init options shared verbatim by the server and edge runtimes (same
 * config, different SDK). Returned as a plain object so each config file calls
 * `Sentry.init(serverRuntimeSentryOptions())` itself — keeping the
 * @sentry/nextjs import, and thus the runtime SDK resolution, in the per-runtime
 * entry point rather than in this shared module.
 */
export const serverRuntimeSentryOptions = () => {
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

  return {
    dsn,
    enabled: Boolean(dsn) && process.env.NODE_ENV !== 'test',
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    tracesSampleRate: parseSampleRate(
      process.env.SENTRY_TRACES_SAMPLE_RATE,
      process.env.NODE_ENV === 'production' ? 0.1 : 1
    ),
    profilesSampleRate: parseSampleRate(process.env.SENTRY_PROFILES_SAMPLE_RATE, 0),
    sendDefaultPii: process.env.SENTRY_SEND_DEFAULT_PII === 'true',
    ignoreErrors: [...NEXTJS_CONTROL_FLOW_ERRORS],
  }
}
