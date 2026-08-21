// Shared config for the three Sentry runtime entry points. The entry points must
// stay separate, and each must call Sentry.init() ITSELF so it resolves its own
// runtime SDK at bundle time (@sentry/node for server, @sentry/vercel-edge for
// edge, browser for client):
//
//   server  -> sentry.server.config.ts   (loaded by instrumentation.ts register())
//   edge    -> sentry.edge.config.ts     (loaded by instrumentation.ts register())
//   browser -> instrumentation-client.ts (loaded by Next.js directly)
//
// The browser one is NOT `sentry.client.config.ts` — @sentry/nextjs no longer
// auto-loads that filename. See the Sentry section in CLAUDE.md.
//
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

/**
 * Resolve the Sentry `environment` tag.
 *
 * Prefers an explicit override, then Vercel's own `VERCEL_ENV`
 * (`production` | `preview` | `development`), then `NODE_ENV`. Using `VERCEL_ENV`
 * is what keeps preview-deploy noise separable from real production traffic in
 * the Sentry UI — both build with `NODE_ENV=production`, so `NODE_ENV` alone
 * would label them identically.
 */
export const resolveEnvironment = (
  explicit: string | undefined,
  vercelEnv: string | undefined
): string => explicit || vercelEnv || process.env.NODE_ENV || 'development'

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
    environment: resolveEnvironment(process.env.SENTRY_ENVIRONMENT, process.env.VERCEL_ENV),
    // Full tracing — span quota is separate from the error quota, so sampling at
    // 1 cannot cause errors to be dropped. Dial down via env if span volume ever
    // becomes a cost problem.
    tracesSampleRate: parseSampleRate(process.env.SENTRY_TRACES_SAMPLE_RATE, 1),
    // Profiling needs the extra `@sentry/profiling-node` package; left at 0
    // rather than silently no-op'ing.
    profilesSampleRate: parseSampleRate(process.env.SENTRY_PROFILES_SAMPLE_RATE, 0),
    // Structured logs (SDK v10 top-level option, not `_experiments`).
    enableLogs: true,
    sendDefaultPii: process.env.SENTRY_SEND_DEFAULT_PII === 'true',
    ignoreErrors: [...NEXTJS_CONTROL_FLOW_ERRORS],
  }
}
