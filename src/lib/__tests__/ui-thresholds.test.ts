// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  READING_PROGRESS,
  INTERSECTION_OBSERVER,
  ANIMATION,
  TIMING_CONSTANTS,
} from '@/lib/ui-thresholds'

describe('READING_PROGRESS', () => {
  it('show and hide thresholds are within 0-100', () => {
    expect(READING_PROGRESS.SHOW_THRESHOLD).toBeGreaterThanOrEqual(0)
    expect(READING_PROGRESS.SHOW_THRESHOLD).toBeLessThanOrEqual(100)
    expect(READING_PROGRESS.HIDE_THRESHOLD).toBeLessThanOrEqual(100)
    expect(READING_PROGRESS.HIDE_THRESHOLD).toBeGreaterThan(READING_PROGRESS.SHOW_THRESHOLD)
  })

  it('default height is positive', () => {
    expect(READING_PROGRESS.DEFAULT_HEIGHT).toBeGreaterThan(0)
  })
})

describe('INTERSECTION_OBSERVER', () => {
  it('partial visibility threshold is between 0 and 1', () => {
    expect(INTERSECTION_OBSERVER.PARTIAL_VISIBILITY).toBeGreaterThan(0)
    expect(INTERSECTION_OBSERVER.PARTIAL_VISIBILITY).toBeLessThan(1)
  })

  it('preload margin is a CSS length', () => {
    expect(INTERSECTION_OBSERVER.PRELOAD_MARGIN).toMatch(/px$/)
  })
})

describe('ANIMATION', () => {
  it('exposes positive numeric thresholds', () => {
    expect(ANIMATION.MIN_FPS_FOR_GPU).toBeGreaterThan(0)
    expect(ANIMATION.REDUCED_MOTION_DURATION_MS).toBeGreaterThan(0)
  })
})

describe('TIMING_CONSTANTS', () => {
  it('FAST < NORMAL < SLOW < SLOWER', () => {
    expect(TIMING_CONSTANTS.FAST).toBeLessThan(TIMING_CONSTANTS.NORMAL)
    expect(TIMING_CONSTANTS.NORMAL).toBeLessThan(TIMING_CONSTANTS.SLOW)
    expect(TIMING_CONSTANTS.SLOW).toBeLessThan(TIMING_CONSTANTS.SLOWER)
  })

  it('exposes form/toast/chart durations as positive ms', () => {
    expect(TIMING_CONSTANTS.TOAST_DISPLAY).toBeGreaterThan(0)
    expect(TIMING_CONSTANTS.FORM_SUCCESS_DISPLAY).toBeGreaterThan(0)
    expect(TIMING_CONSTANTS.CHART_ANIMATION_DURATION).toBeGreaterThan(0)
  })
})
