import { useEffect, useRef, useState } from 'react'
import { SymbolView } from 'expo-symbols'
import { AccessibilityInfo, Animated, Pressable, View } from 'react-native'
import { colors, typography } from '../constants/theme'
import type { homeLayout } from './home-layout'
import TurnText from './TurnText'

type Reply = { id: string; text: string }

const phraseColorTokens = {
  yes: { fill: 'yes-fill', edge: 'yes-edge' },
  no: { fill: 'no-fill', edge: 'no-edge' },
  'not-sure': { fill: 'unsure-fill', edge: 'unsure-edge' }
} as const

export function phraseColorTokensForId(id: string) {
  return phraseColorTokens[id as keyof typeof phraseColorTokens] ?? null
}

type Props = {
  layout: ReturnType<typeof homeLayout>
  width: number
  boldText: boolean
  slots?: readonly (Reply | null)[]
  bigButton?: Reply | null
  emptyNote?: string
  activePhraseId?: string | null
  onInteractionChange?: (pressed: boolean) => void
  onSpeak: (reply: Reply) => void
}

function ReplySlot({
  reply,
  width,
  height,
  short,
  boldText,
  activePhraseId,
  reduceMotion,
  onInteractionChange,
  onSpeak
}: {
  reply: Reply | null | undefined
  width: number
  height: number
  short: boolean
  boldText: boolean
  activePhraseId?: string | null
  reduceMotion: boolean
  onInteractionChange?: (pressed: boolean) => void
  onSpeak: (reply: Reply) => void
}) {
  const [shown, setShown] = useState(reply)
  const [pressed, setPressed] = useState(false)
  const pressing = useRef(false)
  const opacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (pressed) return
    if (shown?.id === reply?.id && shown?.text === reply?.text) return
    opacity.stopAnimation()
    if (reduceMotion || !reply) {
      setShown(reply)
      opacity.setValue(1)
      return
    }
    Animated.timing(opacity, { toValue: 0, duration: 75, useNativeDriver: true }).start(({ finished }) => {
      if (!finished || pressing.current) return
      setShown(reply)
      Animated.timing(opacity, { toValue: 1, duration: 75, useNativeDriver: true }).start()
    })
    return () => opacity.stopAnimation()
  }, [reply?.id, reply?.text, reduceMotion, opacity, pressed])

  const tokens = shown ? phraseColorTokensForId(shown.id) : null
  const length = shown?.text.length ?? 0
  const textKind =
    length > Math.floor(width / 3)
      ? 'subheadline-emphasized'
      : short || length > Math.floor(width / 5)
        ? 'headline'
        : 'title3-emphasized'
  return (
    <Animated.View style={{ width, height, opacity }}>
      {shown && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={shown.text}
          onPressIn={() => {
            pressing.current = true
            opacity.stopAnimation()
            opacity.setValue(1)
            setPressed(true)
            onInteractionChange?.(true)
          }}
          onPressOut={() => {
            pressing.current = false
            setPressed(false)
            onInteractionChange?.(false)
          }}
          onPress={() => onSpeak(shown)}
          style={({ pressed }) => ({
            width,
            height,
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: tokens ? colors[tokens.edge] : colors.edge,
            borderRadius: 12,
            padding: short ? 10 : 12,
            backgroundColor: pressed ? colors['surface-pressed'] : tokens ? colors[tokens.fill] : colors.surface
          })}
        >
          <TurnText
            kind={textKind}
            boldText={boldText}
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ color: colors.ink }}
          >
            {shown.text}
          </TurnText>
          {activePhraseId === shown.id && (
            <SymbolView
              name="speaker.wave.2"
              size={16}
              tintColor={colors.ink}
              accessible={false}
              style={{ position: 'absolute', top: 8, right: 8 }}
            />
          )}
        </Pressable>
      )}
    </Animated.View>
  )
}

export default function ReplyRow({
  layout,
  width,
  boldText,
  slots = [],
  bigButton,
  emptyNote,
  activePhraseId,
  onInteractionChange,
  onSpeak
}: Props) {
  const slotWidth = layout.rowColumns === 2 ? (width - 32 - layout.rowGap) / 2 : width - 32
  const empty = !bigButton && slots.every((reply) => !reply)
  const [reduceMotion, setReduceMotion] = useState(true)

  useEffect(() => {
    let active = true
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (active) setReduceMotion(value)
    })
    const listener = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion)
    return () => {
      active = false
      listener.remove()
    }
  }, [])

  return (
    <View style={{ height: layout.rowHeight, marginHorizontal: 16 }}>
      {bigButton ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={bigButton.text}
          onPressIn={() => onInteractionChange?.(true)}
          onPressOut={() => onInteractionChange?.(false)}
          onPress={() => onSpeak(bigButton)}
          style={({ pressed }) => ({
            height: layout.rowHeight,
            borderRadius: 16,
            backgroundColor: pressed ? colors['accent-pressed'] : colors.accent,
            padding: 16
          })}
        >
          <TurnText
            kind="title1-emphasized"
            boldText={boldText}
            numberOfLines={4}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
            minimumFontScale={typography['title3-emphasized'].fontSize / typography['title1-emphasized'].fontSize}
            style={{ color: colors['on-accent'] }}
          >
            {bigButton.text}
          </TurnText>
          {activePhraseId === bigButton.id && (
            <SymbolView name="speaker.wave.2" size={18} tintColor={colors['on-accent']} accessible={false} />
          )}
        </Pressable>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: layout.rowGap }}>
          {Array.from({ length: 6 }, (_, index) => (
            <ReplySlot
              key={index}
              reply={slots[index]}
              width={slotWidth}
              height={layout.slotHeight}
              short={layout.short}
              boldText={boldText}
              activePhraseId={activePhraseId}
              reduceMotion={reduceMotion}
              onInteractionChange={onInteractionChange}
              onSpeak={onSpeak}
            />
          ))}
        </View>
      )}
      {empty && (
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
          <TurnText
            kind="subheadline"
            boldText={boldText}
            style={{ color: colors['ink-secondary'], textAlign: 'center' }}
          >
            {emptyNote ?? 'Replies to your partner appear here.'}
          </TurnText>
        </View>
      )}
    </View>
  )
}
