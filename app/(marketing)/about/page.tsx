import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { trackEvent } from "@/lib/analytics/track"

export default function AboutPage() {
  // Track page view on mount
  trackEvent({
    type: "page_view",
    path: "/about",
  })

  const expertise = [
    {
      category: "Revenue Operations",
      items: ["Sales Operations", "Process Optimization", "Revenue Forecasting", "Commission Management"],
    },
    {
      category: "Technology",
      items: ["Salesforce", "SalesLoft", "Power BI", "HubSpot", "Workato", "PartnerStack"],
    },
    {
      category: "Development",
      items: ["Python", "JavaScript", "React", "Next.js"],
    },
  ]

  const achievements = [
    "Drove $1.1M+ revenue growth through data-driven forecasting and optimization strategies",
    "Grew partner network by 2,200% and increased transaction volume by 432%",
    "Architected revenue modeling framework achieving 95% forecast accuracy",
    "Transformed commission processes through automation, reducing processing time by 80%",
  ]

  return (
    <div className="container py-12">
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <TypewriterEffect words={[{ text: "Revenue" }, { text: "Operations" }, { text: "Professional" }]} />
            <p className="text-xl text-muted-foreground">
              Helping businesses optimize their growth through strategic operations and technological innovation. Based
              in Plano, TX.
            </p>
          </div>
          <div className="relative aspect-square">
            <Image src="/richard.jpg" alt="Richard Hudson" fill className="object-cover rounded-lg" priority />
          </div>
        </div>

        {/* Key Achievements */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Key Achievements</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <p>{achievement}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Expertise */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Areas of Expertise</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {expertise.map((category) => (
              <Card key={category.category}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item) => (
                      <Badge key={item} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Professional Experience */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Professional Experience</h2>
          <div className="relative border-l border-muted-foreground/20 pl-6 ml-4 space-y-8">
            <div className="relative">
              <div className="absolute -left-[29px] h-4 w-4 rounded-full border bg-background"></div>
              <div className="space-y-2">
                <div className="font-semibold">Revenue Operations Consultant</div>
                <div className="text-sm text-muted-foreground">Thryv</div>
                <div className="text-sm text-muted-foreground">December 2022 - November 2024</div>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Drove $1.1M+ revenue growth through data-driven forecasting and optimization strategies</li>
                  <li>Grew partner network by 2,200% and increased transaction volume by 432%</li>
                  <li>Architected revenue modeling framework in Power BI and Salesforce</li>
                  <li>Transformed commission processes through automation</li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[29px] h-4 w-4 rounded-full border bg-background"></div>
              <div className="space-y-2">
                <div className="font-semibold">Sales Operation Analyst</div>
                <div className="text-sm text-muted-foreground">Thryv</div>
                <div className="text-sm text-muted-foreground">February 2022 - December 2022</div>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Built automated KPI dashboards driving 28% quota attainment growth</li>
                  <li>Automated commission management system achieving 100% accuracy</li>
                  <li>Improved forecast accuracy by 40% through standardized metrics</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Certifications</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold">HubSpot Revenue Operations Certification</h3>
                <p className="text-sm text-muted-foreground">Issued August 2024</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold">SalesLoft Certified Administrator</h3>
                <p className="text-sm text-muted-foreground">Issued December 2022</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

