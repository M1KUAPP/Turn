export type CompanionModel = 'ren' | 'suit' | 'ice' | 'office'

/** The four faces in Settings' order, each under the name its tile shows (frame 67). */
export const COMPANION_MODELS: readonly { model: CompanionModel; name: string }[] = [
  { model: 'ren', name: 'Ren' },
  { model: 'suit', name: 'Suit' },
  { model: 'ice', name: 'Ice' },
  { model: 'office', name: 'Office' }
]

export type CompanionSettingsState = { model: CompanionModel | null; moves: boolean }

type CompanionSettingsPorts = {
  setting(key: string): Promise<string | null>
  setSetting(key: string, value: string | null): Promise<void>
}

function isModel(value: string | null): value is CompanionModel {
  return COMPANION_MODELS.some(({ model }) => model === value)
}

export function companionName(model: CompanionModel | null): string {
  return COMPANION_MODELS.find((entry) => entry.model === model)?.name ?? 'Off'
}

/** The companion's choices, kept in the bank's settings beside the voice's: no face until one is chosen, since the
 * companion is opt-in, and Let it move on until it's turned off. */
export function createCompanionSettings(ports: CompanionSettingsPorts) {
  let state: CompanionSettingsState = { model: null, moves: true }
  const listeners = new Set<() => void>()

  const set = (next: CompanionSettingsState) => {
    state = next
    for (const listener of listeners) listener()
  }

  return {
    snapshot(): CompanionSettingsState {
      return state
    },
    async loadSaved(): Promise<void> {
      const [model, moves] = await Promise.all([ports.setting('companion_model'), ports.setting('companion_moves')])
      set({ model: isModel(model) ? model : null, moves: moves !== '0' })
    },
    async chooseModel(model: CompanionModel | null): Promise<void> {
      await ports.setSetting('companion_model', model)
      set({ ...state, model })
    },
    async chooseMoves(moves: boolean): Promise<void> {
      await ports.setSetting('companion_moves', moves ? null : '0')
      set({ ...state, moves })
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    }
  }
}
