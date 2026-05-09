import { type NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email-service'
import { validateCSRFOrRespond } from '@/lib/api-csrf'
import { getClientIdentifier } from '@/lib/api-request'
import { createContextLogger } from '@/lib/logger'

const logger = createContextLogger('ContactAPI')

export async function POST(request: NextRequest) {
  try {
    const csrfResponse = await validateCSRFOrRespond(request, 'contact form submission')
    if (csrfResponse) return csrfResponse

    const body = await request.json()

    // emailService validates internally; trust it as the single validation point
    // so we get one place that maps zod issues to a typed validationErrors payload.
    const result = await emailService.sendContactEmail(body, getClientIdentifier(request))

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Form submitted successfully!' })
    }

    if (result.validationErrors) {
      return NextResponse.json(
        {
          success: false,
          error: result.error ?? 'Invalid form data',
          validationErrors: result.validationErrors,
        },
        { status: 400 }
      )
    }

    if (result.retryAfter !== undefined) {
      return NextResponse.json(
        { success: false, error: result.error ?? 'Rate limit exceeded' },
        { status: 429, headers: { 'Retry-After': String(result.retryAfter) } }
      )
    }

    return NextResponse.json(
      { success: false, error: result.error ?? 'Submission failed' },
      { status: 500 }
    )
  } catch (error) {
    logger.error(
      'Contact API submission failed',
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json({ success: false, error: 'Error processing form' }, { status: 500 })
  }
}
