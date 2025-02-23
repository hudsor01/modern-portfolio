import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAnalytics } from "@/lib/analytics"
import { Eye, FileText, Download, Mail } from "lucide-react"

export async function OverviewStats() {
  const analytics = await getAnalytics()

  const stats = [
    {
      name: "Total Page Views",
      value: analytics.totalViews,
      change: "+12%",
      icon: Eye,
    },
    {
      name: "Blog Posts",
      value: analytics.totalPosts,
      change: "+2 this month",
      icon: FileText,
    },
    {
      name: "Resume Downloads",
      value: analytics.resumeDownloads,
      change: "+5 today",
      icon: Download,
    },
    {
      name: "Newsletter Subs",
      value: analytics.newsletterSubscribers,
      change: "+3 this week",
      icon: Mail,
    },
  ]

  return (
    <div className="dashboard-grid">
      {stats.map((stat) => (
        <Card key={stat.name} className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

