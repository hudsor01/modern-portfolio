'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Mail,
  Users,
  Clock,
  Target,
  Award,
} from 'lucide-react'

interface ProjectCTASectionProps {
  onContactClick: () => void
}

export const ProjectCTASection: React.FC<ProjectCTASectionProps> = ({ onContactClick }) => {
  return (
    <div className="text-center space-y-8 max-w-6xl mx-auto mt-24 mb-16">
      <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
        {/* Subtle background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 rounded-3xl" />

        <div className="relative z-10">
          {/* Enhanced Header */}
          <div className="flex items-center justify-center mb-8">
            <h3 className="font-bold text-3xl md:text-4xl tracking-tight bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
              Ready to Start Your Project?
            </h3>
          </div>

          <p className="text-gray-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10 font-light">
            Let's discuss how I can help optimize your revenue operations and drive measurable
            business growth.
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-12 justify-center mb-12">
            <Button
              size="lg"
              className="relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 group border border-blue-400/20"
              onClick={onContactClick}
            >
              <span className="relative z-10 flex items-center">
                <Mail className="mr-3" size={20} />
                Start a Project
                <ArrowRight
                  size={20}
                  className="ml-3 transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </Button>

            <Link
              href="/about"
              className="relative inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 group border border-blue-400/20"
            >
              <Users className="mr-3" size={20} />
              Read my Blueprint
              <ArrowRight
                size={20}
                className="ml-3 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Enhanced Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/20">
            <div className="group text-center">
              <div className="relative bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 mb-4 mx-auto w-fit hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Clock className="relative z-10 w-7 h-7 text-blue-400" />
              </div>
              <h4 className="font-bold text-white mb-2 text-xl">
                Fast Delivery
              </h4>
              <p className="text-gray-300 text-base">2-6 month projects</p>
            </div>

            <div className="group text-center">
              <div className="relative bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 mb-4 mx-auto w-fit hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Target className="relative z-10 w-7 h-7 text-blue-400" />
              </div>
              <h4 className="font-bold text-white mb-2 text-xl">
                Results Focused
              </h4>
              <p className="text-gray-300 text-base">Measurable outcomes</p>
            </div>

            <div className="group text-center">
              <div className="relative bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 mb-4 mx-auto w-fit hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Award className="relative z-10 w-7 h-7 text-blue-400" />
              </div>
              <h4 className="font-bold text-white mb-2 text-xl">
                Proven Results
              </h4>
              <p className="text-gray-300 text-base">340% ROI delivered</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}