"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    title: "Posts",
    href: "/admin/posts",
  },
  {
    title: "Projects",
    href: "/admin/projects",
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
  },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-background">
      <div className="container flex h-14 items-center">
        <div className="flex gap-6 font-medium">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href ? "text-foreground" : "text-foreground/60",
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

