"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity, Clock, Users, MousePointerClick } from "lucide-react"

interface ContentMetricsProps {
  contentId: string
  metrics: {
    views: number[]
    uniqueViews: number[]
    averageTimeOnPage: number[]
    bounceRate: number[]
    dates: string[]
  }
}

export function ContentMetrics({ contentId, metrics }: ContentMetricsProps) {
  const data = metrics.dates.map((date, i) => ({
    date,
    views: metrics.views[i],
    uniqueViews: metrics.uniqueViews[i],
    averageTime: metrics.averageTimeOnPage[i],
    bounceRate: metrics.bounceRate[i],
  }))

  const stats = [
    {
      title: "Total Views",
      value: metrics.views.reduce((a, b) => a + b, 0),
      icon: Activity,
    },
    {
      title: "Unique Visitors",
      value: metrics.uniqueViews.reduce((a, b) => a + b, 0),
      icon: Users,
    },
    {
      title: "Avg. Time on Page",
      value: formatTime(metrics.averageTimeOnPage.reduce((a, b) => a + b, 0) / metrics.averageTimeOnPage.length),
      icon: Clock,
    },
    {
      title: "Bounce Rate",
      value: `${Math.round((metrics.bounceRate.reduce((a, b) => a + b, 0) / metrics.bounceRate.length) * 100)}%`,
      icon: MousePointerClick,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{stat.title}</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="views">
                <TabsList>
                  <TabsTrigger value="views">Views</TabsTrigger>
                  <TabsTrigger value="time">Time on Page</TabsTrigger>
                  <TabsTrigger value="bounce">Bounce Rate</TabsTrigger>
                </TabsList>
                <div className="mt-4 h-[300px]">
                  <TabsContent value="views">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="views" stroke="#8884d8" name="Total Views" />
                        <Line type="monotone" dataKey="uniqueViews" stroke="#82ca9d" name="Unique Views" />
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  <TabsContent value="time">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="averageTime" stroke="#8884d8" name="Average Time (seconds)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  <TabsContent value="bounce">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="bounceRate" stroke="#8884d8" name="Bounce Rate (%)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)
  return `${minutes}m ${remainingSeconds}s`
}

