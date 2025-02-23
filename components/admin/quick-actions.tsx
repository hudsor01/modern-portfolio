import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, Settings, BarChart } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "New Blog Post",
      href: "/admin/blog/new",
      icon: PlusCircle,
      description: "Create a new blog post",
    },
    {
      title: "View Analytics",
      href: "/admin/analytics",
      icon: BarChart,
      description: "Check your site analytics",
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
      description: "Manage your site settings",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {actions.map((action) => (
          <Button key={action.href} variant="outline" className="h-auto w-full justify-start gap-4 p-4" asChild>
            <Link href={action.href}>
              <action.icon className="h-5 w-5" />
              <div className="flex flex-col items-start gap-1">
                <span className="font-medium">{action.title}</span>
                <span className="text-sm text-muted-foreground">{action.description}</span>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

