'use client';

import React from 'react';
import { Box, LinearProgress, Typography, Tooltip } from '@mui/material';

type Skill = {
  name: string;
  level: number;
};

type SkillCategory = {
  category: string;
  skills: Skill[];
};

interface SkillsWithProgressProps {
  skillsData: SkillCategory[];
}

export function SkillsWithProgress({ skillsData }: SkillsWithProgressProps) {
  return (
    <div className="w-full">
      {/* Tabs for different skill categories */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <div className="flex justify-center space-x-4 overflow-x-auto pb-2">
          {skillsData.map((category, idx) => (
            <div
              key={category.category}
              className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm md:text-base font-medium"
            >
              {category.category}
            </div>
          ))}
        </div>
      </Box>

      {/* Skills with percentage bars */}
      <div className="max-w-4xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-3">
        {skillsData.map((category) => (
          <div
            key={category.category}
            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-xl font-bold mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
              {category.category}
            </h3>

            <div className="space-y-4">
              {category.skills.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Typography
                      variant="body2"
                      className="text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {skill.name}
                    </Typography>
                    <Tooltip title={`${skill.level}/100`} arrow>
                      <div className="w-10 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded">
                        {skill.level}
                      </div>
                    </Tooltip>
                  </div>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={skill.level}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'light' ? '#e2e8f0' : '#334155',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#2563eb',
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkillsSummary() {
  return (
    <div className="max-w-4xl mx-auto mt-16 p-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
            Continuous Development
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            I&rsquom committed to staying at the forefront of revenue operations best practices and
            technologies. Through ongoing professional development, I constantly expand my knowledge
            and skills to deliver exceptional results.
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            My approach combines proven methodologies with innovative techniques to address complex
            business challenges.
          </p>
        </div>
        <div className="space-y-6">
          <div className="relative">
            <div className="flex mb-1 items-center justify-between">
              <Typography
                variant="subtitle2"
                className="font-medium text-slate-700 dark:text-slate-300"
              >
                Revenue Strategy
              </Typography>
              <Typography
                variant="subtitle2"
                className="font-medium text-blue-600 dark:text-blue-400"
              >
                95%
              </Typography>
            </div>
            <Box sx={{ width: '100%' }}>
              <LinearProgress
                variant="determinate"
                value={95}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? '#e2e8f0' : '#334155',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#2563eb',
                    borderRadius: 5,
                  },
                }}
              />
            </Box>
          </div>

          <div className="relative">
            <div className="flex mb-1 items-center justify-between">
              <Typography
                variant="subtitle2"
                className="font-medium text-slate-700 dark:text-slate-300"
              >
                Data Analytics
              </Typography>
              <Typography
                variant="subtitle2"
                className="font-medium text-blue-600 dark:text-blue-400"
              >
                90%
              </Typography>
            </div>
            <Box sx={{ width: '100%' }}>
              <LinearProgress
                variant="determinate"
                value={90}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? '#e2e8f0' : '#334155',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#2563eb',
                    borderRadius: 5,
                  },
                }}
              />
            </Box>
          </div>

          <div className="relative">
            <div className="flex mb-1 items-center justify-between">
              <Typography
                variant="subtitle2"
                className="font-medium text-slate-700 dark:text-slate-300"
              >
                Process Optimization
              </Typography>
              <Typography
                variant="subtitle2"
                className="font-medium text-blue-600 dark:text-blue-400"
              >
                98%
              </Typography>
            </div>
            <Box sx={{ width: '100%' }}>
              <LinearProgress
                variant="determinate"
                value={98}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? '#e2e8f0' : '#334155',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#2563eb',
                    borderRadius: 5,
                  },
                }}
              />
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}
