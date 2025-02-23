import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAnalyticsData } from "@/lib/analytics/queries"
import { formatDate } from "@/lib/utils"
import { Eye, MousePointer, Download } from "lucide-react"

export async function RecentActivity() {
  const { recentEvents } = await getAnalyticsData()

  const getEventIcon = (type: string) => {
    switch (type) {
      case "page_view":
        return Eye
      case "click":
        return MousePointer
      case "download":
        return Download
      default:
        return Eye
    }
  }

  const getEventDescription = (event: any) => {
    switch (event.event_type) {
      case "page_view":
        return `Viewed ${event.path}`
      case "click":
        return `Clicked ${event.metadata?.element || "unknown element"}`
      case "download":
        return `Downloaded ${event.metadata?.filename || "file"}`
      default:
        return `${event.event_type} on ${event.path}`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentEvents.map((event) => {
            const Icon = getEventIcon(event.event_type)
            return (
              <div key={event.id} className="flex items-center">
                <Icon className="h-4 w-4 text-muted-foreground mr-4" />
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{getEventDescription(event)}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(event.created_at)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

