'use client';

import React from 'react';
import { ProjectChart } from '@/app/(main-content)/projects/project-chart'

interface SkillsChartProps {
  title?: string;
  className?: string;
}

export function SkillsChart({ title = 'Skills Distribution', className }: SkillsChartProps) {
  const data: any = {
    labels: ['React', 'Next.js', 'TypeScript', 'Node.js', 'UI/UX', 'Database'],
    datasets: [
      {
        label: 'Skill Level',
        data: [90, 85, 80, 75, 70, 65],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Proficiency (%)',
        },
      },
    },
  };

  return (
    <ProjectChart
      type="bar"
      data={data}
      options={options}
      title={title}
      className={className}
      animationDuration={0.8}
    />
  );
}
