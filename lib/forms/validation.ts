import { z } from "zod"

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export const newsletterFormSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const mediaUploadSchema = z.object({
  file: z.any(),
  type: z.enum(["image", "document", "video"]),
  maxSize: z.number().optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
export type NewsletterFormData = z.infer<typeof newsletterFormSchema>

