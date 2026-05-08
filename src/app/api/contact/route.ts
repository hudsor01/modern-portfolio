import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { contactFormSchema } from '@/lib/schemas'
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
    const formData = contactFormSchema.parse(body)

    const result = await emailService.sendContactEmail(formData, getClientIdentifier(request))

    if (!result.success) {
      const status = result.retryAfter ? 429 : 500
      return NextResponse.json(
        { success: false, error: result.error ?? 'Submission failed' },
        { status }
      )
    }

    return NextResponse.json({ success: true, message: 'Form submitted successfully!' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid form data' }, { status: 400 })
    }

    logger.error(
      'Contact API submission failed',
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json({ success: false, error: 'Error processing form' }, { status: 500 })
  }
}
