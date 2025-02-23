import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ status: "Server actions are working correctly" })
}

export async function testServerAction() {
  "use server"
  return { success: true, message: "Server action executed successfully" }
}

