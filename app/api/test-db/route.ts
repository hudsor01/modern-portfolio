import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"
import { env } from "@/lib/env"

export async function GET() {
  try {
    // Test database connection
    const result = await sql`SELECT NOW()`

    // Return connection status and environment check
    return NextResponse.json({
      status: "success",
      timestamp: result.rows[0].now,
      database: {
        connected: true,
        url: env.DATABASE_URL.startsWith("postgres://"),
      },
      env: {
        hasPostgresUrl: !!env.POSTGRES_URL,
        hasPostgresUser: !!env.POSTGRES_USER,
        hasPostgresHost: !!env.POSTGRES_HOST,
        hasPostgresPassword: !!env.POSTGRES_PASSWORD,
        hasPostgresDatabase: !!env.POSTGRES_DATABASE,
      },
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to database",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

