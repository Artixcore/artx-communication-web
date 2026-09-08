import type { NextConfig } from 'next'
import { buildStaticSecurityHeaders } from './src/core/security/security-headers'

const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: buildStaticSecurityHeaders(environment) }]
  },
}

export default nextConfig
