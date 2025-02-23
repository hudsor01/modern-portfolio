import { cookies } from "next/headers"
import { encrypt, decrypt } from "./crypto"

const SESSION_COOKIE = "session"
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export interface Session {
  id: string
  userId: string
  email: string
  role: "admin" | "user"
  expires: Date
}

export async function createSession(data: Omit<Session, "id" | "expires">): Promise<Session> {
  const session: Session = {
    id: crypto.randomUUID(),
    ...data,
    expires: new Date(Date.now() + MAX_AGE * 1000),
  }

  // Encrypt session data
  const encrypted = await encrypt(JSON.stringify(session))

  // Set cookie
  cookies().set(SESSION_COOKIE, encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  })

  return session
}

export async function getSession(): Promise<Session | null> {
  const cookie = cookies().get(SESSION_COOKIE)
  if (!cookie) return null

  try {
    const decrypted = await decrypt(cookie.value)
    const session: Session = JSON.parse(decrypted)

    // Check if session is expired
    if (new Date(session.expires) < new Date()) {
      await deleteSession()
      return null
    }

    return session
  } catch {
    return null
  }
}

export async function deleteSession() {
  cookies().delete(SESSION_COOKIE)
}

