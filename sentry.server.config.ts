import * as Sentry from '@sentry/nextjs'
import { NEXTJS_CONTROL_FLOW_ERRORS, parseSampleRate } from './sentry.shared'

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

const tracesSampleRate = parseSampleRate(
  process.env.SENTRY_TRACES_SAMPLE_RATE,
  process.env.NODE_ENV === 'production' ? 0.1 : 1
)

const profilesSampleRate = parseSampleRate(process.env.SENTRY_PROFILES_SAMPLE_RATE, 0)

Sentry.init({
  dsn,
  enabled: Boolean(dsn) && process.env.NODE_ENV !== 'test',
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  tracesSampleRate,
  profilesSampleRate,
  sendDefaultPii: process.env.SENTRY_SEND_DEFAULT_PII === 'true',
  ignoreErrors: [...NEXTJS_CONTROL_FLOW_ERRORS],
})
