import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Define proper types for the contact form
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface ContactApiResponse {
  success: boolean;
  message: string;
  error?: string;
  details?: Record<string, string>;
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

  if (!formData.message || formData.message.trim() === '') {
    errors.message = 'Message is required';
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Validation failed', errors);
  }

  return formData as ContactFormData;
}

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the data using our centralized validation
    const formData = validateContactForm(body);

    // Send email using Resend
    const { name, email, message } = formData;

    await resend.emails.send({
      from: 'Portfolio Contact <hello@richardwhudsonjr.com>',
      to: process.env.CONTACT_EMAIL || 'hudsor01@icloud.com',
      subject: `New contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <div>
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });


    const response: ContactApiResponse = {
      success: true,
      message: 'Form submitted successfully',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {

    const response: ContactApiResponse = {
      success: false,
      message: 'Error processing form',
      error: error instanceof ValidationError ? 'Validation failed' : 'Internal server error',
      details:
        error instanceof ValidationError ? error.details : undefined,
    };

    return NextResponse.json(response, { status: error instanceof ValidationError ? 400 : 500 });
  }
}
