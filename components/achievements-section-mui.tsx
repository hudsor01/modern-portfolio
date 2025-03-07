'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material';
import { BarChart, Group, Lightbulb } from '@mui/icons-material';
import { motion, useInView } from 'framer-motion';

// Stats data
const achievements = [
  {
    value: 1.1,
    suffix: 'M+',
    prefix: '$',
    label: 'Revenue Growth',
    description:
      'Drove significant annual revenue growth through data-driven forecasting and optimization strategies.',
    icon: BarChart,
    color: 'primary',
  },
  {
    value: 2200,
    suffix: '%',
    label: 'Network Expansion',
    description:
      'Grew partner network and increased transaction volume by 432% through strategic partnership development.',
    icon: Group,
    color: 'secondary',
  },
  {
    value: 40,
    suffix: '%',
    label: 'Process Optimization',
    description:
      'Implemented cross-functional workflow integrations, reducing processing time and improving operational efficiency.',
    icon: Lightbulb,
    color: 'warning',
  },
];

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

// AnimatedCounter component for counting animation
const AnimatedCounter = ({ value, duration = 2, prefix = '', suffix = '' }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const inView = useInView(countRef, { once: true, margin: '0px 0px -100px 0px' });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      const totalFrames = Math.max(Math.floor(duration * 60), 1);
      const increment = end / totalFrames;

      const counter = setInterval(() => {
        start += increment;
        setCount(Math.min(start, end));

        if (start >= end) {
          clearInterval(counter);
          setCount(end);
        }
      }, 1000 / 60);

      return () => clearInterval(counter);
    }
  }, [inView, value, duration]);

  return (
    <Box component="span" ref={countRef}>
      {prefix}
      {Math.floor(count)}
      {suffix}
    </Box>
  );
};

export function AchievementsSection() {
  const theme = useTheme();

  // Get color based on theme and color name
  const getColorByName = (colorName: string) => {
    switch (colorName) {
      case 'primary':
        return theme.palette.primary.main;
      case 'secondary':
        return theme.palette.secondary.main;
      case 'warning':
        return theme.palette.warning?.main || '#ED6C02';
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Box
      component="section"
      sx={{
        py: 10,
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? 'white' : 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            mb: 6,
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
                mb: 1,
              }}
            >
              Key Achievements
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 650,
                mx: 'auto',
              }}
            >
              Delivering measurable results through strategic planning and execution
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4}>
          {achievements.map((achievement, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: 8,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: alpha(getColorByName(achievement.color), 0.1),
                          color: getColorByName(achievement.color),
                          width: 56,
                          height: 56,
                          mr: 2,
                        }}
                      >
                        <achievement.icon />
                      </Avatar>
                      <Typography
                        variant="h4"
                        component="div"
                        fontWeight="bold"
                        color={achievement.color}
                      >
                        <AnimatedCounter
                          value={achievement.value}
                          prefix={achievement.prefix || ''}
                          suffix={achievement.suffix || ''}
                        />
                      </Typography>
                    </Box>

                    <Typography variant="h6" component="h3" gutterBottom fontWeight="medium">
                      {achievement.label}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {achievement.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
