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

export async function PATCH(request: Request, { params }: { params: { slug: string } }) {
  try {
    const body = await request.json()
    const { title, slug, description, image, demoUrl, githubUrl, tags } = projectSchema.parse(body)

    // Check if new slug already exists (if changed)
    if (slug !== params.slug) {
      const { rows: existing } = await sql`
        SELECT slug FROM projects 
        WHERE slug = ${slug} AND slug != ${params.slug}
      `

      if (existing.length > 0) {
        return NextResponse.json({ error: "A project with this slug already exists" }, { status: 400 })
      }
    }

    const { rows } = await sql`
      UPDATE projects 
      SET title = ${title},
          slug = ${slug},
          description = ${description},
          image = ${image},
          demo_url = ${demoUrl},
          github_url = ${githubUrl},
          tags = ${JSON.stringify(tags)},
          updated_at = CURRENT_TIMESTAMP
      WHERE slug = ${params.slug}
      RETURNING *
    `

    if (rows.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Failed to update project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { rows } = await sql`
      DELETE FROM projects 
      WHERE slug = ${params.slug}
      RETURNING *
    `

    if (rows.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { rows } = await sql`
      SELECT * FROM projects 
      WHERE slug = ${params.slug}
    `

    if (rows.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Failed to fetch project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

