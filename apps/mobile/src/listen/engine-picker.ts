import Constants from 'expo-constants'
import type { AssetStatus, EngineChoice, EnginePicker, ListenEngine } from './engine'

const availableStatuses: readonly AssetStatus[] = ['installed', 'supported', 'downloading']
const engineChoices: readonly EngineChoice[] = ['auto', 'apple', 'expo', 'none']

async function available(engine: ListenEngine | null): Promise<ListenEngine | null> {
  if (!engine) return null
  try {
    return availableStatuses.includes(await engine.availability()) ? engine : null
  } catch {
    return null
  }
}

export const pickEngine: EnginePicker = async ({ buildKind, choice, turnListen, expo }) => {
  if (buildKind === 'simulator' || choice === 'none') return null
  if (choice === 'apple') return available(turnListen())
  if (choice === 'expo') return available(expo)

  return (await available(turnListen())) ?? available(expo)
}

export async function pickListenEngine(
  turnListen: () => ListenEngine | null,
  expo: ListenEngine
): Promise<ListenEngine | null> {
  const extra = Constants.expoConfig?.extra
  const buildKind = extra?.buildKind === 'device' ? 'device' : 'simulator'
  const choice = engineChoices.includes(extra?.listenEngine as EngineChoice)
    ? (extra?.listenEngine as EngineChoice)
    : 'auto'

  return pickEngine({ buildKind, choice, turnListen, expo })
}
