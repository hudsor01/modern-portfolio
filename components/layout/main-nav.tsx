"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { siteConfig } from "@/config/site"
import ModeToggle from "@/components/mode-toggle"
import { Icons } from "@/components/icons"

export function MainNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="flex items-center gap-6 md:gap-10">
      {/* Mobile Menu */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="px-0 md:hidden" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex flex-col gap-4 py-4">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-lg font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        {siteConfig.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative inline-flex items-center text-sm font-medium transition-colors hover:text-foreground/80",
              pathname === item.href ? "text-foreground" : "text-foreground/60",
            )}
          >
            {pathname === item.href && (
              <motion.div
                layoutId="nav-underline"
                className="absolute left-0 right-0 bottom-[-2px] h-[2px] bg-primary"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30,
                }}
              />
            )}
            {item.title}
          </Link>
        ))}
      </nav>

      {/* Social Links & Theme Toggle */}
      <div className="flex items-center gap-2">
        <nav className="hidden md:flex items-center gap-2">
          {Object.entries(siteConfig.links).map(([platform, url]) => {
            const Icon = Icons[platform as keyof typeof Icons]
            return Icon ? (
              <Button key={platform} variant="ghost" size="icon" asChild>
                <Link href={url} target="_blank" rel="noopener noreferrer">
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{platform}</span>
                </Link>
              </Button>
            ) : null
          })}
        </nav>
        <ModeToggle />
      </div>
    </div>
  )
}

