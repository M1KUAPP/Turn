import { expect, test } from 'vitest'
import { jevAnswer, lineRequest, mockJev, postLine } from './helpers'

test('sends Jev the request its snapshot holds, with the model pinned to jev-1.13.0', async () => {
  const request = lineRequest({
    categories: [
      { id: 'feelings', name: 'Feelings' },
      { id: 'body-pain', name: 'Body and pain' },
      { id: 'food', name: 'Food and drink' }
    ]
  })
  const topic = { feelings: 0.7, 'body-pain': 0.2, food: 0.05, consent: 0.05 }
  const jev = mockJev(() => Response.json(jevAnswer([0.9, 0.4, 0.7], topic)))
  expect((await postLine(request)).status).toBe(200)

  const [url, init] = jev.mock.calls[0]
  expect(String(url)).toBe('https://api.typesafe.ai/v1/systemone')
  expect(init?.method).toBe('POST')
  expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer test-typesafe-key')
  const body = JSON.parse(String(init?.body))
  expect(body.model).toBe('jev-1.13.0')
  await expect(`${JSON.stringify(body, null, 2)}\n`).toMatchFileSnapshot('./snapshots/jev-request.json')
})
