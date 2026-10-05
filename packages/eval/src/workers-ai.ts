/** The environment the evaluation reads its keys from. */
export type Env = Readonly<Record<string, string | undefined>>

/** What Workers AI's REST API answers, as far as the evaluation reads it. */
type Answer = { success?: boolean; errors?: { code: number; message: string }[]; result?: Record<string, unknown> }

/**
 * One Workers AI model's REST endpoint, with the account and a token that may run Workers AI from the environment:
 * posts a body and returns the answer's `result`, or nothing for a success that carries none. An answer that isn't a
 * success throws, with Cloudflare's error codes but never the token.
 */
export function runModel(model: string, env: Env = process.env): (body: object) => Promise<Record<string, unknown>> {
  const { CLOUDFLARE_ACCOUNT_ID: account, CLOUDFLARE_API_TOKEN: token } = env
  if (!account || !token) {
    throw new Error('Workers AI needs CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in the environment')
  }
  const url = `https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${model}`
  return async (body) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    // Every field is optional and checked by the caller, and a page that isn't JSON reads as nothing.
    const answer = (await response.json().catch(() => null)) as Answer | null
    if (answer?.success !== true) {
      const codes = answer?.errors?.map(({ code, message }) => `${code} ${message}`).join('; ') || 'no error codes'
      throw new Error(`Workers AI answered ${response.status}: ${codes}`)
    }
    return answer.result ?? {}
  }
}
