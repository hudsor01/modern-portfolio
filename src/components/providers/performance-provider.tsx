'use client'

/**
 * Performance Provider Component
 * Initializes performance monitoring and provides optimization features
 */

import React, { useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { performanceMonitor } from '@/lib/performance/performance-monitor';

interface PerformanceProviderProps {
  children: React.ReactNode;
  enableReporting?: boolean;
  enableOptimizations?: boolean;
}

// Critical resource preloader
const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const criticalFonts = [
    '/fonts/inter-var.woff2',
    '/fonts/geist-sans.woff2'
  ];

  criticalFonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Preload critical images
  const criticalImages = [
    '/images/richard.jpg',
    '/images/projects/revenue-kpi.jpg'
  ];

  criticalImages.forEach(image => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = image;
    link.as = 'image';
    document.head.appendChild(link);
  });
};

// Intersection Observer for lazy loading optimization
const setupLazyLoadingOptimization = () => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.1
  });

  // Observe all images with data-src attribute
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => imageObserver.observe(img));

  return () => imageObserver.disconnect();
};

// Browser optimization tweaks
const applyBrowserOptimizations = () => {
  if (typeof window === 'undefined') return;

  // Enable hardware acceleration for smooth animations
  const animatedElements = document.querySelectorAll('[data-animated]');
  animatedElements.forEach(element => {
    (element as HTMLElement).style.transform = 'translateZ(0)';
    (element as HTMLElement).style.willChange = 'transform, opacity';
  });

  // Optimize scroll performance
  let ticking = false;
  const optimizeScrollHandler = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        // Batch DOM reads and writes
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', optimizeScrollHandler, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', optimizeScrollHandler);
  };
};

// Resource hints for better loading
const addResourceHints = () => {
  if (typeof document === 'undefined') return;

  // DNS prefetch for external domains
  const externalDomains = [
    'images.unsplash.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com'
  ];

  externalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });

  // Preconnect to critical origins
  const criticalOrigins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  criticalOrigins.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

export const PerformanceProvider: React.FC<PerformanceProviderProps> = React.memo(({
  children,
  enableReporting = true,
  enableOptimizations = true
}) => {
  // Initialize performance monitoring
  useEffect(() => {
    if (!enableReporting) return;

    // Start monitoring
    const monitor = performanceMonitor;
    
    // Log initial performance state
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        const report = monitor.generateReport();
        if (Object.keys(report.summary).length > 0) {
          console.group('🚀 Performance Report');
          console.table(report.summary);
          if (report.recommendations.length > 0) {
            console.warn('Recommendations:', report.recommendations);
          }
          console.groupEnd();
        }
      }, 3000);
    }

    return () => {
      // Cleanup is handled by the monitor singleton
    };
  }, [enableReporting]);

  // Apply performance optimizations
  useEffect(() => {
    if (!enableOptimizations) return;

    const cleanupFunctions: (() => void)[] = [];

    // Apply optimizations after initial render
    const timeoutId = setTimeout(() => {
      preloadCriticalResources();
      addResourceHints();
      
      const cleanupLazyLoading = setupLazyLoadingOptimization();
      const cleanupBrowserOpts = applyBrowserOptimizations();
      
      if (cleanupLazyLoading) cleanupFunctions.push(cleanupLazyLoading);
      if (cleanupBrowserOpts) cleanupFunctions.push(cleanupBrowserOpts);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [enableOptimizations]);

  // Memoize children to prevent unnecessary re-renders
  const memoizedChildren = useMemo(() => children, [children]);

  return <>{memoizedChildren}</>;
});

PerformanceProvider.displayName = 'PerformanceProvider';

// Performance-optimized Image component
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = React.memo(({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  loading: _loading = 'lazy',
  onLoad
}) => {
  const handleLoad = useCallback(() => {
    onLoad?.();
  }, [onLoad]);

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 0}
      height={height || 0}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      priority={priority}
      onLoad={handleLoad}
      placeholder="empty"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: width && height ? `${width}px ${height}px` : 'auto'
      }}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default PerformanceProvider;