'use client'

import { useState } from 'react'
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { FormatQuote } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

// Sample testimonials data
const testimonials = [
  {
    quote: "Richard's data-driven approach to revenue operations transformed our sales process and increased our conversion rates by 35% in just three months.",
    name: "Sarah Johnson",
    title: "VP of Sales, TechCorp Inc.",
    image: "" // Placeholder - will use fallback with initials
  },
  {
    quote: "Working with Richard on our process optimization initiative was a game-changer. His strategic insights and analytical skills helped us identify bottlenecks we didn't even know existed.",
    name: "Michael Chen",
    title: "COO, GrowthMetrics",
    image: "" // Placeholder - will use fallback with initials
  },
  {
    quote: "Richard's expertise in partner management and revenue operations helped us scale our channel program to new heights. His ability to translate data into actionable strategies is remarkable.",
    name: "Jessica Williams",
    title: "Partner Operations Director, ScaleUp Solutions",
    image: "" // Placeholder - will use fallback with initials
  }
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box 
      component="section" 
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
              What My Clients Say
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                maxWidth: 650, 
                mx: 'auto' 
              }}
            >
              I've helped businesses across various industries optimize their revenue operations and drive growth.
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4} alignItems="center">
          {/* Mobile view: Testimonial cards stacked vertically */}
          {isMobile && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {testimonials.map((testimonial, index) => (
                  <Card 
                    key={index}
                    elevation={activeIndex === index ? 3 : 1}
                    onClick={() => setActiveIndex(index)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: activeIndex === index ? 'scale(1.02)' : 'scale(1)',
                      border: activeIndex === index 
                        ? `1px solid ${theme.palette.primary.main}` 
                        : '1px solid transparent'
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        <FormatQuote sx={{ 
                          fontSize: 40, 
                          color: 'primary.main', 
                          opacity: 0.2
                        }} />
                      </Box>
                      
                      <Typography variant="body1" paragraph>
                        "{testimonial.quote}"
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <Avatar sx={{ mr: 2 }}>
                          {testimonial.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.title}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Grid>
          )}

          {/* Desktop view: Current testimonial card with navigation */}
          {!isMobile && (
            <>
              {/* Left side: Testimonial content */}
              <Grid item xs={12} md={8}>
                <Box sx={{ position: 'relative', height: 300 }}>
                  <AnimatePresence mode="wait">
                    {testimonials.map((testimonial, index) => (
                      activeIndex === index && (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.4 }}
                          style={{ 
                            position: 'absolute', 
                            width: '100%', 
                            height: '100%' 
                          }}
                        >
                          <Paper
                            elevation={3}
                            sx={{
                              height: '100%',
                              p: 4,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box>
                              <FormatQuote sx={{ 
                                fontSize: 60, 
                                color: 'primary.main', 
                                opacity: 0.2,
                                mb: 2 
                              }} />
                              <Typography variant="h6" paragraph lineHeight={1.7}>
                                "{testimonial.quote}"
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                              <Avatar sx={{ mr: 2, width: 48, height: 48 }}>
                                {testimonial.name.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                  {testimonial.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {testimonial.title}
                                </Typography>
                              </Box>
                            </Box>
                          </Paper>
                        </motion.div>
                      )
                    ))}
                  </AnimatePresence>
                </Box>
              </Grid>
              
              {/* Right side: Navigation */}
              <Grid item xs={12} md={4}>
                <List component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
                  {testimonials.map((testimonial, index) => (
                    <ListItem key={index} disablePadding divider={index !== testimonials.length - 1}>
                      <ListItemButton 
                        selected={activeIndex === index}
                        onClick={() => setActiveIndex(index)}
                        sx={{
                          py: 2,
                          px: 3,
                          borderLeft: activeIndex === index 
                            ? `4px solid ${theme.palette.primary.main}` 
                            : '4px solid transparent',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="bold">
                              {testimonial.name}
                            </Typography>
                          }
                          secondary={testimonial.title}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </Box>
  );
}
