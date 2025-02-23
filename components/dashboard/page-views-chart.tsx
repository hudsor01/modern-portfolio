"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useAnalytics } from "@/hooks/use-analytics"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"

export function PageViewsChart() {
  const { data, isLoading } = useAnalytics()

  if (isLoading) {
    return <Card className="w-full h-[350px] flex items-center justify-center">Loading analytics...</Card>
  }

  if (!data?.pageViews) {
    return <Card className="w-full h-[350px] flex items-center justify-center">No data available</Card>
  }

  // Format data for chart
  const chartData = data.topPages.map((page) => ({
    name: page.path,
    views: page.views,
    visitors: page.uniqueVisitors,
    date: format(new Date(), "MMM d"),
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} name="Page Views" />
        <Line type="monotone" dataKey="visitors" stroke="#82ca9d" strokeWidth={2} name="Unique Visitors" />
      </LineChart>
    </ResponsiveContainer>
  )
}

