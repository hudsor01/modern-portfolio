/**
 * Standardized Error Handling Utilities
 *
 * Provides consistent error handling patterns across the entire application:
 * - Hooks: Log errors and set error state safely
 * - Utilities: Log errors and return safe defaults or throw as appropriate
 * - Services: Log errors and return structured error responses
 *
 * Error Handling Guidelines:
 * 1. Always log errors with context using the centralized logger
 * 2. Never swallow errors silently - at minimum log them
 * 3. For user-facing operations, return safe defaults with logging
 * 4. For critical operations, throw errors after logging
 * 5. Use structured error responses for services/APIs
 * 6. Include relevant context in error logs for debugging
 */

import { logger } from '@/lib/logger'

/**
 * Error handling strategy types
 */
export type ErrorStrategy = 'throw' | 'return-default' | 'return-error-response'

/**
 * Standard error context for logging
 */
export interface ErrorContext {
  operation: string
  component?: string
  userId?: string
  metadata?: Record<string, unknown>
}

/**
 * Handle errors in React hooks with consistent logging and state management
 * Sets error state and logs the error with context
 */
export function handleHookError<T = unknown>(
  error: unknown,
  context: ErrorContext,
  setError: (error: Error | null) => void,
  defaultValue?: T
): T | undefined {
  const errorObj = error instanceof Error ? error : new Error(String(error))

  logger.error(`${context.component || 'Hook'} error in ${context.operation}`, errorObj, {
    component: context.component,
    operation: context.operation,
    userId: context.userId,
    ...context.metadata,
  })

  setError(errorObj)

  return defaultValue
}

/**
 * Handle errors in utility functions with consistent logging
 * Returns safe default value or throws based on strategy
 */
export function handleUtilityError<T = unknown>(
  error: unknown,
  context: ErrorContext,
  strategy: ErrorStrategy = 'return-default',
  defaultValue?: T
): T | undefined {
  const errorObj = error instanceof Error ? error : new Error(String(error))

  logger.error(`Utility error in ${context.operation}`, errorObj, {
    operation: context.operation,
    component: context.component,
    userId: context.userId,
    strategy,
    ...context.metadata,
  })

  switch (strategy) {
    case 'throw':
      throw errorObj
    case 'return-default':
      return defaultValue
    case 'return-error-response':
      // For utilities that need to return error responses, use the service pattern below
      return defaultValue
    default:
      return defaultValue
  }
}

