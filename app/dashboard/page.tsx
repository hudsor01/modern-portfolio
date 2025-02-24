import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Overview } from "@/components/dashboard/overview"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickStats } from "@/components/dashboard/quick-stats"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your portfolio content and view analytics",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Overview of your portfolio performance and recent activity" />
      <div className="grid gap-4 md:gap-8">
        <QuickStats />
        <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-2">
          <Overview />
          <RecentActivity />
        </div>
      </div>
    </DashboardShell>
  )
}

