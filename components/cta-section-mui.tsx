'use client'

import Link from 'next/link'
import { 
  Box, 
  Typography, 
  Container, 
  Button,
  Paper,
  useTheme,
  alpha
} from '@mui/material'
import { ArrowForward } from '@mui/icons-material'
import { motion } from 'framer-motion'

export function CTASection() {
  const theme = useTheme();

  return (
    <Box 
      component="section" 
      sx={{ 
        py: 10,
        background: theme => theme.palette.mode === 'light' 
          ? 'linear-gradient(to right, #f8fafc, #ffffff)'
          : 'linear-gradient(to right, #0f172a, #1e293b)'
      }}
    >
      <Container maxWidth="lg">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={4}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              background: theme.palette.mode === 'light' 
                ? 'white'
                : alpha(theme.palette.background.paper, 0.9)
            }}
          >
            {/* Background decorative elements */}
            <Box 
              sx={{
                position: 'absolute',
                top: '-20%',
                right: '-10%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                zIndex: 0
              }}
            />
            
            <Box 
              sx={{
                position: 'absolute',
                bottom: '-15%',
                left: '-5%',
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                zIndex: 0
              }}
            />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Typography 
                  variant="h3" 
                  component="h2" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 'bold',
                    mb: 2,
                    maxWidth: '800px',
                    mx: 'auto'
                  }}
                >
                  Ready to Optimize Your Business Operations?
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                  sx={{ 
                    mb: 4, 
                    maxWidth: '600px',
                    mx: 'auto'
                  }}
                >
                  Let's discuss how my expertise in revenue operations and data analytics can help drive your business growth.
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="contained" 
                  component={Link} 
                  href="/contact"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{ 
                    px: 4, 
                    py: 1.5, 
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    boxShadow: theme.shadows[4]
                  }}
                >
                  Let's Connect
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mt: 3 }}
                >
                  No commitment required. Let's start with a conversation.
                </Typography>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
