'use client'

interface ExpertiseNarrativeProps {
  className?: string
}

export function ExpertiseNarrative({ className = '' }: ExpertiseNarrativeProps) {
  return (
    <section className={className}>
      <div className="max-w-4xl mx-auto">
        {/* Opening Statement */}
        <div className="mb-20 animate-fade-in-up">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
            I don't just use tools.
            <br />
            I build systems.
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Ten years solving the same problem: turning messy data into decisions people actually trust.
          </p>
        </div>

        {/* The Work */}
        <div className="space-y-20">
          {/* Data Foundation */}
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="mb-6">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                The Foundation
              </span>
            </div>
            <div className="grid md:grid-cols-[2fr,1fr] gap-8 md:gap-12">
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                  Everything starts with getting the data right
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Most revenue operations problems aren't strategy problems—they're data quality problems.
                  I spend more time in SQL and Python than PowerPoint because if the foundation is wrong,
                  everything built on top collapses.
                </p>
                <div className="text-base text-muted-foreground/70">
                  Built the pipeline that now processes <span className="text-foreground font-medium">$4.8M+ annually</span>.
                  Started with Excel macros. Graduated to Python automation. Now it runs without me.
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>SQL</div>
                <div>Python</div>
                <div>Excel</div>
                <div>PowerBI</div>
                <div>Tableau</div>
              </div>
            </div>
          </div>

          {/* Systems Integration */}
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="mb-6">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                The Connective Tissue
              </span>
            </div>
            <div className="grid md:grid-cols-[2fr,1fr] gap-8 md:gap-12">
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                  Making systems talk to each other
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Sales uses Salesforce. Marketing lives in HubSpot. Outbound runs through SalesLoft.
                  Finance wants everything in a spreadsheet. My job is making all of this work together
                  without anyone having to log into five different platforms.
                </p>
                <div className="text-base text-muted-foreground/70">
                  <span className="text-foreground font-medium">90%+ workflow automation</span> achieved.
                  What used to take 3 people 2 days now happens automatically every morning.
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Salesforce</div>
                <div>HubSpot</div>
                <div>SalesLoft</div>
                <div>Zapier</div>
                <div>API Integration</div>
              </div>
            </div>
          </div>

          {/* Strategic Impact */}
          <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="mb-6">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                The Outcome
              </span>
            </div>
            <div className="grid md:grid-cols-[2fr,1fr] gap-8 md:gap-12">
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                  Turning data into decisions
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  The CEO doesn't care about your dashboard. They care about whether we're going to hit
                  the number this quarter. I translate SQL queries into plain English that executives
                  can act on. No jargon. No fluff. Just clarity.
                </p>
                <div className="text-base text-muted-foreground/70">
                  <span className="text-foreground font-medium">432% transaction growth</span> delivered.
                  <span className="text-foreground font-medium"> 2,217% partner network expansion</span> achieved.
                  Not because I had better tools—because I asked better questions.
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Revenue Operations</div>
                <div>Strategic Planning</div>
                <div>Process Optimization</div>
                <div>Data Storytelling</div>
                <div>Executive Communication</div>
              </div>
            </div>
          </div>

          {/* The Reality */}
          <div className="border-t border-border pt-16 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic">
              "Every company says they're data-driven. Most are just spreadsheet-driven.
              I've spent 10 years learning the difference."
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
