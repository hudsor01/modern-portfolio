"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { navigationLinks } from "@/lib/navigation"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <nav className="flex flex-1 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Your Name
          </Link>
          <div className="flex space-x-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-2 py-1 text-sm font-medium transition-colors hover:text-foreground/80",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {pathname === link.href && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 -z-10 rounded-md bg-accent"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                {link.title}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
