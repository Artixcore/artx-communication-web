export type ValidationResult =
  | { ok: true }
  | { ok: false; message: string }

const AID_HANDLE_RE = /^[a-z0-9](?:[a-z0-9_-]{1,62}[a-z0-9])?$/u
const LOCAL_EMAIL_RE = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/u
const DOMAIN_LABEL_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/u

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

export function validateEmail(value: string): ValidationResult {
  const email = normalizeEmail(value)
  if (email.length < 3 || email.length > 254) return { ok: false, message: 'Enter a valid email address.' }
  const at = email.lastIndexOf('@')
  if (at <= 0 || at !== email.indexOf('@')) return { ok: false, message: 'Enter a valid email address.' }
  const local = email.slice(0, at)
  const domain = email.slice(at + 1)
  if (local.length === 0 || local.length > 64 || domain.length === 0 || domain.length > 253) return { ok: false, message: 'Enter a valid email address.' }
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..') || !LOCAL_EMAIL_RE.test(local)) return { ok: false, message: 'Enter a valid email address.' }
  const labels = domain.split('.')
  if (labels.length < 2 || labels.some((label) => !DOMAIN_LABEL_RE.test(label))) return { ok: false, message: 'Enter a valid email address.' }
  return { ok: true }
}

export function validateAidHandle(value: string): ValidationResult {
  const handle = value.trim().toLowerCase()
  if (handle.length < 3 || handle.length > 64 || !AID_HANDLE_RE.test(handle)) {
    return { ok: false, message: 'AID handle must be 3-64 lowercase letters, numbers, underscores, or hyphens.' }
  }
  return { ok: true }
}
