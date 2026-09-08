import { redirect } from 'next/navigation'
import { PrivateShell } from '@/components/shell/private-shell'
import { hasValidServerSession } from '@/core/auth/server-session'

export default async function PrivateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!(await hasValidServerSession())) redirect('/login')
  return <PrivateShell context={<div className="artx-context-block">Server session verified. API authorization still applies per resource.</div>}>{children}</PrivateShell>
}
