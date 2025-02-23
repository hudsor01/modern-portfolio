import { Suspense } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard"
import { AnalyticsSkeleton } from "@/components/dashboard/analytics-skeleton"

export const metadata = {
  title: "Analytics | Admin Dashboard",
  description: "View your portfolio analytics and performance metrics",
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader heading="Analytics" text="Monitor your portfolio's performance and visitor engagement." />
      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsDashboard />
      </Suspense>
    </div>
  )
}

