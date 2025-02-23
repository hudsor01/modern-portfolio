"use server"

import { sql } from "@vercel/postgres"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  slug: z.string().min(1),
  image: z.string().url().optional(),
  github: z.string().url().optional(),
  demo: z.string().url().optional(),
  technologies: z.array(z.string()),
  featured: z.boolean().default(false),
})

export async function getProject(slug: string) {
  try {
    const { rows } = await sql`
      SELECT * FROM projects WHERE slug = ${slug}
    `
    return rows[0] || null
  } catch (error) {
    console.error("Error getting project:", error)
    throw new Error("Failed to get project")
  }
}

export async function createProject(formData: FormData) {
  try {
    const validatedFields = projectSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      slug: formData.get("slug"),
      image: formData.get("image"),
      github: formData.get("github"),
      demo: formData.get("demo"),
      technologies: JSON.parse(formData.get("technologies") as string),
      featured: formData.get("featured") === "true",
    })

    await sql`
      INSERT INTO projects (
        title, description, slug, image_url, github_url, demo_url, 
        technologies, featured
      ) VALUES (
        ${validatedFields.title},
        ${validatedFields.description},
        ${validatedFields.slug},
        ${validatedFields.image},
        ${validatedFields.github},
        ${validatedFields.demo},
        ${JSON.stringify(validatedFields.technologies)},
        ${validatedFields.featured}
      )
    `

    revalidatePath("/projects")
    revalidatePath("/admin/projects")
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create project",
    }
  }
}

export async function updateProject(slug: string, formData: FormData) {
  try {
    const validatedFields = projectSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      slug: formData.get("slug"),
      image: formData.get("image"),
      github: formData.get("github"),
      demo: formData.get("demo"),
      technologies: JSON.parse(formData.get("technologies") as string),
      featured: formData.get("featured") === "true",
    })

    await sql`
      UPDATE projects 
      SET 
        title = ${validatedFields.title},
        description = ${validatedFields.description},
        slug = ${validatedFields.slug},
        image_url = ${validatedFields.image},
        github_url = ${validatedFields.github},
        demo_url = ${validatedFields.demo},
        technologies = ${JSON.stringify(validatedFields.technologies)},
        featured = ${validatedFields.featured},
        updated_at = NOW()
      WHERE slug = ${slug}
    `

    revalidatePath("/projects")
    revalidatePath(`/projects/${validatedFields.slug}`)
    revalidatePath("/admin/projects")
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update project",
    }
  }
}

export async function deleteProject(slug: string) {
  try {
    await sql`DELETE FROM projects WHERE slug = ${slug}`
    revalidatePath("/projects")
    revalidatePath("/admin/projects")
    return { success: true }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete project",
    }
  }
}

