import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isPrivateRoute } from '@/core/security/route-policy'
import { buildNonceCsp } from '@/core/security/security-headers'

const SESSION_COOKIE = '__Host-artx_session'

function nonceForRequest(): string {
  return btoa(crypto.randomUUID())
}

export function proxy(request: NextRequest) {
  const nonce = nonceForRequest()
  const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development'
  const csp = buildNonceCsp(nonce, environment)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  if (isPrivateRoute(request.nextUrl.pathname) && !request.cookies.has(SESSION_COOKIE)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('returnTo', `${request.nextUrl.pathname}${request.nextUrl.search}`)
    const response = NextResponse.redirect(loginUrl)
    response.headers.set('Content-Security-Policy', csp)
    return response
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
