import { logger } from "@/lib/logger"
import { handleError, createErrorResponse } from "@/lib/errors/handlers"
import type { ApiHandler } from "./types"

export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (request, context) => {
    try {
      const response = await handler(request, context)

      // If it's already a Response, return it
      if (response instanceof Response) {
        return response
      }

      // Convert ApiResponse to Response
      return new Response(JSON.stringify(response), {
        headers: { "Content-Type": "application/json" },
      })
    } catch (error) {
      const appError = await handleError(error)
      return createErrorResponse(appError)
    }
  }
}

export function withLogging(handler: ApiHandler): ApiHandler {
  return async (request, context) => {
    const startTime = Date.now()
    const requestId = crypto.randomUUID()

    logger.info(`API Request started`, {
      requestId,
      method: request.method,
      url: request.url,
      params: context.params,
    })

    try {
      const response = await handler(request, context)
      const duration = Date.now() - startTime

      logger.info(`API Request completed`, {
        requestId,
        duration,
        status: response instanceof Response ? response.status : 200,
      })

      return response
    } catch (error) {
      const duration = Date.now() - startTime

      logger.error(`API Request failed`, {
        requestId,
        duration,
        error,
      })

      throw error
    }
  }
}
