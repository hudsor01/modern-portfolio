"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Eye, Clock, ArrowUpRight } from "lucide-react"
import { useAnalytics } from "@/hooks/use-analytics"

export function VisitorMetrics() {
  const { data } = useAnalytics()

  const metrics = [
    {
      title: "Total Visitors",
      value: data?.visitors ?? 0,
      icon: Users,
    },
    {
      title: "Page Views",
      value: data?.pageViews ?? 0,
      icon: Eye,
    },
    {
      title: "Avg. Session",
      value: `${data?.avgSession ?? 0}m`,
      icon: Clock,
    },
    {
      title: "Bounce Rate",
      value: `${data?.bounceRate ?? 0}%`,
      icon: ArrowUpRight,
    },
  ]

  return metrics.map((metric) => (
    <Card key={metric.title}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
        <metric.icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{metric.value}</div>
      </CardContent>
    </Card>
  ))
}

