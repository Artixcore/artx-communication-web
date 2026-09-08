import assert from 'node:assert/strict'
import test from 'node:test'
import { canUsePasskey } from './passkey-capability.ts'

test('requires both browser support and explicit backend capability', () => {
  const enabled = [{ name: 'auth.webauthn-v1', version: '1.0', enabled: true }]
  assert.equal(canUsePasskey(enabled, true), true)
  assert.equal(canUsePasskey(enabled, false), false)
  assert.equal(canUsePasskey([{ name: 'auth.webauthn-v1', version: '1.0', enabled: false }], true), false)
  assert.equal(canUsePasskey([{ name: 'auth.device-v1', version: '1.0', enabled: true }], true), false)
})

test('fails closed on malformed capability input', () => {
  assert.equal(canUsePasskey(null, true), false)
  assert.equal(canUsePasskey([{ name: 'auth.webauthn-v1', enabled: 'yes' }], true), false)
})
