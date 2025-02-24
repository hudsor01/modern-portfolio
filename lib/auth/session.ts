import { cookies } from "next/headers"
import { encrypt, decrypt } from "@/lib/crypto"
import { authConfig } from "./config"

interface SessionData {
  userId: string
  email: string
  role: "admin" | "user"
  createdAt: number
}

export async function createSession(data: Omit<SessionData, "createdAt">) {
  const sessionData: SessionData = {
    ...data,
    createdAt: Date.now(),
  }

  const encrypted = await encrypt(JSON.stringify(sessionData))

  cookies().set("session", encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: authConfig.session.maxAge,
  })

  return sessionData
}

export async function getSession(): Promise<SessionData | null> {
  const session = cookies().get("session")

  if (!session) return null

  try {
    const decrypted = await decrypt(session.value)
    const sessionData: SessionData = JSON.parse(decrypted)

    // Check if session is expired
    if (Date.now() - sessionData.createdAt > authConfig.session.maxAge * 1000) {
      cookies().delete("session")
      return null
    }

    return sessionData
  } catch {
    return null
  }
}

export async function deleteSession() {
  cookies().delete("session")
}

