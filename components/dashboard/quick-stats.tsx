"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChartIcon as Bar, Eye, MessageSquare, TrendingUp } from "lucide-react"

const stats = [
  {
    name: "Total Views",
    value: "21,234",
    change: "+12%",
    icon: Eye,
  },
  {
    name: "Blog Posts",
    value: "32",
    change: "+2",
    icon: MessageSquare,
  },
  {
    name: "Projects",
    value: "12",
    change: "+1",
    icon: Bar,
  },
  {
    name: "Engagement Rate",
    value: "4.3%",
    change: "+0.3%",
    icon: TrendingUp,
  },
]

export function QuickStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

