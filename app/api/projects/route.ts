import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, slug, description, image, demoUrl, githubUrl, tags } = projectSchema.parse(body)

    // Check if slug already exists
    const { rows: existing } = await sql`
      SELECT slug FROM projects WHERE slug = ${slug}
    `

    if (existing.length > 0) {
      return NextResponse.json({ error: "A project with this slug already exists" }, { status: 400 })
    }

    const { rows } = await sql`
      INSERT INTO projects (
        title, 
        slug, 
        description, 
        image, 
        demo_url, 
        github_url, 
        tags
      )
      VALUES (
        ${title}, 
        ${slug}, 
        ${description}, 
        ${image}, 
        ${demoUrl}, 
        ${githubUrl}, 
        ${JSON.stringify(tags)}
      )
      RETURNING *
    `

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Failed to create project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT * FROM projects 
      ORDER BY created_at DESC
    `
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

