'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Project } from '@/lib/data/projects'
import { ProjectCardEnhanced } from './project-card-enhanced'
import { Button } from '@/components/ui/button'
import { Tabs, Tab, Box, Chip, Paper, Typography, Grid } from '@mui/material'

interface ProjectFiltersEnhancedProps {
  projects: Project[]
}

export function ProjectFiltersEnhanced({ projects }: ProjectFiltersEnhancedProps) {
  // Get all unique technologies from projects
  const allTechnologies = ['All', ...new Set(projects.flatMap(p => p.technologies || []))]
  
  const [selectedFilter, setSelectedFilter] = useState<string>('All')
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects)
  
  const handleFilterChange = useCallback((filter: string) => {
    setSelectedFilter(filter)
    
    if (filter === 'All') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(
        projects.filter(project => project.technologies?.includes(filter))
      )
    }
  }, [projects])
  
  // Initialize with all projects
  useEffect(() => {
    setFilteredProjects(projects)
  }, [projects])

  return (
    <div className="space-y-10">
      {/* Enhanced Filters */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          borderRadius: 3,
          backgroundColor: 'transparent',
          display: 'flex',
          justifyContent: 'center',
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0,0,0,0.05)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: '2px',
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1,
          justifyContent: 'center',
          p: 1
        }}>
          {allTechnologies.map(tech => (
            <Chip
              key={tech}
              label={tech}
              onClick={() => handleFilterChange(tech)}
              color={selectedFilter === tech ? "primary" : "default"}
              variant={selectedFilter === tech ? "filled" : "outlined"}
              sx={{ 
                borderRadius: '2rem',
                px: 1,
                fontWeight: selectedFilter === tech ? 600 : 400,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: selectedFilter === tech ? 'primary.main' : 'rgba(0,0,0,0.08)'
                }
              }}
            />
          ))}
        </Box>
      </Paper>
      
      {/* Project Grid */}
      <Box sx={{ mb: 6 }}>
        <AnimatePresence mode="wait">
          {filteredProjects.length > 0 ? (
            <Grid 
              container 
              spacing={3}
              sx={{ 
                marginTop: 0, 
                marginBottom: 4 
              }}
            >
              {filteredProjects.map((project, index) => (
                <Grid item xs={12} sm={6} md={4} key={project.id}>
                  <ProjectCardEnhanced project={project} index={index} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No projects found with the selected technology.
              </Typography>
              <Button 
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white" 
                onClick={() => handleFilterChange('All')}
              >
                Show All Projects
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </div>
  )
}