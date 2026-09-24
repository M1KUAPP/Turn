import { ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { selectPrivacyNotice } from '../content/privacy-notice'
import { colors } from '../constants/theme'
import { useTurn } from '../turn-context'
import TurnText from './TurnText'

export default function PrivacyNoticeScreen() {
  const { ready, error, boldText } = useTurn()
  const sections = ready || error ? selectPrivacyNotice(ready?.typesafeNamed ?? false) : []

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.board }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 48, gap: 28 }}>
        {!ready && !error && (
          <TurnText kind="body" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
            Loading notice…
          </TurnText>
        )}
        {sections.map((section) => (
          <View key={section.title} style={{ gap: 10 }}>
            <TurnText kind="headline" boldText={boldText} accessibilityRole="header" style={{ color: colors.ink }}>
              {section.title}
            </TurnText>
            <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
              {section.body}
            </TurnText>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
