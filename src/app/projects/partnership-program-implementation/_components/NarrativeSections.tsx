'use client'

import { SectionCard } from '@/components/ui/section-card'
import { FeatureCard } from '@/components/projects/shared/feature-card'
import { ResultCard } from '@/components/projects/shared/result-card'

export function NarrativeSections() {
  return (
    <div className="space-y-16 mb-16">
      {/* Situation */}
      <SectionCard title="Situation" padding="lg">
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            When I was brought in to evaluate revenue diversification opportunities, I discovered
            the organization had zero infrastructure for partner-driven growth. The company was
            completely dependent on direct sales, missing significant revenue opportunities in an
            increasingly partnership-driven market. There was no formal program, no tracking
            mechanisms, and no way to leverage partner networks.
          </p>
          <p className="leading-relaxed">
            Competitors were building extensive partner ecosystems while we were limited to our
            direct sales team's capacity. The lack of any channel program meant we couldn't scale
            efficiently, and potential partners had no clear path to engage with us—even when they
            approached us proactively.
          </p>
        </div>
      </SectionCard>

      {/* Task */}
      <SectionCard title="Task" padding="lg">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I was tasked with designing and building the company's first-ever enterprise partnership
            program from scratch—a greenfield initiative that would become a strategic revenue
            channel. My mandate included:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              Design a scalable partner program architecture with tiered commission structures
            </li>
            <li>Build automated onboarding workflows with compliance and training requirements</li>
            <li>Create real-time commission tracking with transparent calculation engine</li>
            <li>Develop comprehensive partner performance analytics and reporting</li>
            <li>Integrate with existing CRM, billing, and support systems</li>
            <li>Establish partner portal with self-service capabilities</li>
          </ul>
        </div>
      </SectionCard>

      {/* Action */}
      <SectionCard title="Action" padding="lg">
        <div className="space-y-6 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            I personally led the complete design and implementation of the partnership program,
            building every component from program strategy to technical infrastructure:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard title="Program Architecture I Designed" titleVariant="secondary">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Multi-tier partner classification with clear advancement criteria</li>
                <li>Automated onboarding with document verification and compliance checks</li>
                <li>Training and certification programs I developed and deployed</li>
                <li>Performance-based tier advancement algorithms I implemented</li>
                <li>Partner portal I built with self-service deal registration</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Technical Systems I Built" titleVariant="primary">
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Salesforce CRM integration for lead management and attribution</li>
                <li>Real-time commission calculation engine I designed from scratch</li>
                <li>Analytics dashboards with performance tracking and forecasting</li>
                <li>Automated payment processing and dispute resolution workflows</li>
                <li>API integrations connecting billing, support, and partner systems</li>
              </ul>
            </FeatureCard>
          </div>

          <p className="leading-relaxed mt-4">
            I managed the entire rollout process, from partner recruitment and training to technical
            go-live. The program launched in phases to validate each component before expanding
            capabilities.
          </p>
        </div>
      </SectionCard>

      {/* Result */}
      <SectionCard title="Result" padding="lg">
        <div className="space-y-6 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            The partnership program I built became a strategic revenue channel, fundamentally
            transforming the company's go-to-market approach and creating sustainable competitive
            advantage:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard value="47" label="Active Partners I Onboarded" variant="primary" />
            <ResultCard value="90%+" label="Process Automation I Achieved" variant="secondary" />
            <ResultCard value="35%" label="Revenue Growth from Partners" variant="accent" />
            <ResultCard value="15 Days" label="Average Onboarding Time" variant="primary" />
          </div>

          <div className="space-y-3 mt-6">
            <h3 className="font-semibold text-primary">Additional Outcomes I Delivered:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Created new revenue stream that now accounts for 35% of total company revenue</li>
              <li>Reduced partner onboarding time from 6+ weeks to 15 days through automation</li>
              <li>Established scalable infrastructure that can support 200+ partners</li>
              <li>Built partner satisfaction tracking with 4.7/5 average rating</li>
              <li>Eliminated manual commission disputes through transparent calculation engine</li>
            </ul>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
