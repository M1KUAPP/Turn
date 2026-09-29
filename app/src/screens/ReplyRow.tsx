import { useEffect, useRef, useState } from 'react'
import { SymbolView } from 'expo-symbols'
import { AccessibilityInfo, Pressable, StyleSheet, View } from 'react-native'
import Animated, {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated'
import { categoryColors, colors, typography } from '../constants/theme'
import { categoryPalette, categorySymbol } from './category-palette'
import { bigRing, bigSheen, useDepth, useSystemSetting } from './home-depth'
import { slotTextKind, type homeLayout } from './home-layout'
import PhraseCard from './PhraseCard'
import StarterReviewCard from './StarterReviewCard'
import TurnText from './TurnText'

export type Reply = { id: string; text: string; categoryId?: string }
type Category = { id: string; name: string }

type Props = {
  layout: ReturnType<typeof homeLayout>
  width: number
  fontScale: number
  boldText: boolean
  reduceMotion: boolean
  categories: readonly Category[]
  // Replies to the partner's lines are Tinted; typing's matches stay Plain (DESIGN, the phrase button).
  tinted: boolean
  slots?: readonly (Reply | null)[]
  bigButton?: Reply | null
  starterCard?: { onReview: () => void; onDismiss: () => void } | null
  emptyNote?: string
  activePhraseId?: string | null
  onInteractionChange?: (pressed: boolean) => void
  onSpeak: (reply: Reply) => void
}

const easeOut = (duration: number) => ({
  duration,
  easing: Easing.out(Easing.cubic),
  reduceMotion: ReduceMotion.System
})

const paletteFor = (reply: Reply, categories: readonly Category[]) =>
  reply.categoryId ? categoryPalette(reply.categoryId, categories) : categoryColors.quick

function ReplySlot({
  reply,
  index,
  width,
  height,
  short,
  tinted,
  categories,
  fontScale,
  boldText,
  reduceMotion,
  activePhraseId,
  onInteractionChange,
  onSpeak
}: {
  reply: Reply | null | undefined
  index: number
  width: number
  height: number
  short: boolean
  tinted: boolean
  categories: readonly Category[]
  fontScale: number
  boldText: boolean
  reduceMotion: boolean
  activePhraseId?: string | null
  onInteractionChange?: (pressed: boolean) => void
  onSpeak: (reply: Reply) => void
}) {
  const [shown, setShown] = useState(reply)
  const [pressed, setPressed] = useState(false)
  const pressing = useRef(false)
  const card = useSharedValue(reply ? 1 : 0)
  const words = useSharedValue(1)
  const rise = useSharedValue(0)
  const tint = useSharedValue(tinted ? 1 : 0)

  // Replies arriving (plan 0044's motion): in a changed slot the old words fade out in 90 ms, the new fade in over
  // 180 ms rising 4 points, and the tint fills over 240 ms, slots 40 ms apart in reading order. The slot's frame never
  // moves, nothing changes under a finger, and Reduce Motion swaps at once.
  useEffect(() => {
    if (pressed) return
    if (shown?.id === reply?.id && shown?.text === reply?.text) return
    const fill = tinted ? 1 : 0
    const delay = 40 * index
    if (reduceMotion || !reply) {
      setShown(reply)
      card.value = reply ? 1 : 0
      words.value = 1
      rise.value = 0
      tint.value = fill
      return
    }
    if (!shown) {
      setShown(reply)
      words.value = 1
      card.value = 0
      rise.value = 4
      tint.value = 0
      card.value = withDelay(delay, withTiming(1, easeOut(180)))
      rise.value = withDelay(delay, withTiming(0, easeOut(180)))
      tint.value = withDelay(delay, withTiming(fill, easeOut(240)))
      return
    }
    words.value = withDelay(delay, withTiming(0, { duration: 90, reduceMotion: ReduceMotion.System }))
    const timer = setTimeout(() => {
      if (pressing.current) return
      setShown(reply)
      rise.value = 4
      tint.value = 0
      words.value = withTiming(1, easeOut(180))
      rise.value = withTiming(0, easeOut(180))
      tint.value = withTiming(fill, easeOut(240))
    }, delay + 90)
    return () => clearTimeout(timer)
    // Keyed on the words, not the objects, which the session rebuilds as captions arrive.
  }, [reply?.id, reply?.text, shown?.id, shown?.text, pressed, reduceMotion])

  useEffect(() => {
    tint.value = tinted ? 1 : 0
  }, [tinted, tint])

  const cardStyle = useAnimatedStyle(() => ({ opacity: card.value }))
  const wordsStyle = useAnimatedStyle(() => ({ opacity: words.value, transform: [{ translateY: rise.value }] }))

  return (
    <Animated.View style={[{ width, height }, cardStyle]}>
      {shown && (
        <PhraseCard
          id={shown.id}
          text={shown.text}
          palette={paletteFor(shown, categories)}
          speaking={activePhraseId === shown.id}
          kind={slotTextKind(shown.text.length, width - (short ? 23 : 35), fontScale, short)}
          short={short}
          boldText={boldText}
          fontScale={fontScale}
          reduceMotion={reduceMotion}
          numberOfLines={2}
          height={height}
          tint={tint}
          wordsStyle={wordsStyle}
          onPressIn={() => {
            pressing.current = true
            for (const value of [card, words, rise]) cancelAnimation(value)
            card.value = 1
            words.value = 1
            rise.value = 0
            setPressed(true)
            onInteractionChange?.(true)
          }}
          onPressOut={() => {
            pressing.current = false
            setPressed(false)
            onInteractionChange?.(false)
          }}
          onPress={() => onSpeak(shown)}
        />
      )}
    </Animated.View>
  )
}

/** The one confident reply, filling the row's frame (DESIGN, the row): marker blue, its category as a tag, the speaker
 * mark, and a sheen and ring that Increase Contrast hides. */
function BigReply({
  reply,
  categories,
  fontScale,
  boldText,
  reduceMotion,
  speaking,
  onInteractionChange,
  onSpeak
}: {
  reply: Reply
  categories: readonly Category[]
  fontScale: number
  boldText: boolean
  reduceMotion: boolean
  speaking: boolean
  onInteractionChange?: (pressed: boolean) => void
  onSpeak: (reply: Reply) => void
}) {
  const depth = useDepth()
  const increaseContrast = useSystemSetting(AccessibilityInfo.isDarkerSystemColorsEnabled, 'darkerSystemColorsChanged')
  const pressed = useSharedValue(0)
  const pressStyle = useAnimatedStyle(() => ({ opacity: pressed.value }))
  const category = categories.find((candidate) => candidate.id === reply.categoryId)
  const scale = Math.min(fontScale, 2)

  return (
    <View style={{ flex: 1, borderRadius: 28, boxShadow: depth.big }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={reply.text}
        onPressIn={() => {
          pressed.value = 1
          onInteractionChange?.(true)
        }}
        onPressOut={() => {
          pressed.value = withTiming(0, { duration: 120, reduceMotion: ReduceMotion.Never })
          onInteractionChange?.(false)
        }}
        onPress={() => onSpeak(reply)}
        style={{
          flex: 1,
          borderRadius: 28,
          overflow: 'hidden',
          backgroundColor: colors.accent,
          paddingHorizontal: 22,
          paddingVertical: 16
        }}
      >
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors['accent-pressed'] }, pressStyle]} />
        {!increaseContrast && (
          <>
            <View pointerEvents="none" style={[StyleSheet.absoluteFill, { experimental_backgroundImage: bigSheen }]} />
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                right: -149,
                bottom: -131,
                width: 290,
                height: 290,
                borderRadius: 145,
                borderWidth: 27,
                borderColor: bigRing
              }}
            />
          </>
        )}
        {category && (
          <View
            style={{
              alignSelf: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 10,
              paddingVertical: 7,
              borderRadius: 999,
              backgroundColor: colors['accent-tag']
            }}
          >
            <SymbolView
              name={categorySymbol(category.id)}
              size={Math.round(14 * scale)}
              weight="semibold"
              tintColor={colors['on-accent']}
              accessible={false}
            />
            <TurnText kind="caption" boldText={boldText} style={{ color: colors['on-accent'] }}>
              {category.name}
            </TurnText>
          </View>
        )}
        <View style={{ flex: 1, justifyContent: 'center', paddingBottom: category ? 30 : 0 }}>
          <TurnText
            kind="phrase-big"
            boldText={boldText}
            numberOfLines={4}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
            minimumFontScale={typography.phrase.fontSize / typography['phrase-big'].fontSize}
            style={{ color: colors['on-accent'] }}
          >
            {reply.text}
          </TurnText>
        </View>
        <SymbolView
          name={speaking ? 'waveform' : 'speaker.wave.2.fill'}
          size={Math.round(26 * scale)}
          weight="semibold"
          tintColor={colors['on-accent']}
          accessible={false}
          animationSpec={
            speaking && !reduceMotion ? { repeating: true, variableAnimationSpec: { iterative: true } } : undefined
          }
          style={{ position: 'absolute', right: 24, bottom: 24, opacity: speaking ? 1 : 0.75 }}
        />
      </Pressable>
    </View>
  )
}

export default function ReplyRow({
  layout,
  width,
  fontScale,
  boldText,
  reduceMotion,
  categories,
  tinted,
  slots = [],
  bigButton,
  starterCard,
  emptyNote,
  activePhraseId,
  onInteractionChange,
  onSpeak
}: Props) {
  const slotWidth = layout.rowColumns === 2 ? (width - 32 - layout.rowGap) / 2 : width - 32
  const empty = !bigButton && slots.every((reply) => !reply)
  // The big reply keeps its words while it fades out.
  const [lastBig, setLastBig] = useState(bigButton ?? null)
  const big = useSharedValue(bigButton ? 1 : 0)
  const shownBig = bigButton ?? lastBig

  // The big reply: the six slots cross-fade into the one card in the same frame, over 200 ms, or at once under Reduce
  // Motion.
  useEffect(() => {
    if (bigButton) setLastBig(bigButton)
    const target = bigButton ? 1 : 0
    big.value = reduceMotion ? target : withTiming(target, easeOut(200))
  }, [bigButton, reduceMotion, big])

  const slotsStyle = useAnimatedStyle(() => ({ opacity: 1 - big.value }))
  const bigStyle = useAnimatedStyle(() => ({ opacity: big.value }))

  return (
    <View style={{ height: layout.rowHeight, marginHorizontal: 16 }}>
      {empty && starterCard ? (
        <StarterReviewCard
          boldText={boldText}
          short={layout.short}
          onReview={starterCard.onReview}
          onDismiss={starterCard.onDismiss}
        />
      ) : (
        <>
          <Animated.View
            pointerEvents={bigButton ? 'none' : 'auto'}
            accessibilityElementsHidden={Boolean(bigButton)}
            importantForAccessibility={bigButton ? 'no-hide-descendants' : 'auto'}
            style={[
              StyleSheet.absoluteFill,
              { flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start', gap: layout.rowGap },
              slotsStyle
            ]}
          >
            {Array.from({ length: 6 }, (_, index) => (
              <ReplySlot
                key={index}
                reply={slots[index]}
                index={index}
                width={slotWidth}
                height={layout.slotHeight}
                short={layout.short}
                tinted={tinted}
                categories={categories}
                fontScale={fontScale}
                boldText={boldText}
                reduceMotion={reduceMotion}
                activePhraseId={activePhraseId}
                onInteractionChange={onInteractionChange}
                onSpeak={onSpeak}
              />
            ))}
          </Animated.View>
          {shownBig && (
            <Animated.View
              pointerEvents={bigButton ? 'auto' : 'none'}
              accessibilityElementsHidden={!bigButton}
              importantForAccessibility={bigButton ? 'auto' : 'no-hide-descendants'}
              style={[StyleSheet.absoluteFill, bigStyle]}
            >
              <BigReply
                reply={shownBig}
                categories={categories}
                fontScale={fontScale}
                boldText={boldText}
                reduceMotion={reduceMotion}
                speaking={activePhraseId === shownBig.id}
                onInteractionChange={onInteractionChange}
                onSpeak={onSpeak}
              />
            </Animated.View>
          )}
        </>
      )}
      {empty && !starterCard && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            // The first two slots' space: one band across two columns, or two stacked slots in one column.
            height: layout.rowColumns === 2 ? layout.slotHeight : 2 * layout.slotHeight + layout.rowGap,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 12
          }}
        >
          <TurnText kind="label" boldText={boldText} style={{ color: colors['ink-secondary'], textAlign: 'center' }}>
            {emptyNote ?? 'Replies to your partner appear here.'}
          </TurnText>
        </View>
      )}
    </View>
  )
}
