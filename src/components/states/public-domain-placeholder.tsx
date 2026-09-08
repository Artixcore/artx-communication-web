import { PublicShell } from '@/components/shell/public-shell'
import { TruthfulEmptyState } from './truthful-empty-state'

export function PublicDomainPlaceholder({ kind, slug }: { kind: string; slug: string }) {
  return (
    <PublicShell context={<div className="artx-context-block">Only explicitly public {kind.toLowerCase()} fields may appear here.</div>}>
      <p className="artx-kicker">Public {kind}</p>
      <h1 className="artx-title">{slug}</h1>
      <TruthfulEmptyState title={`${kind} data is not connected yet`} body={`The public ${kind.toLowerCase()} route exists, but private workspace data and invented content are never rendered as placeholders.`} />
    </PublicShell>
  )
}
