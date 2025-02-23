"use client"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { MainNav } from "@/components/layout/main-nav"
import { siteConfig } from "@/config/site"

export function SiteHeader() {
  const { scrollY } = useScroll()
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(var(--background-rgb), 0)", "rgba(var(--background-rgb), 0.9)"],
  )
  const backdropBlur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(10px)"])
  const borderOpacity = useTransform(scrollY, [0, 50], [0, 1])

  return (
    <motion.header
      className="fixed top-0 z-50 w-full border-b"
      style={{
        backgroundColor: backgroundColor as any,
        backdropFilter: backdropBlur,
        borderColor: "hsl(var(--border))",
        borderOpacity,
      }}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="hidden md:block text-xl font-bold hover:text-primary transition-colors">
          {siteConfig.name}
        </Link>
        <Link href="/" className="md:hidden text-xl font-bold hover:text-primary transition-colors">
          RH
        </Link>
        <MainNav />
      </div>
    </motion.header>
  )
}

