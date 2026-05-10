// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useMounted } from '@/hooks/use-mounted'

describe('useMounted', () => {
  it('returns true under jsdom (client snapshot)', () => {
    const { result } = renderHook(() => useMounted())
    expect(result.current).toBe(true)
  })
})
