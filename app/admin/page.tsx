import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentPosts } from "@/components/dashboard/recent-posts"
import { TopPages } from "@/components/dashboard/top-pages"
import { getAnalytics } from "@/lib/analytics"

export const metadata = {
  title: "Admin Dashboard",
  description: "Portfolio admin dashboard",
}

export default async function AdminPage() {
  const analytics = await getAnalytics()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your portfolio statistics and content.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Views</CardTitle>
            <CardDescription>Past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics.totalViews}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Blog Posts</CardTitle>
            <CardDescription>Total published posts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics.totalPosts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resume Downloads</CardTitle>
            <CardDescription>Past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics.resumeDownloads}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Page views over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Overview data={analytics.viewsOverTime} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most viewed pages</CardDescription>
          </CardHeader>
          <CardContent>
            <TopPages data={analytics.topPages} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>Recently published blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentPosts />
        </CardContent>
      </Card>
    </div>
  )
}

