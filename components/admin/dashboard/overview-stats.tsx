import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAnalytics } from "@/lib/analytics"
import { Eye, FileText, Download, Mail } from "lucide-react"

export async function OverviewStats() {
  const analytics = await getAnalytics()

  const stats = [
    {
      name: "Total Views",
      value: analytics.totalViews.toLocaleString(),
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
      name: "Downloads",
      value: analytics.resumeDownloads.toLocaleString(),
      change: "+5 today",
      icon: Download,
    },
    {
      name: "Subscribers",
      value: analytics.newsletterSubscribers.toLocaleString(),
      change: "+3 this week",
      icon: Mail,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-roboto">{stat.name}</CardTitle>
            <stat.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-playfair">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1 font-roboto">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

