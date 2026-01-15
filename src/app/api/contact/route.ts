import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { checkEnhancedContactFormRateLimit } from '@/lib/rate-limiter'
import { contactFormSchema } from '@/lib/schemas'
import { escapeHtml } from '@/lib/sanitization'

let resend: Resend | null = null

function getResendClient(): Resend {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured')
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

export async function POST(request: NextRequest) {
  try {
    // Get IP from headers
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = (forwarded ? forwarded.split(/, /)[0] : request.headers.get('x-real-ip')) || 'unknown'

    // Rate limit
    const rateLimitResult = checkEnhancedContactFormRateLimit(`${ip}`, { path: '/api/contact' })

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many contact form submissions. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const formData = contactFormSchema.parse(body)
    const { name, email, message } = formData

    const contactEmail = process.env.CONTACT_EMAIL
    if (!contactEmail) {
      return NextResponse.json(
        { success: false, error: 'Email service misconfigured. Please try again later.' },
        { status: 500 }
      )
    }

    await getResendClient().emails.send({
      from: 'Portfolio Contact <hello@richardwhudsonjr.com>',
      to: contactEmail,
      replyTo: email,
      subject: `New Contact from ${escapeHtml(name)}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;"><h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">New Contact Form Submission</h2><p><strong>From:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p><div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-top: 16px;"><p><strong>Message:</strong></p><p style="white-space: pre-wrap;">${escapeHtml(message).replace(/\n/g, '<br>')}</p></div></div>`,
    })

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully!',
    })

  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid form data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Error processing form' },
      { status: 500 }
    )
  }
}
