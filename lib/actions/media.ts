"use server"

import { revalidatePath } from "next/cache"
import { db, media } from "@/lib/db"
import { eq } from "drizzle-orm"
import { deleteMedia } from "@/lib/media/upload"

export async function deleteMediaAction(id: string) {
  try {
    const success = await deleteMedia(id)

    if (success) {
      revalidatePath("/admin/media")
      return { success: true }
    }

    return { success: false, error: "Failed to delete media" }
  } catch (error) {
    console.error("Delete media error:", error)
    return { success: false, error: "Failed to delete media" }
  }
}

export async function getMediaAction(id: string) {
  try {
    const file = await db.query.media.findFirst({
      where: eq(media.id, id),
    })

    return { success: true, file }
  } catch (error) {
    console.error("Get media error:", error)
    return { success: false, error: "Failed to get media" }
  }
}

