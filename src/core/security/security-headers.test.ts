import assert from 'node:assert/strict'
import test from 'node:test'
import { buildSecurityHeaders } from './security-headers.ts'

test('locks down scripts, framing and browser permissions', () => {
  const headers = Object.fromEntries(buildSecurityHeaders('production').map((entry) => [entry.key, entry.value]))
  const csp = headers['Content-Security-Policy'] ?? ''
  assert.match(csp, /default-src 'self'/)
  assert.match(csp, /script-src 'self'/)
  assert.match(csp, /frame-ancestors 'none'/)
  assert.equal(csp.includes('*'), false)
  assert.equal(headers['X-Frame-Options'], 'DENY')
  assert.equal(headers['X-Content-Type-Options'], 'nosniff')
  assert.match(headers['Permissions-Policy'] ?? '', /camera=\(\)/)
  assert.match(headers['Strict-Transport-Security'] ?? '', /max-age=63072000/)
})

test('omits HSTS in development but keeps the rest of the policy', () => {
  const headers = Object.fromEntries(buildSecurityHeaders('development').map((entry) => [entry.key, entry.value]))
  assert.equal(headers['Strict-Transport-Security'], undefined)
  assert.equal(headers['X-Frame-Options'], 'DENY')
})
