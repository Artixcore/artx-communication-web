export type RuntimeEnvironment = 'development' | 'test' | 'production'

function isLoopbackHostname(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]' || hostname === '::1'
}

export function parseApiBaseUrl(raw: string | undefined, environment: RuntimeEnvironment): URL | null {
  if (!raw) return null
  try {
    const url = new URL(raw)
    if (url.username || url.password) return null
    if (url.protocol === 'https:') return url
    if (environment === 'development' && url.protocol === 'http:' && isLoopbackHostname(url.hostname)) return url
    return null
  } catch {
    return null
  }
}

export function getApiBaseUrl(): URL | null {
  const environment = process.env.NODE_ENV === 'production' ? 'production' : process.env.NODE_ENV === 'test' ? 'test' : 'development'
  return parseApiBaseUrl(process.env.ARTX_API_BASE_URL, environment)
}
