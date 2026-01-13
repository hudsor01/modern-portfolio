'use client'

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

export function TechnicalDetails() {
  return (
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
            <p className="text-muted-foreground mb-6 leading-relaxed">{detail.description}</p>
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
  )
}
