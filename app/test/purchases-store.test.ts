import { describe, expect, test, vi } from 'vitest'
import type { PaywallResult, PurchasesEngine } from '../src/purchases/engine'
import { createPurchasesStore } from '../src/purchases/store'

function createFakeEngine() {
  const listeners = new Set<(active: boolean) => void>()
  const calls = {
    configure: [] as Array<{ apiKey: string; appUserID: string }>,
    listenActive: 0,
    onListenChange: 0,
    restore: 0,
    presentPaywall: 0
  }

  let configureResult: Promise<boolean> = Promise.resolve(true)
  let listenActiveResult: Promise<boolean | null> = Promise.resolve(null)
  let restoreResult: Promise<boolean | null> = Promise.resolve(null)
  let presentPaywallResult: Promise<PaywallResult> = Promise.resolve('NOT_PRESENTED')

  const engine: PurchasesEngine = {
    async configure(input) {
      calls.configure.push(input)
      return configureResult
    },
    async listenActive() {
      calls.listenActive++
      return listenActiveResult
    },
    onListenChange(listener) {
      calls.onListenChange++
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    async restore() {
      calls.restore++
      return restoreResult
    },
    async presentPaywall() {
      calls.presentPaywall++
      return presentPaywallResult
    }
  }

  return {
    engine,
    calls,
    listeners,
    setConfigureResult(p: Promise<boolean>) {
      configureResult = p
    },
    setListenActiveResult(p: Promise<boolean | null>) {
      listenActiveResult = p
    },
    setRestoreResult(p: Promise<boolean | null>) {
      restoreResult = p
    },
    setPresentPaywallResult(p: Promise<PaywallResult>) {
      presentPaywallResult = p
    },
    emitListen(active: boolean) {
      for (const listener of Array.from(listeners)) {
        listener(active)
      }
    }
  }
}

function createFakeConfig(initialFreeLines: number | null = 20) {
  let freeLinesLeft = initialFreeLines
  const listeners = new Set<() => void>()

  return {
    snapshot() {
      return { freeLinesLeft }
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    setFreeLinesLeft(next: number | null) {
      freeLinesLeft = next
      for (const listener of Array.from(listeners)) {
        listener()
      }
    },
    listenerCount() {
      return listeners.size
    }
  }
}

describe('purchases store', () => {
  test('locked at 0 with listen false, and at 0 with listen null; never locked with listen true, nor at 1, 20, or null', async () => {
    const fakeEngine = createFakeEngine()
    const fakeConfig = createFakeConfig(0)
    const store = createPurchasesStore({ engine: fakeEngine.engine, config: fakeConfig })

    // listen is null, count 0 -> locked
    expect(store.snapshot().locked).toBe(true)

    // listen false, count 0 -> locked
    await store.start({ apiKey: 'key', appUserID: 'user' })
    fakeEngine.emitListen(false)
    expect(store.snapshot().locked).toBe(true)

    // listen true, count 0 -> unlocked
    fakeEngine.emitListen(true)
    expect(store.snapshot().locked).toBe(false)

    // count at 1: listen false -> not locked
    fakeConfig.setFreeLinesLeft(1)
    fakeEngine.emitListen(false)
    expect(store.snapshot().locked).toBe(false)
    // count at 1: listen true -> not locked
    fakeEngine.emitListen(true)
    expect(store.snapshot().locked).toBe(false)

    // count at 20: listen false -> not locked
    fakeConfig.setFreeLinesLeft(20)
    fakeEngine.emitListen(false)
    expect(store.snapshot().locked).toBe(false)
    // count at 20: listen true -> not locked
    fakeEngine.emitListen(true)
    expect(store.snapshot().locked).toBe(false)

    // count at null: listen false -> not locked
    fakeConfig.setFreeLinesLeft(null)
    fakeEngine.emitListen(false)
    expect(store.snapshot().locked).toBe(false)
    // count at null: listen true -> not locked
    fakeEngine.emitListen(true)
    expect(store.snapshot().locked).toBe(false)
  })

  test('countLabel at 20, 1, 0 (null), null (null), and with listen true (null)', async () => {
    const fakeEngine = createFakeEngine()
    const fakeConfig = createFakeConfig(20)
    const store = createPurchasesStore({ engine: fakeEngine.engine, config: fakeConfig })

    // count 20, listen null
    expect(store.snapshot().countLabel).toBe('20 free')

    // count 1, listen null
    fakeConfig.setFreeLinesLeft(1)
    expect(store.snapshot().countLabel).toBe('1 free')

    // count 0, listen null
    fakeConfig.setFreeLinesLeft(0)
    expect(store.snapshot().countLabel).toBeNull()

    // count null, listen null
    fakeConfig.setFreeLinesLeft(null)
    expect(store.snapshot().countLabel).toBeNull()

    // count 20, listen true -> null
    fakeConfig.setFreeLinesLeft(20)
    await store.start({ apiKey: 'key', appUserID: 'user' })
    fakeEngine.emitListen(true)
    expect(store.snapshot().countLabel).toBeNull()

    // count 1, listen true -> null
    fakeConfig.setFreeLinesLeft(1)
    expect(store.snapshot().countLabel).toBeNull()

    // count 20, listen false -> '20 free'
    fakeConfig.setFreeLinesLeft(20)
    fakeEngine.emitListen(false)
    expect(store.snapshot().countLabel).toBe('20 free')
  })

  test('each of the five PaywallResult values: the resolution, the note, and listen', async () => {
    const fakeEngine = createFakeEngine()
    const fakeConfig = createFakeConfig(20)
    const store = createPurchasesStore({ engine: fakeEngine.engine, config: fakeConfig })

    // 1. PURCHASED
    fakeEngine.setPresentPaywallResult(Promise.resolve('PURCHASED'))
    const rPurchased = await store.openPaywall('control')
    expect(rPurchased).toBe('unlocked')
    expect(store.snapshot().note).toBe('Listen mode is unlocked.')
    expect(store.snapshot().listen).toBe(true)

    // Reset listen to null for next check
    fakeEngine.setRestoreResult(Promise.resolve(false))
    await store.restore()
    expect(store.snapshot().listen).toBe(false)

    // 2. RESTORED
    fakeEngine.setPresentPaywallResult(Promise.resolve('RESTORED'))
    const rRestored = await store.openPaywall('line')
    expect(rRestored).toBe('unlocked')
    expect(store.snapshot().note).toBe('Listen mode is unlocked.')
    expect(store.snapshot().listen).toBe(true)

    // Reset listen to false
    await store.restore()
    expect(store.snapshot().listen).toBe(false)

    // 3. NOT_PRESENTED
    fakeEngine.setPresentPaywallResult(Promise.resolve('NOT_PRESENTED'))
    const rNotPresented = await store.openPaywall('settings')
    expect(rNotPresented).toBe('unlocked')
    expect(store.snapshot().note).toBe('Listen mode is unlocked.')
    expect(store.snapshot().listen).toBe(true)

    // 4. CANCELLED (leaves listen unchanged)
    fakeEngine.setPresentPaywallResult(Promise.resolve('CANCELLED'))
    const rCancelled = await store.openPaywall('control')
    expect(rCancelled).toBe('locked')
    expect(store.snapshot().note).toBe("The purchase didn't go through. Listen mode is still locked.")
    expect(store.snapshot().listen).toBe(true)

    // Reset listen to false
    await store.restore()
    expect(store.snapshot().listen).toBe(false)

    // 5. ERROR (leaves listen unchanged)
    fakeEngine.setPresentPaywallResult(Promise.resolve('ERROR'))
    const rError = await store.openPaywall('control')
    expect(rError).toBe('locked')
    expect(store.snapshot().note).toBe("The purchase didn't go through. Listen mode is still locked.")
    expect(store.snapshot().listen).toBe(false)
  })

  test('openPaywall while busy opens nothing and resolves at once', async () => {
    const fakeEngine = createFakeEngine()
    const fakeConfig = createFakeConfig(20)
    const store = createPurchasesStore({ engine: fakeEngine.engine, config: fakeConfig })

    let resolvePaywall!: (val: PaywallResult) => void
    const pendingPaywall = new Promise<PaywallResult>((resolve) => {
      resolvePaywall = resolve
    })
    fakeEngine.setPresentPaywallResult(pendingPaywall)

    const firstCall = store.openPaywall('control')
    expect(store.snapshot().busy).toBe(true)
    expect(fakeEngine.calls.presentPaywall).toBe(1)

    // Second call while busy resolves at once without calling engine again
    const secondCallResult = await store.openPaywall('line')
    expect(secondCallResult).toBe('locked')
    expect(fakeEngine.calls.presentPaywall).toBe(1)

    // Completing first call
    resolvePaywall('PURCHASED')
    const firstCallResult = await firstCall
    expect(firstCallResult).toBe('unlocked')
    expect(store.snapshot().busy).toBe(false)

    // If already unlocked (listen is true), busy call resolves 'unlocked'
    let resolveSecondPending!: (val: PaywallResult) => void
    fakeEngine.setPresentPaywallResult(
      new Promise<PaywallResult>((resolve) => {
        resolveSecondPending = resolve
      })
    )
    const thirdCall = store.openPaywall('control')
    expect(store.snapshot().busy).toBe(true)
    const fourthCallResult = await store.openPaywall('settings')
    expect(fourthCallResult).toBe('unlocked')
    resolveSecondPending('NOT_PRESENTED')
    await thirdCall
  })

  test('restore with true, false, and null: the notes and listen', async () => {
    const fakeEngine = createFakeEngine()
    const fakeConfig = createFakeConfig(20)
    const store = createPurchasesStore({ engine: fakeEngine.engine, config: fakeConfig })

    // restore true
    fakeEngine.setRestoreResult(Promise.resolve(true))
    await store.restore()
    expect(store.snapshot().listen).toBe(true)
    expect(store.snapshot().note).toBe('Listen mode is unlocked.')

    // restore false
    fakeEngine.setRestoreResult(Promise.resolve(false))
    await store.restore()
    expect(store.snapshot().listen).toBe(false)
    expect(store.snapshot().note).toBe('No purchase found for this phone. Listen mode is still locked.')

    // restore null leaves listen unchanged
    fakeEngine.setRestoreResult(Promise.resolve(null))
    await store.restore()
    expect(store.snapshot().listen).toBe(false)
    expect(store.snapshot().note).toBe("Turn couldn't check for a purchase. Listen mode hasn't changed.")

    // restore while busy returns immediately
    let resolveRestore!: (val: boolean | null) => void
    fakeEngine.setRestoreResult(
      new Promise<boolean | null>((resolve) => {
        resolveRestore = resolve
      })
    )
    const pendingRestore = store.restore()
    expect(store.snapshot().busy).toBe(true)
    expect(fakeEngine.calls.restore).toBe(4)

    await store.restore()
    expect(fakeEngine.calls.restore).toBe(4)
    resolveRestore(true)
    await pendingRestore
    expect(store.snapshot().busy).toBe(false)
  })

  test('the refresh flag: off at first; on after onListenChange(true) following listenActive false; still on after a second refreshNext(); off after refreshAnswered(); on after an unlocked paywall result', async () => {
    const fakeEngine = createFakeEngine()
    const fakeConfig = createFakeConfig(20)
    const store = createPurchasesStore({ engine: fakeEngine.engine, config: fakeConfig })

    // 1. Off at first
    expect(store.refreshNext()).toBe(false)

    // 2. listenActive false
    fakeEngine.setListenActiveResult(Promise.resolve(false))
    await store.start({ apiKey: 'key', appUserID: 'user' })
    expect(store.refreshNext()).toBe(false)

    // on after onListenChange(true) following listenActive false
    fakeEngine.emitListen(true)
    expect(store.refreshNext()).toBe(true)

    // 3. Still on after a second refreshNext()
    expect(store.refreshNext()).toBe(true)

    // 4. Off after refreshAnswered()
    store.refreshAnswered()
    expect(store.refreshNext()).toBe(false)

    // 5. On after an unlocked paywall result
    fakeEngine.setPresentPaywallResult(Promise.resolve('PURCHASED'))
    await store.openPaywall('control')
    expect(store.refreshNext()).toBe(true)
  })

  test('start with configure resolving false leaves listen null and never calls listenActive; start twice configures once', async () => {
    const fakeEngine = createFakeEngine()
    const fakeConfig = createFakeConfig(20)
    const store = createPurchasesStore({ engine: fakeEngine.engine, config: fakeConfig })

    fakeEngine.setConfigureResult(Promise.resolve(false))
    await store.start({ apiKey: 'key1', appUserID: 'user1' })

    expect(store.snapshot().listen).toBeNull()
    expect(fakeEngine.calls.listenActive).toBe(0)
    expect(fakeEngine.calls.configure).toHaveLength(1)

    // Calling start a second time configures once
    await store.start({ apiKey: 'key2', appUserID: 'user2' })
    expect(fakeEngine.calls.configure).toHaveLength(1)
    expect(fakeEngine.calls.listenActive).toBe(0)
  })

  test('a config change republishes the count', () => {
    const fakeEngine = createFakeEngine()
    const fakeConfig = createFakeConfig(20)
    const store = createPurchasesStore({ engine: fakeEngine.engine, config: fakeConfig })

    const listener = vi.fn()
    store.subscribe(listener)

    fakeConfig.setFreeLinesLeft(15)
    expect(listener).toHaveBeenCalledTimes(1)
    expect(store.snapshot().freeLinesLeft).toBe(15)
    expect(store.snapshot().countLabel).toBe('15 free')
  })

  test('snapshot returns the same object until something changes', () => {
    const fakeEngine = createFakeEngine()
    const fakeConfig = createFakeConfig(20)
    const store = createPurchasesStore({ engine: fakeEngine.engine, config: fakeConfig })

    const s1 = store.snapshot()
    const s2 = store.snapshot()
    expect(s1).toBe(s2)

    fakeConfig.setFreeLinesLeft(19)
    const s3 = store.snapshot()
    expect(s3).not.toBe(s1)
    expect(s3.freeLinesLeft).toBe(19)
  })

  test('clearNote clears the note and dispose unsubscribes from config and engine', async () => {
    const fakeEngine = createFakeEngine()
    const fakeConfig = createFakeConfig(20)
    const store = createPurchasesStore({ engine: fakeEngine.engine, config: fakeConfig })

    fakeEngine.setRestoreResult(Promise.resolve(true))
    await store.restore()
    expect(store.snapshot().note).toBe('Listen mode is unlocked.')

    store.clearNote()
    expect(store.snapshot().note).toBeNull()

    await store.start({ apiKey: 'key', appUserID: 'user' })
    expect(fakeConfig.listenerCount()).toBe(1)
    expect(fakeEngine.listeners.size).toBe(1)

    store.dispose()
    expect(fakeConfig.listenerCount()).toBe(0)
    expect(fakeEngine.listeners.size).toBe(0)
  })
})
