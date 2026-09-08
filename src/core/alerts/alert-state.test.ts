import assert from 'node:assert/strict'
import test from 'node:test'
import { enqueueAlert, makeAlert } from './alert-state.ts'

test('bounds alert messages and rejects invalid kinds', () => {
  assert.equal(makeAlert('success', ' Saved ').message, 'Saved')
  assert.equal(makeAlert('error', 'x'.repeat(500)).message.length, 240)
  assert.throws(() => makeAlert('danger' as never, 'bad'))
})

test('keeps only five most recent alerts', () => {
  let alerts = [] as ReturnType<typeof makeAlert>[]
  for (let index = 0; index < 7; index += 1) alerts = enqueueAlert(alerts, makeAlert('info', `message-${index}`))
  assert.equal(alerts.length, 5)
  assert.equal(alerts[0]?.message, 'message-2')
  assert.equal(alerts[4]?.message, 'message-6')
})
