"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { VisitorMetrics } from "./visitor-metrics"
import { PageViewsChart } from "./page-views-chart"
import { TopContent } from "./top-content"
import { useWebVitals } from "@/hooks/use-web-vitals"
import { Download } from "lucide-react"

export function AnalyticsDashboard() {
  const { metrics } = useWebVitals()

  const handleExport = () => {
    // Implement CSV export of analytics data
    const data = [["Metric", "Value"], ...metrics.map((metric) => [metric.name, metric.value])]

    const csvContent = "data:text/csv;charset=utf-8," + data.map((row) => row.join(",")).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "analytics-export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={handleExport} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <VisitorMetrics />
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Page Views</CardTitle>
            <CardDescription>Daily page views over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <PageViewsChart />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="performance" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => (
            <Card key={metric.name}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="pages" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Content</CardTitle>
            <CardDescription>Your most viewed pages and content</CardDescription>
          </CardHeader>
          <CardContent>
            <TopContent />
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  )
}

