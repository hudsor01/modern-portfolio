import { NextResponse } from "next/server"
import { getBlogTags } from "@/lib/content"

export async function GET() {
  try {
    const tags = await getBlogTags()
    return NextResponse.json(tags)
  } catch (error) {
    console.error("Error fetching blog tags:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}

