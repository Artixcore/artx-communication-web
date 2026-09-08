import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeEmail, validateAidHandle, validateEmail } from './identity.ts'

test('accepts Artixcore, Gmail and custom domains', () => {
  for (const email of ['person@artixcore.com', 'person@gmail.com', 'researcher@university.edu', 'dev@my-company.dev']) {
    assert.equal(validateEmail(email).ok, true, email)
  }
})

test('normalizes case and whitespace but rejects malformed input', () => {
  assert.equal(normalizeEmail('  Person@ARTIXCORE.COM '), 'person@artixcore.com')
  assert.equal(validateEmail('not-an-email').ok, false)
  assert.equal(validateEmail('a@').ok, false)
  assert.equal(validateEmail('@example.com').ok, false)
  assert.equal(validateEmail('person@-example.com').ok, false)
  assert.equal(validateEmail('person@example..com').ok, false)
})

test('validates bounded AID handles', () => {
  assert.equal(validateAidHandle('shams').ok, true)
  assert.equal(validateAidHandle('artx_engineer-01').ok, true)
  assert.equal(validateAidHandle('a').ok, false)
  assert.equal(validateAidHandle('bad handle').ok, false)
  assert.equal(validateAidHandle('x'.repeat(65)).ok, false)
})
