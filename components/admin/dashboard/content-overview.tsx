import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit, Plus } from "lucide-react"

export function ContentOverview() {
  const recentContent = [
    {
      title: "Getting Started with Revenue Operations",
      status: "Published",
      date: "2024-02-20",
    },
    // Add more content items...
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Content Overview</CardTitle>
          <CardDescription>Manage your blog posts and projects</CardDescription>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentContent.map((item) => (
            <div key={item.title} className="flex items-center justify-between space-x-4">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.status} • {item.date}
                </p>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/admin/blog/${item.title.toLowerCase().replace(/ /g, "-")}/edit`}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit post</span>
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

