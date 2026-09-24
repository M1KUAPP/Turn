import { describe, expect, test } from 'vitest'
import { privacyNotices, selectPrivacyNotice } from '../src/content/privacy-notice'

describe('bundled privacy notice', () => {
  test('has separate named and unnamed versions and never names Jev', () => {
    const unnamed = JSON.stringify(privacyNotices.unnamed)
    const named = JSON.stringify(privacyNotices.named)
    expect(unnamed).not.toMatch(/TypeSafe|Jev/i)
    expect(named).toContain('TypeSafe')
    expect(named).not.toMatch(/Jev/i)
    expect(selectPrivacyNotice(false)).toBe(privacyNotices.unnamed)
    expect(selectPrivacyNotice(true)).toBe(privacyNotices.named)
  })

  test.each(['unnamed', 'named'] as const)('%s version covers the data inventory in plain words', (variant) => {
    const copy = privacyNotices[variant].map((section) => `${section.title} ${section.body}`).join(' ')
    for (const term of [
      /bank/i,
      /places/i,
      /tap counts/i,
      /settings/i,
      /audio/i,
      /never recorded/i,
      /transcript/i,
      /two minutes/i,
      /Cloudflare/i,
      /United States/i,
      /40/i,
      /category names/i,
      /tags/i,
      /health/i,
      /RevenueCat/i,
      /purchase/i,
      /telemetry/i,
      /abuse/i,
      /under 18/i,
      /nearby/i
    ]) {
      expect(copy).toMatch(term)
    }
  })
})
