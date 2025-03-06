'use client'

import { useState } from 'react'
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  Tabs,
  Tab,
  LinearProgress,
  Paper,
  Avatar,
  useTheme,
  alpha
} from '@mui/material'
import { motion } from 'framer-motion'

// Skills data organized by categories
const skillsData = [
  {
    category: "Revenue Operations",
    skills: [
      "Revenue Operations",
      "Data Analytics",
      "Process Optimization",
      "Strategic Planning",
      "Sales Operations",
      "Business Analysis"
    ]
  },
  {
    category: "Tools & Platforms",
    skills: [
      "Salesforce",
      "HubSpot",
      "SalesLoft",
      "PartnerStack",
      "Workato",
      "Power BI"
    ]
  },
  {
    category: "Technical Skills",
    skills: [
      "Python",
      "JavaScript",
      "React & Next.js",
      "SQL",
      "Data Visualization",
      "API Integrations"
    ]
  }
];

// Skill progress data
const skillProgress = [
  { name: "Revenue Strategy", value: 95 },
  { name: "Data Analytics", value: 90 },
  { name: "Process Optimization", value: 98 }
];

export function SkillsSection() {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <Box 
      component="section" 
      sx={{ 
        py: 10,
        backgroundColor: theme => theme.palette.mode === 'light' ? 'white' : 'background.default'
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
              Skills & Expertise
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                maxWidth: 650, 
                mx: 'auto' 
              }}
            >
              Specialized capabilities that drive results across various business functions
            </Typography>
          </motion.div>
        </Box>

        {/* Category tabs */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
              },
              '& .MuiTabs-flexContainer': {
                gap: 2
              }
            }}
          >
            {skillsData.map((category, index) => (
              <Tab 
                key={category.category} 
                label={category.category}
                sx={{
                  fontWeight: 500,
                  px: 3,
                  py: 1.5,
                  borderRadius: '99px',
                  color: activeTab === index ? 'primary.main' : 'text.primary',
                  bgcolor: activeTab === index 
                    ? alpha(theme.palette.primary.main, 0.1) 
                    : 'transparent',
                  '&:hover': {
                    bgcolor: activeTab === index 
                      ? alpha(theme.palette.primary.main, 0.1) 
                      : alpha(theme.palette.text.primary, 0.05)
                  }
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Skill cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {skillsData.map((category, categoryIndex) => (
            <Box 
              key={category.category}
              sx={{ display: activeTab === categoryIndex ? 'block' : 'none' }}
            >
              <Grid container spacing={3}>
                {category.skills.map((skill, index) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={skill}>
                    <motion.div variants={itemVariants}>
                      <Card 
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          px: 2,
                          py: 3,
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: 4
                          }
                        }}
                      >
                        <Avatar 
                          sx={{ 
                            width: 48, 
                            height: 48,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                            mb: 2
                          }}
                        >
                          {index + 1}
                        </Avatar>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {skill}
                        </Typography>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </motion.div>
        
        {/* Skill progress section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Paper 
            elevation={1} 
            sx={{ mt: 8, p: 4, borderRadius: 3 }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  Continuous Development
                </Typography>
                <Typography variant="body1" paragraph color="text.secondary">
                  I'm committed to staying at the forefront of revenue operations best practices and technologies. 
                  Through ongoing professional development, I constantly expand my knowledge and skills to deliver 
                  exceptional results.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  My approach combines proven methodologies with innovative techniques to address complex business challenges.
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ px: 2 }}>
                  {skillProgress.map((skill, index) => (
                    <Box key={skill.name} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {skill.name}
                        </Typography>
                        <Typography variant="body2" color="primary.main" fontWeight="medium">
                          {skill.value}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={skill.value} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1)
                        }} 
                      />
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
