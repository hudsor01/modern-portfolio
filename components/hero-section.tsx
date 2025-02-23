"use client"

import { TypewriterEffect } from "./ui/typewriter-effect"
import { Button } from "./ui/button"
import { siteConfig } from "@/config/site"
import Link from "next/link"

export function HeroSection() {
  const words = [
    {
      text: "Full",
    },
    {
      text: "Stack",
    },
    {
      text: "Developer",
    },
    {
      text: "&",
    },
    {
      text: "Engineer",
    },
  ]

  return (
    <div className="h-[85vh] w-full dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="relative z-20 flex flex-col items-center justify-center">
        <TypewriterEffect words={words} />
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <Link href={siteConfig.links.github} target="_blank">
            <Button variant="outline" className="w-40">
              View GitHub
            </Button>
          </Link>
          <Link href={siteConfig.links.linkedin} target="_blank">
            <Button className="w-40">Connect on LinkedIn</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

