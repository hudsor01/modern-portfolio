import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z
    .string()
    .min(5, { message: 'Subject must be at least 5 characters long' })
    .max(100, { message: 'Subject cannot exceed 100 characters' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters long' })
    .max(1000, { message: 'Message cannot exceed 1000 characters' }),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>