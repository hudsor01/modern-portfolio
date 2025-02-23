import { DashboardHeader } from "@/components/admin/dashboard-header"
import { DashboardShell } from "@/components/admin/dashboard-shell"
import { AdminSidebar } from "@/components/admin/sidebar"
import { RSSManager } from "@/components/admin/rss/rss-manager"

export default function RSSPage() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 min-h-screen p-8">
        <DashboardShell>
          <DashboardHeader heading="RSS Feeds" text="Manage your RSS feeds and syndication settings." />
          <div className="grid gap-8">
            <RSSManager />
          </div>
        </DashboardShell>
      </main>
    </div>
  )
}

