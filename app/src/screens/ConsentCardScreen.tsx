import { useWindowDimensions, Pressable, ScrollView, Switch, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../constants/theme'
import { useConsent, useTurn } from '../turn-context'
import TurnText from './TurnText'

function SecondaryButton({
  label,
  boldText,
  disabled,
  onPress,
  equalPair = false
}: {
  label: string
  boldText: boolean
  disabled: boolean
  onPress: () => void
  equalPair?: boolean
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minWidth: 44,
        minHeight: 52,
        flex: equalPair ? 1 : undefined,
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.edge,
        backgroundColor: pressed && !disabled ? colors['surface-pressed'] : colors.surface,
        paddingHorizontal: 16,
        paddingVertical: 10
      })}
    >
      <TurnText
        kind="body"
        boldText={boldText}
        style={{ color: disabled ? colors['ink-secondary'] : colors.ink, textAlign: 'center' }}
      >
        {label}
      </TurnText>
    </Pressable>
  )
}

export default function ConsentCardScreen() {
  const { fontScale } = useWindowDimensions()
  const { boldText } = useTurn()
  const { consent, state } = useConsent()
  const card = state.card
  const disabled = consent === null
  const stackedAnswers = fontScale >= 1.786

  return (
    <SafeAreaView edges={['left', 'right', 'top', 'bottom']} style={{ flex: 1, backgroundColor: colors.board }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, gap: 16 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 20, paddingBottom: 8 }}>
          <TurnText kind="largeTitle-emphasized" boldText={boldText} style={{ color: colors.ink }}>
            {card.lead}
          </TurnText>
          <View style={{ gap: 16 }}>
            {card.facts.map((fact, index) => (
              <TurnText key={index} kind="title2" boldText={boldText} style={{ color: colors.ink }}>
                {fact}
              </TurnText>
            ))}
          </View>
          <View
            style={{
              minHeight: 64,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.edge,
              backgroundColor: colors.surface,
              paddingHorizontal: 16,
              paddingVertical: 10
            }}
          >
            {/* The switch carries the label, so VoiceOver and Voice Control find one element, as in iOS. */}
            <TurnText
              kind="body"
              boldText={boldText}
              accessibilityElementsHidden
              style={{ flex: 1, color: disabled ? colors['ink-secondary'] : colors.ink }}
            >
              {card.under18}
            </TurnText>
            <Switch
              accessibilityLabel={card.under18}
              accessibilityState={{ disabled, checked: state.under18 }}
              value={state.under18}
              onValueChange={(on) => void consent?.setUnder18(on)}
              disabled={disabled}
              trackColor={{ false: colors.edge, true: colors.accent }}
              thumbColor={colors.surface}
              style={{ minWidth: 64, minHeight: 44 }}
            />
          </View>
          <SecondaryButton
            label={card.readAloud}
            boldText={boldText}
            disabled={disabled}
            onPress={() => void consent?.readAloud()}
          />
        </ScrollView>
        <View style={{ flexDirection: stackedAnswers ? 'column' : 'row', gap: 12 }}>
          <SecondaryButton
            label={card.agreed}
            boldText={boldText}
            disabled={disabled}
            equalPair={!stackedAnswers}
            onPress={() => void consent?.partnerAgreed()}
          />
          <SecondaryButton
            label={card.declined}
            boldText={boldText}
            disabled={disabled}
            equalPair={!stackedAnswers}
            onPress={() => consent?.partnerDeclined()}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
