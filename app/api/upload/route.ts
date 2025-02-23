import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { put } from "@vercel/blob"
import { rateLimit } from "@/lib/api/rate-limit"
import { successResponse, errorResponse } from "@/lib/api/response"

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const adminSession = cookies().get("admin-session")
    if (!adminSession) {
      return errorResponse("Unauthorized", 401)
    }

    // Check rate limit
    const rateLimitResult = await rateLimit("upload")
    if (!rateLimitResult.success) {
      return errorResponse("Too many requests", 429)
    }

    const form = await req.formData()
    const file = form.get("file") as File
    if (!file) {
      return errorResponse("No file provided")
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      return errorResponse("Invalid file type")
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return errorResponse("File too large")
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/upload/handle",
    })

    return successResponse({
      url: blob.url,
      size: blob.size,
    })
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message)
    }
    return errorResponse("Internal server error", 500)
  }
}

