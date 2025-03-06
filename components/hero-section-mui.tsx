'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Button,
  Paper,
  Stack,
  Chip,
  useTheme,
  alpha
} from '@mui/material'
import { ArrowForward, FileDownload, LinkedIn, GitHub, KeyboardArrowDown } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { Link as ScrollLink } from 'react-scroll'

interface HeroSectionProps {
  titles: string[];
}

export function HeroSection({ titles }: HeroSectionProps) {
  const theme = useTheme();
  const [currentTitle, setCurrentTitle] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Typewriter effect
  useEffect(() => {
    const title = titles[currentTitle];
    const typingDelay = 100; // Delay between typing each character
    const deletingDelay = 50; // Faster when deleting
    const completeDelay = 1500; // Pause when word is complete
    
    let timeout;
    
    if (!isDeleting && displayedText === title) {
      // Word is complete, wait then start deleting
      timeout = setTimeout(() => setIsDeleting(true), completeDelay);
    } else if (isDeleting && displayedText === '') {
      // Word is deleted, move to next word
      setIsDeleting(false);
      setCurrentTitle((prev) => (prev + 1) % titles.length);
    } else if (isDeleting) {
      // Delete a character
      timeout = setTimeout(() => {
        setDisplayedText(prev => prev.slice(0, -1));
      }, deletingDelay);
    } else {
      // Type a character
      timeout = setTimeout(() => {
        setDisplayedText(title.slice(0, displayedText.length + 1));
      }, typingDelay);
    }
    
    return () => clearTimeout(timeout);
  }, [currentTitle, displayedText, isDeleting, titles]);
  
  return (
    <Box 
      component="section" 
      sx={{ 
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        pt: 8,
        pb: 15,
        position: 'relative',
        backgroundColor: theme => theme.palette.mode === 'light' ? 'white' : 'background.default'
      }}
    >
      {/* Subtle background elements */}
      <Box 
        sx={{
          position: 'absolute',
          top: '20%',
          right: '5%',
          width: { xs: 200, md: 300 },
          height: { xs: 200, md: 300 },
          borderRadius: '50%',
          backgroundColor: alpha(theme.palette.primary.main, 0.03),
          filter: 'blur(60px)',
          zIndex: 0
        }}
      />
      
      <Box 
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '10%',
          width: { xs: 250, md: 350 },
          height: { xs: 250, md: 350 },
          borderRadius: '50%',
          backgroundColor: alpha(theme.palette.secondary.main, 0.04),
          filter: 'blur(70px)',
          zIndex: 0
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} lg={7}>
            <Box>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Chip
                  label="Revenue Operations Professional"
                  color="primary"
                  size="medium"
                  sx={{ 
                    mb: 2,
                    borderRadius: 'full',
                    fontWeight: 500,
                    px: 1.5,
                    fontSize: '0.85rem'
                  }}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Typography 
                  variant="h2" 
                  component="h1"
                  sx={{ 
                    fontWeight: 800,
                    mb: 2,
                    lineHeight: 1.2,
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' }
                  }}
                >
                  Driving Business Growth Through Data-Driven Insights
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box sx={{ height: 42, my: 2 }}>
                  <Typography 
                    variant="h5"
                    component="div" 
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Box component="span">
                      {displayedText}
                    </Box>
                    <Box 
                      component="span" 
                      sx={{ 
                        width: 2, 
                        height: 24, 
                        bgcolor: 'primary.main', 
                        ml: 0.5,
                        animation: 'blink 1s step-end infinite'
                      }}
                    />
                  </Typography>
                </Box>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ 
                    mb: 4,
                    maxWidth: 600,
                    fontSize: '1.1rem',
                    lineHeight: 1.6
                  }}
                >
                  I help businesses optimize their revenue operations through strategic process improvements, 
                  cross-functional collaboration, and actionable data analytics.
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2}
                  sx={{ mb: 4 }}
                >
                  <Button 
                    variant="contained" 
                    component={Link} 
                    href="/projects"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{ 
                      px: 3, 
                      py: 1.5,
                      borderRadius: 2
                    }}
                  >
                    View Projects
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    component={Link} 
                    href="/resume"
                    size="large"
                    startIcon={<FileDownload />}
                    sx={{ 
                      px: 3, 
                      py: 1.5,
                      borderRadius: 2
                    }}
                  >
                    View Resume
                  </Button>
                </Stack>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Stack direction="row" spacing={3} alignItems="center">
                  <Link href="https://linkedin.com/in/hudsor01" passHref>
                    <Box 
                      component="a"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'text.secondary',
                        transition: 'color 0.2s',
                        '&:hover': {
                          color: 'primary.main'
                        }
                      }}
                      aria-label="LinkedIn Profile"
                    >
                      <LinkedIn fontSize="medium" />
                    </Box>
                  </Link>
                  
                  <Link href="https://github.com/hudsor01" passHref>
                    <Box 
                      component="a"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'text.secondary',
                        transition: 'color 0.2s',
                        '&:hover': {
                          color: 'primary.main'
                        }
                      }}
                      aria-label="GitHub Profile"
                    >
                      <GitHub fontSize="medium" />
                    </Box>
                  </Link>
                </Stack>
              </motion.div>
            </Box>
          </Grid>
          
          {/* Right Content - Image */}
          <Grid item xs={12} lg={5}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              sx={{ position: 'relative' }}
            >
              <Box 
                sx={{ 
                  position: 'relative',
                  mx: 'auto',
                  width: { xs: '80%', sm: '70%', md: '100%' },
                  maxWidth: 450,
                  aspectRatio: '1/1',
                }}
              >
                {/* Background decorations */}
                <Box 
                  sx={{
                    position: 'absolute',
                    right: { xs: '-5%', md: '-10%' },
                    bottom: { xs: '-5%', md: '-10%' },
                    width: '90%',
                    height: '90%',
                    backgroundColor: alpha(theme.palette.grey[200], theme.palette.mode === 'light' ? 1 : 0.1),
                    borderRadius: 4,
                    zIndex: 0
                  }}
                />
                
                <Box 
                  sx={{
                    position: 'absolute',
                    left: { xs: '-5%', md: '-8%' },
                    top: { xs: '-5%', md: '-8%' },
                    width: '30%',
                    height: '30%',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 2,
                    zIndex: 0
                  }}
                />
                
                {/* Image container */}
                <Paper
                  elevation={6}
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '8px solid',
                    borderColor: theme.palette.mode === 'light' ? 'white' : theme.palette.background.paper,
                    zIndex: 1
                  }}
                >
                  <Image
                    src="/images/richard.jpg"
                    alt="Richard Hudson"
                    fill
                    sizes="(max-width: 768px) 70vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ 
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                    priority
                  />
                </Paper>
                
                {/* Experience badge */}
                <Paper
                  elevation={8}
                  sx={{
                    position: 'absolute',
                    right: '-10%',
                    bottom: '-5%',
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '4px solid',
                    borderColor: theme.palette.mode === 'light' ? 'white' : theme.palette.background.paper,
                    zIndex: 2
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" lineHeight={1}>7+</Typography>
                  <Typography variant="caption" fontSize="0.7rem">Years Exp.</Typography>
                </Paper>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
        
        {/* Scroll indicator */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            zIndex: 2
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <ScrollLink
              to="projects-section"
              spy={true}
              smooth={true}
              offset={-80}
              duration={800}
            >
              <Stack 
                direction="column" 
                alignItems="center"
                spacing={1}
                sx={{ cursor: 'pointer' }}
              >
                <Typography variant="body2" color="text.secondary">
                  Scroll to explore
                </Typography>
                <Box 
                  sx={{
                    animation: 'bounce 2s infinite'
                  }}
                >
                  <KeyboardArrowDown color="primary" />
                </Box>
              </Stack>
            </ScrollLink>
          </motion.div>
        </Box>
      </Container>
      
      {/* Add keyframes for blinking cursor and bounce animation */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>
    </Box>
  );
}
