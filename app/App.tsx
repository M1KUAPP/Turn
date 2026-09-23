import { useSyncExternalStore } from 'react'
import { nativeAccessibilitySource } from './src/accessibility/native'
import { createAccessibilityStore } from './src/accessibility/store'
import HomeScreen from './src/screens/HomeScreen'

const accessibilityStore = createAccessibilityStore(nativeAccessibilitySource)

export default function App() {
  useSyncExternalStore(accessibilityStore.subscribe, accessibilityStore.getSnapshot)
  return <HomeScreen />
}
