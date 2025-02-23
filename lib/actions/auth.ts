"use server"

import { cookies } from "next/headers"
import { env } from "@/lib/env"

export async function login(email: string, password: string) {
  if (email === env.ADMIN_EMAIL && password === env.ADMIN_PASSWORD) {
    const cookieStore = cookies()
    cookieStore.set("admin-session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    return { success: true }
  }
  return { success: false, error: "Invalid credentials" }
}

export async function logout() {
  const cookieStore = cookies()
  cookieStore.delete("admin-session")
  return { success: true }
}

