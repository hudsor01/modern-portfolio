'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { checkEnhancedContactFormRateLimit } from '@/lib/rate-limiter'
import { contactFormSchema } from '@/lib/schemas'
import { escapeHtml } from '@/lib/sanitization'

// Initialize Resend
let resend: Resend | null = null

function getResendClient(): Resend {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured')
    }
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

/**
 * Server Action for contact form submission
 * Handles validation and email sending
 */
export async function submitContactForm(formData: unknown) {
  try {
    // Validate form data with Zod schema
    const validatedData = contactFormSchema.parse(formData)

    // Rate limiting check using IP-based identification
    const headersList = await headers()
    const forwarded = headersList.get('x-forwarded-for')
    const ip = (forwarded ? forwarded.split(/, /)[0] : headersList.get('x-real-ip')) || 'unknown'

    const rateLimitResult = checkEnhancedContactFormRateLimit(`${ip}`, {
      path: '/contact'
    })

    if (!rateLimitResult.allowed) {
      return {
        success: false,
        error: 'Too many contact form submissions. Please try again later.',
      }
    }

    // Validate that CONTACT_EMAIL is configured
    const contactEmail = process.env.CONTACT_EMAIL
    if (!contactEmail) {
      return {
        success: false,
        error: 'Email service misconfigured. Please try again later.',
      }
    }

    // Send email using Resend
    const { name, email, message } = validatedData

    await getResendClient().emails.send({
      from: 'Portfolio Contact <hello@richardwhudsonjr.com>',
      to: contactEmail,
      replyTo: email,
      subject: `New Contact from ${escapeHtml(name)}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;"><h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">New Contact Form Submission</h2><p><strong>From:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p><div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-top: 16px;"><p><strong>Message:</strong></p><p style="white-space: pre-wrap;">${escapeHtml(message).replace(/\n/g, '<br>')}</p></div></div>`,
    })

    return {
      success: true,
      message: 'Form submitted successfully! I will get back to you soon.',
    }
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return {
        success: false,
        error: 'Please check your form and try again.',
      }
    }

    // Handle other errors
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    }
  }
}
