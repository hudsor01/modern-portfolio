import type React from "react"
import { requireAdmin } from "@/lib/actions/auth"
import AdminNav from "@/components/admin-nav"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This will redirect to /login if not authenticated
  await requireAdmin()

  return (
    <div className="min-h-screen">
      <AdminNav />
      <main className="container py-6">{children}</main>
    </div>
  )
}

