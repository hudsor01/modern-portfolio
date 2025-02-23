"use client"

import type React from "react"

import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { PageTracker } from "@/components/analytics/page-tracker"

export function RootProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      <Toaster />
      <Analytics />
      <PageTracker />
    </ThemeProvider>
  )
}

