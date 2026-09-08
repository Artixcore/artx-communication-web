export interface NavigationItem {
  label: string
  href: string
}

export const PUBLIC_NAVIGATION: readonly NavigationItem[] = [
  { label: 'ARTX', href: '/' },
  { label: 'Freeways', href: '/freeways' },
  { label: 'Search', href: '/search' },
] as const

export const PRIVATE_NAVIGATION: readonly NavigationItem[] = [
  { label: 'Home', href: '/home' },
  { label: 'Create', href: '/create' },
  { label: 'Messages', href: '/messages' },
  { label: 'Notifications', href: '/notifications' },
  { label: 'Settings', href: '/settings' },
] as const
