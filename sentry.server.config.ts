import * as Sentry from '@sentry/nextjs'
import { serverRuntimeSentryOptions } from './sentry.shared'

Sentry.init({
  ...serverRuntimeSentryOptions(),
  // Console forwarding must be wired per-runtime: it needs the `Sentry` import,
  // which sentry.shared.ts deliberately does not carry (see its header).
  integrations: [Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] })],
})
