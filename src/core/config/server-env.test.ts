import assert from 'node:assert/strict'
import test from 'node:test'
import { parseApiBaseUrl } from './server-env.ts'

test('requires https outside local development', () => {
  assert.equal(parseApiBaseUrl('https://api.artx.example', 'production')?.toString(), 'https://api.artx.example/')
  assert.equal(parseApiBaseUrl('http://api.artx.example', 'production'), null)
})

test('permits loopback http only in development', () => {
  assert.equal(parseApiBaseUrl('http://127.0.0.1:8080', 'development')?.toString(), 'http://127.0.0.1:8080/')
  assert.equal(parseApiBaseUrl('http://localhost:8080', 'development')?.toString(), 'http://localhost:8080/')
  assert.equal(parseApiBaseUrl('http://192.168.1.10:8080', 'development'), null)
})

test('rejects credentials and malformed URLs', () => {
  assert.equal(parseApiBaseUrl('https://user:pass@api.example.com', 'production'), null)
  assert.equal(parseApiBaseUrl('not a url', 'production'), null)
})
