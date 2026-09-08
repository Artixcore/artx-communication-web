import type { AlertMessage } from '@/core/alerts/alert-state'

export function AlertRegion({ alerts }: { alerts: readonly AlertMessage[] }) {
  if (alerts.length === 0) return null
  return (
    <div className="artx-alert-region" aria-label="Notifications">
      {alerts.map((alert, index) => (
        <div className={`artx-alert artx-alert--${alert.kind}`} key={`${alert.kind}-${index}-${alert.message}`} role={alert.kind === 'warning' || alert.kind === 'error' ? 'alert' : 'status'}>
          {alert.message}
        </div>
      ))}
    </div>
  )
}
