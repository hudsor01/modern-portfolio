import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="container py-12">
      <div className="relative rounded-lg bg-muted px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Let's Work Together</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            I'm always interested in hearing about new projects and opportunities.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link href="/contact">
              Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

