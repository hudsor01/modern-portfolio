'use client'

import React from 'react'
import { ProjectChart } from '@/components/projects/project-chart'
import type { ChartData } from '@/types/project'

interface SkillsChartProps {
  title?: string
  className?: string
}

export function SkillsChart({ title = 'Skills Distribution', className }: SkillsChartProps) {
  // Original skills data structure (like Chart.js)
  const skillsSourceData = {
    labels: ['React', 'Next.js', 'TypeScript', 'Node.js', 'UI/UX', 'Database'],
    dataset: {
      dataPoints: [90, 85, 80, 75, 70, 65],
      backgroundColors: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
      ],
    },
  };

  // Transform data into the format expected by ProjectChart (ChartData[])
  const preparedChartData: ChartData[] = skillsSourceData.labels.map((label, index) => ({
    name: label,
    // Assuming noUncheckedIndexedAccess is enabled in tsconfig, array access can be T | undefined.
    // Since data is hardcoded and lengths match, we assert non-null for 'value'.
    // 'color' is optional in ChartData, so 'string | undefined' is fine.
    value: skillsSourceData.dataset.dataPoints[index]!, 
    color: skillsSourceData.dataset.backgroundColors[index], 
  }));

  // Options for ProjectChart
  const projectChartOptions = {
    yAxisLabel: 'Proficiency (%)',
    // xAxisLabel will default to 'name' in ProjectChart based on data structure
  };

  return (
    <ProjectChart
      type="bar"
      data={preparedChartData}
      options={projectChartOptions}
      title={title}
      className={className}
      animationDuration={0.8}
    />
  )
}
