import { sql } from "@vercel/postgres"
import { cache } from "react"
import type { MediaItem } from "./types"

export const getMediaItems = cache(async () => {
  const { rows } = await sql<MediaItem>`
    SELECT * FROM media
    ORDER BY uploaded_at DESC
  `
  return rows
})

export const getMediaItem = cache(async (id: string) => {
  const {
    rows: [media],
  } = await sql<MediaItem>`
    SELECT * FROM media
    WHERE id = ${id}
  `
  return media
})

