'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Target, BarChart3, Zap, Users, Brain, Rocket } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface WhatIBringItem {
  title: string
  description: string
  icon: LucideIcon
  color: string
}

const WHAT_I_BRING: WhatIBringItem[] = [
  {
    title: 'Systems Thinking',
    description: "I don't just fix symptoms. I redesign workflows that prevent issues from recurring.",
    icon: Target,
    color: 'text-blue-500'
  },
  {
    title: 'Data Fluency',
    description: 'Translate SQL queries into executive narratives. Make numbers tell stories that drive decisions.',
    icon: BarChart3,
    color: 'text-cyan-500'
  },
  {
    title: 'Bias for Action',
    description: "Certified in SalesLoft & HubSpot, but I ship improvements before the certification arrives.",
    icon: Zap,
    color: 'text-yellow-500'
  },
  {
    title: 'Bridge Builder',
    description: 'Translate between sales, marketing, finance, and engineering—making everyone feel heard.',
    icon: Users,
    color: 'text-green-500'
  },
  {
    title: 'Strategic Simplifier',
    description: 'Turn complex multi-system architectures into intuitive workflows anyone can understand.',
    icon: Brain,
    color: 'text-purple-500'
  },
  {
    title: 'Growth Catalyst',
    description: 'Build systems that scale with you—from startup chaos to enterprise precision.',
    icon: Rocket,
    color: 'text-orange-500'
  }
]

interface WhatIBringProps {
  className?: string
}

export function WhatIBring({ className = '' }: WhatIBringProps) {
  return (
    <section className={className}>
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl lg:text-4xl font-semibold text-foreground mb-4">
          What I Bring to Your Team
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Beyond technical skills and certifications—the mindset and approach that drives results
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WHAT_I_BRING.map((item, index) => (
          <Card
            key={item.title}
            className="group bg-card border border-border rounded-2xl hover:border-primary/50 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
