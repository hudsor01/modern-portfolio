'use client'

import type { LucideIcon } from 'lucide-react'
import { m as motion } from 'framer-motion'
import { fadeInUp } from '../data/constants'

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string
  subtitle: string
  gradientFrom: string
  gradientTo: string
  iconBgClass: string
  iconColorClass: string
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  subtitle,
  gradientFrom,
  gradientTo,
  iconBgClass,
  iconColorClass,
}: MetricCardProps) {
  return (
    <motion.div variants={fadeInUp} className="relative group">
      <div
        className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300`}
      />
      <div className="relative glass-interactive rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 ${iconBgClass} rounded-2xl`}>
            <Icon className={`h-6 w-6 ${iconColorClass}`} />
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-3xl font-bold mb-1">{value}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </motion.div>
  )
}
