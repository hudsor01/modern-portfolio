import { NextResponse } from "next/server"
import { getBlogCategories } from "@/lib/content"

export async function GET() {
  try {
    const categories = await getBlogCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching blog categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

