import { logger } from "@/lib/logger"
import { AppError } from "./types"

export async function handleError(error: unknown): Promise<AppError> {
  // If it's already an AppError, just return it
  if (error instanceof AppError) {
    logger.error(error.message, {
      code: error.code,
      statusCode: error.statusCode,
      metadata: error.metadata,
    })
    return error
  }

  // Convert unknown errors to AppError
  const appError = new AppError(
    error instanceof Error ? error.message : "An unexpected error occurred",
    "UNKNOWN_ERROR",
    500,
    { originalError: error },
  )

  logger.error(appError.message, {
    code: appError.code,
    statusCode: appError.statusCode,
    metadata: appError.metadata,
  })

  return appError
}

export function createErrorResponse(error: AppError) {
  return new Response(
    JSON.stringify({
      error: {
        message: error.message,
        code: error.code,
        ...(process.env.NODE_ENV === "development" ? { metadata: error.metadata } : {}),
      },
    }),
    {
      status: error.statusCode,
      headers: { "Content-Type": "application/json" },
    },
  )
}
