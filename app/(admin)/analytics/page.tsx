import { DashboardHeader } from "@/components/admin/dashboard-header"
import { DashboardShell } from "@/components/admin/dashboard-shell"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AnalyticsChart } from "@/components/admin/dashboard/analytics-chart"
import { TopPages } from "@/components/admin/dashboard/top-pages"
import { RecentActivity } from "@/components/admin/dashboard/recent-activity"
import { getAnalyticsData } from "@/lib/analytics/queries"

export default async function AnalyticsPage() {
  const { dailyStats, totals } = await getAnalyticsData()

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 min-h-screen p-8">
        <DashboardShell>
          <DashboardHeader
            heading="Analytics"
            text={`${totals.total_views.toLocaleString()} views across ${totals.total_pages} pages in the last 30 days.`}
          />
          <div className="grid gap-8">
            <AnalyticsChart data={dailyStats} />
            <div className="grid gap-8 md:grid-cols-2">
              <TopPages />
              <RecentActivity />
            </div>
          </div>
        </DashboardShell>
      </main>
    </div>
  )
}

