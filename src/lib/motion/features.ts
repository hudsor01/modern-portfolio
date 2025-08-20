// Motion features configuration for LazyMotion
// This file defines which Framer Motion features to load for bundle size optimization

import { domAnimation, domMax } from 'framer-motion'

// Basic features for most animations (smaller bundle)
export const basicFeatures = domAnimation

// Full features for complex animations (larger bundle)
export const fullFeatures = domMax

// Default export for lazy loading
export default basicFeatures