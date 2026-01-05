'use client'

import { TrendingUp, Users, Settings, BarChart } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { LoadingState } from '@/components/projects/loading-state'
import { useLoadingState } from '@/hooks/use-loading-state'
import { ProjectJsonLd } from '@/components/seo/json-ld'

const achievements = [
  {
    metric: 'Partner Program',
    value: 'First Implementation',
    description:
      "Designed and built company's first-ever partnership program from concept to production",
    icon: <Users className="w-6 h-6" />,
  },
  {
    metric: 'System Integration',
    value: 'Full Production',
    description: 'Production-ready integrations with CRM, billing systems, and partner portals',
    icon: <Settings className="w-6 h-6" />,
  },
  {
    metric: 'Automation Level',
    value: '90%+',
    description: 'Automated partner onboarding, commission tracking, and performance reporting',
    icon: <BarChart className="w-6 h-6" />,
  },
  {
    metric: 'Business Impact',
    value: 'Strategic Success',
    description: 'Program became integral to company revenue strategy and growth',
    icon: <TrendingUp className="w-6 h-6" />,
  },
]

const technicalDetails = [
  {
    title: 'Partner Onboarding Automation',
    description:
      'Built automated partner registration and approval workflows with document verification, background checks, and training completion tracking.',
    technologies: ['Salesforce', 'DocuSign API', 'Custom Workflows'],
  },
  {
    title: 'Commission Tracking System',
    description:
      'Implemented real-time commission calculation engine with multi-tier structures, dispute resolution, and automated payouts.',
    technologies: ['Custom API', 'Database Design', 'Payment Integration'],
  },
  {
    title: 'Performance Analytics Dashboard',
    description:
      'Created comprehensive partner performance tracking with revenue attribution, conversion metrics, and predictive analytics.',
    technologies: ['React', 'TypeScript', 'Data Visualization'],
  },
  {
    title: 'Integration Architecture',
    description:
      'Designed and implemented production integrations connecting CRM, billing systems, partner portals, and internal tools.',
    technologies: ['REST APIs', 'Webhooks', 'Data Synchronization'],
  },
]

export default function PartnershipProgramPage() {
  const { isLoading, handleRefresh } = useLoadingState()

  return (
    <>
      <ProjectJsonLd
        title="Enterprise Partnership Program Implementation"
        description="Led comprehensive design and implementation of a company's first partnership program, creating automated partner onboarding, commission tracking, and performance analytics."
        slug="partnership-program-implementation"
        category="Revenue Operations"
        tags={[
          'Partnership Program',
          'Channel Operations',
          'Partner Onboarding',
          'Commission Automation',
        ]}
      />

      <ProjectPageLayout
        title="Enterprise Partnership Program Implementation"
        description="Led comprehensive design and implementation of a company's first partnership program, creating automated partner onboarding, commission tracking, and performance analytics. Built production-ready integrations with CRM, billing systems, and partner portals."
        tags={[
          { label: 'First Partner Program', variant: 'primary' },
          { label: '90%+ Automation', variant: 'secondary' },
          { label: 'Full Production', variant: 'primary' },
          { label: 'Strategic Success', variant: 'secondary' },
        ]}
        onRefresh={handleRefresh}
        refreshButtonDisabled={isLoading}
      >
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Key Achievements */}
            <div className="space-y-12 mb-16">
              <div className="text-center space-y-4">
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  Key Achievements
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Strategic implementation results and business impact
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 ease-out"
                  >
                    <div className="text-primary mb-4">{achievement.icon}</div>
                    <div className="space-y-2">
                      <div className="text-xl font-semibold text-foreground">{achievement.value}</div>
                      <div className="text-sm font-medium text-primary">{achievement.metric}</div>
                      <div className="text-sm text-muted-foreground">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Implementation */}
            <div className="space-y-12 mb-16">
              <div className="text-center space-y-4">
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  Technical Implementation
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Production-ready systems and integrations built from the ground up
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {technicalDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 ease-out"
                  >
                    <h3 className="text-lg font-semibold text-foreground mb-4">{detail.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {detail.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {detail.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm border border-primary/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Narrative Sections - STAR Method */}
            <div className="space-y-16 mb-16">
              {/* Situation */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6">
                  Situation
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-lg leading-relaxed">
                    When I was brought in to evaluate revenue diversification opportunities, I
                    discovered the organization had zero infrastructure for partner-driven growth.
                    The company was completely dependent on direct sales, missing significant revenue
                    opportunities in an increasingly partnership-driven market. There was no formal
                    program, no tracking mechanisms, and no way to leverage partner networks.
                  </p>
                  <p className="leading-relaxed">
                    Competitors were building extensive partner ecosystems while we were limited to
                    our direct sales team's capacity. The lack of any channel program meant we
                    couldn't scale efficiently, and potential partners had no clear path to engage
                    with us—even when they approached us proactively.
                  </p>
                </div>
              </div>

              {/* Task */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6">
                  Task
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    I was tasked with designing and building the company's first-ever enterprise
                    partnership program from scratch—a greenfield initiative that would become a
                    strategic revenue channel. My mandate included:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Design a scalable partner program architecture with tiered commission structures</li>
                    <li>Build automated onboarding workflows with compliance and training requirements</li>
                    <li>Create real-time commission tracking with transparent calculation engine</li>
                    <li>Develop comprehensive partner performance analytics and reporting</li>
                    <li>Integrate with existing CRM, billing, and support systems</li>
                    <li>Establish partner portal with self-service capabilities</li>
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6">
                  Action
                </h2>
                <div className="space-y-6 text-muted-foreground">
                  <p className="text-lg leading-relaxed">
                    I personally led the complete design and implementation of the partnership program,
                    building every component from program strategy to technical infrastructure:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-muted/50 rounded-xl p-6 border border-border">
                      <h3 className="font-semibold text-secondary mb-4">Program Architecture I Designed</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Multi-tier partner classification with clear advancement criteria</li>
                        <li>Automated onboarding with document verification and compliance checks</li>
                        <li>Training and certification programs I developed and deployed</li>
                        <li>Performance-based tier advancement algorithms I implemented</li>
                        <li>Partner portal I built with self-service deal registration</li>
                      </ul>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-6 border border-border">
                      <h3 className="font-semibold text-primary mb-4">Technical Systems I Built</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Salesforce CRM integration for lead management and attribution</li>
                        <li>Real-time commission calculation engine I designed from scratch</li>
                        <li>Analytics dashboards with performance tracking and forecasting</li>
                        <li>Automated payment processing and dispute resolution workflows</li>
                        <li>API integrations connecting billing, support, and partner systems</li>
                      </ul>
                    </div>
                  </div>

                  <p className="leading-relaxed mt-4">
                    I managed the entire rollout process, from partner recruitment and training to
                    technical go-live. The program launched in phases to validate each component
                    before expanding capabilities.
                  </p>
                </div>
              </div>

              {/* Result */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6">
                  Result
                </h2>
                <div className="space-y-6 text-muted-foreground">
                  <p className="text-lg leading-relaxed">
                    The partnership program I built became a strategic revenue channel, fundamentally
                    transforming the company's go-to-market approach and creating sustainable
                    competitive advantage:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
                      <div className="text-2xl font-bold text-primary mb-2">
                        47
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Active Partners I Onboarded
                      </div>
                    </div>
                    <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-6 text-center">
                      <div className="text-2xl font-bold text-secondary mb-2">
                        90%+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Process Automation I Achieved
                      </div>
                    </div>
                    <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 text-center">
                      <div className="text-2xl font-bold text-accent mb-2">
                        35%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Revenue Growth from Partners
                      </div>
                    </div>
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
                      <div className="text-2xl font-bold text-primary mb-2">
                        15 Days
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Average Onboarding Time
                      </div>
                    </div>
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
              </div>
            </div>

          </>
        )}
      </ProjectPageLayout>
    </>
  )
}
