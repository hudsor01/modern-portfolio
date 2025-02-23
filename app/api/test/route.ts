import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "success",
    message: "API route is working correctly",
    timestamp: new Date().toISOString(),
  })
}

