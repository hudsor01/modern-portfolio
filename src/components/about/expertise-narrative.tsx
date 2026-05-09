import { Badge } from '@/components/ui/badge'

interface ExpertiseNarrativeProps {
  className?: string
}

interface Subsection {
  eyebrow: string
  heading: string
  body: string
  proof: React.ReactNode
  tags: string[]
  delayMs: number
}

const SUBSECTIONS: Subsection[] = [
  {
    eyebrow: 'The Foundation',
    heading: 'Everything starts with getting the data right',
    body: "Most revenue operations problems aren't strategy problems—they're data quality problems. I spend more time in SQL and Python than PowerPoint because if the foundation is wrong, everything built on top collapses.",
    proof: (
      <>
        Built the pipeline that now processes{' '}
        <span className="text-foreground font-medium">$4.8M+ annually</span>. Started with Excel
        macros. Graduated to Python automation. Now it runs without me.
      </>
    ),
    tags: ['SQL', 'Python', 'Excel', 'PowerBI', 'Tableau'],
    delayMs: 100,
  },
  {
    eyebrow: 'The Connective Tissue',
    heading: 'Making systems talk to each other',
    body: 'Sales uses Salesforce. Marketing lives in HubSpot. Outbound runs through SalesLoft. Finance wants everything in a spreadsheet. My job is making all of this work together without anyone having to log into five different platforms.',
    proof: (
      <>
        <span className="text-foreground font-medium">90%+ workflow automation</span> achieved. What
        used to take 3 people 2 days now happens automatically every morning.
      </>
    ),
    tags: ['Salesforce', 'HubSpot', 'SalesLoft', 'Zapier', 'API Integration'],
    delayMs: 200,
  },
  {
    eyebrow: 'The Outcome',
    heading: 'Turning data into decisions',
    body: "The CEO doesn't care about your dashboard. They care about whether we're going to hit the number this quarter. I translate SQL queries into plain English that executives can act on. No jargon. No fluff. Just clarity.",
    proof: (
      <>
        Outcomes don't come from better tools—they come from asking better questions and owning the
        answers all the way through to what shipped.
      </>
    ),
    tags: [
      'Revenue Operations',
      'Strategic Planning',
      'Process Optimization',
      'Data Storytelling',
      'Executive Communication',
    ],
    delayMs: 300,
  },
]

export function ExpertiseNarrative({ className = '' }: ExpertiseNarrativeProps) {
  return (
    <section className={className}>
      <div className="max-w-3xl mx-auto">
        {/* Opening Statement */}
        <div className="mb-16 lg:mb-20 animate-fade-in-up">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            I don't just use tools.
            <br />I build systems.
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Ten years solving the same problem: turning messy data into decisions people actually
            trust.
          </p>
        </div>

        {/* The Work */}
        <div className="space-y-16 lg:space-y-20">
          {SUBSECTIONS.map((s) => (
            <article
              key={s.eyebrow}
              className="animate-fade-in-up"
              style={{ animationDelay: `${s.delayMs}ms` }}
            >
              <div className="mb-4 text-sm font-medium text-primary uppercase tracking-wider">
                {s.eyebrow}
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                {s.heading}
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-5">{s.body}</p>
              <p className="text-base text-muted-foreground/80 leading-relaxed mb-6">{s.proof}</p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs border-border/70 text-muted-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </article>
          ))}

          {/* Closing Quote */}
          <div
            className="border-t border-border pt-12 lg:pt-16 animate-fade-in-up"
            style={{ animationDelay: '400ms' }}
          >
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic">
              "Every company says they're data-driven. Most are just spreadsheet-driven. I've spent
              10 years learning the difference."
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
