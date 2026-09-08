import { AuthEmailForm } from '@/components/auth/auth-email-form'
import { PublicShell } from '@/components/shell/public-shell'
import { fetchPublicCapabilities } from '@/core/api/capabilities'

export const metadata = { title: 'Create AID' }

export default async function RegisterPage() {
  const capabilities = await fetchPublicCapabilities()
  return (
    <PublicShell context={<div className="artx-context-block">Use an Artixcore address, Gmail, Outlook, research/education address or your own domain.</div>}>
      <p className="artx-kicker">Artixcore Identity</p>
      <h1 className="artx-title">Create an AID.</h1>
      <p className="artx-subtitle">One identity for your public work, private settings, research, projects, collaborations and future agents.</p>
      <AuthEmailForm capabilities={capabilities} mode="register" />
    </PublicShell>
  )
}
