export interface SafeApiError {
  code: string
  message: string
  retryable: boolean
  requestId?: string
  fieldErrors: Record<string, string>
}

const SAFE_FALLBACK = 'Something went wrong. Please try again.'
const CODE_RE = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/u
const REQUEST_ID_RE = /^[A-Za-z0-9._:-]+$/u
const FIELD_RE = /^[A-Za-z0-9_.-]+$/u
const UNSAFE_MESSAGE_RE = /(?:\bpq:|sqlstate|stack trace|panic:|password authentication failed|authorization:\s*bearer|private[_ -]?key|refresh[_ -]?token|access[_ -]?token|presigned|amazonaws\.com|redis:\/\/|postgres(?:ql)?:\/\/)/iu

function safeString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim().replace(/\s+/gu, ' ')
  if (normalized.length === 0 || normalized.length > maxLength) return undefined
  return normalized
}

function safeMessage(value: unknown): string {
  const message = safeString(value, 240)
  if (!message || UNSAFE_MESSAGE_RE.test(message)) return SAFE_FALLBACK
  return message
}

function safeCode(value: unknown): string {
  const code = safeString(value, 80)
  return code && CODE_RE.test(code) ? code : 'unknown'
}

function safeRequestId(value: unknown): string | undefined {
  const requestId = safeString(value, 128)
  return requestId && REQUEST_ID_RE.test(requestId) ? requestId : undefined
}

function safeFieldErrors(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const result: Record<string, string> = {}
  for (const [field, rawMessage] of Object.entries(value)) {
    if (Object.keys(result).length >= 20) break
    if (field.length > 64 || !FIELD_RE.test(field)) continue
    const message = safeString(rawMessage, 240)
    if (!message || UNSAFE_MESSAGE_RE.test(message)) continue
    result[field] = message
  }
  return result
}

export function normalizeApiError(value: unknown): SafeApiError {
  const record = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
  const requestId = safeRequestId(record.request_id)
  const error: SafeApiError = {
    code: safeCode(record.code),
    message: safeMessage(record.message),
    retryable: typeof record.retryable === 'boolean' ? record.retryable : false,
    fieldErrors: safeFieldErrors(record.field_errors),
  }
  if (requestId) error.requestId = requestId
  return error
}
