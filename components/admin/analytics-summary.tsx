import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAnalytics } from "@/lib/analytics"
import { Eye, MessageSquare, ArrowUpRight, Download } from "lucide-react"

export async function AnalyticsSummary() {
  const analytics = await getAnalytics()

  const stats = [
    {
      name: "Total Views",
      value: analytics.totalViews,
      icon: Eye,
      change: "+12%",
    },
    {
      name: "Blog Posts",
      value: analytics.totalPosts,
      icon: MessageSquare,
      change: "+3",
    },
    {
      name: "Resume Downloads",
      value: analytics.resumeDownloads,
      icon: Download,
      change: "+7%",
    },
  ]

  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.name}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <ArrowUpRight className="inline h-4 w-4 text-green-500" />
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

