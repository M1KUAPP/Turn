export type AccessibilityPreferences = {
  reduceMotion: boolean
  boldText: boolean
  reduceTransparency: boolean
  increaseContrast: boolean
  fontScale: number
}

export type AccessibilitySource = {
  read(): Promise<AccessibilityPreferences>
  subscribe(listener: (change: Partial<AccessibilityPreferences>) => void): () => void
}

const defaults: AccessibilityPreferences = {
  reduceMotion: false,
  boldText: false,
  reduceTransparency: false,
  increaseContrast: false,
  fontScale: 1
}

const keys = Object.keys(defaults) as (keyof AccessibilityPreferences)[]

export function createAccessibilityStore(source: AccessibilitySource) {
  let snapshot = defaults
  let sequence = 0
  let stopSource: (() => void) | undefined
  let firstRead: Promise<void> = Promise.resolve()
  const changedAt = { reduceMotion: 0, boldText: 0, reduceTransparency: 0, increaseContrast: 0, fontScale: 0 }
  const listeners = new Set<() => void>()

  function publish(next: AccessibilityPreferences) {
    if (keys.every((key) => snapshot[key] === next[key])) return
    snapshot = next
    listeners.forEach((listener) => listener())
  }

  function apply(change: Partial<AccessibilityPreferences>) {
    sequence += 1
    for (const key of keys) {
      if (change[key] !== undefined) changedAt[key] = sequence
    }
    publish({ ...snapshot, ...change })
  }

  function subscribe(listener: () => void) {
    listeners.add(listener)
    if (listeners.size === 1) {
      const beforeRead = sequence
      stopSource = source.subscribe(apply)
      firstRead = source.read().then((values) => {
        const next = { ...snapshot }
        for (const key of keys) {
          if (changedAt[key] <= beforeRead) {
            ;(next as Record<string, boolean | number>)[key] = values[key]
          }
        }
        publish(next)
      })
    }
    return () => {
      listeners.delete(listener)
      if (listeners.size === 0) {
        stopSource?.()
        stopSource = undefined
      }
    }
  }

  return {
    getSnapshot: () => snapshot,
    subscribe,
    ready: () => firstRead
  }
}
