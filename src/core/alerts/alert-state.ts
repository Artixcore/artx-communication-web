export type AlertKind = 'success' | 'info' | 'warning' | 'error'

export interface AlertMessage {
  kind: AlertKind
  message: string
}

const KINDS = new Set<AlertKind>(['success', 'info', 'warning', 'error'])

export function makeAlert(kind: AlertKind, rawMessage: string): AlertMessage {
  if (!KINDS.has(kind)) throw new TypeError('Unsupported alert kind')
  const normalized = rawMessage.trim().replace(/\s+/gu, ' ').slice(0, 240)
  return { kind, message: normalized || 'Something changed. Please review and try again.' }
}

export function enqueueAlert(current: readonly AlertMessage[], next: AlertMessage): AlertMessage[] {
  return [...current, next].slice(-5)
}
