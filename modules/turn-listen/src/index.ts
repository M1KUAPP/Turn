import { requireOptionalNativeModule } from 'expo'

export type NameKind = 'person' | 'place' | 'org'

export type NameSpan = { kind: NameKind; start: number; end: number }

export type AssetStatus = 'installed' | 'supported' | 'downloading' | 'unsupported' | 'none'

export type EngineState = 'idle' | 'starting' | 'listening' | 'paused' | 'stopping' | 'unavailable'

export type ListenLine = { text: string; endedAt: number; silenceWindowMs: number }

export type ListenEngineEvents = {
  onPartial(text: string): void
  onLine(line: ListenLine): void
  onState(state: EngineState, reason?: string): void
  onAssetProgress(fraction: number | null): void
  onVoice(active: boolean): void
}

type NativeEventPayloads = {
  onPartial: { text: string }
  onLine: ListenLine
  onState: { state: EngineState; reason?: string }
  onAssetProgress: { fraction: number | null }
  onVoice: { active: boolean }
}

type NativeTurnListenModule = {
  findNames(texts: string[]): Promise<NameSpan[][]>
  setGazetteer(person: string[], place: string[], org: string[]): Promise<void>
  availability(): Promise<AssetStatus>
  installAsset(): Promise<void>
  start(): Promise<void>
  pause(): Promise<void>
  resume(): Promise<void>
  stop(): Promise<void>
  endLine(): Promise<void>
  muteForSpeech(muted: boolean): Promise<void>
  addListener<K extends keyof NativeEventPayloads>(
    eventName: K,
    listener: (event: NativeEventPayloads[K]) => void
  ): { remove(): void }
}

export type TurnListen = {
  findNames(texts: readonly string[]): Promise<readonly (readonly NameSpan[])[]>
  setGazetteer(person: readonly string[], place: readonly string[], org: readonly string[]): Promise<void>
  availability(): Promise<AssetStatus>
  installAsset(): Promise<void>
  start(options: { lang: string }): Promise<void>
  pause(): Promise<void>
  resume(): Promise<void>
  stop(): Promise<void>
  endLine(): Promise<void>
  muteForSpeech(muted: boolean): Promise<void>
  listen(events: ListenEngineEvents): () => void
}

const native = requireOptionalNativeModule<NativeTurnListenModule>('TurnListen')

export const turnListen: TurnListen | null = native
  ? {
      findNames: (texts) => native.findNames([...texts]),
      setGazetteer: (person, place, org) => native.setGazetteer([...person], [...place], [...org]),
      availability: () => native.availability(),
      installAsset: () => native.installAsset(),
      start: (_options) => native.start(),
      pause: () => native.pause(),
      resume: () => native.resume(),
      stop: () => native.stop(),
      endLine: () => native.endLine(),
      muteForSpeech: (muted) => native.muteForSpeech(muted),
      listen(events) {
        const subscriptions = [
          native.addListener('onPartial', ({ text }) => events.onPartial(text)),
          native.addListener('onLine', events.onLine),
          native.addListener('onState', ({ state, reason }) => events.onState(state, reason)),
          native.addListener('onAssetProgress', ({ fraction }) => events.onAssetProgress(fraction)),
          native.addListener('onVoice', ({ active }) => events.onVoice(active))
        ]
        return () => subscriptions.forEach((subscription) => subscription.remove())
      }
    }
  : null
