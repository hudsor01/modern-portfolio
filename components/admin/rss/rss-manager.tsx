import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Copy, RefreshCw, Rss } from "lucide-react"
import { siteConfig } from "@/config/site"

export function RSSManager() {
  const feeds = [
    {
      title: "Blog Feed",
      url: `${siteConfig.url}/feed.xml`,
      description: "All blog posts",
      active: true,
    },
    {
      title: "Projects Feed",
      url: `${siteConfig.url}/projects.xml`,
      description: "Latest projects",
      active: true,
    },
  ]

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>RSS Feeds</CardTitle>
          <CardDescription>Configure and manage your RSS feeds for content syndication.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {feeds.map((feed) => (
              <div key={feed.title} className="flex items-start justify-between space-x-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Rss className="h-4 w-4" />
                    <Label>{feed.title}</Label>
                    <Switch checked={feed.active} />
                  </div>
                  <p className="text-sm text-muted-foreground">{feed.description}</p>
                  <div className="flex items-center space-x-2">
                    <Input value={feed.url} readOnly className="max-w-md text-sm text-muted-foreground" />
                    <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(feed.url)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feed Settings</CardTitle>
          <CardDescription>Configure global settings for your RSS feeds.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="items">Items per feed</Label>
            <Input id="items" type="number" defaultValue={10} className="max-w-[180px]" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Feed Description</Label>
            <Input id="description" defaultValue={siteConfig.description} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="fullContent" />
            <Label htmlFor="fullContent">Include full content in feeds</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

