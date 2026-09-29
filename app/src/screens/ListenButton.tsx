import { useEffect, type ReactNode } from 'react'
import { SymbolView } from 'expo-symbols'
import { Pressable, StyleSheet, View, type ColorValue } from 'react-native'
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { colors } from '../constants/theme'
import { listeningGlow } from './home-depth'
import { Layer, usePress } from './home-press'
import type { ListenControl } from './listen-control'
import TurnText from './TurnText'

type Props = {
  control: ListenControl
  micOn: boolean
  disabled: boolean
  boldText: boolean
  fontScale: number
  reduceMotion: boolean
  // From AX3 the controls fill their row.
  fill: boolean
  height: number
  onPress: () => void
  onEnd: () => void
}

function looks(control: ListenControl, disabled: boolean) {
  const ink = disabled ? colors['ink-secondary'] : colors.ink
  if (control.action === 'unlock') return { fill: colors['accent-soft'], edge: colors.accent, ink }
  if (control.action === 'resume') return { fill: colors['listen-soft'], edge: colors.listen, ink }
  if (control.action === null)
    return { fill: colors['surface-sunken'], edge: colors.edge, ink: colors['ink-secondary'] }
  return { fill: colors.surface, edge: colors.edge, ink }
}

function Capsule({
  pressStyle,
  fill,
  edge,
  height,
  children
}: {
  // Null for a control that can't be pressed.
  pressStyle: ReturnType<typeof usePress>['style'] | null
  fill: ColorValue
  edge: ColorValue
  height: number
  children: ReactNode
}) {
  return (
    <View
      style={{
        minHeight: height,
        minWidth: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingHorizontal: 13.5,
        paddingVertical: 4,
        borderRadius: 999
      }}
    >
      <Layer fill={fill} edge={edge} edgeWidth={1.5} radius={999} />
      {pressStyle && (
        // The edge thickens on press under the words, so nothing under the finger moves.
        <Layer fill={colors['surface-pressed']} edge={edge} edgeWidth={2.5} radius={999} style={pressStyle} />
      )}
      {children}
    </View>
  )
}

/** The top bar's Listen control (DESIGN, the Listen control): Off with the free lines on a `listen-soft` pill, the
 * orange Listening capsule with its light, Paused and Mic off each with End beside them, and Locked with Unlock. */
export default function ListenButton({
  control,
  micOn,
  disabled,
  boldText,
  fontScale,
  reduceMotion,
  fill,
  height,
  onPress,
  onEnd
}: Props) {
  const look = looks(control, disabled)
  const scale = Math.min(fontScale, 2.6)
  const locked = control.action === 'unlock'
  const lit = useSharedValue(micOn ? 1 : 0)
  const press = usePress()
  const endPress = usePress()

  // Listening starts (plan 0044's motion): the orange capsule fades in over its unlit face in 400 ms, or at once under
  // Reduce Motion; it goes out at once.
  useEffect(() => {
    lit.value =
      micOn && !reduceMotion ? withTiming(1, { duration: 400, reduceMotion: ReduceMotion.Never }) : micOn ? 1 : 0
  }, [micOn, reduceMotion, lit])
  const litStyle = useAnimatedStyle(() => ({ opacity: lit.value }))

  const face = (ink: ColorValue) => (
    <>
      {control.symbol ? (
        <SymbolView
          name={control.symbol}
          size={Math.round(18 * scale)}
          weight="semibold"
          tintColor={ink}
          accessible={false}
        />
      ) : (
        // The light: while the microphone is on, the capsule carries a lamp in place of a symbol (CONSENT-5).
        <View
          style={{
            width: Math.round(16 * scale),
            height: Math.round(16 * scale),
            borderRadius: 999,
            backgroundColor: ink
          }}
        />
      )}
      <TurnText kind="button" boldText={boldText} style={{ color: ink, flexShrink: 1 }}>
        {control.word}
      </TurnText>
      {control.detail && (
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 999,
            backgroundColor: locked ? colors.accent : colors['listen-soft']
          }}
        >
          <TurnText
            kind="caption"
            boldText={boldText}
            style={{ color: locked ? colors['on-accent'] : colors.listen, fontVariant: ['tabular-nums'] }}
          >
            {control.detail}
          </TurnText>
        </View>
      )}
    </>
  )

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: fill ? 'wrap' : 'nowrap',
        gap: 8,
        alignItems: fill ? 'stretch' : 'center'
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={control.word}
        accessibilityValue={control.detail ? { text: control.detail } : undefined}
        accessibilityHint={control.hint}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPressIn={press.onPressIn}
        onPressOut={press.onPressOut}
        onPress={onPress}
        style={{ flexGrow: fill ? 1 : 0 }}
      >
        <View>
          <Capsule pressStyle={disabled ? null : press.style} fill={look.fill} edge={look.edge} height={height}>
            {face(look.ink)}
          </Capsule>
          {micOn && (
            <Animated.View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  paddingHorizontal: 13.5,
                  borderRadius: 999,
                  backgroundColor: colors.listen,
                  boxShadow: listeningGlow
                },
                litStyle
              ]}
            >
              {/* Pressed, the orange capsule takes a 2.5 `ink` edge, as it has no darker orange. */}
              <Layer edge={colors.ink} edgeWidth={2.5} radius={999} style={press.style} />
              {face(colors['on-listen'])}
            </Animated.View>
          )}
        </View>
      </Pressable>
      {control.showsEnd && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="End"
          accessibilityHint="Ends Listen mode."
          onPressIn={endPress.onPressIn}
          onPressOut={endPress.onPressOut}
          onPress={onEnd}
          style={{ flexGrow: fill ? 1 : 0 }}
        >
          <Capsule pressStyle={endPress.style} fill={colors.surface} edge={colors.edge} height={height}>
            <TurnText kind="button" boldText={boldText} style={{ color: colors.ink }}>
              End
            </TurnText>
          </Capsule>
        </Pressable>
      )}
    </View>
  )
}
