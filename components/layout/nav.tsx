"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Resume", href: "/resume" },
  { name: "Contact", href: "/contact" },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-primary" : "text-muted-foreground",
          )}
        >
          {item.name}
        </Link>
      ))}
      <Button variant="outline" size="sm" className="ml-4" asChild>
        <Link href="/resume/download">
          <Download className="mr-2 h-4 w-4" />
          Download Resume
        </Link>
      </Button>
    </nav>
  )
}

