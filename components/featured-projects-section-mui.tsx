'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Chip,
  Stack
} from '@mui/material'
import { ArrowForward } from '@mui/icons-material'
import { Project } from '@/lib/data/projects'
import { motion } from 'framer-motion'

interface FeaturedProjectsSectionProps {
  projects: Project[]
}

export function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  // Only show the first 2 projects
  const displayedProjects = projects.slice(0, 2);

  return (
    <Box
      component="section"
      id="projects-section"
      sx={{
        py: 10,
        backgroundColor: theme => theme.palette.mode === 'light' ? 'grey.50' : 'grey.900'
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            mb: 6
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                mb: 1
              }}
            >
              Featured Projects
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 650,
                mx: 'auto'
              }}
            >
              Explore my work in revenue operations and business analytics
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4}>
          {displayedProjects.map((project, index) => (
            <Grid item xs={12} md={6} key={project.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: 8
                    }
                  }}
                >
                  <CardActionArea
                    component={Link}
                    href={`/projects/${project.slug}`}
                    sx={{
                      textDecoration: 'none'
                    }}
                  >
                    <Box sx={{ position: 'relative', height: 240 }}>
                      <CardMedia
                        component="div"
                        sx={{
                          position: 'relative',
                          height: '100%',
                          overflow: 'hidden'
                        }}
                      >
                        <Image
                          src={project.image || '/images/projects/churn-retention.jpg'}
                          alt={project.title}
                          fill
                          sizes="(max-width: 600px) 100vw, 600px"
                          style={{
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease'
                          }}
                          className="group-hover:scale-105"
                        />

                        {/* Gradient overlay */}
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                            opacity: 0.8
                          }}
                        />

                        {/* Project title */}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            p: 3
                          }}
                        >
                          <Typography
                            variant="h5"
                            component="h3"
                            sx={{
                              fontWeight: 'bold',
                              color: 'white'
                            }}
                          >
                            {project.title}
                          </Typography>
                        </Box>
                      </CardMedia>
                    </Box>

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                        sx={{
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {project.description}
                      </Typography>

                      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2, gap: 1 }}>
                        {project.technologies?.slice(0, 3).map((tech, techIndex) => (
                          <Chip
                            key={techIndex}
                            label={tech}
                            size="small"
                            sx={{
                              bgcolor: theme => theme.palette.mode === 'light' ? 'grey.100' : 'grey.800',
                              color: 'text.secondary',
                              fontSize: '0.75rem'
                            }}
                          />
                        ))}
                        {project.technologies?.length > 3 && (
                          <Chip
                            label={`+${project.technologies.length - 3} more`}
                            size="small"
                            sx={{
                              bgcolor: theme => theme.palette.mode === 'light' ? 'grey.100' : 'grey.800',
                              color: 'text.secondary',
                              fontSize: '0.75rem'
                            }}
                          />
                        )}
                      </Stack>

                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', fontWeight: 500 }}>
                        View Project Details
                        <ArrowForward sx={{ ml: 1, fontSize: '1rem' }} />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              variant="outlined"
              component={Link}
              href="/projects"
              size="large"
              endIcon={<ArrowForward />}
              sx={{ py: 1.5, px: 3 }}
            >
              View All Projects
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
