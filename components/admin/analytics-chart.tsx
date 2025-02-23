"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface AnalyticsData {
  date: string
  views: number
  visitors: number
}

export function AnalyticsChart({ data }: { data?: AnalyticsData[] }) {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d")

  // Sample data - replace with real data from your analytics
  const sampleData = [
    { date: "2024-02-01", views: 100, visitors: 80 },
    { date: "2024-02-02", views: 120, visitors: 90 },
    // ... more data points
  ]

  const chartData = data || sampleData

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Site Analytics</CardTitle>
        <div className="flex space-x-2">
          <Button variant={timeframe === "7d" ? "default" : "outline"} size="sm" onClick={() => setTimeframe("7d")}>
            7D
          </Button>
          <Button variant={timeframe === "30d" ? "default" : "outline"} size="sm" onClick={() => setTimeframe("30d")}>
            30D
          </Button>
          <Button variant={timeframe === "90d" ? "default" : "outline"} size="sm" onClick={() => setTimeframe("90d")}>
            90D
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#465fff" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="visitors" stroke="#ffc1df" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

