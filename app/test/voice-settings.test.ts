import { describe, expect, test } from 'vitest'
import { createVoiceSettings } from '../src/speech/voice-settings'

type AvailableVoice = { identifier: string; name: string; language: string }
type Authorization = 'authorized' | 'denied' | 'notDetermined' | 'unsupported'

const refusedNote =
  "Turn can't use your Personal Voice. In iOS Settings, allow apps to request to use it, then try again."
const unavailableNote =
  "There's no Personal Voice Turn can use on this iPhone. If you've made one, allow apps to request to use it in iOS Settings; until then, Turn keeps the system voice."

function ports(
  options: {
    values?: Record<string, string>
    voices?: AvailableVoice[]
    authorization?: Authorization
    personal?: { identifier: string; name: string } | null
  } = {}
) {
  const values = new Map(Object.entries(options.values ?? {}))
  return {
    setting: async (key: string) => values.get(key) ?? null,
    setSetting: async (key: string, value: string | null) => {
      if (value === null) values.delete(key)
      else values.set(key, value)
    },
    availableVoices: async () => options.voices ?? [],
    requestPersonalVoice: async () => options.authorization ?? 'unsupported',
    personalVoice: async () => options.personal ?? null,
    values
  }
}

async function createSettings(options: Parameters<typeof ports>[0] = {}) {
  const nativePorts = ports(options)
  const settings = createVoiceSettings(nativePorts)
  await settings.refresh()
  return { settings, nativePorts }
}

describe('voice settings', () => {
  test('speaks with the saved voice and rate before the voice list loads', async () => {
    const nativePorts = ports({ values: { voice_id: 'com.apple.voice.enhanced.en-US.Ava', speech_rate: 'slower' } })
    let listed = false
    const settings = createVoiceSettings({
      ...nativePorts,
      availableVoices: async () => {
        listed = true
        return []
      }
    })

    await settings.loadSaved()

    expect(listed).toBe(false)
    expect(settings.selected().identifier).toBe('com.apple.voice.enhanced.en-US.Ava')
    expect(settings.rateStep()).toBe('slower')
  })

  test('lists the system default first, sorted English voices, and one resolved Personal Voice', async () => {
    const { settings } = await createSettings({
      voices: [
        { identifier: 'z', name: 'Zoe', language: 'en-US' },
        { identifier: 'fr', name: 'Aline', language: 'fr-FR' },
        { identifier: 'dup', name: 'Delta', language: 'en-US' },
        { identifier: 'a', name: 'Alice', language: 'en-GB' },
        { identifier: 'dup', name: 'Charlie', language: 'en-US' },
        { identifier: 'personal-1', name: 'Personal from speech list', language: 'en-US' },
        {
          identifier: 'com.apple.speech.synthesis.voice.BadNews',
          name: 'Bad News',
          language: 'en-US'
        }
      ],
      personal: { identifier: 'personal-1', name: 'My voice' }
    })

    expect(settings.voices()).toEqual([
      { identifier: null, name: 'System default', personal: false },
      { identifier: 'a', name: 'Alice', personal: false },
      { identifier: 'dup', name: 'Charlie', personal: false },
      { identifier: 'z', name: 'Zoe', personal: false },
      { identifier: 'personal-1', name: 'My voice', personal: true }
    ])
  })

  test('defaults to System default at Normal rate', async () => {
    const { settings } = await createSettings({
      voices: [{ identifier: 'voice-1', name: 'Avery', language: 'en-US' }]
    })

    expect(settings.selected()).toEqual({ identifier: null, name: 'System default', personal: false })
    expect(settings.rate()).toBe(1)
    expect(settings.rateStep()).toBe('normal')
  })

  test.each([
    ['slowest', 0.5],
    ['slower', 0.75],
    ['normal', 1],
    ['faster', 1.25],
    ['fastest', 1.5]
  ] as const)('stores the %s speech rate as %s', async (step, rate) => {
    const { settings, nativePorts } = await createSettings()

    await settings.chooseRate(step)

    expect(settings.rateStep()).toBe(step)
    expect(settings.rate()).toBe(rate)
    expect(await nativePorts.setting('speech_rate')).toBe(step)
  })

  test.each([
    {
      authorization: 'authorized',
      personal: { identifier: 'personal-1', name: 'My voice' },
      note: null,
      selected: 'personal-1'
    },
    { authorization: 'authorized', personal: null, note: unavailableNote, selected: 'system-1' },
    { authorization: 'denied', personal: null, note: refusedNote, selected: 'system-1' },
    { authorization: 'notDetermined', personal: null, note: unavailableNote, selected: 'system-1' },
    { authorization: 'unsupported', personal: null, note: unavailableNote, selected: 'system-1' }
  ] as const)(
    'handles Personal Voice authorization: $authorization',
    async ({ authorization, personal, note, selected }) => {
      const { settings, nativePorts } = await createSettings({
        values: { voice_id: 'system-1' },
        voices: [{ identifier: 'system-1', name: 'Avery', language: 'en-US' }],
        authorization,
        personal
      })

      await expect(settings.choosePersonalVoice()).resolves.toBe(note)

      expect(settings.selected().identifier).toBe(selected)
      expect(await nativePorts.setting('voice_id')).toBe(selected === 'system-1' ? 'system-1' : selected)
    }
  )

  test('falls back to System default and clears a voice that no longer resolves', async () => {
    const { settings, nativePorts } = await createSettings({
      values: { voice_id: 'deleted-personal-voice' },
      voices: [{ identifier: 'system-1', name: 'Avery', language: 'en-US' }]
    })

    expect(settings.selected()).toEqual({ identifier: null, name: 'System default', personal: false })
    expect(await nativePorts.setting('voice_id')).toBeNull()
  })
})
