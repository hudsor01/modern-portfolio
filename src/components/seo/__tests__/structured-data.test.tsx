// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { StructuredData } from '../structured-data'

describe('StructuredData', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders a <script type="application/ld+json"> element', () => {
    const { container } = render(<StructuredData data={{ '@context': 'https://schema.org' }} />)
    const script = container.querySelector('script')
    expect(script).toBeTruthy()
    expect(script?.getAttribute('type')).toBe('application/ld+json')
  })

  it('serializes the data prop into JSON inside the script tag', () => {
    const data = { '@context': 'https://schema.org', '@type': 'Person', name: 'Richard Hudson' }
    const { container } = render(<StructuredData data={data} />)
    const script = container.querySelector('script')
    const parsed = JSON.parse(script!.innerHTML)
    expect(parsed).toEqual(data)
  })

  it('escapes </script> sequences in payload (defense-in-depth)', () => {
    // safeJsonLdStringify replaces "</" with "<\/" to prevent breakout
    const data = { name: 'foo</script>bar' }
    const { container } = render(<StructuredData data={data} />)
    const script = container.querySelector('script')
    expect(script?.innerHTML).not.toContain('</script>')
    // Browsers parse the escape away — JSON content still round-trips correctly.
    const parsed = JSON.parse(script!.innerHTML)
    expect(parsed.name).toBe('foo</script>bar')
  })

  it('passes a nonce through to the script element when provided', () => {
    const { container } = render(<StructuredData data={{ '@type': 'Person' }} nonce="abc123" />)
    const script = container.querySelector('script')
    expect(script?.getAttribute('nonce')).toBe('abc123')
  })

  it('omits the nonce attribute when nonce is null', () => {
    const { container } = render(<StructuredData data={{ '@type': 'Person' }} nonce={null} />)
    const script = container.querySelector('script')
    expect(script?.hasAttribute('nonce')).toBe(false)
  })

  it('omits the nonce attribute when nonce is undefined', () => {
    const { container } = render(<StructuredData data={{ '@type': 'Person' }} />)
    const script = container.querySelector('script')
    expect(script?.hasAttribute('nonce')).toBe(false)
  })
})
