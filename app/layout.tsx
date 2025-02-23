import type React from "react"
import type { Metadata } from "next"
import { defaultMetadata } from "@/lib/metadata"
import "./globals.css"

export const metadata: Metadata = defaultMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}



import './globals.css'