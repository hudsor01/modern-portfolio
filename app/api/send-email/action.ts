'use server'

import { Resend } from 'resend'
import { z } from 'zod'

// Email validation schema
const ContactFormSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters').max(50),
	email: z.string().email('Please enter a valid email address'),
	message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
})

type ContactFormData = z.infer<typeof ContactFormSchema>

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(formData: ContactFormData) {
	try {
		// Validate form data
		const validatedData = ContactFormSchema.parse(formData)

		// Create email data
		const { name, email, message } = validatedData

		// Send email using Resend
		const { data, error } = await resend.emails.send({
			from: 'Portfolio Contact Form <contact@yourdomain.com>',
			to: ['your-email@example.com'], // Your email address
			subject: `Portfolio Contact: ${name}`,
			replyTo: email,
			text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
		})

		if (error) {
			console.error('Email sending error:', error)
			return { success: false, error: 'Failed to send email' }
		}

		return { success: true, data }
	} catch (error) {
		console.error('Contact form error:', error)

		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: 'Validation error',
				validationErrors: error.flatten().fieldErrors,
			}
		}

		return { success: false, error: 'An unexpected error occurred' }
	}
}
