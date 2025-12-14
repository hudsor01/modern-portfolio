/**
 * Production-Ready Logging and Monitoring System
 * Structured logging with different levels, error tracking, and performance monitoring
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

// Log level priorities for filtering
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
}

// Environment configuration
const LOG_LEVEL = (process.env.LOG_LEVEL as LogLevel) ||
  ((process.env.NODE_ENV as string) === 'production' ? 'info' : 'debug')
const IS_PRODUCTION = (process.env.NODE_ENV as string) === 'production'

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

// Console transport with colored output
class ConsoleTransport implements LogTransport {
  private colors = {
    debug: '\x1b[36m', // Cyan
    info: '\x1b[32m',  // Green
    warn: '\x1b[33m',  // Yellow
    error: '\x1b[31m', // Red
    fatal: '\x1b[35m', // Magenta
    reset: '\x1b[0m',  // Reset
  }
  
  log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level) || ((process.env.NODE_ENV as string) === 'production')) return

    const color = this.colors[entry.level]
    const timestamp = new Date(entry.timestamp).toISOString()
    const level = entry.level.toUpperCase().padEnd(5)

    let output = `${color}[${timestamp}] ${level}${this.colors.reset} ${entry.message}`
    
    if (entry.context && Object.keys(entry.context).length > 0) {
      output += `\n  Context: ${JSON.stringify(entry.context, null, 2)}`
    }
    
    if (entry.error) {
      if ((process.env.NODE_ENV as string) === 'production') {
        // In production, only log error name and sanitized message
        output += `\n  Error: ${entry.error.name}: ${entry.error.message}`
        // Don't include stack traces in production logs to prevent information disclosure
      } else {
        // In development, include full error details for debugging
        output += `\n  Error: ${entry.error.name}: ${entry.error.message}`
        if (entry.error.stack && entry.level === 'error') {
          output += `\n  Stack: ${entry.error.stack}`
        }
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
  
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[LOG_LEVEL]
  }
}

// Structured JSON transport (for production logging services)
class JSONTransport implements LogTransport {
  log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return
    
    // In production, you'd send this to your logging service
    // Examples: DataDog, Splunk, ELK Stack, CloudWatch, etc.
    console.info('Logging entry:', entry)
  }
  
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[LOG_LEVEL]
  }
}

// File transport (for persistent logging)
// Node.js 24: Implements Disposable for automatic cleanup via 'using' keyword
class FileTransport implements LogTransport, Disposable {
  private buffer: LogEntry[] = []
  private readonly maxBufferSize = 100
  private readonly flushInterval = 5000 // 5 seconds
  private flushIntervalId: NodeJS.Timeout | null = null

  constructor() {
    // Flush buffer periodically
    this.flushIntervalId = setInterval(() => this.flush(), this.flushInterval)

    // Flush on process exit
    process.on('exit', () => this.flush())
    process.on('SIGINT', () => this.flush())
    process.on('SIGTERM', () => this.flush())
  }

  log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return

    this.buffer.push(entry)

    // Flush if buffer is full
    if (this.buffer.length >= this.maxBufferSize) {
      this.flush()
    }
  }

  private flush(): void {
    if (this.buffer.length === 0) return

    try {
      // In a real implementation, you'd write to a file or send to a service
      // For now, we'll just clear the buffer
      this.buffer = []
    } catch (error) {
      console.error('Failed to flush log buffer:', error)
    }
  }

  // Node.js 24: Explicit Resource Management - called automatically with 'using' keyword
  [Symbol.dispose](): void {
    if (this.flushIntervalId) {
      clearInterval(this.flushIntervalId)
      this.flushIntervalId = null
    }
    // Flush remaining logs before disposal
    this.flush()
  }

  // Legacy method for backward compatibility - calls Symbol.dispose
  destroy(): void {
    this[Symbol.dispose]()
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[LOG_LEVEL]
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
    this.log('info', `Performance: ${operation}`, {
      ...context,
      operation,
    }, undefined, {
      duration,
      memory: this.getMemoryUsage(),
    })
  }

  request(requestInfo: LogEntry['request'], context?: LogContext): void {
    this.log('info', `Request: ${requestInfo?.method} ${requestInfo?.url}`, context, undefined, undefined, requestInfo)
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

  // Add destroy method to properly clean up transports
  destroy(): void {
    for (const transport of this.transports) {
      if (typeof (transport as FileTransport).destroy === 'function') {
        (transport as FileTransport).destroy()
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
        version: process.env.npm_package_version,
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
    this.transports.forEach(transport => {
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

// Error boundary logger
export class ErrorBoundaryLogger {
  private logger: Logger
  
  constructor(logger: Logger) {
    this.logger = logger
  }
  
  logError(error: Error, errorInfo: { componentStack: string }, context?: LogContext): void {
    this.logger.error('React Error Boundary caught an error', error, {
      ...context,
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    })
  }
  
  logRecovery(context?: LogContext): void {
    this.logger.info('Error boundary recovered', {
      ...context,
      errorBoundary: true,
      recovered: true,
    })
  }
}

// Performance monitor
export class PerformanceMonitor {
  private logger: Logger
  private metrics: Map<string, number[]> = new Map()
  
  constructor(logger: Logger) {
    this.logger = logger
  }
  
  async measureAsync<T>(operation: string, fn: () => Promise<T>, context?: LogContext): Promise<T> {
    const start = performance.now()

    try {
      const result = await fn()
      this.recordMetric(operation, performance.now() - start, context)
      return result
    } catch (error) {
      this.recordMetric(operation, performance.now() - start, {
        ...context,
        error: true,
      })
      throw error
    }
  }
  
  measure<T>(operation: string, fn: () => T, context?: LogContext): T {
    const start = performance.now()
    
    try {
      const result = fn()
      this.recordMetric(operation, performance.now() - start, context)
      return result
    } catch (error) {
      this.recordMetric(operation, performance.now() - start, {
        ...context,
        error: true,
      })
      throw error
    }
  }
  
  private recordMetric(operation: string, duration: number, context?: LogContext): void {
    // Store metrics for aggregation
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, [])
    }
    
    const operationMetrics = this.metrics.get(operation)!
    operationMetrics.push(duration)
    
    // Keep only recent metrics (last 100)
    if (operationMetrics.length > 100) {
      operationMetrics.shift()
    }
    
    // Log the performance
    this.logger.performance(operation, duration, context)
    
    // Log warning for slow operations
    if (duration > 1000) {
      this.logger.warn(`Slow operation detected: ${operation}`, {
        ...context,
        duration,
        threshold: 1000,
      })
    }
  }
  
  getMetricsSummary(): Record<string, OperationMetricsSummary> { // Updated return type
    const summary: Record<string, OperationMetricsSummary> = {} // Updated type for summary
    
    this.metrics.forEach((durations, operation) => {
      if (durations.length === 0) return
      
      const sorted = [...durations].sort((a, b) => a - b)
      const sum = durations.reduce((a, b) => a + b, 0)
      
      summary[operation] = {
        count: durations.length,
        average: sum / durations.length,
        min: sorted[0]!, // Added non-null assertion
        max: sorted[sorted.length - 1]!, // Added non-null assertion
        p95: sorted[Math.floor(sorted.length * 0.95)]!, // Added non-null assertion
      }
    })
    
    return summary
  }
}

interface OperationMetricsSummary {
  count: number;
  average: number;
  min: number;
  max: number;
  p95: number;
}

// Create logger instance with appropriate transports
function createLogger(): Logger {
  const transports: LogTransport[] = []
  
  if (IS_PRODUCTION) {
    // In production, use structured JSON logging
    transports.push(new JSONTransport())
    
    // Optionally add file transport or external service transport
    if (process.env.ENABLE_FILE_LOGGING === 'true') {
      transports.push(new FileTransport())
    }
  } else {
    // In development, use colored console output
    transports.push(new ConsoleTransport())
  }
  
  return new LoggerImpl(transports)
}

// Export singleton instances
export const logger = createLogger()
export const errorBoundaryLogger = new ErrorBoundaryLogger(logger)
export const performanceMonitor = new PerformanceMonitor(logger)

// Utility functions
export function withLogging<T extends unknown[], R>( // Changed any[] to unknown[]
  operation: string,
  fn: (...args: T) => R,
  context?: LogContext
): (...args: T) => R {
  return (...args: T): R => {
    return performanceMonitor.measure(operation, () => fn(...args), context)
  }
}

export function withAsyncLogging<T extends unknown[], R>( // Changed any[] to unknown[]
  operation: string,
  fn: (...args: T) => Promise<R>,
  context?: LogContext
): (...args: T) => Promise<R> {
  return (...args: T): Promise<R> => {
    return performanceMonitor.measureAsync(operation, () => fn(...args), context)
  }
}

interface MinimalRequest {
  method: string;
  url: string;
  headers?: {
    get: (name: string) => string | null | undefined;
  };
}

// Request logger middleware utility
export function createRequestLogger(operation: string) {
  return (request: MinimalRequest, context?: LogContext) => {
    const requestLogger = logger.child({
      requestId: crypto.randomUUID(),
      operation,
      ...context,
    })

    requestLogger.request({
      id: crypto.randomUUID(),
      method: request.method,
      url: request.url,
      userAgent: request.headers?.get?.('user-agent') || undefined,
      ip: (request.headers?.get?.('x-forwarded-for') || request.headers?.get?.('x-real-ip')) || undefined,
    })

    return requestLogger
  }
}

/**
 * Context-specific logger factory
 * Creates a logger with a fixed context name for better log organization
 */
export function createContextLogger(context: string) {
  return {
    debug: (message: string, data?: LogContext) =>
      logger.debug(message, { ...data, context }),
    info: (message: string, data?: LogContext) =>
      logger.info(message, { ...data, context }),
    warn: (message: string, data?: LogContext) =>
      logger.warn(message, { ...data, context }),
    error: (message: string, error?: Error | LogContext, data?: LogContext) => {
      if (error instanceof Error) {
        logger.error(message, error, { ...data, context })
      } else {
        logger.error(message, undefined, { ...error, ...data, context })
      }
    },
  }
}
