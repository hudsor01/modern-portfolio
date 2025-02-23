"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartIcon, CodeIcon, UsersIcon } from "@/components/icons"

const features = [
  {
    title: "Revenue Operations",
    description: "Strategic optimization of revenue streams through data-driven decision making.",
    icon: ChartIcon,
  },
  {
    title: "Digital Transformation",
    description: "Implementing cutting-edge technology solutions to drive business growth.",
    icon: CodeIcon,
  },
  {
    title: "Team Leadership",
    description: "Building and leading high-performing teams to exceed organizational goals.",
    icon: UsersIcon,
  },
]

export function FeaturesSection() {
  return (
    <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Expertise</h2>
        <CardDescription className="max-w-[85%] leading-normal sm:text-lg sm:leading-7">
          Specialized in optimizing revenue operations and implementing technological solutions
        </CardDescription>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        {features.map(({ title, description, icon: Icon }) => (
          <Card key={title} className="relative overflow-hidden">
            <CardHeader>
              <Icon className="h-12 w-12 text-primary" />
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

