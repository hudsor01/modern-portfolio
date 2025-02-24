"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalyticsChart } from "./analytics-chart"
import { StatsCards } from "./stats-cards"
import { TrafficSources } from "./traffic-sources"
import { TopPages } from "./top-pages"
import { RecentActivity } from "./recent-activity"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"

interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  averageTime: number
  bounceRate: number
  chartData: {
    date: string
    views: number
    visitors: number
  }[]
  sources: {
    direct: number
    search: number
    social: number
    referral: number
  }
  topPages: {
    path: string
    views: number
    uniqueViews: number
  }[]
}

interface AnalyticsOverviewProps {
  data: AnalyticsData
}

export function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d")

  const exportData = () => {
    const csv = [
      ["Date", "Page Views", "Unique Visitors"],
      ...data.chartData.map((item) => [item.date, item.views.toString(), item.visitors.toString()]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics-${timeframe}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <Button onClick={exportData}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <StatsCards
            pageViews={data.pageViews}
            uniqueVisitors={data.uniqueVisitors}
            averageTime={data.averageTime}
            bounceRate={data.bounceRate}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <AnalyticsChart data={data.chartData} timeframe={timeframe} />
              </CardContent>
            </Card>
            <TrafficSources sources={data.sources} />
          </div>
        </TabsContent>

        <TabsContent value="traffic">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <TrafficSources sources={data.sources} detailed />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <div className="grid gap-6">
            <TopPages pages={data.topPages} />
            <RecentActivity />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

