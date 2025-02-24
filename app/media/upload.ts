import { put } from "@vercel/blob"
import { db, media } from "@/lib/db"
import { eq } from "drizzle-orm"
import type { MediaFile } from "./types"

export async function uploadMedia(file: File): Promise<MediaFile> {
  // Upload to Vercel Blob
  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
  })

  // Get image dimensions if it's an image
  let width: number | undefined
  let height: number | undefined

  if (file.type.startsWith("image/")) {
    const image = await createImageBitmap(file)
    width = image.width
    height = image.height
  }

  // Store in database
  const [mediaFile] = await db
    .insert(media)
    .values({
      filename: file.name,
      url: blob.url,
      size: file.size,
      type: file.type,
      width,
      height,
    })
    .returning()

  return mediaFile
}

export async function deleteMedia(id: string): Promise<boolean> {
  try {
    await db.delete(media).where(eq(media.id, id))
    return true
  } catch (error) {
    console.error("Error deleting media:", error)
    return false
  }
}

