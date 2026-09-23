import { startingPolicy } from '@turn/shared/row'
import { env } from 'cloudflare:workers'
import { describe, expect, test, vi } from 'vitest'
import { expectError, jevAnswer, lineRequest, mockJev, postLine, user } from './helpers'

/** The hex SHA-256 of the text, worked out apart from the relay's own code. */
async function sha256(text: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

describe('POST /v1/lines', () => {
  test("answers with Jev's scores by candidate id, the kind, the topic, the policy, and the free lines", async () => {
    const jev = mockJev(() => Response.json(jevAnswer([0.9, 0.4, 0.7])))
    const response = await postLine(lineRequest())
    expect(response.status).toBe(200)
    const answer = await response.json()
    expect(answer).toEqual({
      seq: 7,
      kind: { yes_no: 0.1, either_or: 0.1, open: 0.7, not_a_question: 0.1 },
      topic: { feelings: 0.8, 'body-pain': 0.15, consent: 0.05 },
      scores: { hard: 0.9, well: 0.4, tired: 0.7 },
      policy: startingPolicy,
      freeLinesLeft: 20,
      ms: { jev: expect.any(Number), total: expect.any(Number) }
    })
    expect(jev).toHaveBeenCalledOnce()
  })

  test("reaches the user's object by the salted hash of their ID, in western North America", async () => {
    mockJev(() => Response.json(jevAnswer()))
    const getByName = vi.fn((name: string, options?: DurableObjectNamespaceGetDurableObjectOptions) =>
      env.DEVICE.getByName(name, options)
    )
    await postLine(lineRequest(), { DEVICE: { getByName } })
    expect(getByName).toHaveBeenCalledExactlyOnceWith(`user-${await sha256(`test-salt${user}`)}`, {
      locationHint: 'wnam'
    })
  })

  test('follows a changed policy in the next answer, with no app build (ROW-8)', async () => {
    mockJev(() => Response.json(jevAnswer()))
    const response = await postLine(lineRequest(), { POLICY: { floor: 0.7, fixedOnlyTopics: ['consent'] } })
    expect(await response.json()).toMatchObject({
      policy: { ...startingPolicy, floor: 0.7, fixedOnlyTopics: ['consent'] }
    })
  })

  test('answers 503 jev_off with no call to Jev while the switch is off (STATE-3)', async () => {
    const jev = mockJev()
    await expectError(await postLine(lineRequest(), { JEV_ON: 'false' }), 503, 'jev_off')
    expect(jev).not.toHaveBeenCalled()
  })

  test.each([
    ['JSON that does not parse', '{"seq": 7,'],
    ['a list', '[]'],
    ['a line id that is no UUID', lineRequest({ lineId: 'line-1' })],
    ['a negative sequence number', lineRequest({ seq: -1 })],
    ['a fractional sequence number', lineRequest({ seq: 1.5 })],
    ['a line that is no text', { ...lineRequest(), line: 42 }],
    ['no place', { ...lineRequest(), place: undefined }],
    ['a category with no name', lineRequest({ categories: [{ id: 'food' }] as never })],
    ['a candidate whose id is a number', lineRequest({ candidates: [{ id: 1, text: 'Yes' }] as never })],
    ['a refresh that is text', { ...lineRequest(), refresh: 'true' }]
  ])('refuses %s with 400 invalid_request and no call to Jev', async (_, body) => {
    const jev = mockJev()
    await expectError(await postLine(body), 400, 'invalid_request')
    expect(jev).not.toHaveBeenCalled()
  })
})
