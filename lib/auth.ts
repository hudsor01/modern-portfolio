import { cookies } from "next/headers"

const ADMIN_CREDENTIALS = {
  username: "richard",
  password: "godmode69",
}

export async function login(username: string, password: string) {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    cookies().set("admin-session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    return true
  }
  return false
}

