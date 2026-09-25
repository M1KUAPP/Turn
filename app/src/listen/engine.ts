/** The one surface both transcription engines meet (#49, #51); see docs/plans/0037-turn-transcription.md. */
export type EngineId = 'turn-listen' | 'expo-speech-recognition'

/** Mirrors AssetInventory.Status, plus 'none' for an engine that is absent. */
export type AssetStatus = 'installed' | 'supported' | 'downloading' | 'unsupported' | 'none'

export type EngineState = 'idle' | 'starting' | 'listening' | 'paused' | 'stopping' | 'unavailable'

/** One ended line. The engine stamps endedAt; the app logs against it. */
export type ListenLine = {
  text: string
  endedAt: number
  silenceWindowMs: number
}

export type ListenEngineEvents = {
  /** Words heard so far in the open line. */
  onPartial(text: string): void
  /** The open line, once, on the engine's own boundary. */
  onLine(line: ListenLine): void
  onState(state: EngineState, reason?: string): void
  /** Fraction 0..1 while an asset installs, null when there is none. */
  onAssetProgress(fraction: number | null): void
  /** True while the partner's voice is above the silence level. */
  onVoice(active: boolean): void
}

export type ListenEngine = {
  id: EngineId
  /** The session registers its handlers once; the engine calls them. */
  listen(events: ListenEngineEvents): () => void
  availability(): Promise<AssetStatus>
  installAsset(): Promise<void>
  start(options: { lang: string }): Promise<void>
  pause(): Promise<void>
  resume(): Promise<void>
  stop(): Promise<void>
  endLine(): Promise<void>
  muteForSpeech(muted: boolean): Promise<void>
}

/** From extra.listenEngine. 'auto' is the default. */
export type EngineChoice = 'auto' | 'apple' | 'expo' | 'none'

/** Null means the typed path. */
export type EnginePicker = (input: {
  buildKind: 'simulator' | 'device'
  choice: EngineChoice
  turnListen: () => ListenEngine | null
  expo: ListenEngine
}) => Promise<ListenEngine | null>
