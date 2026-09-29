import { Linking, ScrollView, View } from 'react-native'
import { selectPrivacyNotice } from '../content/privacy-notice'
import { colors } from '../constants/theme'
import { useTurn } from '../turn-context'
import { ScreenTitle } from './ListGroup'
import TurnText from './TurnText'

export default function PrivacyNoticeScreen() {
  const { ready, error, boldText } = useTurn()
  const sections = ready || error ? selectPrivacyNotice(ready?.typesafeNamed ?? false) : []

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.board }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 48, gap: 24 }}
    >
      <ScreenTitle title="Privacy notice" boldText={boldText} />
      {!ready && !error && (
        <TurnText kind="body" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
          Loading notice…
        </TurnText>
      )}
      {sections.map((section) => {
        const url = section.url
        return (
          <View key={section.title} style={{ gap: 8 }}>
            <TurnText kind="title" boldText={boldText} accessibilityRole="header" style={{ color: colors.ink }}>
              {section.title}
            </TurnText>
            <TurnText kind="body" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
              {section.body}
            </TurnText>
            {url && (
              <TurnText
                kind="body"
                boldText={boldText}
                accessibilityRole="link"
                onPress={() => void Linking.openURL(url)}
                style={{ color: colors.accent, textDecorationLine: 'underline' }}
              >
                {url}
              </TurnText>
            )}
          </View>
        )
      })}
    </ScrollView>
  )
}
