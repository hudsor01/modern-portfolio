import * as Sentry from '@sentry/nextjs'
import { parseSampleRate } from './sentry.shared'

// Browser-side Sentry init. This MUST live here, not in a `sentry.client.config.ts`
// — @sentry/nextjs stopped auto-loading that file, so a config left there is dead
// code and the browser SDK never initialises (server/edge still work, which makes
// the breakage easy to miss). Verified by grepping `.next/static` for the DSN.
// Ref: https://docs.sentry.io/platforms/javascript/guides/nextjs/

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

const tracesSampleRate = parseSampleRate(
  process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE,
  process.env.NODE_ENV === 'production' ? 0.1 : 1
)

const profilesSampleRate = parseSampleRate(
  process.env.NEXT_PUBLIC_SENTRY_PROFILES_SAMPLE_RATE,
  0
)

const replaysSessionSampleRate = parseSampleRate(
  process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE,
  0
)

const replaysOnErrorSampleRate = parseSampleRate(
  process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE,
  0
)

const enableReplay = replaysSessionSampleRate > 0 || replaysOnErrorSampleRate > 0

Sentry.init({
  dsn,
  enabled: Boolean(dsn) && process.env.NODE_ENV !== 'test',
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  tracesSampleRate,
  profilesSampleRate,
  replaysSessionSampleRate,
  replaysOnErrorSampleRate,
  integrations: enableReplay
    ? (integrations) => [...integrations, Sentry.replayIntegration()]
    : undefined,
  sendDefaultPii: process.env.NEXT_PUBLIC_SENTRY_SEND_DEFAULT_PII === 'true',
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

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
