import * as z from "zod"

export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be less than 200 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(100, "Slug must be less than 100 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  tags: z.array(z.string()).default([]),
})

export const updatePostSchema = createPostSchema.partial()

export type CreatePost = z.infer<typeof createPostSchema>
export type UpdatePost = z.infer<typeof updatePostSchema>

