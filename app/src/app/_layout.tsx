import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router'
import { useColorScheme, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { colors, navigationColors } from '../constants/theme'
import { TurnProvider } from '../turn-context'

// Settings and the editor keep iOS's own bar and glass back button, on the board. Each screen sets its title in the
// content, in `large-title`, since the bar's title can't take the rounded face; the bar keeps it for the next
// screen's back button.
const listScreen = {
  headerShadowVisible: false,
  headerStyle: { backgroundColor: colors.board },
  headerTitle: () => <View />
} as const

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
                contentStyle: { backgroundColor: colors.board }
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
            <Stack.Screen
              name="partner"
              options={{
                presentation: 'fullScreenModal',
                headerShown: false,
                contentStyle: { backgroundColor: colors.board }
              }}
            />
            <Stack.Screen name="settings/index" options={{ ...listScreen, title: 'Settings' }} />
            <Stack.Screen name="settings/listen" options={{ ...listScreen, title: 'Listen mode' }} />
            <Stack.Screen name="settings/places" options={{ ...listScreen, title: 'Places' }} />
            <Stack.Screen name="settings/voice" options={{ ...listScreen, title: 'Voice' }} />
            <Stack.Screen name="settings/companion" options={{ ...listScreen, title: 'Companion' }} />
            <Stack.Screen name="settings/privacy" options={{ ...listScreen, title: 'Privacy notice' }} />
            <Stack.Screen name="settings/stats" options={{ ...listScreen, title: 'Stats on this phone' }} />
            <Stack.Screen name="settings/licenses" options={{ ...listScreen, title: 'Licenses' }} />
            <Stack.Screen name="bank/index" options={{ ...listScreen, title: 'Phrase bank' }} />
            <Stack.Screen name="bank/[category]" options={{ ...listScreen, title: 'Phrases' }} />
          </Stack>
        </ThemeProvider>
      </TurnProvider>
    </SafeAreaProvider>
  )
}
