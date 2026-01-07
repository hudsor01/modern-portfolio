/**
 * Monitoring & Logging Types - Centralized
 * Consolidated from src/lib/monitoring/logger.ts
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'
export type LogContext = Record<string, unknown>

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: {
    name: string
    message: string
    stack?: string
    cause?: unknown
  }
  performance?: {
    duration: number
    memory?: {
      used: number
      total: number
    }
  }
  request?: {
    id: string
    method: string
    url: string
    userAgent?: string
    ip?: string
  }
  user?: {
    id?: string
    sessionId?: string
  }
  metadata?: {
    buildId?: string
    version?: string
    environment: string
  }
}

// Logger interface
export interface Logger {
  debug(message: string, context?: LogContext): void
  info(message: string, context?: LogContext): void
  warn(message: string, context?: LogContext): void
  error(message: string, error?: Error, context?: LogContext): void
  fatal(message: string, error?: Error, context?: LogContext): void

  // Specialized logging methods
  performance(operation: string, duration: number, context?: LogContext): void
  request(requestInfo: LogEntry['request'], context?: LogContext): void
  security(event: string, context?: LogContext): void

  // Utility methods
  child(baseContext: LogContext): Logger
  startTimer(operation: string): () => void
}

// Log transport interface
export interface LogTransport {
  log(entry: LogEntry): Promise<void> | void
}
