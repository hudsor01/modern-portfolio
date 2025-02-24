import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAnalytics } from "@/lib/analytics/queries"
import { formatNumber } from "@/lib/utils"
import { Eye, Users, Clock, ArrowUp } from "lucide-react"

export async function StatsCards() {
  const analytics = await getAnalytics()

  const stats = [
    {
      name: "Total Views",
      value: formatNumber(analytics.totals.total_views),
      change: "+12%",
      icon: Eye,
    },
    {
      name: "Unique Visitors",
      value: formatNumber(analytics.totals.total_visitors),
      change: "+8%",
      icon: Users,
    },
    {
      name: "Avg. Time on Site",
      value: "2m 45s",
      change: "+15%",
      icon: Clock,
    },
    {
      name: "Bounce Rate",
      value: "42%",
      change: "-5%",
      icon: ArrowUp,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">
              <span className={stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}>{stat.change}</span>{" "}
              from last month
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

