/**
 * Contact Form RPC Routes
 * Handles contact form submissions with validation and email sending
 */

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { Resend } from 'resend'
import { 
  ContactFormSchema, 
  ContactResponse, 
  RPCContext, 
  RPCResponse 
} from '../types'
import { rateLimit, validateInput, requestContext } from '../middleware'

const contact = new Hono()

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// =======================
// CONTACT FORM SUBMISSION
// =======================

contact.post(
  '/submit',
  rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 5 }), // 5 requests per 15 minutes
  requestContext(),
  zValidator('json', ContactFormSchema),
  async (c) => {
    try {
      const formData = c.req.valid('json')
      const context = c.get('rpcContext') as RPCContext

      // Bot detection - check honeypot field
      if (formData.honeypot) {
        return c.json<RPCResponse>({
          success: false,
          error: {
            code: 'SPAM_DETECTED',
            message: 'Spam detected',
          }
        }, 400)
      }

      // Generate unique ID for tracking
      const submissionId = `contact_${Date.now()}_${Math.random().toString(36).substring(2)}`

      // Prepare email content
      const { name, email, subject, message, company, phone } = formData
      const emailSubject = subject || `New contact from ${name}`

      // Create HTML email template
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">Name:</td>
                <td style="padding: 8px 0; color: #111827;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 8px 0; color: #111827;">
                  <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                </td>
              </tr>
              ${company ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Company:</td>
                  <td style="padding: 8px 0; color: #111827;">${company}</td>
                </tr>
              ` : ''}
              ${phone ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone:</td>
                  <td style="padding: 8px 0; color: #111827;">${phone}</td>
                </tr>
              ` : ''}
            </table>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #374151; margin-bottom: 10px;">Message:</h3>
            <div style="background-color: #ffffff; padding: 15px; border: 1px solid #e5e7eb; border-radius: 6px; line-height: 1.6;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
            <p><strong>Submission Details:</strong></p>
            <p>ID: ${submissionId}</p>
            <p>Timestamp: ${context.timestamp.toISOString()}</p>
            <p>IP Address: ${context.ipAddress}</p>
            <p>User Agent: ${context.userAgent}</p>
          </div>
        </div>
      `

      // Create plain text version
      const textContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ''}
${phone ? `Phone: ${phone}` : ''}

Message:
${message}

---
Submission Details:
ID: ${submissionId}
Timestamp: ${context.timestamp.toISOString()}
IP Address: ${context.ipAddress}
User Agent: ${context.userAgent}
      `.trim()

      // Send email using Resend
      await resend.emails.send({
        from: 'Portfolio Contact <hello@richardwhudsonjr.com>',
        to: [process.env.CONTACT_EMAIL || 'hudsor01@icloud.com'],
        replyTo: email,
        subject: emailSubject,
        text: textContent,
        html: htmlContent,
        tags: [
          { name: 'source', value: 'portfolio-contact' },
          { name: 'submission-id', value: submissionId }
        ],
      })

      // Prepare response
      const response: ContactResponse = {
        id: submissionId,
        status: 'sent',
        timestamp: context.timestamp.toISOString(),
        createdAt: context.timestamp.toISOString(),
      }

      return c.json<RPCResponse<ContactResponse>>({
        success: true,
        data: response,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: context.sessionId,
          version: '1.0.0',
        }
      })

    } catch (error) {
      console.error('Contact form submission error:', error)

      // Check if it's a Resend API error
      if (error && typeof error === 'object' && 'message' in error) {
        return c.json<RPCResponse>({
          success: false,
          error: {
            code: 'EMAIL_SEND_FAILED',
            message: 'Failed to send email. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? { error: error.message } : undefined
          }
        }, 500)
      }

      return c.json<RPCResponse>({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An internal error occurred while processing your request.',
        }
      }, 500)
    }
  }
)

// =======================
// CONTACT FORM VALIDATION TEST
// =======================

contact.post(
  '/validate',
  rateLimit({ windowMs: 60 * 1000, maxRequests: 10 }), // 10 requests per minute
  zValidator('json', ContactFormSchema),
  async (c) => {
    const formData = c.req.valid('json')
    
    return c.json<RPCResponse>({
      success: true,
      data: {
        valid: true,
        message: 'Form data is valid',
        fields: Object.keys(formData),
      }
    })
  }
)

// =======================
// GET CONTACT STATISTICS
// =======================

contact.get('/stats', async (c) => {
  // This would typically fetch from a database
  // For now, return mock statistics
  const stats = {
    totalSubmissions: 247,
    thisMonth: 23,
    avgResponseTime: '2.3 hours',
    topSources: [
      { source: 'direct', count: 156 },
      { source: 'linkedin', count: 45 },
      { source: 'github', count: 28 },
      { source: 'referral', count: 18 },
    ],
  }

  return c.json<RPCResponse<typeof stats>>({
    success: true,
    data: stats,
  })
})

export { contact }