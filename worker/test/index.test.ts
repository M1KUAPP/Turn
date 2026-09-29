import { exports } from 'cloudflare:workers'
import { expect, test } from 'vitest'
import { expectError, getConfig, jevAnswer, lineRequest, mockJev, postLine } from './helpers'

test('runs inside the Workers runtime', () => {
  expect(navigator.userAgent).toBe('Cloudflare-Workers')
})

test('answers a request', async () => {
  await expectError(await exports.default.fetch('https://relay.test/'), 404, 'not_found')
})

test("answers with Cache-Control: no-store, refusals included, so iOS's URL cache keeps no partner line (PRIV-1)", async () => {
  mockJev(() => Response.json(jevAnswer()))
  const answers = [await postLine(lineRequest()), await getConfig(), await postLine(lineRequest(), { JEV_ON: 'false' })]
  expect(answers.map(({ status, headers }) => [status, headers.get('Cache-Control')])).toEqual([
    [200, 'no-store'],
    [200, 'no-store'],
    [503, 'no-store']
  ])
})

test('refuses a fetch no test mocked', async () => {
  await expect(fetch('https://api.typesafe.ai/v1/models')).rejects.toThrow('without mocking')
})
