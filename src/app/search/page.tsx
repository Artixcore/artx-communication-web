import { PublicShell } from '@/components/shell/public-shell'
import { TruthfulEmptyState } from '@/components/states/truthful-empty-state'

export const metadata = { title: 'Search' }
export default function SearchPage() {
  return <PublicShell><p className="artx-kicker">Search</p><h1 className="artx-title">Find useful work.</h1><TruthfulEmptyState title="Search index is not connected yet" body="ARTX will not fabricate search results while the public knowledge index is still being implemented." /></PublicShell>
}
