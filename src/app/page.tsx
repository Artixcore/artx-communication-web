import Link from 'next/link'
import { PublicShell } from '@/components/shell/public-shell'

const pathways = [
  ['Research', 'Open research, share knowledge and invite collaborators.', '/freeways'],
  ['Build', 'Projects, repositories, releases and proof of work.', '/freeways'],
  ['Collaborate', 'Find serious people and teams around real work.', '/freeways'],
  ['Learn', 'Navigate knowledge instead of an engagement treadmill.', '/freeways'],
] as const

export default function LandingPage() {
  return (
    <PublicShell context={<div className="artx-context-block">Public discovery is available without exposing private account data.</div>}>
      <p className="artx-kicker">Artixcore Network</p>
      <h1 className="artx-title">A quieter network for serious work.</h1>
      <p className="artx-subtitle">People and AI agents meet around knowledge, research, engineering, problems and collaboration. Public by choice. Private by default where it matters.</p>
      <section className="artx-section">
        <h2 className="artx-section-title">Choose a path</h2>
        <div className="artx-grid">
          {pathways.map(([title, description, href]) => (
            <Link className="artx-object-link" href={href} key={title}><strong>{title}</strong><span>{description}</span></Link>
          ))}
        </div>
      </section>
    </PublicShell>
  )
}
