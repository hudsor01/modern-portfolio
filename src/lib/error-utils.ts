export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL'
}

export class AppError extends Error {
  public readonly type: ErrorType
  public readonly statusCode: number
  public readonly details?: unknown

  constructor(
    message: string,
    type: ErrorType = ErrorType.INTERNAL,
    statusCode: number = 500,
    details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.statusCode = statusCode
    this.details = details

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      statusCode: this.statusCode,
      details: this.details,
      stack: this.stack
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, ErrorType.VALIDATION, 400, details)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, ErrorType.AUTHENTICATION, 401)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, ErrorType.AUTHORIZATION, 403)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, ErrorType.NOT_FOUND, 404)
    this.name = 'NotFoundError'
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export enum ErrorSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

// Placeholder for a more robust error reporting mechanism (e.g., Sentry, LogRocket)
export function reportError(
  error: Error,
  severity: ErrorSeverity,
  componentName?: string,
  additionalContext?: Record<string, unknown>
): void {
  console.error(`[${severity}] Error reported`, {
    message: error.message,
    name: error.name,
    stack: error.stack,
    component: componentName,
    context: additionalContext,
  });

  // Production error tracking - integrate with monitoring services like Sentry or DataDog
  if (typeof window !== 'undefined' && (severity === ErrorSeverity.ERROR || severity === ErrorSeverity.CRITICAL)) {
    // Client-side error reporting
    const errorReport = {
      message: error.message,
      stack: error.stack,
      component: componentName,
      severity,
      context: additionalContext,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    }
    
    // Send to error tracking service (implement based on your chosen service)
    // Example: Sentry.captureException(error, { tags: { component: componentName }, extra: additionalContext })
    console.error('Client Error Report:', errorReport)
  } else if (typeof window === 'undefined') {
    // Server-side error reporting
    const errorReport = {
      message: error.message,
      stack: error.stack,
      component: componentName,
      severity,
      context: additionalContext,
      timestamp: new Date().toISOString(),
    }
    
    // Send to server monitoring service
    console.error('Server Error Report:', errorReport)
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unknown error occurred'
}

export function getErrorDetails(error: unknown): unknown {
  if (isAppError(error)) {
    return error.details
  }
  return null
}
