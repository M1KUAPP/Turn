import { SymbolView } from 'expo-symbols'
import {
  Pressable,
  StyleSheet,
  View,
  type AccessibilityActionEvent,
  type AccessibilityActionInfo,
  type ColorValue
} from 'react-native'
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue
} from 'react-native-reanimated'
import { colors } from '../constants/theme'
import { phraseColorTokensForId } from './category-palette'
import { useDepth } from './home-depth'
import TurnText from './TurnText'

const fixedSymbols = { yes: 'checkmark', no: 'xmark', 'not-sure': 'questionmark.circle' } as const

// The speaking symbol's size, and its chip, 5 points around it and 6 in from the corner.
const markSize = (fontScale: number) => Math.round(18 * Math.min(fontScale, 2))

/** The room a card's words always leave at their end for the speaking symbol's chip, past the card's own padding, so
 * the chip never covers a word and the words never reflow when speaking starts or stops. */
export const speakingRoom = (fontScale: number, short: boolean) => markSize(fontScale) + 16 - (short ? 10 : 16)

type Props = {
  id: string
  text: string
  palette: { fill: ColorValue; edge: ColorValue }
  speaking: boolean
  kind: 'phrase' | 'button'
  short: boolean
  boldText: boolean
  fontScale: number
  reduceMotion: boolean
  numberOfLines?: number
  height?: number
  minHeight?: number
  grow?: boolean
  // The category's fill over the card, 0 to 1: a reply to the partner's line is Tinted (DESIGN, the phrase button).
  tint?: SharedValue<number>
  wordsStyle?: ReturnType<typeof useAnimatedStyle>
  accessibilityActions?: AccessibilityActionInfo[]
  onAccessibilityAction?: (event: AccessibilityActionEvent) => void
  onPressIn?: () => void
  onPressOut?: () => void
  onPress: () => void
}

/** A phrase card, in the row and the grid: Plain on `surface` with its category's edge, Tinted with the category's
 * fill, Pressed on `surface-pressed` with a 2.5 edge from touch-down, and Speaking on `accent-soft` with an `accent`
 * edge and a waveform pinned to its corner. Yes, No, and Not sure keep their own fills behind a symbol disc. The card
 * never moves or scales; a press changes its fill and edge only. */
export default function PhraseCard({
  id,
  text,
  palette,
  speaking,
  kind,
  short,
  boldText,
  fontScale,
  reduceMotion,
  numberOfLines,
  height,
  minHeight,
  grow,
  tint,
  wordsStyle,
  accessibilityActions,
  onAccessibilityAction,
  onPressIn,
  onPressOut,
  onPress
}: Props) {
  const depth = useDepth()
  const pressed = useSharedValue(0)
  const pressStyle = useAnimatedStyle(() => ({ opacity: pressed.value }))
  const tintStyle = useAnimatedStyle(() => ({ opacity: tint ? tint.value : 0 }))
  const tokens = phraseColorTokensForId(id)
  const fixed = tokens ? (id as keyof typeof fixedSymbols) : null
  const edge = tokens ? colors[tokens.edge] : palette.edge
  const scale = Math.min(fontScale, 2)
  const disc = Math.round(40 * scale)
  const mark = markSize(fontScale)

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityActions={accessibilityActions}
      onAccessibilityAction={onAccessibilityAction}
      onPressIn={() => {
        pressed.value = 1
        onPressIn?.()
      }}
      onPressOut={() => {
        // A fill change isn't motion, so the release keeps its 120 ms under Reduce Motion (plan 0044's table).
        pressed.value = withTiming(0, { duration: 120, reduceMotion: ReduceMotion.Never })
        onPressOut?.()
      }}
      onPress={onPress}
      style={{
        height,
        minHeight,
        flexGrow: grow ? 1 : undefined,
        justifyContent: 'center',
        paddingHorizontal: short ? 10 : 16,
        paddingVertical: short ? 10 : 12,
        borderRadius: 20,
        boxShadow: depth.card
      }}
    >
      <View
        style={[
          styles.layer,
          {
            backgroundColor: tokens ? colors[tokens.fill] : colors.surface,
            borderColor: edge,
            borderWidth: tokens ? 2.5 : 1.5
          }
        ]}
      />
      {tint && !tokens && (
        <Animated.View
          style={[styles.layer, { backgroundColor: palette.fill, borderColor: edge, borderWidth: 1.5 }, tintStyle]}
        />
      )}
      {speaking && (
        <View
          style={[
            styles.layer,
            { backgroundColor: colors['accent-soft'], borderColor: colors.accent, borderWidth: 2.5 }
          ]}
        />
      )}
      <Animated.View
        style={[
          styles.layer,
          {
            backgroundColor: colors['surface-pressed'],
            borderColor: speaking ? colors.accent : edge,
            borderWidth: 2.5
          },
          pressStyle
        ]}
      />
      <Animated.View
        style={[
          { flexDirection: 'row', alignItems: 'center', gap: 12, paddingRight: speakingRoom(fontScale, short) },
          wordsStyle
        ]}
      >
        {fixed && (
          <View
            style={{
              width: disc,
              height: disc,
              borderRadius: disc / 2,
              backgroundColor: edge,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SymbolView
              name={fixedSymbols[fixed]}
              size={Math.round(disc / 2)}
              weight="semibold"
              tintColor={colors.surface}
              accessible={false}
            />
          </View>
        )}
        <TurnText
          kind={fixed === 'yes' || fixed === 'no' ? 'phrase-yes-no' : kind}
          boldText={boldText}
          numberOfLines={numberOfLines}
          ellipsizeMode="tail"
          style={{ color: colors.ink, flexShrink: 1 }}
        >
          {text}
        </TurnText>
      </Animated.View>
      {speaking && (
        // Pinned to the corner on a chip of the card's fill, in the room the words leave for it.
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            right: 6,
            bottom: 6,
            width: mark + 10,
            height: mark + 10,
            borderRadius: 14,
            backgroundColor: colors['accent-soft'],
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <SymbolView
            name="waveform"
            size={mark}
            weight="semibold"
            tintColor={colors.ink}
            accessible={false}
            animationSpec={reduceMotion ? undefined : { repeating: true, variableAnimationSpec: { iterative: true } }}
          />
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  layer: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, borderRadius: 20 }
})
