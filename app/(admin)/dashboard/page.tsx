import { DashboardHeader } from "@/components/admin/dashboard-header"
import { DashboardShell } from "@/components/admin/dashboard-shell"
import { AdminSidebar } from "@/components/admin/sidebar"
import { DashboardOverview } from "@/components/admin/dashboard/overview"

export default async function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <DashboardShell className="p-8">
          <DashboardHeader heading="Welcome Back" text="Here's an overview of your site's performance" />
          <div className="mt-8">
            <DashboardOverview />
          </div>
        </DashboardShell>
      </main>
    </div>
  )
}

