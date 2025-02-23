import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAnalyticsData } from "@/lib/analytics/queries"

export async function TopPages() {
  const { topPages } = await getAnalyticsData()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Pages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {topPages.map((page) => (
            <div key={page.path} className="flex items-center">
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">{page.path}</p>
                <p className="text-sm text-muted-foreground">
                  {page.views} views ({page.unique_views} unique)
                </p>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium">{((page.unique_views / page.views) * 100).toFixed(1)}%</div>
                <p className="text-[0.70rem] uppercase text-muted-foreground">Engagement</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

