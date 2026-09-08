import assert from 'node:assert/strict'
import test from 'node:test'
import { classifyRoute } from './route-policy.ts'

test('keeps discovery public and settings private', () => {
  assert.equal(classifyRoute('/'), 'public')
  assert.equal(classifyRoute('/freeways'), 'public')
  assert.equal(classifyRoute('/aid/shams'), 'public')
  assert.equal(classifyRoute('/research/quantum-auth'), 'public')
  assert.equal(classifyRoute('/projects/artx'), 'public')
  assert.equal(classifyRoute('/uswe/cryptography'), 'public')
  assert.equal(classifyRoute('/login'), 'public')
  assert.equal(classifyRoute('/register'), 'public')
  assert.equal(classifyRoute('/settings/security'), 'private')
  assert.equal(classifyRoute('/account'), 'private')
  assert.equal(classifyRoute('/messages'), 'private')
})

test('fails closed for unknown application routes', () => {
  assert.equal(classifyRoute('/unexpected-future-feature'), 'private')
})

test('does not allow public-prefix confusion', () => {
  assert.equal(classifyRoute('/freeways-malicious'), 'private')
  assert.equal(classifyRoute('/aid-malicious/shams'), 'private')
})
