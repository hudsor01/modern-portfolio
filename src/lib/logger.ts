/**
 * Production-Ready Logging and Monitoring System
 * Structured logging with different levels, error tracking, and performance monitoring
 */

import type { LogLevel, LogContext, LogEntry, Logger, LogTransport } from '@/types/monitoring'

// Log level priorities for filtering
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
}

// Environment configuration
const LOG_LEVEL =
  (process.env.LOG_LEVEL as LogLevel) || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const IS_BUILD_PHASE = process.env.NEXT_PHASE === 'phase-production-build'

// Shared utility to determine if a log entry should be logged
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[LOG_LEVEL]
}

// Console transport with colored output
class ConsoleTransport implements LogTransport {
  private colors = {
    debug: '\x1b[36m', // Cyan
    info: '\x1b[32m', // Green
    warn: '\x1b[33m', // Yellow
    error: '\x1b[31m', // Red
    fatal: '\x1b[35m', // Magenta
    reset: '\x1b[0m', // Reset
  }

  log(entry: LogEntry): void {
    if (!shouldLog(entry.level) || process.env.NODE_ENV === 'production') return

    const color = this.colors[entry.level]
    const timestamp = new Date(entry.timestamp).toISOString()
    const level = entry.level.toUpperCase().padEnd(5)

    let output = `${color}[${timestamp}] ${level}${this.colors.reset} ${entry.message}`

    if (entry.context && Object.keys(entry.context).length > 0) {
      output += `\n  Context: ${JSON.stringify(entry.context, null, 2)}`
    }

    // ConsoleTransport only runs in non-production (guarded by the production
    // early-return above, and production uses SentryTransport), so always
    // include full error details for debugging. The previous `if (production)`
    // branch here was unreachable dead code, masked by an `as string` cast.
    if (entry.error) {
      output += `\n  Error: ${entry.error.name}: ${entry.error.message}`
      if (entry.error.stack && entry.level === 'error') {
        output += `\n  Stack: ${entry.error.stack}`
      }
    }

    if (entry.performance) {
      output += `\n  Performance: ${entry.performance.duration}ms`
      if (entry.performance.memory) {
        output += ` | Memory: ${Math.round(entry.performance.memory.used / 1024 / 1024)}MB`
      }
    }

    console.log(output)
  }
}

// Sentry transport (production error tracking and breadcrumbs)
class SentryTransport implements LogTransport {
  log(entry: LogEntry): void {
    if (!shouldLog(entry.level)) return

    const Sentry = require('@sentry/nextjs') as typeof import('@sentry/nextjs')

    if (entry.level === 'error' || entry.level === 'fatal') {
      if (entry.error) {
        const err = new Error(entry.error.message)
        err.name = entry.error.name
        if (entry.error.stack) err.stack = entry.error.stack
        Sentry.captureException(err, {
          level: entry.level === 'fatal' ? 'fatal' : 'error',
          extra: { ...entry.context, ...entry.metadata },
        })
      } else {
        Sentry.captureMessage(entry.message, {
          level: entry.level === 'fatal' ? 'fatal' : 'error',
          extra: { ...entry.context, ...entry.metadata },
        })
      }
    } else if (entry.level === 'warn') {
      Sentry.captureMessage(entry.message, {
        level: 'warning',
        extra: { ...entry.context, ...entry.metadata },
      })
    } else {
      // info/debug: breadcrumbs provide context on future error events
      Sentry.addBreadcrumb({
        message: entry.message,
        level: entry.level === 'info' ? 'info' : 'debug',
        data: entry.context,
        timestamp: Date.now() / 1000,
      })
    }
  }
}

// Main logger implementation
class LoggerImpl implements Logger {
  private transports: LogTransport[]
  private baseContext: LogContext

  constructor(transports: LogTransport[], baseContext: LogContext = {}) {
    this.transports = transports
    this.baseContext = baseContext
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context)
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.log('error', message, context, error)
  }

  fatal(message: string, error?: Error, context?: LogContext): void {
    this.log('fatal', message, context, error)
  }

  performance(operation: string, duration: number, context?: LogContext): void {
    this.log(
      'info',
      `Performance: ${operation}`,
      {
        ...context,
        operation,
      },
      undefined,
      {
        duration,
        memory: this.getMemoryUsage(),
      }
    )
  }

  request(requestInfo: LogEntry['request'], context?: LogContext): void {
    this.log(
      'info',
      `Request: ${requestInfo?.method} ${requestInfo?.url}`,
      context,
      undefined,
      undefined,
      requestInfo
    )
  }

  security(event: string, context?: LogContext): void {
    this.log('warn', `Security Event: ${event}`, {
      ...context,
      securityEvent: event,
      timestamp: Date.now(),
    })
  }

  child(baseContext: LogContext): Logger {
    return new LoggerImpl(this.transports, {
      ...this.baseContext,
      ...baseContext,
    })
  }

  startTimer(operation: string): () => void {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      this.performance(operation, duration)
    }
  }

  // Cleanup transports that implement Disposable
  destroy(): void {
    for (const transport of this.transports) {
      if (Symbol.dispose in transport) {
        ;(transport as Disposable)[Symbol.dispose]()
      }
    }
  }

  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error,
    performanceData?: LogEntry['performance'],
    requestData?: LogEntry['request']
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: {
        ...this.baseContext,
        ...context,
      },
      metadata: {
        buildId: process.env.NEXT_BUILD_ID,
        version: process.env.bun_package_version,
        environment: process.env.NODE_ENV || 'development',
      },
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      }
    }

    if (performanceData) {
      entry.performance = performanceData
    }

    if (requestData) {
      entry.request = requestData
    }

    // Send to all transports
    this.transports.forEach((transport) => {
      try {
        transport.log(entry)
      } catch (err) {
        console.error('Logger transport error:', err)
      }
    })
  }

  private getMemoryUsage(): { used: number; total: number } {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage()
      return {
        used: usage.heapUsed,
        total: usage.heapTotal,
      }
    }
    return { used: 0, total: 0 }
  }
}

// Create logger instance with appropriate transports
function createLogger(): Logger {
  const transports: LogTransport[] = []

  if (IS_BUILD_PHASE) {
    // During build, no transports — real errors throw and Next.js reports them
  } else if (IS_PRODUCTION) {
    // In production, route errors/warnings to Sentry, info/debug as breadcrumbs.
    // (Sentry is the production log sink; there is no file transport — the old
    // FileTransport silently discarded everything it buffered. See #149.)
    transports.push(new SentryTransport())
  } else {
    // In development, use colored console output
    transports.push(new ConsoleTransport())
  }

  return new LoggerImpl(transports)
}

// Export singleton instance
export const logger = createLogger()

/**
 * Context-specific logger factory
 * Creates a logger with a fixed context name for better log organization
 */
export function createContextLogger(context: string) {
  return {
    debug: (message: string, data?: LogContext) => logger.debug(message, { ...data, context }),
    info: (message: string, data?: LogContext) => logger.info(message, { ...data, context }),
    warn: (message: string, data?: LogContext) => logger.warn(message, { ...data, context }),
    error: (message: string, error?: Error | LogContext, data?: LogContext) => {
      if (error instanceof Error) {
        logger.error(message, error, { ...data, context })
      } else {
        logger.error(message, undefined, { ...error, ...data, context })
      }
    },
  }
}
