'use client'

import { Card, CardContent } from '@/components/ui/card'

interface SkillGroup {
  title: string
  context: string
  skills: string[]
  impact?: string
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    title: 'Revenue Intelligence',
    context: 'The foundation of every decision I make',
    skills: ['SQL', 'Python', 'Excel', 'PowerBI', 'Tableau'],
    impact: 'Built pipelines processing $4.8M+ annually'
  },
  {
    title: 'Systems Architecture',
    context: 'Connecting the dots between sales, marketing, and customer success',
    skills: ['Salesforce', 'HubSpot', 'SalesLoft', 'Zapier', 'API Integrations'],
    impact: '90%+ workflow automation achieved'
  },
  {
    title: 'Strategic Execution',
    context: 'Turning data into action plans that teams actually follow',
    skills: ['Revenue Operations', 'Process Optimization', 'Strategic Planning', 'Cross-functional Leadership'],
    impact: '432% transaction growth delivered'
  },
  {
    title: 'Analytics & Insights',
    context: 'Making complex data accessible to non-technical stakeholders',
    skills: ['Data Visualization', 'Business Intelligence', 'Predictive Modeling', 'Performance Metrics'],
    impact: '2,217% partner network expansion'
  }
]

interface SkillsShowcaseProps {
  className?: string
}

export function SkillsShowcase({ className = '' }: SkillsShowcaseProps) {
  return (
    <section className={className}>
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl lg:text-4xl font-semibold text-foreground mb-4">
          How I Work
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Skills aren't just checkboxes—here's how I combine them to drive real outcomes
        </p>
      </div>

      <div className="grid gap-8 lg:gap-12">
        {SKILL_GROUPS.map((group, index) => (
          <Card
            key={group.title}
            className="group bg-card border border-border rounded-2xl hover:border-primary/30 transition-all duration-500 overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-[2fr,3fr] gap-8 lg:gap-12 items-start">
                {/* Left: Title & Context */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display text-2xl lg:text-3xl font-semibold text-foreground mb-3">
                      {group.title}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {group.context}
                    </p>
                  </div>

                  {group.impact && (
                    <div className="pt-4 border-t border-border/50">
                      <p className="text-sm font-medium text-primary">
                        {group.impact}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right: Skills Grid */}
                <div className="flex flex-wrap gap-3">
                  {group.skills.map((skill) => (
                    <div
                      key={skill}
                      className="px-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 hover:border-primary/50 hover:bg-muted transition-all duration-300"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Attribution */}
      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Every skill listed has been applied in production environments. No theoretical knowledge—
          just tools I use daily to solve real problems for real businesses.
        </p>
      </div>
    </section>
  )
}
