import assert from 'node:assert/strict'
import test from 'node:test'
import { PUBLIC_NAVIGATION, PRIVATE_NAVIGATION } from './navigation-model.ts'

test('keeps public discovery separate from private work', () => {
  assert.deepEqual(PUBLIC_NAVIGATION.map((item) => item.href), ['/', '/freeways', '/search'])
  assert.deepEqual(PRIVATE_NAVIGATION.map((item) => item.href), ['/home', '/create', '/messages', '/notifications', '/settings'])
  assert.equal(PUBLIC_NAVIGATION.some((item) => item.href.startsWith('/settings')), false)
})
