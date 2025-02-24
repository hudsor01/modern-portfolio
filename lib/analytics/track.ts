"use server"

import { sql } from "@vercel/postgres"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

interface EventData {
  type: string
  path: string
  metadata?: Record<string, any>
  sessionId?: string
}

export async function trackEvent(data: EventData) {
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

    // Track the event
    await sql`
      INSERT INTO analytics_events (
        event_type,
        path,
        session_id,
        metadata,
        created_at
      ) VALUES (
        ${data.type},
        ${data.path},
        ${sessionId},
        ${JSON.stringify(data.metadata || {})},
        NOW()
      )
    `

    // Track page view if it's a page_view event
    if (data.type === "page_view") {
      await sql`
        INSERT INTO page_views (path, session_id, views)
        VALUES (${data.path}, ${sessionId}, 1)
        ON CONFLICT (path, date)
        DO UPDATE SET views = page_views.views + 1
      `
    }

    // Track user journey
    await sql`
      INSERT INTO user_journeys (
        session_id,
        event_type,
        path,
        created_at
      ) VALUES (
        ${sessionId},
        ${data.type},
        ${data.path},
        NOW()
      )
    `

    return { success: true }
  } catch (error) {
    console.error("Failed to track event:", error)
    return { error: "Failed to track event" }
  }
}

export async function trackConversion(type: string, value?: number) {
  try {
    const sessionId = cookies().get("session_id")?.value

    if (!sessionId) return { error: "No session found" }

    await sql`
      INSERT INTO conversions (
        session_id,
        conversion_type,
        value,
        created_at
      ) VALUES (
        ${sessionId},
        ${type},
        ${value || 0},
        NOW()
      )
    `

    return { success: true }
  } catch (error) {
    console.error("Failed to track conversion:", error)
    return { error: "Failed to track conversion" }
  }
}

