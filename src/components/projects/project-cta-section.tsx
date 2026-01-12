'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, FileText, Lightbulb, MessageSquare } from 'lucide-react'

interface ProjectCTASectionProps {
  totalProjects: number
}

export const ProjectCTASection: React.FC<ProjectCTASectionProps> = ({ totalProjects }) => {
  return (
    <section className="mt-32 mb-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl lg:text-4xl font-semibold text-foreground mb-4">
          Let&apos;s Work Together
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Ready to transform your revenue operations? Explore more about my work or get in touch to discuss your project.
        </p>
      </div>

      {/* CTA Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* About Card */}
        <Link
          href="/about"
          className="group relative p-8 bg-card border border-border rounded-2xl transition-all duration-300 ease-out hover:border-primary/30 hover:shadow-lg hover:-translate-y-1"
        >
          <div className="w-12 h-12 flex items-center justify-center bg-primary/5 border border-primary/10 rounded-xl mb-5 transition-colors duration-300 ease-out group-hover:bg-primary/10 group-hover:border-primary/20">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2 transition-colors duration-300 ease-out group-hover:text-primary">
            About My Work
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            Learn about my experience in revenue operations and data analytics.
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
            Learn more
            <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </span>
        </Link>

        {/* Blog Card */}
        <Link
          href="/blog"
          className="group relative p-8 bg-card border border-border rounded-2xl transition-all duration-300 ease-out hover:border-primary/30 hover:shadow-lg hover:-translate-y-1"
        >
          <div className="w-12 h-12 flex items-center justify-center bg-primary/5 border border-primary/10 rounded-xl mb-5 transition-colors duration-300 ease-out group-hover:bg-primary/10 group-hover:border-primary/20">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2 transition-colors duration-300 ease-out group-hover:text-primary">
            Technical Insights
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            Read about revenue operations strategies and best practices.
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
            Read blog
            <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </span>
        </Link>

        {/* Contact Card */}
        <Link
          href="/contact"
          className="group relative p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-2xl transition-all duration-300 ease-out hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
        >
          <div className="w-12 h-12 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-xl mb-5 transition-colors duration-300 ease-out group-hover:bg-primary/20 group-hover:border-primary/30">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2 transition-colors duration-300 ease-out group-hover:text-primary">
            Get in Touch
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            Have a project in mind? Let&apos;s discuss how I can help.
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
            Contact me
            <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </span>
        </Link>
      </div>

      {/* Bottom Stats Bar */}
      <div className="mt-16 pt-12 border-t border-border">
        <div className="flex flex-wrap justify-center gap-8 lg:gap-16 text-center">
          <div>
            <div className="font-mono text-3xl lg:text-4xl font-bold text-foreground mb-1">$4.8M+</div>
            <div className="text-sm text-muted-foreground">Revenue Impact</div>
          </div>
          <div className="hidden sm:block w-px bg-border" />
          <div>
            <div className="font-mono text-3xl lg:text-4xl font-bold text-foreground mb-1">432%</div>
            <div className="text-sm text-muted-foreground">Average Growth</div>
          </div>
          <div className="hidden sm:block w-px bg-border" />
          <div>
            <div className="font-mono text-3xl lg:text-4xl font-bold text-foreground mb-1">{totalProjects}+</div>
            <div className="text-sm text-muted-foreground">Case Studies</div>
          </div>
        </div>
      </div>
    </section>
  )
}
