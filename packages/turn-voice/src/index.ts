import { requireOptionalNativeModule } from 'expo'

export type PersonalVoiceAuthorization = 'authorized' | 'denied' | 'notDetermined' | 'unsupported'
export type PersonalVoice = { identifier: string; name: string }

type NativeTurnVoiceModule = {
  requestPersonalVoice(): Promise<PersonalVoiceAuthorization>
  personalVoice(): Promise<PersonalVoice | null>
  addListener(eventName: 'onVoicesChanged', listener: () => void): { remove(): void }
}

export type TurnVoice = {
  requestPersonalVoice(): Promise<PersonalVoiceAuthorization>
  personalVoice(): Promise<PersonalVoice | null>
  onVoicesChanged(listener: () => void): () => void
}

const native = requireOptionalNativeModule<NativeTurnVoiceModule>('TurnVoice')

export const turnVoice: TurnVoice = {
  requestPersonalVoice: () => native?.requestPersonalVoice() ?? Promise.resolve('unsupported'),
  personalVoice: () => native?.personalVoice() ?? Promise.resolve(null),
  onVoicesChanged(listener) {
    if (!native) return () => {}
    const subscription = native.addListener('onVoicesChanged', listener)
    return () => subscription.remove()
  }
}
