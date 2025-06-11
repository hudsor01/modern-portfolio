'use server'

import { z } from 'zod'
import { contactFormSchema } from '@/lib/validation'

// Define the response type
type ContactFormResponse = {
  success: boolean
  message: string
  error?: string
}

/**
 * Server action to handle contact form submissions
 * This replaces the API route approach with a more efficient server action
 */
export async function submitContactForm(
  formData: z.infer<typeof contactFormSchema>
): Promise<ContactFormResponse> {
  try {
    // Validate the form data
    const validatedData = contactFormSchema.parse(formData)

    // TODO: UPDATE FOR A PRODUCTION IMPLEMENTATION
    // Log the submission in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Contact form submission:', validatedData)
    }

    // Here you would typically send an email or store the contact request
    // For example, using a service like Resend, SendGrid, or your own email service
    // This is a placeholder for the actual implementation

    // Example with Resend (uncomment and configure as needed)
    /*
    const { data, error } = await resend.emails.send({
      from: 'Contact Form <contact@yourdomain.com>',
      to: ['your-email@example.com'],
      subject: `New contact form submission from ${validatedData.name}`,
      text: `
        Name: ${validatedData.name}
        Email: ${validatedData.email}
        Message: ${validatedData.message}
      `,
    })

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`)
    }
    */

    // Simulate a delay for demonstration purposes
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return success response
    return {
      success: true,
      message: 'Your message has been sent successfully!',
    }
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((e) => e.message).join(', ')
      return {
        success: false,
        message: 'Validation failed',
        error: errorMessage,
      }
    }

    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'

    return {
      success: false,
      message: 'Failed to send your message',
      error: errorMessage,
    }
  }
}
