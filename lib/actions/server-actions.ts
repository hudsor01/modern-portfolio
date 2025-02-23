"use server"

import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  status: z.enum(["draft", "published"]),
  slug: z.string(),
})

export async function getPosts() {
  try {
    const { rows } = await sql`
      SELECT 
        id, 
        title, 
        status, 
        created_at as "createdAt", 
        updated_at as "updatedAt"
      FROM posts
      ORDER BY created_at DESC
    `
    return rows
  } catch (error) {
    console.error("Error getting posts:", error)
    throw new Error("Failed to fetch posts")
  }
}

export async function createPost(formData: FormData) {
  try {
    const validatedFields = postSchema.parse({
      title: formData.get("title"),
      content: formData.get("content"),
      status: formData.get("status"),
      slug: formData.get("slug"),
    })

    const { rows } = await sql`
      INSERT INTO posts (title, content, status, slug)
      VALUES (${validatedFields.title}, ${validatedFields.content}, ${validatedFields.status}, ${validatedFields.slug})
      RETURNING *
    `

    revalidatePath("/admin/posts")
    return { success: true, post: rows[0] }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create post",
    }
  }
}

export async function deletePost(id: string) {
  try {
    await sql`DELETE FROM posts WHERE id = ${id}`
    revalidatePath("/admin/posts")
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete post",
    }
  }
}

