import fs from 'node:fs'
import path from 'node:path'
import { beforeEach, describe, expect, test, vi } from 'vitest'

const { fakePurchases, fakeRevenueCatUI } = vi.hoisted(() => {
  return {
    fakePurchases: {
      isConfigured: vi.fn(),
      configure: vi.fn(),
      getCustomerInfo: vi.fn(),
      addCustomerInfoUpdateListener: vi.fn(),
      removeCustomerInfoUpdateListener: vi.fn(),
      restorePurchases: vi.fn()
    },
    fakeRevenueCatUI: {
      presentPaywallIfNeeded: vi.fn()
    }
  }
})

vi.mock('react-native-purchases', () => {
  return {
    default: fakePurchases
  }
})

vi.mock('react-native-purchases-ui', () => {
  return {
    default: fakeRevenueCatUI,
    PAYWALL_RESULT: {
      NOT_PRESENTED: 'NOT_PRESENTED',
      ERROR: 'ERROR',
      CANCELLED: 'CANCELLED',
      PURCHASED: 'PURCHASED',
      RESTORED: 'RESTORED'
    }
  }
})

import { createRevenueCatEngine } from '../src/purchases/revenuecat-engine'

function getSourceFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getSourceFiles(fullPath))
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      files.push(fullPath)
    }
  }
  return files
}

describe('revenuecat engine', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('configure: resolves true without configuring again when isConfigured is true', async () => {
    const engine = createRevenueCatEngine()
    fakePurchases.isConfigured.mockResolvedValueOnce(true)

    const result = await engine.configure({ apiKey: 'rc_key', appUserID: 'user_1' })

    expect(result).toBe(true)
    expect(fakePurchases.isConfigured).toHaveBeenCalledTimes(1)
    expect(fakePurchases.configure).not.toHaveBeenCalled()
  })

  test('configure: calls configure and resolves true when isConfigured is false', async () => {
    const engine = createRevenueCatEngine()
    fakePurchases.isConfigured.mockResolvedValueOnce(false)

    const result = await engine.configure({ apiKey: 'rc_key', appUserID: 'user_1' })

    expect(result).toBe(true)
    expect(fakePurchases.isConfigured).toHaveBeenCalledTimes(1)
    expect(fakePurchases.configure).toHaveBeenCalledWith({ apiKey: 'rc_key', appUserID: 'user_1' })
  })

  test('configure: resolves false when isConfigured or configure throws', async () => {
    const engine = createRevenueCatEngine()

    fakePurchases.isConfigured.mockRejectedValueOnce(new Error('native error'))
    expect(await engine.configure({ apiKey: 'rc_key', appUserID: 'user_1' })).toBe(false)

    fakePurchases.isConfigured.mockResolvedValueOnce(false)
    fakePurchases.configure.mockImplementationOnce(() => {
      throw new Error('invalid config')
    })
    expect(await engine.configure({ apiKey: 'rc_key', appUserID: 'user_1' })).toBe(false)
  })

  test('listenActive: maps customer info active listen entitlement and handles throws', async () => {
    const engine = createRevenueCatEngine()

    fakePurchases.getCustomerInfo.mockResolvedValueOnce({
      entitlements: { active: { listen: { identifier: 'listen', isActive: true } } }
    })
    expect(await engine.listenActive()).toBe(true)

    fakePurchases.getCustomerInfo.mockResolvedValueOnce({
      entitlements: { active: {} }
    })
    expect(await engine.listenActive()).toBe(false)

    fakePurchases.getCustomerInfo.mockRejectedValueOnce(new Error('network error'))
    expect(await engine.listenActive()).toBeNull()
  })

  test('onListenChange: registers listener, maps customer info, and removes listener on unsubscribe', () => {
    const engine = createRevenueCatEngine()
    let registeredCallback: ((info: any) => void) | null = null

    fakePurchases.addCustomerInfoUpdateListener.mockImplementationOnce((cb: (info: any) => void) => {
      registeredCallback = cb
    })
    fakePurchases.removeCustomerInfoUpdateListener.mockReturnValueOnce(true)

    const listener = vi.fn()
    const unsubscribe = engine.onListenChange(listener)

    expect(fakePurchases.addCustomerInfoUpdateListener).toHaveBeenCalledTimes(1)
    expect(registeredCallback).not.toBeNull()

    registeredCallback!({
      entitlements: { active: { listen: { identifier: 'listen', isActive: true } } }
    })
    expect(listener).toHaveBeenCalledWith(true)

    registeredCallback!({
      entitlements: { active: {} }
    })
    expect(listener).toHaveBeenCalledWith(false)

    unsubscribe()
    expect(fakePurchases.removeCustomerInfoUpdateListener).toHaveBeenCalledWith(registeredCallback)
  })

  test('restore: maps restorePurchases customer info and handles throws', async () => {
    const engine = createRevenueCatEngine()

    fakePurchases.restorePurchases.mockResolvedValueOnce({
      entitlements: { active: { listen: { identifier: 'listen', isActive: true } } }
    })
    expect(await engine.restore()).toBe(true)

    fakePurchases.restorePurchases.mockResolvedValueOnce({
      entitlements: { active: {} }
    })
    expect(await engine.restore()).toBe(false)

    fakePurchases.restorePurchases.mockRejectedValueOnce(new Error('store failure'))
    expect(await engine.restore()).toBeNull()
  })

  test('presentPaywall: maps each of the five values, an unknown value, and a throw', async () => {
    const engine = createRevenueCatEngine()
    fakePurchases.isConfigured.mockResolvedValue(true)

    // 1. NOT_PRESENTED
    fakeRevenueCatUI.presentPaywallIfNeeded.mockResolvedValueOnce('NOT_PRESENTED')
    expect(await engine.presentPaywall()).toBe('NOT_PRESENTED')
    expect(fakeRevenueCatUI.presentPaywallIfNeeded).toHaveBeenCalledWith({
      requiredEntitlementIdentifier: 'listen'
    })

    // 2. PURCHASED
    fakeRevenueCatUI.presentPaywallIfNeeded.mockResolvedValueOnce('PURCHASED')
    expect(await engine.presentPaywall()).toBe('PURCHASED')

    // 3. RESTORED
    fakeRevenueCatUI.presentPaywallIfNeeded.mockResolvedValueOnce('RESTORED')
    expect(await engine.presentPaywall()).toBe('RESTORED')

    // 4. CANCELLED
    fakeRevenueCatUI.presentPaywallIfNeeded.mockResolvedValueOnce('CANCELLED')
    expect(await engine.presentPaywall()).toBe('CANCELLED')

    // 5. ERROR
    fakeRevenueCatUI.presentPaywallIfNeeded.mockResolvedValueOnce('ERROR')
    expect(await engine.presentPaywall()).toBe('ERROR')

    // 6. Unknown value resolves 'ERROR'
    fakeRevenueCatUI.presentPaywallIfNeeded.mockResolvedValueOnce('UNEXPECTED_STATUS')
    expect(await engine.presentPaywall()).toBe('ERROR')

    // 7. Thrown error resolves 'ERROR'
    fakeRevenueCatUI.presentPaywallIfNeeded.mockRejectedValueOnce(new Error('UI presentation crashed'))
    expect(await engine.presentPaywall()).toBe('ERROR')
  })

  test('presentPaywall: resolves ERROR without opening the paywall while RevenueCat is not configured', async () => {
    const engine = createRevenueCatEngine()

    // RevenueCatUI stops the app natively when Purchases isn't configured, as in the Simulator run 36327720412.
    fakePurchases.isConfigured.mockResolvedValueOnce(false)
    expect(await engine.presentPaywall()).toBe('ERROR')

    fakePurchases.isConfigured.mockRejectedValueOnce(new Error('no native module'))
    expect(await engine.presentPaywall()).toBe('ERROR')

    expect(fakeRevenueCatUI.presentPaywallIfNeeded).not.toHaveBeenCalled()
  })

  test('PRIV-4: no customer attribute setter calls anywhere in app/src', () => {
    const srcDir = path.resolve(__dirname, '../src')
    const files = getSourceFiles(srcDir)
    expect(files.length).toBeGreaterThan(0)

    const pattern =
      /\b(setAttributes|setEmail|setPhoneNumber|setDisplayName|setPushToken|collectDeviceIdentifiers|set[A-Za-z]*ID)\s*\(/

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8')
      const match = pattern.exec(content)
      expect(match, `File ${file} violates PRIV-4 by calling ${match?.[0]}`).toBeNull()
    }
  })

  test('the pin: app/package.json pins react-native-purchases and react-native-purchases-ui at 10.10.1', () => {
    const packageJsonPath = path.resolve(__dirname, '../package.json')
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

    expect(pkg.dependencies['react-native-purchases']).toBe('10.10.1')
    expect(pkg.dependencies['react-native-purchases-ui']).toBe('10.10.1')
  })
})
