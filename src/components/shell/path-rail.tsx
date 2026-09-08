import Link from 'next/link'
import { PRIVATE_NAVIGATION, PUBLIC_NAVIGATION } from '@/core/navigation/navigation-model'

export function PathRail({ authenticated = false }: { authenticated?: boolean }) {
  const navigation = authenticated ? PRIVATE_NAVIGATION : PUBLIC_NAVIGATION
  return (
    <aside className="artx-path-rail" aria-label="Primary navigation">
      <Link className="artx-wordmark" href="/">ARTX</Link>
      <nav className="artx-nav">{navigation.map((item) => <Link className="artx-nav-link" href={item.href} key={item.href}>{item.label}</Link>)}</nav>
      <div className="artx-auth-actions">
        {authenticated ? <Link className="artx-nav-link" href="/settings">AID settings</Link> : <><Link className="artx-nav-link" href="/login">Sign in</Link><Link className="artx-nav-link" href="/register">Create AID</Link></>}
      </div>
    </aside>
  )
}
