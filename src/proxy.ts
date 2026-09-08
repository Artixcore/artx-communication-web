import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isPrivateRoute } from '@/core/security/route-policy'

const SESSION_COOKIE = '__Host-artx_session'

export function proxy(request: NextRequest) {
  if (!isPrivateRoute(request.nextUrl.pathname)) return NextResponse.next()
  if (!request.cookies.has(SESSION_COOKIE)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('returnTo', `${request.nextUrl.pathname}${request.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
