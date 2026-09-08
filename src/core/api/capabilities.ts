import 'server-only'
import { getApiBaseUrl } from '@/core/config/server-env'

export async function fetchPublicCapabilities(): Promise<unknown[]> {
  const baseUrl = getApiBaseUrl()
  if (!baseUrl) return []
  const url = new URL('/v1/capabilities', baseUrl)
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(3_000),
    })
    if (!response.ok) return []
    const payload: unknown = await response.json()
    if (Array.isArray(payload)) return payload
    if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
      const record = payload as Record<string, unknown>
      if (Array.isArray(record.capabilities)) return record.capabilities
    }
    return []
  } catch {
    return []
  }
}
