import { useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../constants/theme'
import { useConsent, useTurn } from '../turn-context'
import Button from './Button'
import type { SymbolName } from './category-style'
import { useShadow } from './depth'
import EdgeFade from './EdgeFade'
import SheetHeader from './SheetHeader'
import PressFill from './PressFill'
import TurnText from './TurnText'

// The facts after the first paragraph, in plan 0044's order: names swapped for tags, what stays, what the service keeps.
const factSymbols: SymbolName[] = ['person.text.rectangle', 'lock.fill', 'info.circle']

export default function PermissionStepScreen() {
  const router = useRouter()
  const { boldText, increaseContrast } = useTurn()
  const { consent, state } = useConsent()
  const step = state.step
  const disabled = consent === null
  const { fontScale } = useWindowDimensions()
  const symbolSize = (base: number) => Math.round(base * Math.min(fontScale, 2.6))
  const disc = Math.round(40 * Math.min(fontScale, 1.5))
  const stacked = fontScale >= 1.786
  const [lead, ...facts] = step.paragraphs
  const glow = useShadow('glow')

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.board }}>
      <SheetHeader title={step.title} boldText={boldText} closeLabel="Close" onClose={() => consent?.notNow()} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, gap: 14 }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.listen,
            boxShadow: glow
          }}
        >
          <SymbolView name="ear" size={28} weight="semibold" tintColor={colors['on-listen']} accessible={false} />
        </View>
        <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
          {lead}
        </TurnText>
        {facts.map((fact, index) => (
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
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={step.privacyNotice}
          onPress={() => router.push('/settings/privacy')}
          style={{
            minHeight: 44,
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            gap: 6,
            marginLeft: -8,
            paddingHorizontal: 8,
            borderRadius: 14
          }}
        >
          {({ pressed }) => (
            <>
              <PressFill pressed={pressed} color={colors['surface-pressed']} radius={14} />
              <SymbolView
                name="checkmark.shield.fill"
                size={symbolSize(18)}
                weight="semibold"
                tintColor={colors.accent}
                accessible={false}
              />
              <TurnText kind="headline" boldText={boldText} style={{ flexShrink: 1, color: colors.accent }}>
                {step.privacyNotice}
              </TurnText>
            </>
          )}
        </Pressable>
      </ScrollView>
      {/* Allow and Not now carry equal weight (CONSENT-1): one size and style side by side, stacked from AX1. Where the
          step scrolls, its words fade into the board above them rather than stopping at a hard line. */}
      <View style={{ flexDirection: stacked ? 'column' : 'row', paddingHorizontal: 16, paddingTop: 8, gap: 12 }}>
        <View pointerEvents="none" style={{ position: 'absolute', top: -16, left: 0, right: 0, height: 16 }}>
          <EdgeFade side="bottom" size={16} token="board" increaseContrast={increaseContrast} />
        </View>
        <Button
          label={step.allow}
          boldText={boldText}
          disabled={disabled}
          onPress={() => void consent?.allow()}
          style={stacked ? undefined : { flex: 1 }}
        />
        <Button
          label={step.notNow}
          boldText={boldText}
          disabled={disabled}
          onPress={() => consent?.notNow()}
          style={stacked ? undefined : { flex: 1 }}
        />
      </View>
    </SafeAreaView>
  )
}
