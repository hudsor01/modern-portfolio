import { ResumePreview } from "@/components/resume/resume-preview"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"
import Link from "next/link"
import { FadeIn } from "@/components/ui/fade-in"

export default function ResumePage() {
  return (
    <div className="container py-12">
      <div className="flex flex-col gap-8">
        <FadeIn>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Professional Resume</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Revenue Operations & Technology Professional with a track record of driving growth
            </p>
          </div>
        </FadeIn>

        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/api/resume/download">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/resume/view" target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              View Full Resume
            </Link>
          </Button>
        </div>

        <div className="mx-auto max-w-4xl w-full">
          <ResumePreview />
        </div>
      </div>
    </div>
  )
}

