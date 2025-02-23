"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/admin/dashboard/overview"
import { RecentActivity } from "@/components/admin/dashboard/recent-activity"
import { ContentOverview } from "@/components/admin/dashboard/content-overview"
import { OverviewStats } from "@/components/admin/dashboard/overview-stats"

export function AnalyticsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <Overview />
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentActivity />
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardContent>
          <ContentOverview />
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardContent>
          <OverviewStats />
        </CardContent>
      </Card>
    </div>
  )
}

