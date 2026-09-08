import { PublicShell } from '@/components/shell/public-shell'
import { TruthfulEmptyState } from '@/components/states/truthful-empty-state'
import { validateAidHandle } from '@/core/validation/identity'

export default async function PublicAidPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const validation = validateAidHandle(handle)
  return (
    <PublicShell context={<div className="artx-context-block">Only fields explicitly classified public may appear on an AID profile.</div>}>
      <p className="artx-kicker">AID profile</p>
      <h1 className="artx-title">@{handle}</h1>
      {validation.ok
        ? <TruthfulEmptyState title="Public profile data is not connected yet" body="This route is ready, but ARTX will not invent biography, skills, repositories, reputation, verification, availability or activity before the public profile API exists." />
        : <TruthfulEmptyState title="Invalid AID handle" body={validation.message} />}
    </PublicShell>
  )
}
