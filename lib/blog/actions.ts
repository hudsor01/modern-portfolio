"use server"

import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  published: z.boolean().default(false),
})

class BlogError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any,
  ) {
    super(message)
    this.name = "BlogError"
  }
}

export async function createPost(data: z.infer<typeof postSchema>) {
  try {
    const validatedData = postSchema.parse(data)

    // Check if slug already exists
    const { rows: existing } = await sql`
      SELECT slug FROM posts WHERE slug = ${validatedData.slug}
    `

    if (existing.length > 0) {
      throw new BlogError("A post with this slug already exists", "DUPLICATE_SLUG")
    }

    const { rows } = await sql`
      INSERT INTO posts (
        title, 
        slug, 
        description, 
        content, 
        published,
        published_at
      )
      VALUES (
        ${validatedData.title},
        ${validatedData.slug},
        ${validatedData.description},
        ${validatedData.content},
        ${validatedData.published},
        ${validatedData.published ? new Date() : null}
      )
      RETURNING *
    `

    revalidatePath("/blog")
    revalidatePath("/admin/blog")

    return { post: rows[0] }
  } catch (error) {
    if (error instanceof BlogError) {
      throw error
    }

    console.error("Failed to create post:", error)
    throw new BlogError("Failed to create post", "DATABASE_ERROR", error)
  }
}

export async function updatePost(slug: string, data: z.infer<typeof postSchema>) {
  try {
    const validatedData = postSchema.parse(data)

    // Check if new slug already exists (if changed)
    if (slug !== validatedData.slug) {
      const { rows: existing } = await sql`
        SELECT slug FROM posts WHERE slug = ${validatedData.slug} AND slug != ${slug}
      `

      if (existing.length > 0) {
        throw new BlogError("A post with this slug already exists", "DUPLICATE_SLUG")
      }
    }

    const { rows } = await sql`
      UPDATE posts 
      SET title = ${validatedData.title},
          slug = ${validatedData.slug},
          description = ${validatedData.description},
          content = ${validatedData.content},
          published = ${validatedData.published},
          published_at = ${validatedData.published ? sql`COALESCE(published_at, CURRENT_TIMESTAMP)` : null},
          updated_at = CURRENT_TIMESTAMP
      WHERE slug = ${slug}
      RETURNING *
    `

    if (rows.length === 0) {
      throw new BlogError("Post not found", "NOT_FOUND")
    }

    revalidatePath("/blog")
    revalidatePath(`/blog/${slug}`)
    revalidatePath("/admin/blog")

    return { post: rows[0] }
  } catch (error) {
    if (error instanceof BlogError) {
      throw error
    }

    console.error("Failed to update post:", error)
    throw new BlogError("Failed to update post", "DATABASE_ERROR", error)
  }
}

