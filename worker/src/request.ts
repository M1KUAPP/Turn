/** A lowercase version 4 UUID, as `crypto.randomUUID()` makes. */
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

/** The app's version: 1 to 32 visible ASCII characters. */
const version = /^[\x21-\x7e]{1,32}$/

const builds = ['device', 'simulator']

/** The app user ID, when every header each request carries is well formed, or null. */
export function readUser(headers: Headers): string | null {
  const user = headers.get('X-Turn-User') ?? ''
  const valid =
    uuid.test(user) &&
    version.test(headers.get('X-Turn-Version') ?? '') &&
    builds.includes(headers.get('X-Turn-Build') ?? '')
  return valid ? user : null
}
