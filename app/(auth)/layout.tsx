import type React from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/actions/auth"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  // Redirect to admin if already logged in
  if (session) {
    redirect("/admin")
  }

  return <div className="min-h-screen">{children}</div>
}

