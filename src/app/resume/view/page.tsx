import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Richard Hudson - Resume',
  description: 'Full resume of Richard Hudson, Revenue Operations Professional',
}

export default function ResumeViewPage() {
  return (
    <div className="mx-auto my-8 max-w-4xl px-4 print:my-0 print:px-0">
      <div className="space-y-6 print:space-y-5">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-bold print:text-3xl">RICHARD HUDSON</h1>
          <p className="mt-2 print:mt-1">
            Plano, TX | 214.566.0279 | hudsor01@icloud.com | https://linkedin.com/in/hudsor01
          </p>
        </header>

        {/* Summary */}
        <section>
          <h2 className="border-b border-gray-300 pb-1 text-center text-xl font-bold print:text-lg">
            REVENUE OPERATIONS PROFESSIONAL
          </h2>
          <p className="mt-2 text-sm leading-relaxed print:text-xs">
            Revenue operations professional with expertise in data-driven forecasting, process
            optimization, and cross-functional collaboration. Proven track record of driving revenue
            growth through analytical insights, partnership development, and strategic operational
            improvements. Skilled in automating commission management systems, integrating
            Salesforce workflows, and reducing processing time. Adept at leveraging Power BI and
            analytics frameworks to enhance revenue forecasting, real-time performance tracking, and
            KPI monitoring. Delivers streamlined reporting and actionable insights to optimize
            revenue growth and operational efficiency.
          </p>
        </section>

        {/* Skills */}
        <section className="space-y-2">
          <h2 className="border-b border-gray-300 pb-1 text-center text-xl font-bold print:text-lg">
            KEY TECHNICAL SKILLS
          </h2>
          <p className="text-center text-sm print:text-xs">
            ChatGPT | Anthropic Claude 3 | Microsoft Copilot | GitHub Copilot | Google Gemini | Meta
            Llama 3
          </p>
          <p className="text-center text-sm print:text-xs">
            Python | Javascript | React | Next.js | React.js | Salesforce | SalesLoft | Power BI |
            HubSpot | Workato | PartnerStack
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="border-b border-gray-300 pb-1 text-center text-xl font-bold print:text-lg">
            KEY SKILLS
          </h2>
          <p className="text-center text-sm print:text-xs">
            Revenue Operations| Data Analytics|Sales Support & Operations| Business Analysis |
            Problem – Solving
          </p>
          <p className="text-center text-sm print:text-xs">
            Web Development | Process Analysis & Optimization| Growth Mindset
          </p>
        </section>

        {/* Professional Experience */}
        <section className="space-y-4 print:space-y-3">
          <h2 className="border-b border-gray-300 pb-1 text-center text-xl font-bold print:text-lg">
            PROFESSIONAL EXPERIENCE
          </h2>

          {/* Thryv */}
          <div>
            <div className="flex justify-between">
              <h3 className="font-bold">Thryv, Grapevine, TX</h3>
              <span>December 2022 - November 2024</span>
            </div>
            <div className="font-semibold italic">Revenue Operations Consultant</div>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-tight print:text-xs">
              <li>
                Drove $1.1M+ revenue growth through data-driven forecasting and optimization
                strategies while scaling partner network by 2,200%.
              </li>
              <li>Grew partner network by 2,200% and increased transaction volume by 432%.</li>
              <li>
                Architected revenue modeling framework in Power BI and Salesforce achieving 95%
                forecast accuracy across all divisions.
              </li>
              <li>
                Transformed commission processes through automation, reducing processing time by 80%
                and increasing accuracy to 100%.
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold italic">Sales Operation Analyst</div>
            <div className="text-right">February 2022 - December 2022</div>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-tight print:text-xs">
              <li>
                Built automated KPI dashboards driving 28% quota attainment growth across teams and
                divisions.
              </li>
              <li>
                Automated commission management system achieving 100% accuracy and reducing
                processing time by 73%.
              </li>
              <li>
                Improved forecast accuracy by 40% through standardized metrics and reporting
                frameworks.
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold italic">Channel Operations Lead</div>
            <div className="text-right">March 2020 - March 2022</div>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-tight print:text-xs">
              <li>
                Scaled network to over 300 active affiliates, resellers, and Managed Service
                Providers (MSPs), maintaining 99.9% data accuracy.
              </li>
              <li>
                Reduced onboarding time by 45% through PartnerStack automation and workflow
                optimization.
              </li>
              <li>
                Built scalable infrastructure driving 432% volume growth and 67% faster processing
                time.
              </li>
              <li>
                Implemented real-time analytics framework streamlining performance tracking and
                reporting.
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold italic">Business Systems Specialist</div>
            <div className="text-right">December 2017 - March 2020</div>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-tight print:text-xs">
              <li>
                Led Salesforce platform integration and automation reducing order processing time by
                60%.
              </li>
              <li>Achieved 95% SLA compliance managing offshore operations team.</li>
              <li>
                Developed KPI monitoring systems improving revenue visibility and team performance
                metrics.
              </li>
              <li>Implemented automated workflows reducing manual processing time by 40%.</li>
            </ul>
          </div>

          <div>
            <div className="font-semibold italic">Digital Marketing Associate</div>
            <div className="text-right">April 2016- December 2017</div>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-tight print:text-xs">
              <li>
                Led digital marketing operations for more than 300 clients across web, social, and
                search platforms.
              </li>
              <li>
                Collaborated with web design team on development and content for more than 200
                client websites.
              </li>
              <li>
                Implemented Search Engine Optimization and content strategies improving search
                visibility.
              </li>
            </ul>
          </div>

          {/* Texas Army National Guard */}
          <div className="pt-1">
            <div className="flex justify-between">
              <h3 className="font-bold">Texas Army National Guard, Fort Worth, Texas</h3>
              <span>March 2005 - March 2011</span>
            </div>
            <div className="font-semibold italic">Information Technology Specialist (MOS 25B)</div>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-tight print:text-xs">
              <li>
                Managed mission-critical networks ensuring 99.9% uptime for 500+ personnel during
                combat operations in Iraq.
              </li>
              <li>
                Led hardware and software support achieving zero downtime during strategic
                deployments.
              </li>
              <li>
                Maintained $250,000+ IT equipment inventory with 100% accountability in high-stakes
                environment.
              </li>
              <li>
                Administered battalion-wide Access database systems and managed network
                infrastructure deployment.
              </li>
              <li>
                Executed imaging and system restoration for battalion equipment maintaining
                operational readiness.
              </li>
              <li>
                Built and maintained custom network infrastructure including cable termination and
                patch panel installation.
              </li>
              <li>
                Maintained $250,000+ IT equipment inventory with 100% accountability in high-stakes
                environment.
              </li>
            </ul>
          </div>
        </section>

        {/* Education & Certifications */}
        <section className="space-y-2">
          <h2 className="border-b border-gray-300 pb-1 text-center text-xl font-bold print:text-lg">
            EDUCATION & CERTIFICATIONS
          </h2>
          <p className="text-center font-semibold">
            Bachelor of Science (BS) in Business Administration | University of Texas at Dallas,
            Richardson, Texas
          </p>

          <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2 print:text-xs">
            <div className="flex justify-between">
              <span>HubSpot Revenue Operations Certification - HubSpot, Issued</span>
              <span>August 2024</span>
            </div>
            <div className="flex justify-between">
              <span>SalesLoft Certified Administrator – SalesLoft, Issued</span>
              <span>December 2022</span>
            </div>
            <div className="flex justify-between">
              <span>Career Essentials in Data Analysis - Microsoft and LinkedIn, Issued</span>
              <span>June 2024</span>
            </div>
            <div className="flex justify-between">
              <span>Career Essentials in Business Analysis - Microsoft and LinkedIn, Issued</span>
              <span>July 2024</span>
            </div>
            <div className="flex justify-between">
              <span>Atlassian Agile Project Management – Atlassian, Issued</span>
              <span>May 2024</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
