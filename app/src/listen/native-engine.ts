import { turnListen, type TurnListen } from '../../../modules/turn-listen/src'
import type { ListenEngine } from './engine'

export function createNativeListenEngine(module: TurnListen | null = turnListen): ListenEngine | null {
  if (!module) return null

  return {
    id: 'turn-listen',
    listen: (events) => module.listen(events),
    availability: () => module.availability(),
    installAsset: () => module.installAsset(),
    start: (options) => module.start(options),
    pause: () => module.pause(),
    resume: () => module.resume(),
    stop: () => module.stop(),
    endLine: () => module.endLine()
  }
}

export const nativeListenEngine = createNativeListenEngine()
