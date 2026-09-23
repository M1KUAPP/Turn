import type { ErrorCode } from '@turn/shared/relay'
import { readConfig } from './config'
import { readUser } from './request'

const statuses: Record<ErrorCode, number> = {
  invalid_request: 400,
  not_found: 404,
  duplicate: 409,
  paywall: 402,
  rate_limited: 429,
  jev_off: 503,
  jev_unavailable: 503,
  internal: 500
}

/** An error's response, which carries its code and nothing else (SEC-4). */
const failure = (code: ErrorCode) => Response.json({ error: code }, { status: statuses[code] })

async function route(request: Request, env: Env): Promise<Response> {
  const { pathname } = new URL(request.url)
  if (request.method === 'GET' && pathname === '/v1/config') {
    if (!readUser(request.headers)) return failure('invalid_request')
    return Response.json(readConfig(env))
  }
  return failure('not_found')
}

export default {
  async fetch(request: Request, env: Env) {
    try {
      return await route(request, env)
    } catch {
      return failure('internal')
    }
  }
} satisfies ExportedHandler<Env>
