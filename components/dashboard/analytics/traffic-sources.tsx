import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAnalytics } from "@/lib/analytics/queries"
import { formatNumber, formatPercent } from "@/lib/utils"
import { Globe, Search, Share2, MessageSquare } from "lucide-react"

export async function TrafficSources() {
  const analytics = await getAnalytics()

  const sources = [
    {
      name: "Direct",
      value: formatNumber(analytics.sources.direct),
      percentage: formatPercent(analytics.sources.direct / analytics.totals.total_views),
      icon: Globe,
    },
    {
      name: "Search",
      value: formatNumber(analytics.sources.search),
      percentage: formatPercent(analytics.sources.search / analytics.totals.total_views),
      icon: Search,
    },
    {
      name: "Social",
      value: formatNumber(analytics.sources.social),
      percentage: formatPercent(analytics.sources.social / analytics.totals.total_views),
      icon: Share2,
    },
    {
      name: "Referral",
      value: formatNumber(analytics.sources.referral),
      percentage: formatPercent(analytics.sources.referral / analytics.totals.total_views),
      icon: MessageSquare,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
        <CardDescription>Where your visitors are coming from</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sources.map((source) => (
            <div key={source.name} className="flex items-center">
              <source.icon className="h-4 w-4 text-muted-foreground mr-4" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{source.name}</p>
                <p className="text-sm text-muted-foreground">{source.value} visits</p>
              </div>
              <div className="text-sm font-medium">{source.percentage}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

