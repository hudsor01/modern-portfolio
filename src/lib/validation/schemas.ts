/**
 * Comprehensive validation schemas for the entire application
 * Centralized validation using Zod for type safety and runtime validation
 */

import { z } from 'zod'

// Base validation schemas
export const emailSchema = z.string().email('Please enter a valid email address')
export const requiredStringSchema = z.string().min(1, 'This field is required')
export const optionalStringSchema = z.string().optional()
export const urlSchema = z.string().url('Please enter a valid URL')
export const phoneSchema = z.string().regex(
  /^(\+1[-.\s]?)?(\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
  'Please enter a valid phone number'
)

// Contact form validation
export const contactFormSchema = z.object({
  name: requiredStringSchema.min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  subject: requiredStringSchema.min(5, 'Subject must be at least 5 characters'),
  message: requiredStringSchema.min(10, 'Message must be at least 10 characters'),
  phone: phoneSchema.optional(),
  company: optionalStringSchema,
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Newsletter subscription validation
export const newsletterSchema = z.object({
  email: emailSchema,
  name: optionalStringSchema,
  interests: z.array(z.string()).optional(),
})

export type NewsletterData = z.infer<typeof newsletterSchema>

// Project data validation
export const projectSchema = z.object({
  id: requiredStringSchema,
  title: requiredStringSchema,
  description: requiredStringSchema,
  longDescription: optionalStringSchema,
  category: requiredStringSchema,
  technologies: z.array(z.string()),
  image: urlSchema.optional(),
  liveUrl: urlSchema.optional(),
  githubUrl: urlSchema.optional(),
  featured: z.boolean().default(false),
  year: z.number().min(2020).max(new Date().getFullYear()),
  client: optionalStringSchema,
  duration: optionalStringSchema,
  tags: z.array(z.string()).optional(),
  metrics: z.array(z.object({
    label: requiredStringSchema,
    value: requiredStringSchema,
    icon: z.any().optional(), // Icon component reference
  })).optional(),
})

export type ProjectData = z.infer<typeof projectSchema>

// Blog post validation
export const blogPostSchema = z.object({
  id: requiredStringSchema,
  title: requiredStringSchema,
  slug: requiredStringSchema,
  excerpt: requiredStringSchema,
  content: requiredStringSchema,
  author: requiredStringSchema,
  publishedAt: z.date(),
  updatedAt: z.date().optional(),
  tags: z.array(z.string()),
  category: requiredStringSchema,
  featured: z.boolean().default(false),
  readTime: z.number().positive(),
  seoTitle: optionalStringSchema,
  seoDescription: optionalStringSchema,
  coverImage: urlSchema.optional(),
})

export type BlogPostData = z.infer<typeof blogPostSchema>

// User profile validation
export const userProfileSchema = z.object({
  id: requiredStringSchema,
  name: requiredStringSchema,
  email: emailSchema,
  bio: optionalStringSchema,
  avatar: urlSchema.optional(),
  website: urlSchema.optional(),
  social: z.object({
    twitter: optionalStringSchema,
    linkedin: optionalStringSchema,
    github: optionalStringSchema,
  }).optional(),
  preferences: z.object({
    newsletter: z.boolean().default(false),
    notifications: z.boolean().default(true),
    theme: z.enum(['light', 'dark', 'system']).default('system'),
  }).optional(),
})

export type UserProfileData = z.infer<typeof userProfileSchema>

// API response validation
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.record(z.string(), z.unknown()).optional(),
  error: z.string().optional(),
  timestamp: z.string().datetime().optional(),
})

export type ApiResponse = z.infer<typeof apiResponseSchema>

// Search query validation
export const searchQuerySchema = z.object({
  query: requiredStringSchema.min(1, 'Search query cannot be empty'),
  category: z.enum(['all', 'projects', 'blog', 'pages']).default('all'),
  limit: z.number().min(1).max(50).default(10),
  offset: z.number().min(0).default(0),
})

export type SearchQuery = z.infer<typeof searchQuerySchema>

// File upload validation
export const fileUploadSchema = z.object({
  name: requiredStringSchema,
  type: z.string().regex(/^(image|document|video)\//),
  size: z.number().max(10 * 1024 * 1024), // 10MB max
  lastModified: z.number(),
})

export type FileUploadData = z.infer<typeof fileUploadSchema>

// Analytics event validation
export const analyticsEventSchema = z.object({
  event: requiredStringSchema,
  category: requiredStringSchema,
  label: optionalStringSchema,
  value: z.number().optional(),
  userId: optionalStringSchema,
  sessionId: requiredStringSchema,
  timestamp: z.date().default(() => new Date()),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>

// Environment validation
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().url(),
  RESEND_API_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  CONTACT_EMAIL: emailSchema,
  NEXT_PUBLIC_APP_URL: z.string().url(),
  ANALYZE: z.string().optional(),
})

export type EnvConfig = z.infer<typeof envSchema>

// Validation utilities
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`).join(', ')
      throw new Error(`Validation failed: ${errorMessages}`)
    }
    throw error
  }
}

export const safeValidateData = <T>(
  schema: z.ZodSchema<T>, 
  data: unknown
): { success: true; data: T } | { success: false; error: string } => {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`).join(', ')
      return { success: false, error: errorMessages }
    }
    return { success: false, error: 'Unknown validation error' }
  }
}