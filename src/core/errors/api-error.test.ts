import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeApiError } from './api-error.ts'

test('preserves bounded stable error metadata', () => {
  const result = normalizeApiError({ code: 'validation.failed', message: 'One or more fields are invalid.', request_id: 'req_123', retryable: false, field_errors: { email: 'Enter a valid email address.' } })
  assert.deepEqual(result, { code: 'validation.failed', message: 'One or more fields are invalid.', requestId: 'req_123', retryable: false, fieldErrors: { email: 'Enter a valid email address.' } })
})

test('replaces blank, hostile and oversized messages with safe fallback', () => {
  for (const message of ['', '   ', 'pq: password authentication failed for user root', 'x'.repeat(1000)]) {
    assert.equal(normalizeApiError({ code: 'internal', message }).message, 'Something went wrong. Please try again.')
  }
})

test('drops malformed fields instead of reflecting them', () => {
  const result = normalizeApiError({ code: '<script>alert(1)</script>', message: 'Safe enough', request_id: 'x'.repeat(500), retryable: 'yes', field_errors: { '<img>': 'bad', email: 'x'.repeat(500) } })
  assert.equal(result.code, 'unknown')
  assert.equal(result.requestId, undefined)
  assert.equal(result.retryable, false)
  assert.deepEqual(result.fieldErrors, {})
})
