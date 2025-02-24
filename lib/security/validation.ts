import { z } from "zod"
import sanitizeHtml from "sanitize-html"
import { rateLimit } from "@/lib/rate-limit"

// Base content schema
const baseContentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  content: z.string().min(1),
})

// Blog post schema
export const blogPostSchema = baseContentSchema.extend({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  tags: z.array(z.string()),
  published: z.boolean(),
})

// Project schema
export const projectSchema = baseContentSchema.extend({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  demoUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  tags: z.array(z.string()),
})

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
})

// Sanitize HTML content
export function sanitizeContent(content: string) {
  return sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title"],
    },
  })
}

// Rate limiting middleware
export async function validateRateLimit(identifier: string, limit = 100, window = 900) {
  const { success, remaining } = await rateLimit(identifier)

  if (!success) {
    throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(window / 60)} minutes.`)
  }

  return { success, remaining }
}

// Request validation middleware
export async function validateRequest<T>(
  data: unknown,
  schema: z.Schema<T>,
  options?: {
    sanitize?: boolean
    rateLimit?: {
      limit?: number
      window?: number
    }
  },
): Promise<T> {
  // Validate rate limit if specified
  if (options?.rateLimit) {
    const identifier = typeof data === "object" && data !== null ? JSON.stringify(data) : String(data)
    await validateRateLimit(identifier, options.rateLimit.limit, options.rateLimit.window)
  }

  // Validate schema
  const validated = schema.parse(data)

  // Sanitize content if needed
  if (options?.sanitize && "content" in validated) {
    return {
      ...validated,
      content: sanitizeContent(validated.content),
    }
  }

  return validated
}

