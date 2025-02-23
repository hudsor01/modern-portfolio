"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Resume", href: "/resume" },
  { name: "Contact", href: "/contact" },
]

export function FloatingNav() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.div
      className="fixed left-1/2 top-4 z-50"
      animate={{
        y: isScrolled ? 0 : 20,
        scale: isScrolled ? 0.95 : 1,
        opacity: isScrolled ? 0.8 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="flex -translate-x-1/2 items-center gap-6 rounded-full border bg-background/80 px-8 py-3 shadow-lg backdrop-blur"
        layout
      >
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative px-3 py-1.5 text-sm font-medium transition-colors hover:text-foreground/80",
                isActive ? "text-foreground" : "text-foreground/60",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 -z-10 rounded-full bg-accent"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
              {item.name}
            </Link>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

