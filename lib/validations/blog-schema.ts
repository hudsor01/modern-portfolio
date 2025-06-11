import { z } from 'zod'

export const blogPostSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters long' })
    .max(100, { message: 'Title cannot exceed 100 characters' }),
  slug: z
    .string()
    .min(5, { message: 'Slug must be at least 5 characters long' })
    .max(100, { message: 'Slug cannot exceed 100 characters' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug must contain only lowercase letters, numbers, and hyphens',
    }),
  excerpt: z
    .string()
    .min(10, { message: 'Excerpt must be at least 10 characters long' })
    .max(200, { message: 'Excerpt cannot exceed 200 characters' }),
  content: z
    .string()
    .min(100, { message: 'Content must be at least 100 characters long' }),
  publishedAt: z.date(),
  updatedAt: z.date().optional(),
  coverImage: z.string().url({ message: 'Cover image must be a valid URL' }).optional(),
  tags: z.array(z.string()).min(1, { message: 'At least one tag is required' }),
  category: z.string(),
  featured: z.boolean().default(false),
})

export type BlogPost = z.infer<typeof blogPostSchema>