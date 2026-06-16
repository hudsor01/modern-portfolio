import * as Sentry from '@sentry/nextjs'
import { serverRuntimeSentryOptions } from './sentry.shared'

Sentry.init(serverRuntimeSentryOptions())
