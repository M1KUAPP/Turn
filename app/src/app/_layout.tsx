import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { colors } from '../constants/theme'
import { TurnProvider } from '../turn-context'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TurnProvider>
        <Stack screenOptions={{ contentStyle: { backgroundColor: colors.board }, headerTintColor: colors.ink }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="settings/index" options={{ title: 'Settings' }} />
          <Stack.Screen name="settings/places" options={{ title: 'Places' }} />
          <Stack.Screen name="settings/privacy" options={{ title: 'Privacy notice' }} />
          <Stack.Screen name="settings/licenses" options={{ title: 'Open-source licenses' }} />
        </Stack>
      </TurnProvider>
    </SafeAreaProvider>
  )
}
