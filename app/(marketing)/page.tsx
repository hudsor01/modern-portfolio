import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import { Button } from "@/components/ui/button"
import { ArrowDown, FileText, Download } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const words = [
    { text: "Revenue" },
    { text: "Operations" },
    { text: "&" },
    { text: "Technology" },
    { text: "Professional" },
  ]

  return (
    <>
      <section className="flex min-h-[90vh] flex-col items-center justify-center bg-gradient-to-b from-background to-accent/20">
        <div className="container px-4 text-center">
          <TypewriterEffect words={words} className="pb-8" />
          <p className="mx-auto max-w-2xl pb-8 text-lg text-muted-foreground">
            Driving revenue growth through data-driven insights, process optimization, and strategic operational
            improvements.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Button size="lg" asChild>
              <Link href="/resume">
                <FileText className="mr-2 h-5 w-5" />
                View Resume
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/resume/download">
                <Download className="mr-2 h-5 w-5" />
                Download PDF
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-8 animate-bounce">
          <ArrowDown className="h-6 w-6" />
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-accent/10">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12 font-playfair">Featured Projects</h2>
          {/* ProjectGrid component here */}
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-20">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12 font-playfair">Latest Insights</h2>
          {/* BlogGrid component here */}
        </div>
      </section>
    </>
  )
}

