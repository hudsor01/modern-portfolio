import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

const parseSampleRate = (value: string | undefined, fallback: number) => {
  if (!value) return fallback

  const parsed = Number.parseFloat(value)
  if (Number.isNaN(parsed)) return fallback

  return Math.min(1, Math.max(0, parsed))
}

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
})
