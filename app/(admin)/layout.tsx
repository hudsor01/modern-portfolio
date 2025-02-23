import type React from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Providers } from "@/components/providers/providers"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check for admin session
  const session = cookies().get("admin-session")
  if (!session) {
    redirect("/login")
  }

  return (
    <Providers>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </Providers>
  )
}
