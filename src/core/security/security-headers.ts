export interface SecurityHeader {
  key: string
  value: string
}

const NONCE_RE = /^[A-Za-z0-9+/_=-]{8,256}$/u

export function buildNonceCsp(nonce: string, environment: 'development' | 'production'): string {
  if (!NONCE_RE.test(nonce)) throw new TypeError('Invalid CSP nonce')
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${environment === 'development' ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    ...(environment === 'production' ? ['upgrade-insecure-requests'] : []),
  ].join('; ')
}

export function buildStaticSecurityHeaders(environment: 'development' | 'production'): SecurityHeader[] {
  return [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
    { key: 'X-Frame-Options', value: 'DENY' },
    ...(environment === 'production'
      ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
      : []),
  ]
}
