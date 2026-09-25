import { useRouter } from 'expo-router'
import { useWindowDimensions, Pressable, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../constants/theme'
import { useConsent, useTurn } from '../turn-context'
import TurnText from './TurnText'

function SecondaryButton({
  label,
  boldText,
  disabled,
  onPress,
  equalPair
}: {
  label: string
  boldText: boolean
  disabled: boolean
  onPress: () => void
  equalPair: boolean
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

export default function PermissionStepScreen() {
  const router = useRouter()
  const { boldText } = useTurn()
  const { consent, state } = useConsent()
  const step = state.step
  const disabled = consent === null
  const { fontScale } = useWindowDimensions()
  const stacked = fontScale >= 1.786

  return (
    <SafeAreaView edges={['left', 'right', 'top', 'bottom']} style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20, gap: 20 }}
      >
        <TurnText kind="title2" boldText={boldText} style={{ color: colors.ink }}>
          {step.title}
        </TurnText>
        <View style={{ gap: 14 }}>
          {step.paragraphs.map((paragraph, index) => (
            <TurnText key={index} kind="body" boldText={boldText} style={{ color: colors.ink }}>
              {paragraph}
            </TurnText>
          ))}
        </View>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={step.privacyNotice}
          onPress={() => router.push('/settings/privacy')}
          style={({ pressed }) => ({
            minWidth: 44,
            minHeight: 44,
            justifyContent: 'center',
            alignSelf: 'flex-start',
            backgroundColor: pressed ? colors['surface-pressed'] : undefined,
            borderRadius: 8,
            paddingHorizontal: 8
          })}
        >
          <TurnText kind="body" boldText={boldText} style={{ color: colors.accent, textDecorationLine: 'underline' }}>
            {step.privacyNotice}
          </TurnText>
        </Pressable>
        <View style={{ flexGrow: 1 }} />
        <View style={{ flexDirection: stacked ? 'column' : 'row', gap: 12 }}>
          <SecondaryButton
            label={step.allow}
            boldText={boldText}
            disabled={disabled}
            equalPair={!stacked}
            onPress={() => void consent?.allow()}
          />
          <SecondaryButton
            label={step.notNow}
            boldText={boldText}
            disabled={disabled}
            equalPair={!stacked}
            onPress={() => consent?.notNow()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
