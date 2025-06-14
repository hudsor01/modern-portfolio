/**
 * Production-Ready Email Service
 * Handles email sending with proper error handling, rate limiting, and monitoring
 */

// Production-ready email service with comprehensive error handling and monitoring

import { Resend } from 'resend'
import { z } from 'zod'

// Environment configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || 'contact@richardwhudsonjr.com'
const TO_EMAIL = process.env.TO_EMAIL || 'hello@richardwhudsonjr.com'
const NODE_ENV = process.env.NODE_ENV

// Email validation schema
export const ContactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name contains invalid characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
  subject: z.string()
    .max(100, 'Subject must be less than 100 characters')
    .optional(),
  phone: z.string()
    .max(20, 'Phone number must be less than 20 characters')
    .optional(),
})

export type ContactFormData = z.infer<typeof ContactFormSchema>

// Email templates
export const EmailTemplates = {
  contact: (data: ContactFormData) => ({
    subject: data.subject ? `Portfolio Contact: ${data.subject}` : `Portfolio Contact from ${data.name}`,
    text: `
New contact form submission from your portfolio:

Name: ${data.name}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.subject ? `Subject: ${data.subject}` : ''}

Message:
${data.message}

---
Sent from Portfolio Contact Form
Time: ${new Date().toISOString()}
    `.trim(),
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          New Portfolio Contact
        </h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #374151; width: 80px;">Name:</td>
              <td style="padding: 8px 0; color: #1f2937;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #374151;">Email:</td>
              <td style="padding: 8px 0;">
                <a href="mailto:${data.email}" style="color: #3b82f6; text-decoration: none;">
                  ${data.email}
                </a>
              </td>
            </tr>
            ${data.phone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #374151;">Phone:</td>
              <td style="padding: 8px 0; color: #1f2937;">${data.phone}</td>
            </tr>
            ` : ''}
            ${data.subject ? `
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #374151;">Subject:</td>
              <td style="padding: 8px 0; color: #1f2937;">${data.subject}</td>
            </tr>
            ` : ''}
          </table>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #374151; margin-bottom: 10px;">Message:</h3>
          <div style="background: white; padding: 20px; border-left: 4px solid #3b82f6; border-radius: 4px;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
          <p>Sent from Portfolio Contact Form</p>
          <p>Time: ${new Date().toISOString()}</p>
        </div>
      </div>
    `,
  }),

  autoReply: (data: ContactFormData) => ({
    subject: 'Thank you for contacting Richard Hudson',
    text: `
Hi ${data.name},

Thank you for reaching out through my portfolio contact form. I've received your message and will get back to you as soon as possible, typically within 24 hours.

Your message:
"${data.message}"

I appreciate your interest and look forward to connecting with you!

Best regards,
Richard Hudson

---
This is an automated response. Please do not reply to this email.
    `.trim(),
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          Thank You for Your Message
        </h2>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Hi ${data.name},
        </p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Thank you for reaching out through my portfolio contact form. I've received your message and will get back to you as soon as possible, typically within 24 hours.
        </p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="color: #374151; margin-top: 0;">Your message:</h3>
          <p style="color: #1f2937; font-style: italic; margin-bottom: 0;">
            "${data.message}"
          </p>
        </div>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          I appreciate your interest and look forward to connecting with you!
        </p>
        
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Best regards,<br>
          <strong>Richard Hudson</strong>
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
          <p>This is an automated response. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  }),
} as const

// Rate limiting (simple in-memory store - use Redis in production cluster)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX_ATTEMPTS = 5

export function checkRateLimit(identifier: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true }
  }
  
  if (record.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return { allowed: false, resetTime: record.resetTime }
  }
  
  record.count++
  return { allowed: true }
}

// Email service class
export class EmailService {
  private resend: Resend | null = null
  private isProduction: boolean
  
  constructor() {
    this.isProduction = NODE_ENV === 'production'
    
    if (RESEND_API_KEY && RESEND_API_KEY !== 'mock_api_key_for_development') {
      this.resend = new Resend(RESEND_API_KEY)
    }
  }
  
  async validateData(data: unknown): Promise<ContactFormData> {
    return ContactFormSchema.parse(data)
  }
  
  async sendContactEmail(data: ContactFormData, clientIP?: string): Promise<EmailServiceResult> {
    try {
      // Rate limiting
      const identifier = clientIP || 'unknown'
      const rateCheck = checkRateLimit(identifier)
      
      if (!rateCheck.allowed) {
        return {
          success: false,
          error: 'Rate limit exceeded',
          retryAfter: rateCheck.resetTime,
        }
      }
      
      // Validate data
      const validatedData = await this.validateData(data)
      
      if (!this.resend) {
        return this.handleMockEmail(validatedData)
      }
      
      // Send notification email to site owner
      const contactTemplate = EmailTemplates.contact(validatedData)
      const contactResult = await this.resend.emails.send({
        from: `Portfolio Contact <${FROM_EMAIL}>`,
        to: [TO_EMAIL],
        subject: contactTemplate.subject,
        text: contactTemplate.text,
        html: contactTemplate.html,
        replyTo: validatedData.email,
        headers: {
          'X-Contact-Form': 'portfolio',
          'X-Contact-Name': validatedData.name,
        },
      })
      
      if (contactResult.error) {
        console.error('Failed to send contact notification:', contactResult.error)
        return {
          success: false,
          error: 'Failed to send notification email',
        }
      }
      
      // Send auto-reply to user
      const autoReplyTemplate = EmailTemplates.autoReply(validatedData)
      const autoReplyResult = await this.resend.emails.send({
        from: `Richard Hudson <${FROM_EMAIL}>`,
        to: [validatedData.email],
        subject: autoReplyTemplate.subject,
        text: autoReplyTemplate.text,
        html: autoReplyTemplate.html,
        headers: {
          'X-Auto-Reply': 'true',
        },
      })
      
      // Auto-reply failure is not critical
      if (autoReplyResult.error) {
        console.warn('Failed to send auto-reply:', autoReplyResult.error)
      }
      
      return {
        success: true,
        data: {
          contactEmailId: contactResult.data?.id,
          autoReplyEmailId: autoReplyResult.data?.id,
        },
      }
    } catch (error) {
      console.error('Email service error:', error)
      
      if (error instanceof z.ZodError) {
        const rawFieldErrors = error.flatten().fieldErrors;
        const DOME_VALIDATION_ERRORS: Record<string, string[]> = {};
        for (const key in rawFieldErrors) {
           
          if (rawFieldErrors.hasOwnProperty(key)) {
            const DOME_ERROR_MESSAGES = rawFieldErrors[key];
            if (DOME_ERROR_MESSAGES) {
              DOME_VALIDATION_ERRORS[key] = DOME_ERROR_MESSAGES;
            }
          }
        }
        return {
          success: false,
          error: 'Validation error',
          validationErrors: DOME_VALIDATION_ERRORS,
        }
      }
      
      return {
        success: false,
        error: 'An unexpected error occurred',
      }
    }
  }
  
  private async handleMockEmail(data: ContactFormData): Promise<EmailServiceResult> {
    if (this.isProduction) {
      console.error('Email service not configured in production')
      return {
        success: false,
        error: 'Email service not available',
      }
    }
    
    // Development/testing mode - logs contact form submissions when email service is unavailable
    const logMessage = [
      '📧 Contact Form Submission (Mock Mode):',
      '---',
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : null,
      data.subject ? `Subject: ${data.subject}` : null,
      `Message: ${data.message}`,
      '---'
    ].filter(Boolean).join('\n')
    
    console.log(logMessage)
    
    return {
      success: true,
      data: {
        contactEmailId: 'mock-contact-id',
        autoReplyEmailId: 'mock-autoreply-id',
      },
    }
  }
}

// Export types
export interface EmailServiceResult {
  success: boolean
  error?: string
  retryAfter?: number
  validationErrors?: Record<string, string[]>
  data?: {
    contactEmailId?: string
    autoReplyEmailId?: string
  }
}

// Singleton instance
export const emailService = new EmailService()
