import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRecentActivity } from "@/lib/analytics"
import { formatDate } from "@/lib/utils"
import { Download, Eye, Mail } from "lucide-react"

export async function RecentActivity() {
  const activity = await getRecentActivity()

  const getIcon = (type: string) => {
    switch (type) {
      case "page_view":
        return Eye
      case "resume_download":
        return Download
      case "newsletter_signup":
        return Mail
      default:
        return Eye
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activity.map((item) => {
            const Icon = getIcon(item.type)
            return (
              <div key={item.id} className="flex items-center space-x-4">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{item.description}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(item.timestamp)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

