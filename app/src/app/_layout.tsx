import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { colors, navigationColors } from '../constants/theme'
import { TurnProvider } from '../turn-context'

export default function RootLayout() {
  const scheme = useColorScheme()
  const navigationTheme = { ...(scheme === 'dark' ? DarkTheme : DefaultTheme), colors: navigationColors }
  return (
    <SafeAreaProvider>
      <TurnProvider>
        <ThemeProvider value={navigationTheme}>
          <Stack screenOptions={{ contentStyle: { backgroundColor: colors.board }, headerTintColor: colors.ink }}>
            <Stack.Screen name="index" options={{ headerShown: false, title: 'Turn' }} />
            <Stack.Screen
              name="permission"
              options={{
                presentation: 'formSheet',
                sheetAllowedDetents: [1],
                headerShown: false,
                headerTransparent: false,
                gestureEnabled: false,
                contentStyle: { backgroundColor: colors.surface }
              }}
            />
            <Stack.Screen
              name="consent"
              options={{
                headerShown: false,
                gestureEnabled: false,
                contentStyle: { backgroundColor: colors.board }
              }}
            />
            <Stack.Screen name="settings/index" options={{ title: 'Settings', headerLargeTitle: true }} />
            <Stack.Screen name="settings/places" options={{ title: 'Places' }} />
            <Stack.Screen name="settings/voice" options={{ title: 'Voice' }} />
            <Stack.Screen name="settings/privacy" options={{ title: 'Privacy notice' }} />
            <Stack.Screen name="settings/stats" options={{ title: 'Stats on this phone' }} />
            <Stack.Screen name="settings/licenses" options={{ title: 'Open-source licenses' }} />
            <Stack.Screen name="bank/index" options={{ title: 'Phrase bank' }} />
            <Stack.Screen name="bank/[category]" options={{ title: 'Phrases' }} />
          </Stack>
        </ThemeProvider>
      </TurnProvider>
    </SafeAreaProvider>
  )
}
