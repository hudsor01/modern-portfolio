/**
 * Logger service for structured logging
 * Replaces all console.log, console.error, console.warn statements
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: string
  data?: Record<string, any>
  stack?: string
}

class Logger {
  private isDevelopment: boolean
  private logs: LogEntry[] = []

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  /**
   * Format timestamp in ISO format
   */
  private getTimestamp(): string {
    return new Date().toISOString()
  }

  /**
   * Create a log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: string,
    data?: Record<string, any>,
    stack?: string
  ): LogEntry {
    return {
      level,
      message,
      timestamp: this.getTimestamp(),
      context,
      data,
      stack,
    }
  }

  /**
   * Output log to console (only in development)
   */
  private outputToConsole(entry: LogEntry): void {
    if (!this.isDevelopment) return

    const { level, message, context, data, stack } = entry
    const prefix = context ? `[${context}]` : ''
    const timestamp = entry.timestamp

    switch (level) {
      case 'debug':
        console.debug(`${timestamp} ${prefix} ${message}`, data || '')
        break
      case 'info':
        console.info(`${timestamp} ${prefix} ${message}`, data || '')
        break
      case 'warn':
        console.warn(`${timestamp} ${prefix} ${message}`, data || '')
        if (stack) console.warn(stack)
        break
      case 'error':
        console.error(`${timestamp} ${prefix} ${message}`, data || '')
        if (stack) console.error(stack)
        break
    }
  }

  /**
   * Store log entry
   */
  private storeLogEntry(entry: LogEntry): void {
    this.logs.push(entry)

    // Keep only last 100 logs in memory
    if (this.logs.length > 100) {
      this.logs.shift()
    }
  }

  /**
   * Send log to external service (e.g., Sentry, LogRocket, CloudWatch)
   *
   * DEFERRED: External logging integration
   * This feature is ready for implementation but deferred to Phase 4+
   * To implement:
   * 1. Install external logging service SDK (Sentry, LogRocket, etc.)
   * 2. Add environment variables for API keys
   * 3. Initialize service in constructor if env var is set
   * 4. Replace this method with actual service calls
   *
   * Example implementation:
   * ```typescript
   * private sendToExternalService(entry: LogEntry): void {
   *   if (this.isDevelopment) return
   *   if (entry.level !== 'error') return
   *
   *   if (typeof window !== 'undefined' && window.Sentry) {
   *     window.Sentry.captureException(new Error(entry.message), {
   *       tags: { context: entry.context },
   *       extra: entry.data,
   *     })
   *   }
   * }
   * ```
   */
  private sendToExternalService(entry: LogEntry): void {
    // Only send errors to external service in production
    if (this.isDevelopment || entry.level !== 'error') return

    // External logging service integration deferred
    // See method documentation above for implementation details
  }

  /**
   * Debug level logging
   */
  debug(message: string, data?: Record<string, any>, context?: string): void {
    const entry = this.createLogEntry('debug', message, context, data)
    this.outputToConsole(entry)
    this.storeLogEntry(entry)
  }

  /**
   * Info level logging
   */
  info(message: string, data?: Record<string, any>, context?: string): void {
    const entry = this.createLogEntry('info', message, context, data)
    this.outputToConsole(entry)
    this.storeLogEntry(entry)
  }

  /**
   * Warning level logging
   */
  warn(message: string, data?: Record<string, any>, context?: string): void {
    const entry = this.createLogEntry('warn', message, context, data)
    this.outputToConsole(entry)
    this.storeLogEntry(entry)
  }

  /**
   * Error level logging
   */
  error(
    message: string,
    error?: Error | Record<string, any>,
    context?: string
  ): void {
    const data = error instanceof Error
      ? { name: error.name, message: error.message }
      : error

    const stack = error instanceof Error ? error.stack : undefined
    const entry = this.createLogEntry('error', message, context, data, stack)

    this.outputToConsole(entry)
    this.storeLogEntry(entry)
    this.sendToExternalService(entry)
  }

  /**
   * Get all stored logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level)
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = []
  }

  /**
   * Export logs as JSON
   */
  exportLogsAsJSON(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

// Export singleton instance
export const logger = new Logger()

/**
 * Context-specific logger for better organization
 */
export function createContextLogger(context: string) {
  return {
    debug: (message: string, data?: Record<string, any>) =>
      logger.debug(message, data, context),
    info: (message: string, data?: Record<string, any>) =>
      logger.info(message, data, context),
    warn: (message: string, data?: Record<string, any>) =>
      logger.warn(message, data, context),
    error: (message: string, error?: Error | Record<string, any>) =>
      logger.error(message, error, context),
  }
}
