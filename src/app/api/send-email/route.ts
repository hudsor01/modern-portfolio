import { NextResponse } from 'next/server'
import { sendContactEmail } from './action'
import { ContactFormSchema } from '@/lib/email/email-service'
import { validationErrorResponse, errorResponse } from '@/lib/api/response'
import { z } from 'zod'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input data with proper schema
    const validatedData = ContactFormSchema.parse(body)
    
    const result = await sendContactEmail(validatedData)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in send-email API route:', error)
    
    if (error instanceof z.ZodError) {
      return validationErrorResponse(error)
    }
    
    return errorResponse('Failed to process request', 500)
  }
}
