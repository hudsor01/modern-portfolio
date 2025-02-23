import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  try {
    await sql`DELETE FROM posts WHERE slug = ${params.slug}`
    revalidatePath("/admin/posts")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}

