"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const activities = [
  {
    type: "post",
    title: "New Blog Post Published",
    description: "Introduction to Revenue Operations",
    timestamp: "2 hours ago",
  },
  {
    type: "project",
    title: "Project Updated",
    description: "Revenue Analytics Dashboard",
    timestamp: "5 hours ago",
  },
  {
    type: "comment",
    title: "New Comment",
    description: "On: Introduction to Revenue Operations",
    timestamp: "1 day ago",
  },
]

export function RecentActivity() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

