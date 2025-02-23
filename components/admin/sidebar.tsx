"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollText, BarChart2, Settings, Newspaper, Rss } from "lucide-react"

const sidebarLinks = [
  {
    title: "Overview",
    href: "/admin/dashboard",
    icon: BarChart2,
  },
  {
    title: "Blog Posts",
    href: "/admin/blog",
    icon: ScrollText,
  },
  {
    title: "Newsletter",
    href: "/admin/newsletter",
    icon: Newspaper,
  },
  {
    title: "RSS Feeds",
    href: "/admin/rss",
    icon: Rss,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-background min-h-screen">
      <div className="flex flex-col gap-2 p-4">
        <div className="px-2 py-4">
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
        </div>
        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            return (
              <Button
                key={link.href}
                variant={pathname === link.href ? "default" : "ghost"}
                className={cn("w-full justify-start", pathname === link.href && "bg-primary text-primary-foreground")}
                asChild
              >
                <Link href={link.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {link.title}
                </Link>
              </Button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

