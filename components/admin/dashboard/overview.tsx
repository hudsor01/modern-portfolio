import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/admin/dashboard/overview-chart"
import { RecentActivity } from "@/components/admin/dashboard/recent-activity"
import { OverviewStats } from "@/components/admin/dashboard/overview-stats"
import { NewsletterStats } from "@/components/admin/dashboard/newsletter-stats"
import { ContentOverview } from "@/components/admin/dashboard/content-overview"

export function DashboardOverview() {
  return (
    <div className="grid gap-6">
      <OverviewStats />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Site traffic and engagement over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ContentOverview />
        <NewsletterStats />
      </div>
    </div>
  )
}

