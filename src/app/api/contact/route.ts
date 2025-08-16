import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { 
  checkEnhancedContactFormRateLimit
} from '@/lib/security/enhanced-rate-limiter'
import { ContactFormData } from '@/types/shared-api'

interface ContactApiResponse {
  success: boolean;
  message: string;
  error?: string;
  details?: Record<string, string>;
  rateLimitInfo?: {
    remaining?: number;
    resetTime?: number;
    retryAfter?: number;
    blocked?: boolean;
  };
}

class ValidationError extends Error {
  details: Record<string, string>;

  constructor(message: string, details: Record<string, string>) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

function validateContactForm(data: unknown): ContactFormData {
  const errors: Record<string, string> = {};
  const formData = data as Partial<ContactFormData>;

  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Name is required';
  }

  if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
    errors.email = 'Valid email is required';
  }

  if (!formData.subject || formData.subject.trim() === '') {
    errors.subject = 'Subject is required';
  }

  if (!formData.message || formData.message.trim() === '') {
    errors.message = 'Message is required';
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Validation failed', errors);
  }

  return formData as ContactFormData;
}

function getClientIdentifier(req: Request): string {
  // Try to get IP from various headers
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const cfConnectingIp = req.headers.get('cf-connecting-ip')
  
  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
  
  // Add user agent as additional identifier
  const userAgent = req.headers.get('user-agent') || 'unknown'
  const userAgentHash = Buffer.from(userAgent).toString('base64').slice(0, 8)
  
  return `${ip}:${userAgentHash}`
}

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    // Enhanced rate limiting check first
    const clientId = getClientIdentifier(request)
    const userAgent = request.headers.get('user-agent')
    const rateLimitResult = checkEnhancedContactFormRateLimit(clientId, {
      ...(userAgent && { userAgent }),
      path: '/api/contact'
    })

    if (!rateLimitResult.allowed) {
      const response: ContactApiResponse = {
        success: false,
        message: rateLimitResult.reason === 'penalty_block' 
          ? 'Account temporarily blocked due to excessive attempts'
          : 'Too many contact form submissions. Please try again later.',
        error: 'RATE_LIMIT_EXCEEDED',
        rateLimitInfo: {
          ...(rateLimitResult.retryAfter !== undefined && { retryAfter: rateLimitResult.retryAfter }),
          ...(rateLimitResult.resetTime !== undefined && { resetTime: rateLimitResult.resetTime }),
          ...(rateLimitResult.blocked !== undefined && { blocked: rateLimitResult.blocked })
        }
      }

      const status = rateLimitResult.blocked ? 429 : 429
      const headers: Record<string, string> = {
        'X-RateLimit-Limit': '3',
        'X-RateLimit-Remaining': '0'
      }

      if (rateLimitResult.resetTime) {
        headers['X-RateLimit-Reset'] = rateLimitResult.resetTime.toString()
      }

      if (rateLimitResult.retryAfter) {
        headers['Retry-After'] = Math.ceil((rateLimitResult.retryAfter - Date.now()) / 1000).toString()
      }

      return NextResponse.json(response, { 
        status, 
        headers 
      })
    }

    // Parse the request body
    const body = await request.json();

    // Validate the data using our centralized validation
    const formData = validateContactForm(body);

    // Send email using Resend
    const { name, email, subject, message } = formData;

    await resend.emails.send({
      from: 'Portfolio Contact <hello@richardwhudsonjr.com>',
      to: process.env.CONTACT_EMAIL || 'hudsor01@icloud.com',
      subject: `${subject} - from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
      html: `
        <div>
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });


    const response: ContactApiResponse = {
      success: true,
      message: 'Form submitted successfully',
      rateLimitInfo: {
        ...(rateLimitResult.remaining !== undefined && { remaining: rateLimitResult.remaining }),
        ...(rateLimitResult.resetTime !== undefined && { resetTime: rateLimitResult.resetTime })
      }
    };

    // Add rate limit headers to successful response
    const headers: Record<string, string> = {}
    if (rateLimitResult.remaining !== undefined) {
      headers['X-RateLimit-Limit'] = '3'
      headers['X-RateLimit-Remaining'] = rateLimitResult.remaining.toString()
    }
    if (rateLimitResult.resetTime) {
      headers['X-RateLimit-Reset'] = rateLimitResult.resetTime.toString()
    }

    return NextResponse.json(response, { 
      status: 200,
      headers 
    });
  } catch (error) {

    const response: ContactApiResponse = {
      success: false,
      message: 'Error processing form',
      error: error instanceof ValidationError ? 'Validation failed' : 'Internal server error',
      ...(error instanceof ValidationError && error.details && { details: error.details }),
    };

    return NextResponse.json(response, { status: error instanceof ValidationError ? 400 : 500 });
  }
}
