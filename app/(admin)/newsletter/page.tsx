import { DashboardHeader } from "@/components/admin/dashboard-header"
import { DashboardShell } from "@/components/admin/dashboard-shell"
import { AdminSidebar } from "@/components/admin/sidebar"
import { NewsletterDashboard } from "@/components/admin/newsletter/newsletter-dashboard"

export default async function NewsletterPage() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 min-h-screen p-8">
        <DashboardShell>
          <DashboardHeader heading="Newsletter Management" text="Manage your newsletter subscribers and campaigns." />
          <div className="grid gap-8">
            <NewsletterDashboard />
          </div>
        </DashboardShell>
      </main>
    </div>
  )
}

