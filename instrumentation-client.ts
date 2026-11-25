import * as Sentry from '@sentry/nextjs'
import { scheduleReplayLoad, shouldLoadReplay } from '@/lib/sentry-lazy-replay'
import { parseSampleRate, resolveDataCollection, resolveEnvironment } from './sentry.shared'

// Browser-side Sentry init. This MUST live here, not in a `sentry.client.config.ts`
// — @sentry/nextjs stopped auto-loading that file, so a config left there is dead
// code and the browser SDK never initialises (server/edge still work, which makes
// the breakage easy to miss). Verified by grepping `.next/static` for the DSN.
// Ref: https://docs.sentry.io/platforms/javascript/guides/nextjs/

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

// Full tracing. This is a low-traffic site, and span quota is separate from the
// error quota — so sampling at 1 cannot cause errors to be dropped. Dial down via
// env if span volume ever becomes a cost problem.
const tracesSampleRate = parseSampleRate(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE, 1)

// Session Replay quota is consumed per replay, and once it is exhausted Sentry
// drops NEW replays — including the ones attached to errors. Sampling random
// uneventful sessions therefore trades away error-replay coverage, so the default
// is "a replay for every error, none otherwise". Raise the session rate only if
// you want replay for UX research rather than debugging.
//
// The Replay integration is NOT part of Sentry.init: it is added after the load
// event once the browser is idle (<= 2 s), from a same-origin chunk, so it stays
// out of the first-load JS. See src/lib/sentry-lazy-replay.ts.
const replaysSessionSampleRate = parseSampleRate(
  process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE,
  0
)

const replaysOnErrorSampleRate = parseSampleRate(
  process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE,
  1
)

Sentry.init({
  dsn,
  enabled: Boolean(dsn) && process.env.NODE_ENV !== 'test',
  environment: resolveEnvironment(
    process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
    process.env.NEXT_PUBLIC_VERCEL_ENV
  ),
  tracesSampleRate,
  replaysSessionSampleRate,
  replaysOnErrorSampleRate,
  // Structured logs need no option since SDK v11 (`enableLogs` was removed):
  // adding `consoleLoggingIntegration` below is what turns them on.
  integrations: (integrations) => [
    ...integrations,
    // Forward console output as structured, searchable logs. `debug`/`info` are
    // deliberately excluded — they are dev noise and would dominate the stream.
    Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
  ],
  dataCollection: resolveDataCollection(process.env.NEXT_PUBLIC_SENTRY_SEND_DEFAULT_PII),
  ignoreErrors: [
    // Browser benign noise
    /^ResizeObserver loop limit exceeded$/,
    /^ResizeObserver loop completed with undelivered notifications/,
    'Non-Error promise rejection captured',
    'AbortError',
    // Next.js client-side control flow
    /^NEXT_REDIRECT/,
    /^NEXT_NOT_FOUND$/,
  ],
})

if (
  shouldLoadReplay({
    dsn,
    nodeEnv: process.env.NODE_ENV,
    sessionRate: replaysSessionSampleRate,
    onErrorRate: replaysOnErrorSampleRate,
  })
) {
  scheduleReplayLoad()
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
