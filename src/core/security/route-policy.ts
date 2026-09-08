export type RouteAccess = 'public' | 'private'

const PUBLIC_ROOTS = new Set(['/'])
const PUBLIC_PREFIXES = [
  '/freeways',
  '/aid',
  '/research',
  '/projects',
  '/uswe',
  '/search',
  '/login',
  '/register',
] as const

const PRIVATE_PREFIXES = [
  '/home',
  '/create',
  '/messages',
  '/notifications',
  '/settings',
  '/account',
  '/security',
  '/devices',
  '/sessions',
  '/integrations',
] as const

function matchesPathRoot(pathname: string, root: string): boolean {
  return pathname === root || pathname.startsWith(`${root}/`)
}

function normalizePathname(pathname: string): string {
  const raw = pathname.trim()
  if (raw === '') return '/'
  const withoutQuery = raw.split(/[?#]/u, 1)[0] ?? '/'
  if (!withoutQuery.startsWith('/')) return `/${withoutQuery}`
  return withoutQuery
}

export function classifyRoute(pathname: string): RouteAccess {
  const normalized = normalizePathname(pathname)
  if (PUBLIC_ROOTS.has(normalized)) return 'public'
  if (PRIVATE_PREFIXES.some((root) => matchesPathRoot(normalized, root))) return 'private'
  if (PUBLIC_PREFIXES.some((root) => matchesPathRoot(normalized, root))) return 'public'
  return 'private'
}

export function isPrivateRoute(pathname: string): boolean {
  return classifyRoute(pathname) === 'private'
}
