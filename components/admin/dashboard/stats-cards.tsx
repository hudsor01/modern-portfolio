import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, FileText, Users, ArrowUpRight } from "lucide-react"

interface StatsCardsProps {
  pageViews: number
  totalPosts: number
  totalSubscribers: number
}

export function StatsCards({ pageViews, totalPosts, totalSubscribers }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pageViews.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            <ArrowUpRight className="mr-1 h-4 w-4 inline" />
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPosts}</div>
          <p className="text-xs text-muted-foreground">
            <ArrowUpRight className="mr-1 h-4 w-4 inline" />
            +12 new this month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSubscribers}</div>
          <p className="text-xs text-muted-foreground">
            <ArrowUpRight className="mr-1 h-4 w-4 inline" />
            +8.2% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

