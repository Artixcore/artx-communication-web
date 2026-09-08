import 'server-only'
import { cookies } from 'next/headers'
import { getApiBaseUrl } from '@/core/config/server-env'

const SESSION_COOKIE = '__Host-artx_session'

export async function hasValidServerSession(): Promise<boolean> {
  const baseUrl = getApiBaseUrl()
  if (!baseUrl) return false
  const cookieStore = await cookies()
  const credential = cookieStore.get(SESSION_COOKIE)?.value.trim()
  if (!credential || credential.length > 4096) return false
  try {
    const response = await fetch(new URL('/v1/session', baseUrl), {
      cache: 'no-store',
      headers: { Accept: 'application/json', Authorization: `Bearer ${credential}` },
      signal: AbortSignal.timeout(3_000),
    })
    return response.ok
  } catch {
    return false
  }
}
