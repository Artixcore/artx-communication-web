import { ContextRail } from './context-rail'
import { PathRail } from './path-rail'

export function PrivateShell({ children, context }: Readonly<{ children: React.ReactNode; context?: React.ReactNode }>) {
  return <div className="artx-shell"><PathRail authenticated /><main className="artx-main">{children}</main><ContextRail>{context}</ContextRail></div>
}
