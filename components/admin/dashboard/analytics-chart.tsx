"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { formatDate } from "@/lib/utils"

interface AnalyticsData {
  date: string
  views: number
  visitors: number
}

interface AnalyticsChartProps {
  data: AnalyticsData[]
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d")

  const filterData = (data: AnalyticsData[]) => {
    const now = new Date()
    const days = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90
    const cutoff = new Date(now.setDate(now.getDate() - days))

    return data.filter((item) => new Date(item.date) >= cutoff)
  }

  const filteredData = filterData(data)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Analytics Overview</CardTitle>
        <div className="flex items-center gap-2">
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
            <LineChart data={filteredData}>
              <XAxis
                dataKey="date"
                tickFormatter={(value) => formatDate(value)}
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Views</span>
                            <span className="font-bold text-muted-foreground">{payload[0].value}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Visitors</span>
                            <span className="font-bold text-muted-foreground">{payload[1].value}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line type="monotone" dataKey="views" strokeWidth={2} stroke="hsl(var(--primary))" dot={false} />
              <Line type="monotone" dataKey="visitors" strokeWidth={2} stroke="hsl(var(--secondary))" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

