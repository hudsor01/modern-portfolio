"use server"

import { sql } from "@vercel/postgres"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

interface PageViewData {
  path: string
  referrer?: string
  userAgent?: string
  language?: string
  screenResolution?: string
}

export async function trackPageView(data: PageViewData) {
  try {
    // Get or create session ID
    let sessionId = cookies().get("session_id")?.value

    if (!sessionId) {
      sessionId = uuidv4()
      cookies().set("session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 30, // 30 minutes
      })
    }

    // Track page view
    await sql`
      INSERT INTO page_views (
        path,
        session_id,
        referrer,
        user_agent,
        language,
        screen_resolution
      ) VALUES (
        ${data.path},
        ${sessionId},
        ${data.referrer || null},
        ${data.userAgent || null},
        ${data.language || null},
        ${data.screenResolution || null}
      )
    `

    return { success: true }
  } catch (error) {
    console.error("Failed to track page view:", error)
    return { error: "Failed to track page view" }
  }
}

interface EventData {
  type: string
  path: string
  metadata?: Record<string, any>
}

export async function trackEvent(data: EventData) {
  try {
    const sessionId = cookies().get("session_id")?.value

    await sql`
      INSERT INTO analytics_events (
        event_type,
        path,
        session_id,
        metadata
      ) VALUES (
        ${data.type},
        ${data.path},
        ${sessionId || null},
        ${JSON.stringify(data.metadata || {})}
      )
    `

    return { success: true }
  } catch (error) {
    console.error("Failed to track event:", error)
    return { error: "Failed to track event" }
  }
}

