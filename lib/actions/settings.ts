"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@vercel/postgres"
import { z } from "zod"

const SettingsSchema = z.object({
  title: z.string(),
  description: z.string(),
  ogImage: z.string().url().optional(),
  twitterHandle: z.string().optional(),
  githubHandle: z.string().optional(),
  linkedinHandle: z.string().optional(),
})

type Settings = z.infer<typeof SettingsSchema>

// Mark individual functions with 'use server'
export async function updateSettings(data: Settings): Promise<{ success: boolean }> {
  "use server"

  try {
    const { title, description, ogImage, twitterHandle, githubHandle, linkedinHandle } = SettingsSchema.parse(data)

    await sql`
      INSERT INTO settings (
        title, description, og_image, twitter_handle, github_handle, linkedin_handle
      )
      VALUES (
        ${title}, ${description}, ${ogImage}, ${twitterHandle}, ${githubHandle}, ${linkedinHandle}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        og_image = EXCLUDED.og_image,
        twitter_handle = EXCLUDED.twitter_handle,
        github_handle = EXCLUDED.github_handle,
        linkedin_handle = EXCLUDED.linkedin_handle,
        updated_at = NOW()
    `

    revalidatePath("/admin/settings")
    return { success: true }
  } catch (error) {
    console.error("Error updating settings:", error)
    throw new Error("Failed to update settings")
  }
}

export async function getSettings(): Promise<Settings | null> {
  "use server"

  try {
    const { rows } = await sql`SELECT * FROM settings LIMIT 1`
    return rows[0] || null
  } catch (error) {
    console.error("Error getting settings:", error)
    throw new Error("Failed to get settings")
  }
}

