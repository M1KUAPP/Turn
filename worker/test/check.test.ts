import { limits } from '@turn/shared/relay'
import { startingPolicy } from '@turn/shared/row'
import { describe, expect, test, vi } from 'vitest'
import { APP_VERSION, DEFAULT_RELAY_URL, main, starterCandidates, starterCategories } from '../scripts/check'

// @ts-expect-error Vite ?raw import
import appConfigText from '../../app/app.config.ts?raw'
// @ts-expect-error Vite ?raw import
import starterBankText from '../../app/src/content/starter-bank.json?raw'

const validConfig = {
  jevOn: true,
  typesafeNamed: false,
  freeLinesLeft: null,
  policy: startingPolicy
}

const scores: Record<string, number> = {}
for (const candidate of starterCandidates) {
  scores[candidate.id] = candidate.id === 'it-was-hard' ? 0.95 : 0.4
}

const validLineAnswer = {
  seq: 1,
  kind: { yes_no: 0.1, either_or: 0.1, open: 0.7, not_a_question: 0.1 },
  topic: { health: 0.9, consent: 0.1 },
  scores,
  policy: startingPolicy,
  freeLinesLeft: null,
  ms: { jev: 210, total: 290 }
}

function output() {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {})
  const error = vi.spyOn(console, 'error').mockImplementation(() => {})
  return {
    printed: () => log.mock.calls.map((c) => c.join(' ')).join('\n'),
    errors: () => error.mock.calls.map((c) => c.join(' ')).join('\n')
  }
}

type Reply = Response | Promise<Response> | ((init?: RequestInit) => Response | Promise<Response>)

function fakeFetch(...replies: Reply[]) {
  const queue = [...replies]
  return vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
    const next = queue.shift()
    if (!next) throw new Error('This test called fakeFetch with no reply queued')
    return typeof next === 'function' ? next(init) : next
  })
}

describe('the daily relay check', () => {
  test("the default relay URL constant matches app/app.config.ts's default URL", () => {
    const match = /relayUrl:\s*process\.env\.EXPO_PUBLIC_RELAY_URL\s*\?\?\s*'([^']+)'/.exec(appConfigText)
    expect(match).not.toBeNull()
    expect(DEFAULT_RELAY_URL).toBe(match![1])
  })

  test.each([
    ['unknown flag', ['--unknown']],
    ['missing relay value', ['--relay']],
    ['empty relay value', ['--relay', '']],
    ['invalid relay url', ['--relay', 'not-a-url']],
    ['missing out value', ['--out']],
    ['empty out value', ['--out', '']],
    ['positional argument', ['positional']]
  ])('refuses %s with exit 2', async (_, args) => {
    const { errors } = output()
    expect(await main(args, {})).toBe(2)
    expect(errors()).toContain('bun scripts/check.ts takes only --relay <url> and --out <file>.')
  })

  test('passes when both steps succeed, reporting all required fields', async () => {
    const { printed } = output()
    const fetch = fakeFetch(Response.json(validConfig), Response.json(validLineAnswer))

    const exitCode = await main([], {}, { fetch })
    expect(exitCode).toBe(0)

    const text = printed()
    expect(text).toMatch(/### Relay check, \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC/)
    expect(text).toContain(`- **Relay URL:** ${DEFAULT_RELAY_URL}`)
    expect(text).toContain('- **Status:** passed')
    expect(text).toMatch(/- Step config: passed \(\d+ ms\)/)
    expect(text).toContain('- `jevOn`: true')
    expect(text).toContain('- `freeLinesLeft`: null')
    expect(text).toMatch(/- Step line: passed \(\d+ ms\)/)
    expect(text).toContain('Answer ms: Jev 210 ms, total 290 ms')
    expect(text).toContain('"It was hard": place 1 of 40 (score 0.95)')
  })

  test("sends the bank's categories and phrases as the app would: no strip, no fixed button, real ids", () => {
    type BankPhrase = { id: string; text: string; fixed: boolean }
    const bank = JSON.parse(starterBankText as string) as {
      categories: { id: string; name: string; phrases: BankPhrase[] }[]
    }
    const phrases = new Map(
      bank.categories.flatMap((category) =>
        category.phrases.map((phrase) => [phrase.id, { ...phrase, category: category.id }])
      )
    )
    expect(starterCategories.map(({ id }) => id)).toEqual(
      bank.categories.filter(({ id }) => id !== 'strip').map(({ id }) => id)
    )
    for (const candidate of starterCandidates) {
      const phrase = phrases.get(candidate.id)
      expect(phrase?.text).toBe(candidate.text)
      expect(phrase?.fixed).toBe(false)
      expect(phrase?.category).not.toBe('strip')
    }
  })

  test("sends request with UUID user, simulator build, version, judge's line, and candidates within limits", async () => {
    output()
    const fetch = fakeFetch(Response.json(validConfig), Response.json(validLineAnswer))

    expect(await main([], {}, { fetch })).toBe(0)
    expect(fetch).toHaveBeenCalledTimes(2)

    const [configCall, lineCall] = fetch.mock.calls
    const configUrl = String(configCall[0])
    const configInit = configCall[1] as RequestInit
    const configHeaders = new Headers(configInit.headers)

    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    const userId = configHeaders.get('X-Turn-User') ?? ''

    expect(configUrl).toBe(`${DEFAULT_RELAY_URL}/v1/config`)
    expect(uuid.test(userId)).toBe(true)
    expect(configHeaders.get('X-Turn-Build')).toBe('simulator')
    expect(configHeaders.get('X-Turn-Version')).toBe(APP_VERSION)

    const lineUrl = String(lineCall[0])
    const lineInit = lineCall[1] as RequestInit
    const lineHeaders = new Headers(lineInit.headers)

    expect(lineUrl).toBe(`${DEFAULT_RELAY_URL}/v1/lines`)
    expect(lineHeaders.get('X-Turn-User')).toBe(userId)
    expect(lineHeaders.get('X-Turn-Build')).toBe('simulator')
    expect(lineHeaders.get('X-Turn-Version')).toBe(APP_VERSION)
    expect(lineHeaders.get('Content-Type')).toBe('application/json')

    const rawBody = String(lineInit.body)
    expect(new TextEncoder().encode(rawBody).byteLength).toBeLessThanOrEqual(limits.bytes)

    const body = JSON.parse(rawBody)
    expect(uuid.test(body.lineId)).toBe(true)
    expect(body.seq).toBe(1)
    expect(body.line).toBe('How was physio?')
    expect(body.place).toBe('Clinic')
    expect(body.line.length).toBeLessThanOrEqual(limits.line)
    expect(body.place.length).toBeLessThanOrEqual(limits.name)

    expect(body.categories.length).toBeLessThanOrEqual(limits.categories)
    expect(body.categories).toEqual(starterCategories)
    for (const cat of body.categories) {
      expect(cat.id).not.toBe('consent')
      expect(cat.id.length).toBeLessThanOrEqual(limits.id)
      expect(cat.name.length).toBeLessThanOrEqual(limits.name)
    }

    expect(body.candidates.length).toBeLessThanOrEqual(limits.candidates)
    expect(body.candidates).toEqual(starterCandidates)
    expect(body.candidates).toContainEqual({ id: 'it-was-hard', text: 'It was hard' })
    for (const cand of body.candidates) {
      expect(cand.id.length).toBeLessThanOrEqual(limits.id)
      expect(cand.text.length).toBeLessThanOrEqual(limits.text)
    }
  })

  test('fails when config does not answer 200, naming config step and exiting 1', async () => {
    const { printed, errors } = output()
    const fetch = fakeFetch(Response.json({ error: 'jev_unavailable' }, { status: 503 }))

    const exitCode = await main([], {}, { fetch })
    expect(exitCode).toBe(1)

    const text = printed()
    expect(text).toContain('Step config: failed')
    expect(text).toContain('HTTP status: 503')
    expect(text).toContain('Relay error code: jev_unavailable')
    expect(errors()).toContain('step config')
  })

  test('fails when config has wrong shape, naming config step and exiting 1', async () => {
    const { printed, errors } = output()
    const fetch = fakeFetch(Response.json({ not: 'a valid config' }))

    const exitCode = await main([], {}, { fetch })
    expect(exitCode).toBe(1)

    const text = printed()
    expect(text).toContain('Step config: failed')
    expect(text).toContain('Relay error code: invalid_shape')
    expect(errors()).toContain('step config')
  })

  test('fails when line answers 503 jev_unavailable, naming line step and exiting 1', async () => {
    const { printed, errors } = output()
    const fetch = fakeFetch(Response.json(validConfig), Response.json({ error: 'jev_unavailable' }, { status: 503 }))

    const exitCode = await main([], {}, { fetch })
    expect(exitCode).toBe(1)

    const text = printed()
    expect(text).toContain('Step line: failed')
    expect(text).toContain('HTTP status: 503')
    expect(text).toContain('Relay error code: jev_unavailable')
    expect(errors()).toContain('step line')
  })

  test('fails when line scores miss a candidate, naming line step and exiting 1', async () => {
    const { printed, errors } = output()
    const incompleteScores = { ...validLineAnswer.scores }
    delete incompleteScores['it-was-hard']

    const fetch = fakeFetch(Response.json(validConfig), Response.json({ ...validLineAnswer, scores: incompleteScores }))

    const exitCode = await main([], {}, { fetch })
    expect(exitCode).toBe(1)

    const text = printed()
    expect(text).toContain('Step line: failed')
    expect(text).toContain('Relay error code: invalid_scores')
    expect(errors()).toContain('step line')
  })

  test('fails when line scores fall outside 0 to 1, naming line step and exiting 1', async () => {
    const { printed, errors } = output()
    const outOfRangeScores = { ...validLineAnswer.scores, 'it-was-hard': 1.5 }

    const fetch = fakeFetch(Response.json(validConfig), Response.json({ ...validLineAnswer, scores: outOfRangeScores }))

    const exitCode = await main([], {}, { fetch })
    expect(exitCode).toBe(1)

    const text = printed()
    expect(text).toContain('Step line: failed')
    expect(text).toContain('Relay error code: invalid_scores')
    expect(errors()).toContain('step line')
  })

  test('fails on timeout during config, naming config step and exiting 1', async () => {
    const { printed, errors } = output()
    const fetch = vi.fn().mockRejectedValueOnce(new DOMException('Timeout', 'TimeoutError'))

    const exitCode = await main([], {}, { fetch })
    expect(exitCode).toBe(1)

    const text = printed()
    expect(text).toContain('Step config: failed')
    expect(text).toContain('Relay error code: timeout')
    expect(errors()).toContain('step config')
  })

  test('fails on timeout during line, naming line step and exiting 1', async () => {
    const { printed, errors } = output()
    const fetch = vi.fn(async (input) => {
      if (String(input).includes('/v1/config')) return Response.json(validConfig)
      throw new DOMException('Timeout', 'TimeoutError')
    })

    const exitCode = await main([], {}, { fetch })
    expect(exitCode).toBe(1)

    const text = printed()
    expect(text).toContain('Step line: failed')
    expect(text).toContain('Relay error code: timeout')
    expect(errors()).toContain('step line')
  })

  test('gives up on a relay that never answers once the time limit passes', async () => {
    const { printed } = output()
    // A relay that holds the request open until the check aborts it.
    const hang = (_input: string | URL | Request, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) =>
        init?.signal?.addEventListener('abort', () => reject(init.signal?.reason))
      )
    for (const stalled of ['/v1/config', '/v1/lines']) {
      const fetch = vi.fn(async (input: string | URL | Request, init?: RequestInit) =>
        String(input).includes(stalled) ? hang(input, init) : Response.json(validConfig)
      )
      expect(await main([], {}, { fetch, timeoutMs: 20 })).toBe(1)
      expect(printed()).toContain('Relay error code: timeout')
    }
  })

  test('never includes any user UUID in any report across pass, failure, and timeout', async () => {
    const cases: Array<() => Promise<string>> = [
      async () => {
        const { printed } = output()
        const fetch = fakeFetch(Response.json(validConfig), Response.json(validLineAnswer))
        await main([], {}, { fetch })
        return printed()
      },
      async () => {
        const { printed } = output()
        const fetch = fakeFetch(Response.json({ error: 'jev_unavailable' }, { status: 503 }))
        await main([], {}, { fetch })
        return printed()
      },
      async () => {
        const { printed } = output()
        const fetch = fakeFetch(Response.json({ invalid: true }))
        await main([], {}, { fetch })
        return printed()
      },
      async () => {
        const { printed } = output()
        const fetch = fakeFetch(
          Response.json(validConfig),
          Response.json({ error: 'jev_unavailable' }, { status: 503 })
        )
        await main([], {}, { fetch })
        return printed()
      },
      async () => {
        const { printed } = output()
        const fetch = vi.fn().mockRejectedValueOnce(new DOMException('Timeout', 'TimeoutError'))
        await main([], {}, { fetch })
        return printed()
      }
    ]

    const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i
    for (const run of cases) {
      const report = await run()
      expect(report).not.toMatch(uuidPattern)
    }
  })
})
