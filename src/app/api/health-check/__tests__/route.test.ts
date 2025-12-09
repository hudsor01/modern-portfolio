import { describe, it, expect } from 'vitest'
import { GET, HEAD } from '../route'

describe('/api/health-check', () => {
  describe('GET', () => {
    it('should return OK status', async () => {
      const response = await GET()

      expect(response.status).toBe(200)
      expect(await response.text()).toBe('OK')
    })

    it('should return correct headers', async () => {
      const response = await GET()

      expect(response.headers.get('Content-Type')).toBe('text/plain')
      expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate')
      expect(response.headers.get('Pragma')).toBe('no-cache')
      expect(response.headers.get('Expires')).toBe('0')
    })
  })

  describe('HEAD', () => {
    it('should return 200 status with no body', async () => {
      const response = await HEAD()

      expect(response.status).toBe(200)
      expect(await response.text()).toBe('')
    })

    it('should return correct headers', async () => {
      const response = await HEAD()

      expect(response.headers.get('Content-Type')).toBe('text/plain')
      expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate')
      expect(response.headers.get('Pragma')).toBe('no-cache')
      expect(response.headers.get('Expires')).toBe('0')
    })
  })
})
