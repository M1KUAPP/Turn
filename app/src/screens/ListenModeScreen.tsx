import { useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { ScrollView, useWindowDimensions, View } from 'react-native'
import { colors } from '../constants/theme'
import { consentWords } from '../consent/strings'
import { useConsent, useTurn } from '../turn-context'
import Button from './Button'
import { ListGroup, ListRow, ScreenTitle, tileTones, useScreenTitle } from './ListGroup'
import { permissionDateText } from './SettingsScreen'
import TurnText from './TurnText'

// Listen mode's permission (CONSENT-1, CONSENT-3), with Withdraw or Allow, and the under-18 switch (CONSENT-6).
export default function ListenModeScreen() {
  const router = useRouter()
  const { fontScale } = useWindowDimensions()
  const { boldText } = useTurn()
  const { consent, state } = useConsent()
  const { onTitleLayout, scrollProps } = useScreenTitle('Listen mode')
  const allowed = state.permissionAllowed
  const date = permissionDateText(state.permissionDate)
  const title = allowed ? [consentWords.allowedOn, date].filter(Boolean).join(' ') : consentWords.notAllowed

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      {...scrollProps}
      style={{ flex: 1, backgroundColor: colors.board }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40, gap: 22 }}
    >
      <ScreenTitle title="Listen mode" boldText={boldText} onLayout={onTitleLayout} />
      <View
        style={{
          gap: 10,
          padding: 20,
          borderRadius: 24,
          borderCurve: 'continuous',
          borderWidth: 1.5,
          borderColor: allowed ? colors.listen : colors.edge,
          backgroundColor: allowed ? colors['listen-soft'] : colors.surface
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <SymbolView
            name={allowed ? 'checkmark.circle' : 'lock'}
            size={Math.round(22 * Math.min(fontScale, 2.6))}
            weight="semibold"
            tintColor={colors.ink}
            accessible={false}
          />
          <TurnText kind="title" boldText={boldText} style={{ flex: 1, color: colors.ink }}>
            {title}
          </TurnText>
        </View>
        <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
          {state.note ?? state.step.paragraphs[0]}
        </TurnText>
      </View>

      {allowed ? (
        <Button
          label={consentWords.withdraw}
          boldText={boldText}
          disabled={!consent}
          onPress={() => void consent?.withdraw()}
        />
      ) : (
        <Button
          variant="primary"
          label={consentWords.allow}
          boldText={boldText}
          disabled={!consent}
          onPress={() => void consent?.grant()}
        />
      )}

      <ListGroup>
        <ListRow
          label={state.step.privacyNotice}
          boldText={boldText}
          symbol="checkmark.shield.fill"
          tone={tileTones.neutral}
          chevron
          onPress={() => router.push('/settings/privacy')}
        />
        <ListRow
          label={state.card.under18}
          boldText={boldText}
          symbol="person.crop.circle.badge.xmark"
          tone={tileTones.listen}
          subtitle="Asked on the consent card each time"
          toggle={{
            value: state.under18,
            onValueChange: (value) => void consent?.setUnder18(value),
            disabled: !consent
          }}
        />
      </ListGroup>
    </ScrollView>
  )
}
