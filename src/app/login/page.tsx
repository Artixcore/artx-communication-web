import { AuthEmailForm } from '@/components/auth/auth-email-form'
import { PublicShell } from '@/components/shell/public-shell'
import { fetchPublicCapabilities } from '@/core/api/capabilities'

export const metadata = { title: 'Sign in' }

export default async function LoginPage() {
  const capabilities = await fetchPublicCapabilities()
  return (
    <PublicShell context={<div className="artx-context-block">Private routes are revalidated against the Go server before rendering private data.</div>}>
      <p className="artx-kicker">Secure access</p>
      <h1 className="artx-title">Sign in without weakening your identity.</h1>
      <p className="artx-subtitle">ARTX is passkey-first. Email identifies the account; it does not bypass device/session authorization.</p>
      <AuthEmailForm capabilities={capabilities} mode="login" />
    </PublicShell>
  )
}
