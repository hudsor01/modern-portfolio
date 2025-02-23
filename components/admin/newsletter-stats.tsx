import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Users } from "lucide-react"
import { getNewsletterStats } from "@/lib/newsletter"

export async function NewsletterStats() {
  const stats = await getNewsletterStats()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Newsletter Subscribers</CardTitle>
        <Button variant="outline" size="sm" className="h-8">
          <Download className="h-4 w-4 mr-2" />
          Export List
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalSubscribers}</p>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
              </div>
            </div>
            <div className="text-sm text-green-500">+{stats.newSubscribers} this month</div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Open Rate</span>
              <span className="font-medium">{stats.openRate}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Click Rate</span>
              <span className="font-medium">{stats.clickRate}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

