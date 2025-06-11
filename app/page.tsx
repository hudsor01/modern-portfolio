import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Metadata } from 'next'
import { HomePageSchema } from '@/components/seo/home-page-schema'
import PageTransition from '@/components/ui/page-transition'
import { TestimonialsSection } from '@/components/layout/testimonials-section'

// Define metadata for SEO
export const metadata: Metadata = {
  title: 'Richard Hudson - Revenue Operations Professional',
  description:
    'Revenue Operations professional specializing in data analytics, business intelligence, and growth strategies for SaaS companies.',
  keywords: ['revenue operations', 'data analytics', 'business intelligence', 'PowerBI', 'dashboard development'],
  openGraph: {
    title: 'Richard Hudson - Revenue Operations Professional',
    description:
      'Revenue Operations professional specializing in data analytics, business intelligence, and growth strategies for SaaS companies.',
    url: 'https://richardwhudsonjr.com',
    siteName: 'Richard Hudson Portfolio',
    images: [
      {
        url: 'https://richardwhudsonjr.com/images/richard.jpg',
        width: 1200,
        height: 630,
        alt: 'Richard Hudson - Revenue Operations Professional',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Richard Hudson - Revenue Operations Professional',
    description:
      'Revenue Operations professional specializing in data analytics, business intelligence, and growth strategies for SaaS companies.',
    images: ['https://richardwhudsonjr.com/images/richard.jpg'],
  },
}

export default function HomePage() {
  return (
    <PageTransition>
      <div className="relative isolate">
        <HomePageSchema />
      {/* Background gradient effect - top */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/30 to-secondary/30 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] [clip-path:polygon(74.1%_44.1%,100%_61.6%,97.5%_26.9%,85.5%_0.1%,80.7%_2%,72.5%_32.5%,60.2%_62.4%,52.4%_68.1%,47.5%_58.3%,45.2%_34.5%,27.5%_76.7%,0.1%_64.9%,17.9%_100%,27.6%_76.8%,76.1%_97.7%,74.1%_44.1%)]"
        ></div>
      </div>

      {/* Hero content */}
      <div className="mx-auto max-w-4xl px-6 py-32 sm:py-48 lg:px-8 lg:py-56">
        {/* Featured project banner */}
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-border hover:ring-foreground/20">
            View my latest revenue operations dashboard project.{' '}
            <Link href="/projects/revenue-kpi" className="font-semibold text-primary">
              <span className="absolute inset-0" aria-hidden="true"></span>
              See the case study <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-balance text-foreground sm:text-7xl text-shadow-lg">
            Revenue Operations & Data Analytics
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-muted-foreground sm:text-xl leading-8">
            I help SaaS companies optimize their revenue operations through data-driven insights and
            strategic analytics. Specializing in business intelligence dashboards, sales pipeline optimization,
            and customer retention strategies.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              variant="default"
              size="lg"
              asChild
            >
              <Link href="/projects">
                View Projects
              </Link>
            </Button>
            <Link
              href="/about"
              className="text-sm font-semibold leading-6 text-foreground flex items-center"
            >
              About Me{' '}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Featured work section */}
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Featured Work</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Project 1 */}
          <div className="bg-card rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="relative h-48">
              <Image
                src="/images/projects/revenue-kpi.jpg"
                alt="Revenue Dashboard"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Revenue Analytics Dashboard</h3>
              <p className="text-muted-foreground mb-4">
                Interactive dashboard providing real-time insights into revenue performance, customer acquisition costs, and growth metrics.
              </p>
              <Link href="/projects/revenue-kpi" className="text-primary font-medium flex items-center">
                View Project <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Project 2 */}
          <div className="bg-card rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="relative h-48">
              <Image
                src="/images/projects/churn-retention.jpg"
                alt="Customer Retention Analysis"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Customer Retention Analysis</h3>
              <p className="text-muted-foreground mb-4">
                Comprehensive analysis of customer churn patterns with actionable insights to improve retention rates.
              </p>
              <Link href="/projects/churn-retention" className="text-primary font-medium flex items-center">
                View Project <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Project 3 */}
          <div className="bg-card rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="relative h-48">
              <Image
                src="/images/projects/deal-funnel.jpg"
                alt="Sales Pipeline Optimization"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Sales Pipeline Optimization</h3>
              <p className="text-muted-foreground mb-4">
                Strategic redesign of sales processes resulting in 35% improvement in conversion rates and reduced sales cycle time.
              </p>
              <Link href="/projects/deal-funnel" className="text-primary font-medium flex items-center">
                View Project <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-16 my-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to optimize your revenue operations?</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss how data-driven insights can transform your business growth strategy.
          </p>
          <Button
            variant="default"
            size="lg"
            asChild
          >
            <Link href="/contact">
              Get in Touch
            </Link>
          </Button>
        </div>
      </section>

      {/* Background gradient effect - bottom */}
      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary/30 to-secondary/30 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        ></div>
      </div>
    </div>
    </PageTransition>
  )
}
