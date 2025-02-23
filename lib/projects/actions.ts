"use server"

import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  image: z.string().optional(),
  demoUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  tags: z.array(z.string()),
})

export async function createProject(data: z.infer<typeof projectSchema>) {
  try {
    const { title, slug, description, image, demoUrl, githubUrl, tags } = projectSchema.parse(data)

    await sql`
      INSERT INTO projects (title, slug, description, image, demo_url, github_url, tags)
      VALUES (${title}, ${slug}, ${description}, ${image}, ${demoUrl}, ${githubUrl}, ${JSON.stringify(tags)})
    `

    revalidatePath("/projects")
    revalidatePath("/admin/projects")
    return { success: true }
  } catch (error) {
    console.error("Failed to create project:", error)
    return { error: "Failed to create project" }
  }
}

export async function updateProject(slug: string, data: z.infer<typeof projectSchema>) {
  try {
    const { title, description, image, demoUrl, githubUrl, tags } = projectSchema.parse(data)

    await sql`
      UPDATE projects 
      SET title = ${title},
          description = ${description},
          image = ${image},
          demo_url = ${demoUrl},
          github_url = ${githubUrl},
          tags = ${JSON.stringify(tags)},
          updated_at = CURRENT_TIMESTAMP
      WHERE slug = ${slug}
    `

    revalidatePath("/projects")
    revalidatePath(`/projects/${slug}`)
    revalidatePath("/admin/projects")
    return { success: true }
  } catch (error) {
    console.error("Failed to update project:", error)
    return { error: "Failed to update project" }
  }
}

export async function deleteProject(slug: string) {
  try {
    await sql`
      DELETE FROM projects 
      WHERE slug = ${slug}
    `

    revalidatePath("/projects")
    revalidatePath("/admin/projects")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete project:", error)
    return { error: "Failed to delete project" }
  }
}

export async function getProjects() {
  try {
    const { rows } = await sql`
      SELECT * FROM projects 
      ORDER BY created_at DESC
    `
    return { projects: rows }
  } catch (error) {
    console.error("Failed to get projects:", error)
    return { error: "Failed to get projects" }
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const { rows } = await sql`
      SELECT * FROM projects 
      WHERE slug = ${slug}
    `
    return { project: rows[0] }
  } catch (error) {
    console.error("Failed to get project:", error)
    return { error: "Failed to get project" }
  }
}

