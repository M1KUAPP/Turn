import type { PaywallDoor, PurchasesEngine, PurchasesSnapshot, PurchasesStore } from './engine'

type PurchasesStorePorts = {
  engine: PurchasesEngine
  config: {
    snapshot(): { freeLinesLeft: number | null }
    subscribe(listener: () => void): () => void
  }
}

/** Creates a PurchasesStore backed by a PurchasesEngine and relay config. */
export function createPurchasesStore(ports: PurchasesStorePorts): PurchasesStore {
  const listeners = new Set<() => void>()
  let listen: boolean | null = null
  let busy = false
  let note: string | null = null
  let refresh = false
  let started = false
  let disposed = false
  let unsubscribeEngine: (() => void) | null = null

  function computeSnapshot(): PurchasesSnapshot {
    const freeLinesLeft = ports.config.snapshot().freeLinesLeft
    const locked = freeLinesLeft === 0 && listen !== true
    const countLabel =
      typeof freeLinesLeft === 'number' && freeLinesLeft >= 1 && listen !== true ? `${freeLinesLeft} free` : null
    return {
      freeLinesLeft,
      listen,
      locked,
      countLabel,
      busy,
      note
    }
  }

  let currentSnapshot: PurchasesSnapshot = computeSnapshot()

  function publishIfChanged() {
    const next = computeSnapshot()
    if (
      next.freeLinesLeft !== currentSnapshot.freeLinesLeft ||
      next.listen !== currentSnapshot.listen ||
      next.locked !== currentSnapshot.locked ||
      next.countLabel !== currentSnapshot.countLabel ||
      next.busy !== currentSnapshot.busy ||
      next.note !== currentSnapshot.note
    ) {
      currentSnapshot = next
      for (const listener of Array.from(listeners)) {
        listener()
      }
    }
  }

  const unsubscribeConfig = ports.config.subscribe(() => {
    publishIfChanged()
  })

  function onListenUpdated(active: boolean) {
    if (active && listen !== true) {
      refresh = true
    }
    listen = active
    publishIfChanged()
  }

  return {
    async start(input: { apiKey: string; appUserID: string }): Promise<void> {
      if (started) return
      started = true
      try {
        const ok = await ports.engine.configure(input)
        if (!ok || disposed) return
        const active = await ports.engine.listenActive()
        if (disposed) return
        if (active !== null) {
          onListenUpdated(active)
        }
        if (disposed) return
        unsubscribeEngine = ports.engine.onListenChange((active) => {
          if (disposed) return
          onListenUpdated(active)
        })
      } catch {
        // Never rejects
      }
    },

    snapshot(): PurchasesSnapshot {
      return currentSnapshot
    },

    subscribe(listener: () => void): () => void {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },

    async openPaywall(_door: PaywallDoor): Promise<'unlocked' | 'locked'> {
      if (busy) {
        return listen === true ? 'unlocked' : 'locked'
      }
      note = null
      busy = true
      publishIfChanged()
      try {
        const result = await ports.engine.presentPaywall()
        busy = false
        if (result === 'PURCHASED' || result === 'RESTORED' || result === 'NOT_PRESENTED') {
          listen = true
          refresh = true
          note = 'Listen mode is unlocked.'
          publishIfChanged()
          return 'unlocked'
        } else {
          note = "The purchase didn't go through. Listen mode is still locked."
          publishIfChanged()
          return 'locked'
        }
      } catch {
        busy = false
        note = "The purchase didn't go through. Listen mode is still locked."
        publishIfChanged()
        return 'locked'
      }
    },

    async restore(): Promise<void> {
      if (busy) return
      note = null
      busy = true
      publishIfChanged()
      try {
        const result = await ports.engine.restore()
        busy = false
        if (result === true) {
          listen = true
          refresh = true
          note = 'Listen mode is unlocked.'
          publishIfChanged()
        } else if (result === false) {
          listen = false
          note = 'No purchase found for this phone. Listen mode is still locked.'
          publishIfChanged()
        } else {
          note = "Turn couldn't check for a purchase. Listen mode hasn't changed."
          publishIfChanged()
        }
      } catch {
        busy = false
        note = "Turn couldn't check for a purchase. Listen mode hasn't changed."
        publishIfChanged()
      }
    },

    refreshNext(): boolean {
      return refresh
    },

    refreshAnswered(): void {
      refresh = false
    },

    clearNote(): void {
      if (note !== null) {
        note = null
        publishIfChanged()
      }
    },

    dispose(): void {
      disposed = true
      unsubscribeConfig()
      if (unsubscribeEngine) {
        unsubscribeEngine()
        unsubscribeEngine = null
      }
      listeners.clear()
    }
  }
}
