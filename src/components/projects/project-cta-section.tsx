'use client'

import React from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Github,
  FileText,
  TrendingUp,
  BarChart3,
  Brain,
} from 'lucide-react'

interface ProjectCTASectionProps {
  onContactClick?: () => void // Make optional since we're not using it
}

export const ProjectCTASection: React.FC<ProjectCTASectionProps> = () => {
  return (
    <div className="text-center space-y-8 max-w-6xl mx-auto mt-24 mb-16">
      <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-8 md:p-12 shadow-2xl">
        {/* Subtle background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 rounded-xl" />

        <div className="relative z-10">
          {/* Portfolio Header */}
          <div className="flex items-center justify-center mb-8">
            <h3 className="typography-h2 border-none pb-0 text-2xl md:text-2xl tracking-tight section-heading-gradient glow-blue">
              Explore More of My Work
            </h3>
          </div>

          <p className="text-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10 font-light">
            Dive deeper into my Revenue Operations expertise, methodologies, and the 
            transformative results achieved across various industries.
          </p>

          {/* Portfolio Navigation - Equal sized buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 max-w-2xl mx-auto">
            <Link
              href="/about"
              className="relative inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black typography-large px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 group border border-primary/20 flex-1 sm:min-w-[240px]"
            >
              <FileText className="mr-3" size={20} />
              About My Experience
              <ArrowRight
                size={20}
                className="ml-3 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/blog"
              className="relative inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black typography-large px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 group border border-primary/20 flex-1 sm:min-w-[240px]"
            >
              <Brain className="mr-3" size={20} />
              Technical Insights
              <ArrowRight
                size={20}
                className="ml-3 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Portfolio Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/20">
            <div className="group text-center">
              <div className="relative bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 mb-4 mx-auto w-fit hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <TrendingUp className="relative z-10 w-7 h-7 text-primary" />
              </div>
              <h4 className="font-bold text-foreground mb-2 text-xl">
                $4.8M+ Generated
              </h4>
              <p className="text-muted-foreground text-base">Revenue impact delivered</p>
            </div>

            <div className="group text-center">
              <div className="relative bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 mb-4 mx-auto w-fit hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <BarChart3 className="relative z-10 w-7 h-7 text-primary" />
              </div>
              <h4 className="font-bold text-foreground mb-2 text-xl">
                432% Growth
              </h4>
              <p className="text-muted-foreground text-base">Average client improvement</p>
            </div>

            <div className="group text-center">
              <div className="relative bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 mb-4 mx-auto w-fit hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Github className="relative z-10 w-7 h-7 text-primary" />
              </div>
              <h4 className="font-bold text-foreground mb-2 text-xl">
                11+ Projects
              </h4>
              <p className="text-muted-foreground text-base">Documented case studies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}