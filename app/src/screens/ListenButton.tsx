import type { ReactNode } from 'react'
import { SymbolView } from 'expo-symbols'
import { Pressable, View, type ColorValue } from 'react-native'
import { colors } from '../constants/theme'
import { listeningGlow } from './home-depth'
import type { ListenControl } from './listen-control'
import TurnText from './TurnText'

type Props = {
  control: ListenControl
  micOn: boolean
  disabled: boolean
  boldText: boolean
  fontScale: number
  // From AX3 the controls fill their row.
  fill: boolean
  height: number
  onPress: () => void
  onEnd: () => void
}

function looks(control: ListenControl, micOn: boolean, disabled: boolean) {
  const ink = disabled ? colors['ink-secondary'] : colors.ink
  if (micOn) return { fill: colors.listen, edge: colors.listen, ink: colors['on-listen'] }
  if (control.action === 'unlock') return { fill: colors['accent-soft'], edge: colors.accent, ink }
  if (control.action === 'resume') return { fill: colors['listen-soft'], edge: colors.listen, ink }
  if (control.action === null)
    return { fill: colors['surface-sunken'], edge: colors.edge, ink: colors['ink-secondary'] }
  return { fill: colors.surface, edge: colors.edge, ink }
}

function Capsule({
  pressed,
  fill,
  edge,
  height,
  glow,
  children
}: {
  pressed: boolean
  fill: ColorValue
  edge: ColorValue
  height: number
  glow: boolean
  children: ReactNode
}) {
  const edgeWidth = pressed ? 2.5 : 1.5
  return (
    <View
      style={{
        minHeight: height,
        minWidth: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        // The edge thickens on press inside the same outline, so nothing under the finger moves.
        paddingHorizontal: 13.5 - edgeWidth,
        paddingVertical: 4,
        borderRadius: 999,
        borderWidth: edgeWidth,
        borderColor: glow && pressed ? colors.ink : edge,
        backgroundColor: pressed && !glow ? colors['surface-pressed'] : fill,
        boxShadow: glow ? listeningGlow : undefined
      }}
    >
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
  fill,
  height,
  onPress,
  onEnd
}: Props) {
  const look = looks(control, micOn, disabled)
  const scale = Math.min(fontScale, 2.6)
  const locked = control.action === 'unlock'

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
        onPress={onPress}
        style={{ flexGrow: fill ? 1 : 0 }}
      >
        {({ pressed }) => (
          <Capsule pressed={pressed && !disabled} fill={look.fill} edge={look.edge} height={height} glow={micOn}>
            {control.symbol ? (
              <SymbolView
                name={control.symbol}
                size={Math.round(18 * scale)}
                weight="semibold"
                tintColor={look.ink}
                accessible={false}
              />
            ) : (
              // The light: while the microphone is on, the capsule carries a lamp in place of a symbol (CONSENT-5).
              <View
                style={{
                  width: Math.round(16 * scale),
                  height: Math.round(16 * scale),
                  borderRadius: 999,
                  backgroundColor: colors['on-listen']
                }}
              />
            )}
            <TurnText kind="button" boldText={boldText} style={{ color: look.ink, flexShrink: 1 }}>
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
          </Capsule>
        )}
      </Pressable>
      {control.showsEnd && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="End"
          accessibilityHint="Ends Listen mode."
          onPress={onEnd}
          style={{ flexGrow: fill ? 1 : 0 }}
        >
          {({ pressed }) => (
            <Capsule pressed={pressed} fill={colors.surface} edge={colors.edge} height={height} glow={false}>
              <TurnText kind="button" boldText={boldText} style={{ color: colors.ink }}>
                End
              </TurnText>
            </Capsule>
          )}
        </Pressable>
      )}
    </View>
  )
}
