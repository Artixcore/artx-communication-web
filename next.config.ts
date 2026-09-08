import type { NextConfig } from 'next'
import { buildSecurityHeaders } from './src/core/security/security-headers'

const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: buildSecurityHeaders(environment) }]
  },
}

export default nextConfig
