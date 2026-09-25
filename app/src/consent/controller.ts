import type { Config } from '@turn/shared/relay'
import { consentCard, consentWords, permissionStep, type Card, type Step } from './strings'

type ConfigPort = {
  read(): Promise<Config>
  typesafeNamed(): boolean
  refresh(): Promise<Config>
}

type ConsentPorts = {
  setting(key: string): Promise<string | null>
  setSetting(key: string, value: string | null): Promise<void>
  now(): Date
  config: ConfigPort
  speech: { speak(text: string): Promise<void> | void }
  listen: {
    start(): Promise<void> | void
    end(): Promise<void> | void
    blocked(): boolean
  }
  navigate(route: '/' | '/permission' | '/consent'): void
}

export type ConsentState = {
  permissionAllowed: boolean
  permissionDate: string | null
  under18: boolean
  typesafeNamed: boolean
  requestsBlocked: boolean
  note: string | null
  step: Step
  card: Card
}

const permissionKey = 'listen_permission'
const permissionDateKey = 'listen_permission_date'
const under18Key = 'partner_under_18'

export function createConsentController(ports: ConsentPorts) {
  const listeners = new Set<() => void>()
  let state: ConsentState = {
    permissionAllowed: false,
    permissionDate: null,
    under18: false,
    typesafeNamed: false,
    requestsBlocked: true,
    note: null,
    step: permissionStep(false),
    card: consentCard(false)
  }

  function publish(next: Partial<Omit<ConsentState, 'requestsBlocked' | 'step' | 'card'>>) {
    const values = { ...state, ...next }
    state = {
      ...values,
      requestsBlocked: !values.permissionAllowed || values.under18 || ports.listen.blocked(),
      step: permissionStep(values.typesafeNamed),
      card: consentCard(values.typesafeNamed)
    }
    for (const listener of listeners) listener()
  }

  async function load(): Promise<void> {
    const [permission, date, under18, config] = await Promise.all([
      ports.setting(permissionKey),
      ports.setting(permissionDateKey),
      ports.setting(under18Key),
      ports.config.read()
    ])
    publish({
      permissionAllowed: permission === 'true',
      permissionDate: date,
      under18: under18 === 'true',
      typesafeNamed: config.typesafeNamed,
      note: null
    })
  }

  const ready = load()

  async function savePermission(): Promise<void> {
    const now = ports.now()
    const date = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0')
    ].join('-')
    await ports.setSetting(permissionDateKey, date)
    await ports.setSetting(permissionKey, 'true')
    publish({ permissionAllowed: true, permissionDate: date, note: null })
  }

  return {
    ready,
    snapshot(): ConsentState {
      return state
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    async startListen(): Promise<'permission' | 'consent'> {
      let config = state.typesafeNamed
      try {
        config = (await ports.config.refresh()).typesafeNamed
      } catch {
        config = ports.config.typesafeNamed()
      }
      const [permission, date, under18] = await Promise.all([
        ports.setting(permissionKey),
        ports.setting(permissionDateKey),
        ports.setting(under18Key)
      ])
      const permissionAllowed = permission === 'true'
      publish({
        permissionAllowed,
        permissionDate: date,
        under18: under18 === 'true',
        typesafeNamed: config,
        note: null
      })
      return permissionAllowed ? 'consent' : 'permission'
    },
    async allow(): Promise<void> {
      await savePermission()
      ports.navigate('/consent')
    },
    notNow(): void {
      void Promise.resolve(ports.listen.end())
      publish({ note: null })
      ports.navigate('/')
    },
    async partnerAgreed(): Promise<void> {
      if (!state.permissionAllowed) {
        ports.navigate('/permission')
        return
      }
      if (state.under18) {
        ports.navigate('/')
        return
      }
      await ports.listen.start()
      ports.navigate('/')
    },
    partnerDeclined(): void {
      void Promise.resolve(ports.listen.end())
      ports.navigate('/')
    },
    async readAloud(): Promise<void> {
      await ports.speech.speak([state.card.lead, ...state.card.facts].join(' '))
    },
    async setUnder18(on: boolean): Promise<void> {
      await ports.setSetting(under18Key, String(on))
      publish({ under18: on })
      if (on) await ports.listen.end()
    },
    async withdraw(): Promise<void> {
      await ports.setSetting(permissionKey, null)
      publish({ permissionAllowed: false, permissionDate: null, note: consentWords.afterWithdraw })
      try {
        await ports.listen.end()
      } finally {
        await ports.setSetting(permissionDateKey, null)
      }
    },
    async grant(): Promise<void> {
      await savePermission()
    }
  }
}
