import Purchases, { type CustomerInfo, type CustomerInfoUpdateListener } from 'react-native-purchases'
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui'
import { listenEntitlement, type PaywallResult, type PurchasesEngine } from './engine'

function hasActiveListen(info: CustomerInfo): boolean {
  return info.entitlements.active[listenEntitlement] !== undefined
}

/** Creates a PurchasesEngine adapter backed by RevenueCat and RevenueCatUI. */
export function createRevenueCatEngine(): PurchasesEngine {
  return {
    async configure({ apiKey, appUserID }: { apiKey: string; appUserID: string }): Promise<boolean> {
      try {
        if (await Purchases.isConfigured()) return true
        Purchases.configure({ apiKey, appUserID })
        return true
      } catch {
        return false
      }
    },

    async listenActive(): Promise<boolean | null> {
      try {
        const info = await Purchases.getCustomerInfo()
        return hasActiveListen(info)
      } catch {
        return null
      }
    },

    onListenChange(listener: (active: boolean) => void): () => void {
      const customerInfoListener: CustomerInfoUpdateListener = (info: CustomerInfo) => {
        listener(hasActiveListen(info))
      }
      Purchases.addCustomerInfoUpdateListener(customerInfoListener)
      return () => {
        Purchases.removeCustomerInfoUpdateListener(customerInfoListener)
      }
    },

    async restore(): Promise<boolean | null> {
      try {
        const info = await Purchases.restorePurchases()
        return hasActiveListen(info)
      } catch {
        return null
      }
    },

    async presentPaywall(): Promise<PaywallResult> {
      try {
        // Unlike Purchases' calls, RevenueCatUI doesn't check for configure first: without it the app stops natively.
        if (!(await Purchases.isConfigured())) return 'ERROR'
        const result = await RevenueCatUI.presentPaywallIfNeeded({
          requiredEntitlementIdentifier: listenEntitlement
        })
        switch (result) {
          case PAYWALL_RESULT.NOT_PRESENTED:
            return 'NOT_PRESENTED'
          case PAYWALL_RESULT.PURCHASED:
            return 'PURCHASED'
          case PAYWALL_RESULT.RESTORED:
            return 'RESTORED'
          case PAYWALL_RESULT.CANCELLED:
            return 'CANCELLED'
          case PAYWALL_RESULT.ERROR:
            return 'ERROR'
          default:
            return 'ERROR'
        }
      } catch {
        return 'ERROR'
      }
    }
  }
}
