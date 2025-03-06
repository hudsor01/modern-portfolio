import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart2, Users2, LightbulbIcon, BriefcaseIcon, GraduationCapIcon } from 'lucide-react'

export const metadata = {
  title: 'About | Richard Hudson',
  description: "Learn more about Richard Hudson's experience, skills, and approach to revenue operations and business growth.",
  openGraph: {
    title: 'About Richard Hudson | Revenue Operations Professional',
    description: "Learn more about Richard Hudson's experience, skills, and approach to revenue operations and business growth.",
    images: [{ url: '/images/og-image.jpg' }],
  },
}

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0070f3]/10 to-transparent pt-20 pb-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0070f3] to-[#7461c3] bg-clip-text text-transparent">
                About Me
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Revenue Operations Professional with a passion for driving business growth through data-driven strategies.
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <Link href="/contact">Contact Me</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/resume">View Resume</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative mx-auto">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0070f3] to-[#7461c3] blur-md" />
                <div className="absolute inset-1 rounded-2xl bg-white dark:bg-gray-900 overflow-hidden">
                  <Image
                    src="/images/richard.jpg"
                    alt="Richard Hudson"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 256px, 320px"
                    quality={95}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Background */}
      <section className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <BriefcaseIcon className="mr-3 text-[#0070f3]" /> 
            Professional Background
          </h2>
          <div className="space-y-6 text-lg">
            <p>
              I'm Richard Hudson, a Revenue Operations Professional with over 7 years of 
              experience optimizing business processes and driving growth. My expertise lies 
              in developing data-driven strategies that enhance operational efficiency and 
              improve financial outcomes.
            </p>
            <p>
              Throughout my career, I've helped companies implement cross-functional workflow improvements, 
              establish effective reporting systems, and create scalable processes that support business growth.
            </p>
            <p>
              Having worked with both startups and established enterprises, I bring a versatile approach to 
              solving complex operational challenges. My focus is always on creating systems that increase revenue, 
              streamline operations, and improve the customer experience.
            </p>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Professional Journey
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="relative pl-10 pb-10 border-l-2 border-[#0070f3]">
              <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-[#0070f3]"></div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <div className="text-[#0070f3] font-semibold">December 2022 - November 2024</div>
                <h3 className="text-xl font-bold mt-1">Revenue Operations Consultant</h3>
                <p className="font-medium text-gray-600 dark:text-gray-300 mb-4">Thryv</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Drove $1.1M+ revenue growth through data-driven forecasting and optimization strategies while scaling partner network by 2,200%.</li>
                  <li>Grew partner network by 2,200% and increased transaction volume by 432%.</li>
                  <li>Architected revenue modeling framework in Power BI and Salesforce achieving 95% forecast accuracy across all divisions.</li>
                </ul>
              </div>
            </div>
            
            <div className="relative pl-10 pb-10 border-l-2 border-[#0070f3]">
              <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-[#0070f3]"></div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <div className="text-[#0070f3] font-semibold">February 2022 - December 2022</div>
                <h3 className="text-xl font-bold mt-1">Sales Operation Analyst</h3>
                <p className="font-medium text-gray-600 dark:text-gray-300 mb-4">Thryv</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Built automated KPI dashboards driving 28% quota attainment growth across teams and divisions.</li>
                  <li>Automated commission management system achieving 100% accuracy and reducing processing time by 73%.</li>
                  <li>Improved forecast accuracy by 40% through standardized metrics and reporting frameworks.</li>
                </ul>
              </div>
            </div>
            
            <div className="relative pl-10 pb-10 border-l-2 border-[#0070f3]">
              <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-[#0070f3]"></div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <div className="text-[#0070f3] font-semibold">March 2020 - March 2022</div>
                <h3 className="text-xl font-bold mt-1">Channel Operations Lead</h3>
                <p className="font-medium text-gray-600 dark:text-gray-300 mb-4">Thryv</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Scaled network to over 300 active affiliates, resellers, and Managed Service Providers (MSPs), maintaining 99.9% data accuracy.</li>
                  <li>Reduced onboarding time by 45% through PartnerStack automation and workflow optimization.</li>
                  <li>Built scalable infrastructure driving 432% volume growth and 67% faster processing time.</li>
                </ul>
              </div>
            </div>
            
            <div className="relative pl-10 border-l-2 border-[#0070f3]">
              <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-[#0070f3]"></div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <div className="text-[#0070f3] font-semibold">December 2017 - March 2020</div>
                <h3 className="text-xl font-bold mt-1">Business Systems Specialist</h3>
                <p className="font-medium text-gray-600 dark:text-gray-300 mb-4">Thryv</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Led Salesforce platform integration and automation reducing order processing time by 60%.</li>
                  <li>Achieved 95% SLA compliance managing offshore operations team.</li>
                  <li>Developed KPI monitoring systems improving revenue visibility and team performance metrics.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Education */}
      <section className="bg-white dark:bg-gray-800 container mx-auto px-4 rounded-xl py-12 shadow-md border border-gray-100 dark:border-gray-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Education</h2>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg">
                <h3 className="text-xl font-bold">Bachelor of Science (BS) in Business Administration</h3>
                <p className="text-[#0070f3] font-medium mt-2">The University of Texas at Dallas</p>
                <p className="mt-2 text-gray-600 dark:text-gray-300">2012 - 2015</p>
                <p className="mt-4 max-w-lg mx-auto">
                  Concentration in Entrepreneurship
                </p>
              </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center">Skills & Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="bg-[#0070f3]/10 p-3 rounded-full mr-4">
                <BarChart2 size={24} className="text-[#0070f3]" />
              </div>
              <h3 className="text-xl font-bold">Data Analytics</h3>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Power BI Dashboards</li>
              <li>Revenue Forecasting</li>
              <li>KPI Development</li>
              <li>Python for Data Analysis</li>
              <li>Performance Metrics</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="bg-[#0070f3]/10 p-3 rounded-full mr-4">
                <Users2 size={24} className="text-[#0070f3]" />
              </div>
              <h3 className="text-xl font-bold">Sales Operations</h3>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Salesforce Administration</li>
              <li>Sales Enablement</li>
              <li>Commission Management</li>
              <li>SalesLoft Implementation</li>
              <li>Pipeline Management</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="bg-[#0070f3]/10 p-3 rounded-full mr-4">
                <LightbulbIcon size={24} className="text-[#0070f3]" />
              </div>
              <h3 className="text-xl font-bold">Technical Skills</h3>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Python & JavaScript</li>
              <li>React & Next.js</li>
              <li>Workato Automation</li>
              <li>PartnerStack Implementation</li>
              <li>HubSpot Management</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#0070f3] to-[#7461c3] rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Interested in Working Together?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Let's discuss how I can help optimize your business operations and drive growth.
            </p>
            <Button asChild size="lg" variant="outline" className="bg-white text-[#0070f3] hover:bg-white/90 hover:text-[#0070f3] border-white">
              <Link href="/contact" className="group">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}