import assert from 'node:assert/strict'
import test from 'node:test'
import { buildNonceCsp, buildStaticSecurityHeaders } from './security-headers.ts'

test('builds strict nonce CSP without unsafe-inline scripts', () => {
  const csp = buildNonceCsp('nonce123', 'production')
  assert.match(csp, /script-src 'self' 'nonce-nonce123' 'strict-dynamic'/)
  assert.match(csp, /style-src 'self' 'nonce-nonce123'/)
  assert.match(csp, /frame-ancestors 'none'/)
  assert.equal(csp.includes("'unsafe-inline'"), false)
  assert.equal(csp.includes('*'), false)
})

test('permits unsafe-eval only in development for Next dev tooling', () => {
  assert.match(buildNonceCsp('devnonce', 'development'), /'unsafe-eval'/)
  assert.equal(buildNonceCsp('prodnonce', 'production').includes("'unsafe-eval'"), false)
})

test('keeps static browser protections separate from per-request CSP', () => {
  const headers = Object.fromEntries(buildStaticSecurityHeaders('production').map((entry) => [entry.key, entry.value]))
  assert.equal(headers['Content-Security-Policy'], undefined)
  assert.equal(headers['X-Frame-Options'], 'DENY')
  assert.equal(headers['X-Content-Type-Options'], 'nosniff')
  assert.match(headers['Permissions-Policy'] ?? '', /camera=\(\)/)
  assert.match(headers['Strict-Transport-Security'] ?? '', /max-age=63072000/)
})
