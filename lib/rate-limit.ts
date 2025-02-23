import { db } from "@/lib/db"
import { sql } from "drizzle-orm"

// Simple rate limiting using database
export async function rateLimit(identifier: string, limit = 5, window = 60000) {
  try {
    // Clean up old attempts
    await db.execute(sql`
      DELETE FROM rate_limit 
      WHERE identifier = ${identifier} 
      AND timestamp < NOW() - INTERVAL '${window} milliseconds'
    `)

    // Count recent attempts
    const result = await db.execute<{ count: number }>(sql`
      SELECT COUNT(*) as count 
      FROM rate_limit 
      WHERE identifier = ${identifier}
    `)

    if (result[0].count >= limit) {
      return { success: false }
    }

    // Record new attempt
    await db.execute(sql`
      INSERT INTO rate_limit (identifier, timestamp)
      VALUES (${identifier}, NOW())
    `)

    return { success: true }
  } catch (error) {
    console.error("Rate limit error:", error)
    // If rate limiting fails, allow the request
    return { success: true }
  }
}

