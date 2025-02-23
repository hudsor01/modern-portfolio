"use server"

import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import sharp from "sharp"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

export async function uploadImage(file: File) {
  try {
    // Validate file
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.")
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size too large. Maximum size is 10MB.")
    }

    // Convert to Buffer for processing
    const buffer = Buffer.from(await file.arrayBuffer())

    // Process image with sharp
    const processedImage = await sharp(buffer)
      .resize(1200, 1200, {
        // Max dimensions
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 }) // Convert to WebP for better compression
      .toBuffer()

    // Upload to Vercel Blob
    const blob = await put(`${file.name.split(".")[0]}.webp`, processedImage, {
      access: "public",
      contentType: "image/webp",
      addRandomSuffix: true, // Adds random suffix to prevent naming conflicts
    })

    revalidatePath("/admin/blog")
    revalidatePath("/admin/projects")

    return blob.url
  } catch (error) {
    console.error("Error uploading image:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to upload image")
  }
}

