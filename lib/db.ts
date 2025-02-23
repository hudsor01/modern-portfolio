import { sql } from "@vercel/postgres"
import { cache } from "react"
import { env } from "@/lib/env"

class DatabaseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "DatabaseError"
  }
}

// Verify database connection
const verifyConnection = async () => {
  try {
    const { rows } = await sql`SELECT NOW()`
    console.log("Database connection verified:", rows[0])
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

// Initialize connection pool
let isConnected = false

export const db = {
  connect: async () => {
    if (!isConnected) {
      isConnected = await verifyConnection()
    }
    return isConnected
  },

  query: cache(async <T = any>(query: string, values: any[] = []): Promise<{ rows: T[]; rowCount: number }> => {
    try {
      if (!isConnected) {
        await db.connect()
      }
      const result = await sql.query(query, values)
      return { rows: result.rows as T[], rowCount: result.rowCount }
    } catch (error) {
      console.error("Database query error:", error)
      throw new DatabaseError(error instanceof Error ? error.message : "Database query failed")
    }
  }),

  // Helper method to check connection
  checkConnection: async () => {
    try {
      const result = await sql`SELECT NOW()`
      return {
        connected: true,
        timestamp: result.rows[0].now,
        database: env.DATABASE_URL ? "Connected" : "Not Connected",
      }
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  },
}

// Export the sql function for direct use when needed
export { sql }

