/**
 * Advanced Performance Monitoring System
 * Tracks Core Web Vitals, custom metrics, and provides optimization insights
 */

interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  
  // Custom Performance Metrics
  pageLoadTime?: number;
  domContentLoaded?: number;
  resourceLoadTime?: number;
  jsExecutionTime?: number;
  cssRenderTime?: number;
  
  // User Experience Metrics
  interactionDelay?: number;
  scrollPerformance?: number;
  memoryUsage?: number;
  
  // Page Context
  url: string;
  userAgent: string;
  timestamp: number;
  sessionId: string;
}

interface PerformanceThresholds {
  lcp: { good: number; needs_improvement: number };
  fid: { good: number; needs_improvement: number };
  cls: { good: number; needs_improvement: number };
  fcp: { good: number; needs_improvement: number };
  ttfb: { good: number; needs_improvement: number };
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();
  private sessionId: string;
  
  // Performance thresholds based on Google's Core Web Vitals
  private readonly thresholds: PerformanceThresholds = {
    lcp: { good: 2500, needs_improvement: 4000 },
    fid: { good: 100, needs_improvement: 300 },
    cls: { good: 0.1, needs_improvement: 0.25 },
    fcp: { good: 1800, needs_improvement: 3000 },
    ttfb: { good: 800, needs_improvement: 1800 }
  };

  private constructor() {
    this.sessionId = this.generateSessionId();
    if (typeof window !== 'undefined') {
      this.initializeObservers();
      this.setupBeforeUnloadListener();
    }
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeObservers(): void {
    if (!('PerformanceObserver' in window)) return;

    // Largest Contentful Paint (LCP)
    this.createObserver('largest-contentful-paint', (entries) => {
      const lcpEntry = entries[entries.length - 1] as LargestContentfulPaint;
      this.recordMetric('lcp', lcpEntry.startTime);
    });

    // First Input Delay (FID)
    this.createObserver('first-input', (entries) => {
      const fidEntry = entries[0] as PerformanceEventTiming;
      this.recordMetric('fid', fidEntry.processingStart - fidEntry.startTime);
    });

    // Cumulative Layout Shift (CLS)
    this.createObserver('layout-shift', (entries) => {
      let clsValue = 0;
      // LayoutShift interface not yet in TypeScript lib.dom.d.ts
      // Using type assertion with known properties
      interface LayoutShiftEntry extends PerformanceEntry {
        hadRecentInput: boolean;
        value: number;
      }
      for (const entry of entries as LayoutShiftEntry[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.recordMetric('cls', clsValue);
    });

    // Navigation Timing
    this.observeNavigationTiming();

    // Resource Performance
    this.observeResourceTiming();

    // Memory Usage (if available)
    this.observeMemoryUsage();
  }

  private createObserver(type: string, callback: (entries: PerformanceEntry[]) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ 
        type, 
        buffered: true 
      });
      
      this.observers.set(type, observer);
    } catch (error) {
      console.warn(`Failed to create ${type} observer:`, error);
    }
  }

  private observeNavigationTiming(): void {
    if (!('performance' in window) || !performance.getEntriesByType) return;

    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const nav = navEntries[0];
    if (!nav) return;
    
    // First Contentful Paint
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      this.recordMetric('fcp', fcpEntry.startTime);
    }

    // Time to First Byte
    if (nav.responseStart && nav.requestStart) {
      this.recordMetric('ttfb', nav.responseStart - nav.requestStart);
    }
    
    // Page Load Time
    if (nav.loadEventEnd && nav.fetchStart) {
      this.recordMetric('pageLoadTime', nav.loadEventEnd - nav.fetchStart);
    }
    
    // DOM Content Loaded
    if (nav.domContentLoadedEventEnd && nav.fetchStart) {
      this.recordMetric('domContentLoaded', nav.domContentLoadedEventEnd - nav.fetchStart);
    }
  }

  private observeResourceTiming(): void {
    if (!('performance' in window)) return;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    let totalResourceTime = 0;
    let jsTime = 0;
    let cssTime = 0;

    resources.forEach((resource) => {
      const duration = resource.responseEnd - resource.startTime;
      totalResourceTime += duration;

      if (resource.name.includes('.js')) {
        jsTime += duration;
      } else if (resource.name.includes('.css')) {
        cssTime += duration;
      }
    });

    this.recordMetric('resourceLoadTime', totalResourceTime);
    this.recordMetric('jsExecutionTime', jsTime);
    this.recordMetric('cssRenderTime', cssTime);
  }

  private observeMemoryUsage(): void {
    // Chrome-specific memory API
    interface PerformanceMemory {
      usedJSHeapSize: number;
      jsHeapSizeLimit: number;
      totalJSHeapSize: number;
    }
    
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory: PerformanceMemory }).memory;
      this.recordMetric('memoryUsage', memory.usedJSHeapSize / memory.jsHeapSizeLimit);
    }
  }

  private recordMetric(name: keyof PerformanceMetrics, value: number): void {
    const currentMetrics = this.getCurrentMetrics();
    // Type-safe assignment using index signature
    (currentMetrics as Record<keyof PerformanceMetrics, number | string | undefined>)[name] = value;
    
    // Check if metric exceeds thresholds
    this.checkThresholds(name, value);
  }

  private getCurrentMetrics(): PerformanceMetrics {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    
    let current = this.metrics.find(m => 
      m.url === url && 
      m.sessionId === this.sessionId &&
      Date.now() - m.timestamp < 30000 // Within last 30 seconds
    );

    if (!current) {
      current = {
        url,
        userAgent,
        timestamp: Date.now(),
        sessionId: this.sessionId
      };
      this.metrics.push(current);
    }

    return current;
  }

  private checkThresholds(metric: string, value: number): void {
    const threshold = this.thresholds[metric as keyof PerformanceThresholds];
    if (!threshold) return;

    let status: 'good' | 'needs-improvement' | 'poor';
    if (value <= threshold.good) {
      status = 'good';
    } else if (value <= threshold.needs_improvement) {
      status = 'needs-improvement';
    } else {
      status = 'poor';
    }

    // Log performance issues
    if (status !== 'good') {
      console.warn(`Performance Warning: ${metric} = ${value}ms (${status})`);
      
      // Send to analytics in production
      if (process.env.NODE_ENV === 'production') {
        this.sendToAnalytics(metric, value, status);
      }
    }
  }

  private async sendToAnalytics(metric: string, value: number, status: string): Promise<void> {
    try {
      await fetch('/api/analytics/vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metric,
          value,
          status,
          url: window.location.href,
          sessionId: this.sessionId,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.warn('Failed to send performance data to analytics:', error);
    }
  }

  private setupBeforeUnloadListener(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('beforeunload', () => {
      this.sendBeacon();
    });

    // Also send data periodically
    setInterval(() => {
      this.sendBeacon();
    }, 30000); // Every 30 seconds
  }

  private sendBeacon(): void {
    if (!navigator.sendBeacon || this.metrics.length === 0) return;

    const data = JSON.stringify({
      metrics: this.metrics,
      sessionId: this.sessionId,
      timestamp: Date.now()
    });

    try {
      navigator.sendBeacon('/api/analytics/vitals', data);
      this.metrics = []; // Clear sent metrics
    } catch (error) {
      console.warn('Failed to send beacon:', error);
    }
  }

  // Public API
  public getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  public getLatestMetrics(): PerformanceMetrics | null {
    return this.metrics[this.metrics.length - 1] || null;
  }

  public generateReport(): {
    summary: Record<string, { value: number; status: string }>;
    recommendations: string[];
  } {
    const latest = this.getLatestMetrics();
    if (!latest) {
      return { summary: {}, recommendations: [] };
    }

    const summary: Record<string, { value: number; status: string }> = {};
    const recommendations: string[] = [];

    // Analyze each metric
    Object.entries(this.thresholds).forEach(([metric, threshold]) => {
      const value = (latest as unknown as Record<string, number | string | undefined>)[metric];
      if (value !== undefined && typeof value === 'number') {
        let status: string;
        if (value <= threshold.good) {
          status = 'good';
        } else if (value <= threshold.needs_improvement) {
          status = 'needs-improvement';
        } else {
          status = 'poor';
          recommendations.push(this.getRecommendation(metric, value));
        }
        
        summary[metric] = { value, status };
      }
    });

    return { summary, recommendations };
  }

  private getRecommendation(metric: string, value: number): string {
    const recommendations: Record<string, string> = {
      lcp: `LCP is ${value}ms. Consider optimizing images, preloading critical resources, and reducing server response time.`,
      fid: `FID is ${value}ms. Consider code splitting, deferring non-critical JavaScript, and using web workers.`,
      cls: `CLS is ${value}. Consider adding size attributes to images and avoiding inserting content above existing content.`,
      fcp: `FCP is ${value}ms. Consider optimizing critical rendering path and reducing resource load time.`,
      ttfb: `TTFB is ${value}ms. Consider optimizing server response time and using CDN.`
    };

    return recommendations[metric] || `${metric} needs optimization.`;
  }

  public dispose(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.metrics = [];
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// React hook for performance monitoring
export function usePerformanceMonitor() {
  if (typeof window === 'undefined') {
    return {
      metrics: [],
      latestMetrics: null,
      report: { summary: {}, recommendations: [] }
    };
  }

  const monitor = PerformanceMonitor.getInstance();
  
  return {
    metrics: monitor.getMetrics(),
    latestMetrics: monitor.getLatestMetrics(),
    report: monitor.generateReport()
  };
}

export type { PerformanceMetrics, PerformanceThresholds };