/** RevenueCat's SDK behind one surface (#53); see docs/plans/0040-turn-paywall.md. */
export const listenEntitlement = 'listen'

/** RevenueCatUI's PAYWALL_RESULT, by value. */
export type PaywallResult = 'NOT_PRESENTED' | 'ERROR' | 'CANCELLED' | 'PURCHASED' | 'RESTORED'

/** The calls Turn makes. None rejects: a thrown SDK error becomes false, null, or 'ERROR'. */
export type PurchasesEngine = {
  /** Purchases.configure with the Test Store key and the app user ID, once; false if it threw. */
  configure(input: { apiKey: string; appUserID: string }): Promise<boolean>
  /** Whether `listen` is active in getCustomerInfo(); null when RevenueCat can't say. */
  listenActive(): Promise<boolean | null>
  /** Calls back with `listen`'s state on each customer info update; returns the unsubscribe. */
  onListenChange(listener: (active: boolean) => void): () => void
  /** restorePurchases(), then `listen`'s state; null when it threw. */
  restore(): Promise<boolean | null>
  /** presentPaywallIfNeeded for `listen`; 'ERROR' when it threw. */
  presentPaywall(): Promise<PaywallResult>
}

/** Where the paywall opened from, which decides what closing it does. */
export type PaywallDoor = 'line' | 'control' | 'settings'

export type PurchasesSnapshot = {
  /** The relay's count; null once entitled, or while the Simulator switch skips the count. */
  freeLinesLeft: number | null
  /** RevenueCat's `listen`; null until it answers. */
  listen: boolean | null
  /** No free lines left and `listen` not known to be active (PAY-1, PAY-2). */
  locked: boolean
  /** "20 free", under "Listen", while there's a count and no `listen`; else null (PAY-1). */
  countLabel: string | null
  /** The paywall is open or a restore is running. */
  busy: boolean
  /** The last purchase or restore's note, in DESIGN's words; null when there's none. */
  note: string | null
}

export type PurchasesStore = {
  snapshot(): PurchasesSnapshot
  subscribe(listener: () => void): () => void
  /** Opens the paywall unless it's open or busy, and says what Listen mode is now. */
  openPaywall(door: PaywallDoor): Promise<'unlocked' | 'locked'>
  restore(): Promise<void>
  /** Whether the next line carries `refresh` (PAY-4). */
  refreshNext(): boolean
  /** A line that carried `refresh` was answered, so the flag clears. */
  refreshAnswered(): void
  clearNote(): void
  dispose(): void
}
