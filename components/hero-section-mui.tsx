'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Grid from '@mui/material/Unstable_Grid2';
import { Typography, Button as MuiButton, Container, Box } from '@mui/material';
import { FileText, Folder, User, ArrowRight } from 'lucide-react';
import type { Route } from 'next';

export function HeroSectionMUI() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure hydration doesn't cause UI mismatches
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Box
      component="section"
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #1a1a2e, #16213e)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Background elements */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 0)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Animated background gradient */}
      <Box
        className="animate-blob"
        sx={{
          position: 'absolute',
          top: 0,
          left: -16,
          width: 384,
          height: 384,
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          borderRadius: '50%',
          mixBlendMode: 'multiply',
          filter: 'blur(24px)',
        }}
      />
      <Box
        className="animate-blob animation-delay-2000"
        sx={{
          position: 'absolute',
          top: 0,
          right: -16,
          width: 384,
          height: 384,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '50%',
          mixBlendMode: 'multiply',
          filter: 'blur(24px)',
        }}
      />
      <Box
        className="animate-blob animation-delay-4000"
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 80,
          width: 384,
          height: 384,
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderRadius: '50%',
          mixBlendMode: 'multiply',
          filter: 'blur(24px)',
        }}
      />

      {/* Content Container */}
      <Container sx={{ position: 'relative', zIndex: 10, maxWidth: 'lg' }}>
        <Grid container direction="column" alignItems="center" spacing={2} textAlign="center">
          {/* Eyebrow badge */}
          <Grid xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ marginBottom: '2rem' }}
            >
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(141, 169, 196, 0.1)',
                  border: '1px solid rgba(141, 169, 196, 0.3)',
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'rgb(141, 169, 196)',
                }}
              >
                Revenue Operations Professional
              </Box>
            </motion.div>
          </Grid>

          {/* Main heading with gradient */}
          <Grid xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ marginBottom: '1.5rem' }}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontFamily: 'serif',
                  fontSize: { xs: '3rem', sm: '4rem', md: '5rem', lg: '6rem' },
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  background: 'linear-gradient(to right, #F5F5DC, #E8E8D0)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  color: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Richard Hudson
              </Typography>
            </motion.div>
          </Grid>

          {/* Subtitle with gradient */}
          <Grid xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{ marginBottom: '2rem' }}
            >
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
                  fontWeight: 500,
                  letterSpacing: '-0.025em',
                  background: 'linear-gradient(to right, #8DA9C4, #7A9BB9)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  color: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Driving Business Growth Through Data
              </Typography>
            </motion.div>
          </Grid>

          {/* Description text with improved typography */}
          <Grid xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ marginBottom: '3rem' }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(245, 245, 220, 0.8)',
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  maxWidth: '48rem',
                  mx: 'auto',
                  lineHeight: 1.7,
                  fontWeight: 300,
                  px: 2,
                }}
              >
                Experienced in optimizing revenue operations through data-driven insights, process
                optimization, and strategic operational improvements that drive measurable business
                results.
              </Typography>
            </motion.div>
          </Grid>

          {/* CTA Buttons - Using Grid for button layout */}
          <Grid xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Grid
                container
                spacing={2}
                justifyContent="center"
                sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}
              >
                {/* Resume Button */}
                <Grid>
                  <Link href={'/resume' as Route<string>} className="group">
                    <MuiButton
                      variant="contained"
                      size="large"
                      sx={{
                        backgroundColor: '#8DA9C4',
                        color: '#F5F5DC',
                        padding: '0.875rem 2rem',
                        fontSize: '1.125rem',
                        borderRadius: '0.75rem',
                        boxShadow:
                          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(141, 169, 196, 0.8)',
                        transition: 'all 0.3s',
                        '&:hover': {
                          backgroundColor: '#7A9BB9',
                          boxShadow:
                            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                      startIcon={
                        <FileText
                          size={20}
                          className="text-[#F5F5DC]/90 transition-transform duration-300 group-hover:translate-x-1"
                        />
                      }
                    >
                      View Resume
                    </MuiButton>
                  </Link>
                </Grid>

                {/* Projects Button */}
                <Grid>
                  <Link href={'/projects' as Route<string>} className="group">
                    <MuiButton
                      variant="contained"
                      size="large"
                      sx={{
                        backgroundColor: '#8DA9C4',
                        color: '#F5F5DC',
                        padding: '0.875rem 2rem',
                        fontSize: '1.125rem',
                        borderRadius: '0.75rem',
                        boxShadow:
                          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(141, 169, 196, 0.8)',
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow:
                            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                          backgroundColor: '#7A9BB9',
                        },
                      }}
                      startIcon={
                        <Folder
                          size={20}
                          className="text-[#F5F5DC]/90 transition-transform duration-300 group-hover:translate-x-1"
                        />
                      }
                    >
                      View Projects
                    </MuiButton>
                  </Link>
                </Grid>

                {/* About Me Button */}
                <Grid>
                  <Link href={'/about' as Route<string>} className="group">
                    <MuiButton
                      variant="contained"
                      size="large"
                      sx={{
                        backgroundColor: '#8DA9C4',
                        color: '#F5F5DC',
                        padding: '0.875rem 2rem',
                        fontSize: '1.125rem',
                        borderRadius: '0.75rem',
                        boxShadow:
                          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(141, 169, 196, 0.8)',
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow:
                            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                          backgroundColor: '#7A9BB9',
                        },
                      }}
                      startIcon={
                        <User
                          size={20}
                          className="text-[#F5F5DC]/90 transition-transform duration-300 group-hover:translate-x-1"
                        />
                      }
                    >
                      About Me
                    </MuiButton>
                  </Link>
                </Grid>
              </Grid>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(245, 245, 220, 0.6)',
            fontSize: '0.875rem',
            marginBottom: '0.5rem',
          }}
        >
          Scroll to explore
        </Typography>
        <Box
          sx={{
            width: '1.5rem',
            height: '2.5rem',
            border: '2px solid rgba(245, 245, 220, 0.3)',
            borderRadius: '9999px',
            display: 'flex',
            justifyContent: 'center',
            padding: '0.25rem',
          }}
        >
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: 'easeInOut',
            }}
            style={{
              width: '0.375rem',
              height: '0.375rem',
              backgroundColor: 'rgba(245, 245, 220, 0.6)',
              borderRadius: '9999px',
            }}
          />
        </Box>
      </motion.div>

      {/* CSS for animation delays */}
      <style jsx global>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </Box>
  );
}
