import type { AppStateStatus } from 'react-native'

type ListenSession = {
  pause(): Promise<void>
}

type AppStateSource = {
  addEventListener(type: 'change', listener: (state: AppStateStatus) => void): { remove(): void }
}

export function bindListenLifecycle(listen: ListenSession, appState: AppStateSource): () => void {
  const subscription = appState.addEventListener('change', (state) => {
    if (state === 'background') void listen.pause()
  })
  return () => subscription.remove()
}
