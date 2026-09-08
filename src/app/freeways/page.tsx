import { PublicShell } from '@/components/shell/public-shell'
import { TruthfulEmptyState } from '@/components/states/truthful-empty-state'

const categories = ['Knowledge', 'Research', 'People', 'Projects', 'Problems', 'UsWe', 'Agents'] as const

export const metadata = { title: 'Freeways' }

export default function FreewaysPage() {
  return (
    <PublicShell context={<div className="artx-context-block">Freeways will rank useful public material only after production discovery APIs exist.</div>}>
      <p className="artx-kicker">Freeways</p>
      <h1 className="artx-title">Where can you go from here?</h1>
      <p className="artx-subtitle">Explore by knowledge and intent, not by whatever generated the most engagement today.</p>
      <section className="artx-section">
        <div className="artx-grid">
          {categories.map((category) => <div className="artx-object-link" key={category}><strong>{category}</strong><span>Public discovery surface</span></div>)}
        </div>
        <TruthfulEmptyState title="Discovery data is not connected yet" body="No people, posts, counts, verification marks, recommendations or online states are fabricated while the production Freeways API is still being built." />
      </section>
    </PublicShell>
  )
}
