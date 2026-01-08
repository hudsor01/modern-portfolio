'use client'

import { SectionCard } from '@/components/ui/section-card'
import { ResultCard, FeatureCard } from '@/components/projects/shared'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils/data-formatters'

const _technologies = [
  'React',
  'Next.js',
  'TypeScript',
  'Recharts',
  'Tailwind CSS',
  'PostgreSQL',
  'Node.js',
  'Learning Management System',
  'Content Management',
  'Video Production',
  'Analytics Platform',
  'CRM Integration',
]

export function NarrativeSections() {
  return (
    <div className="space-y-12 mt-12">
      {/* Situation */}
      <SectionCard title="Situation">
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            When I assessed the sales organization's enablement capabilities, I found a team
            struggling to keep up with growth. We had {formatNumber(125)} sales professionals
            across multiple segments, but new hire ramp time averaged 9 months—far too long in
            a competitive market. Win rates had plateaued at 52%, and managers spent more time
            firefighting than coaching. The root cause was clear: there was no systematic
            approach to skill development, content management, or performance coaching.
          </p>
          <p className="leading-relaxed">
            Training was ad-hoc and inconsistent. New hires received a week of classroom training
            and were then left to figure things out on their own. Sales content was scattered
            across 12 different systems with no governance or version control—reps often used
            outdated materials without knowing it. Managers lacked coaching frameworks and spent
            their limited time on administrative tasks rather than developing their teams.
          </p>
        </div>
      </SectionCard>

      {/* Task */}
      <SectionCard title="Task">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I was tasked with building a comprehensive sales enablement platform that would
            accelerate new hire productivity, improve win rates, and enable systematic skill
            development across the entire sales organization. My specific objectives included:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Reduce new hire ramp time from 9 months to under 5 months</li>
            <li>Improve overall win rates by at least 25%</li>
            <li>Create a centralized content library with governance and analytics</li>
            <li>Develop role-specific learning paths with competency assessments</li>
            <li>Build coaching frameworks and tools for sales managers</li>
            <li>Achieve at least 80% adoption rate for enablement resources within 90 days</li>
          </ul>
        </div>
      </SectionCard>

      {/* Action */}
      <SectionCard title="Action">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I designed and built a comprehensive sales enablement platform that transformed
            how the organization develops, enables, and coaches its sales team. The system
            combined learning management, content governance, and coaching analytics:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FeatureCard title="Learning & Development">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Role-specific learning paths with progressive skill building</li>
                <li>Interactive modules with video, quizzes, and simulations</li>
                <li>Competency assessments tied to performance milestones</li>
                <li>Certification programs for product and methodology expertise</li>
                <li>Peer learning community with gamification elements</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Content & Coaching">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Centralized content library with {formatNumber(450)}+ resources</li>
                <li>Battle cards, case studies, and industry-specific playbooks</li>
                <li>Manager coaching dashboards with rep performance insights</li>
                <li>Call recording analysis and coaching recommendations</li>
                <li>One-on-one meeting templates and action tracking</li>
              </ul>
            </FeatureCard>
          </div>

          <p className="leading-relaxed mt-4">
            I personally led the content strategy, designed the learning path architecture,
            and built the coaching analytics framework. I worked closely with top performers
            to document their winning approaches, transforming tribal knowledge into scalable
            training. The platform launched in phases: onboarding first, then ongoing skill
            development, then manager enablement.
          </p>
        </div>
      </SectionCard>

      {/* Result */}
      <SectionCard title="Result">
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The sales enablement platform I built transformed how the organization develops
            its salesforce, delivering measurable improvements in productivity, win rates,
            and team retention:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ResultCard
              value={formatPercentage(0.34)}
              label="Win Rate Increase"
              variant="primary"
            />
            <ResultCard
              value={formatPercentage(0.45)}
              label="Ramp Time Reduction"
              variant="secondary"
            />
            <ResultCard
              value={formatCurrency(3200000, { compact: true })}
              label="Additional Revenue"
              variant="primary"
            />
            <ResultCard
              value={formatPercentage(0.82)}
              label="Adoption Rate"
              variant="secondary"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-secondary">Quantified Business Outcomes I Delivered:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Improved overall win rates from 52% to 70%—a 34% improvement</li>
              <li>Reduced new hire ramp time from 9 months to 5 months—45% faster to full productivity</li>
              <li>Generated {formatCurrency(3200000)} in additional revenue attributed to improved skills</li>
              <li>Achieved {formatPercentage(0.82)} adoption rate for learning resources within 90 days</li>
              <li>Reduced sales turnover by 28% through improved manager coaching</li>
              <li>Improved manager satisfaction scores from 3.4 to 4.7 out of 5</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Key Learnings */}
      <SectionCard title="Key Learnings">
        <div className="space-y-4 text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-accent-foreground">Enablement Strategy Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Peer learning outperforms classroom training—I now design every program
                  with community elements built in
                </li>
                <li>
                  Content adoption correlates directly with sales involvement in creation—
                  reps trust content that other reps helped build
                </li>
                <li>
                  Manager coaching is the multiplier—enabling managers enables the entire team
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Technical Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  CRM integration is essential—learning paths should trigger based on deal
                  stage and skill gaps
                </li>
                <li>
                  Analytics drive accountability—usage data helps managers identify
                  disengaged reps before performance suffers
                </li>
                <li>
                  Mobile-first design is non-negotiable—field reps need learning on the go
                </li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project taught me that sales enablement is fundamentally about behavior change,
            not content delivery. The best content in the world fails if it doesn't change how
            reps sell. I now measure every enablement initiative by behavior change metrics,
            not just consumption metrics.
          </p>
        </div>
      </SectionCard>
    </div>
  )
}
