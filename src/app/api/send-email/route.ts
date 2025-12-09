import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from './action'
import { ContactFormSchema } from '@/lib/email/email-service'
import {
  validateRequest,
  ValidationError,
  createApiError,
} from '@/lib/api/validation'
import {
  getClientIdentifier,
  getRequestMetadata,
  parseRequestBody,
  logApiRequest,
  logApiResponse,
} from '@/lib/api/utils'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const clientId = getClientIdentifier(request)
  const metadata = getRequestMetadata(request)
  
  logApiRequest('POST', '/api/send-email', clientId, metadata)
  
  try {
    // Parse and validate request body
    const body = await parseRequestBody(request)
    const validatedData = validateRequest(ContactFormSchema, body)
    
    const result = await sendContactEmail(validatedData)

    logApiResponse('POST', '/api/send-email', clientId, 200, true, Date.now() - startTime)
    return NextResponse.json(result)
    
  } catch (error) {
    const isValidationError = error instanceof ValidationError || error instanceof z.ZodError
    const status = isValidationError ? 400 : 500
    
    const response = createApiError(
      isValidationError ? 'Validation failed' : 'Failed to process request',
      isValidationError ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR',
      isValidationError && error instanceof ValidationError ? error.details : undefined
    )

    logApiResponse('POST', '/api/send-email', clientId, status, false, Date.now() - startTime, {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    
    return NextResponse.json(response, { status })
  }
}
