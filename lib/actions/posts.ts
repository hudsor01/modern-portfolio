"use server"

import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"

export async function getPosts() {
  const { rows } = await sql`
    SELECT * FROM posts 
    ORDER BY created_at DESC
  `
  return rows
}

export async function getPost(slug: string) {
  const { rows } = await sql`
    SELECT * FROM posts 
    WHERE slug = ${slug}
  `
  return rows[0]
}

export async function createPost(data: any) {
  const { rows } = await sql`
    INSERT INTO posts (title, slug, content, status)
    VALUES (${data.title}, ${data.slug}, ${data.content}, ${data.status})
    RETURNING *
  `
  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  return rows[0]
}

export async function updatePost(slug: string, data: any) {
  const { rows } = await sql`
    UPDATE posts 
    SET title = ${data.title}, 
        content = ${data.content}, 
        status = ${data.status},
        updated_at = CURRENT_TIMESTAMP
    WHERE slug = ${slug}
    RETURNING *
  `
  revalidatePath("/admin/blog")
  revalidatePath(`/blog/${slug}`)
  return rows[0]
}

