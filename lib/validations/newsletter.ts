import * as z from "zod"

export const newsletterSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters"),
})

export type NewsletterData = z.infer<typeof newsletterSchema>

