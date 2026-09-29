import { SymbolView } from 'expo-symbols'
import { Pressable, ScrollView, Switch, useColorScheme, useWindowDimensions, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, colorValues } from '../constants/theme'
import { useConsent, useTurn } from '../turn-context'
import Button from './Button'
import type { SymbolName } from './category-style'
import { useShadow } from './depth'
import PressFill from './PressFill'
import TurnText from './TurnText'

// CONSENT-4's facts in order: text on this phone, where the words go, no audio, pause any time.
const factSymbols: SymbolName[] = ['iphone', 'arrow.left.arrow.right', 'mic.slash.fill', 'pause.circle.fill']

// The lamp's warm glow behind the card: `listen-glow` at 30% fading out, an ellipse from plan 0044's frame.
function glowGradient(dark: boolean) {
  const hex = colorValues['listen-glow'][dark ? 'dark' : 'light']
  const [r, g, b] = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16))
  return `radial-gradient(ellipse closest-side, rgba(${r},${g},${b},0.3), rgba(${r},${g},${b},0))`
}

export default function ConsentCardScreen() {
  const { fontScale } = useWindowDimensions()
  const dark = useColorScheme() === 'dark'
  const cardShadow = useShadow('raised')
  const { boldText } = useTurn()
  const { consent, state } = useConsent()
  const card = state.card
  const disabled = consent === null
  const disc = Math.round(40 * Math.min(fontScale, 1.5))

  return (
    <View style={{ flex: 1, backgroundColor: colors.board }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: -120,
          top: -160,
          width: 640,
          height: 460,
          experimental_backgroundImage: glowGradient(dark)
        }}
      />
      <SafeAreaView edges={['left', 'right', 'top', 'bottom']} style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            marginHorizontal: 16,
            marginTop: 8,
            marginBottom: 12,
            borderRadius: 28,
            boxShadow: cardShadow
          }}
        >
          <View
            style={{
              flex: 1,
              borderRadius: 28,
              borderCurve: 'continuous',
              borderWidth: 1.5,
              borderColor: colors.listen,
              backgroundColor: colors.surface,
              overflow: 'hidden'
            }}
          >
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 22, paddingBottom: 16, gap: 16 }}>
              <View
                style={{
                  minHeight: 100,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  alignContent: 'center',
                  justifyContent: 'space-between',
                  gap: 12
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.listen
                  }}
                >
                  <SymbolView
                    name="ear"
                    size={24}
                    weight="semibold"
                    tintColor={colors['on-listen']}
                    accessible={false}
                  />
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={card.readAloud}
                  accessibilityState={{ disabled }}
                  disabled={disabled}
                  onPress={() => void consent?.readAloud()}
                  style={{
                    minHeight: 44,
                    flexShrink: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 22,
                    backgroundColor: colors['surface-sunken']
                  }}
                >
                  {({ pressed }) => (
                    <>
                      <PressFill pressed={pressed} color={colors['surface-pressed']} radius={22} />
                      <SymbolView
                        name="speaker.wave.2.fill"
                        size={Math.round(18 * Math.min(fontScale, 2.6))}
                        weight="semibold"
                        tintColor={colors.ink}
                        accessible={false}
                      />
                      <TurnText kind="label" boldText={boldText} style={{ flexShrink: 1, color: colors.ink }}>
                        {card.readAloud}
                      </TurnText>
                    </>
                  )}
                </Pressable>
              </View>
              <TurnText
                kind="partner-card-title"
                boldText={boldText}
                accessibilityRole="header"
                style={{ color: colors.ink }}
              >
                {card.lead}
              </TurnText>
              <View style={{ gap: 12 }}>
                {card.facts.map((fact, index) => (
                  <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
                    <View
                      style={{
                        width: disc,
                        height: disc,
                        borderRadius: disc / 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colors['listen-soft']
                      }}
                    >
                      <SymbolView
                        name={factSymbols[index] ?? 'info.circle'}
                        size={Math.round(disc / 2)}
                        weight="semibold"
                        tintColor={colors.ink}
                        accessible={false}
                      />
                    </View>
                    <TurnText kind="body" boldText={boldText} style={{ flex: 1, color: colors.ink }}>
                      {fact}
                    </TurnText>
                  </View>
                ))}
              </View>
              <View
                style={{
                  minHeight: 80,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 20,
                  borderCurve: 'continuous',
                  backgroundColor: colors['surface-sunken']
                }}
              >
                {/* The switch carries the label, so VoiceOver and Voice Control find one element, as in iOS. */}
                <View
                  style={{ flex: 1, gap: 2 }}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                >
                  <TurnText
                    kind="body"
                    boldText={boldText}
                    style={{ color: disabled ? colors['ink-secondary'] : colors.ink }}
                  >
                    {card.under18}
                  </TurnText>
                  <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                    {state.under18 ? card.under18Off : card.under18Never}
                  </TurnText>
                </View>
                <Switch
                  accessibilityLabel={card.under18}
                  accessibilityHint={state.under18 ? card.under18Off : card.under18Never}
                  accessibilityState={{ disabled, checked: state.under18 }}
                  value={state.under18}
                  onValueChange={(on) => void consent?.setUnder18(on)}
                  disabled={disabled}
                  trackColor={{ false: colors.edge, true: colors.accent }}
                  thumbColor={colors.surface}
                />
              </View>
            </ScrollView>
            {/* The answers stay pinned within a thumb's reach; above them the card scrolls at large sizes. The mic
                stays off for a partner under 18, so agreeing then takes Turn's own blue, not the lamp's orange. */}
            <View style={{ paddingHorizontal: 24, paddingBottom: 22, paddingTop: 0, gap: 16 }}>
              <Button
                variant={state.under18 ? 'primary' : 'listen'}
                label={card.agreed}
                boldText={boldText}
                disabled={disabled}
                onPress={() => void consent?.partnerAgreed()}
              />
              <Button
                label={card.declined}
                boldText={boldText}
                disabled={disabled}
                onPress={() => consent?.partnerDeclined()}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}
