'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Project } from '@/lib/data/projects';
import { Card, CardContent, CardMedia, Typography, Chip, Box } from '@mui/material';

interface ProjectCardEnhancedProps {
  project: Project;
  index: number;
}

export function ProjectCardEnhanced({ project, index }: ProjectCardEnhancedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-full"
    >
      <Link href={`/projects/${project.slug}`} className="block h-full">
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--card-gradient)',
            borderRadius: '12px',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            },
          }}
          elevation={2}
        >
          <CardMedia
            component="div"
            sx={{
              height: 240,
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '40%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                transition: 'opacity 0.3s ease',
              },
            }}
          >
            <Image
              src={project.image || '/images/project-placeholder.jpg'}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Featured badge */}
            {project.featured && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  zIndex: 1,
                }}
              >
                Featured
              </Box>
            )}

            {/* Project title overlay on image */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                padding: '16px',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }}
              >
                {project.title}
              </Typography>
            </Box>
          </CardMedia>

          <CardContent
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px',
              paddingTop: '12px',
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {project.technologies?.slice(0, 3).map((tech) => (
                <Chip
                  key={tech}
                  label={tech}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: 'primary.main',
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />
              ))}
              {project.technologies && project.technologies.length > 3 && (
                <Chip
                  label={`+${project.technologies.length - 3}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    color: 'text.secondary',
                  }}
                />
              )}
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'primary.main',
                fontWeight: 500,
                fontSize: '0.875rem',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: 'primary.dark',
                },
              }}
            >
              View Details <ArrowRight size={16} style={{ marginLeft: '4px' }} />
            </Box>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
