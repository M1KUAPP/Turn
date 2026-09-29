import { useEffect, useState, type ReactNode } from 'react'
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect'
import { SymbolView } from 'expo-symbols'
import { Pressable, StyleSheet, View, type ColorValue } from 'react-native'
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { colors } from '../constants/theme'
import { useDepth } from './home-depth'
import { toolbarLayout, type ToolbarItem } from './home-layout'
import TurnText from './TurnText'

type Props = {
  width: number
  fontScale: number
  boldText: boolean
  reduceMotion: boolean
  reduceTransparency: boolean
  speaking: boolean
  canRepeat: boolean
  canPageUp: boolean
  canPageDown: boolean
  onType: () => void
  onRepeat: () => void
  onStop: () => void
  onPageUp: () => void
  onPageDown: () => void
}

const labels: Record<ToolbarItem, string> = { type: 'Type', repeat: 'Repeat', up: 'Up', down: 'Down' }
const icons = { type: 'keyboard', repeat: 'arrow.counterclockwise', up: 'chevron.up', down: 'chevron.down' } as const

function PillFace({
  icon,
  label,
  stacked,
  symbol,
  fill,
  ink,
  edge,
  pressed,
  boldText
}: {
  icon: (typeof icons)[ToolbarItem] | 'stop.fill'
  label: string
  stacked: boolean
  symbol: number
  fill: ColorValue
  ink: ColorValue
  edge: ColorValue | null
  pressed: boolean
  boldText: boolean
}) {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          flexDirection: stacked ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: stacked ? 3 : 6,
          borderRadius: 999,
          borderWidth: edge ? (pressed ? 2.5 : 1.5) : 0,
          borderColor: edge ?? undefined,
          backgroundColor: fill
        }
      ]}
    >
      <SymbolView name={icon} size={symbol} weight="semibold" tintColor={ink} accessible={false} />
      <TurnText kind="caption" boldText={boldText} style={{ color: ink }}>
        {label}
      </TurnText>
    </View>
  )
}

/** The floating bottom bar (DESIGN, the bottom bar): a glass capsule, opaque `surface` under Reduce Transparency, whose
 * items each sit on a solid pill, so no label is ever on the glass: Type on `accent`, and Repeat, Up, and Down on
 * `surface` with an `edge`, Repeat turning into Stop on `ink` while Turn speaks. */
export default function Toolbar({
  width,
  fontScale,
  boldText,
  reduceMotion,
  reduceTransparency,
  speaking,
  canRepeat,
  canPageUp,
  canPageDown,
  onType,
  onRepeat,
  onStop,
  onPageUp,
  onPageDown
}: Props) {
  const depth = useDepth()
  const [measured, setMeasured] = useState<Partial<Record<ToolbarItem, { width: number; height: number }>>>({})
  const scale = Math.min(fontScale, 2.6)
  const symbol = Math.round(20 * scale)
  // Until the labels are measured, estimate them at about 0.6 of an em a character.
  const widths = Object.fromEntries(
    (Object.keys(labels) as ToolbarItem[]).map((item) => [
      item,
      measured[item]?.width ?? labels[item].length * 12 * fontScale * 0.6
    ])
  ) as Record<ToolbarItem, number>
  const layout = toolbarLayout(widths, symbol, width - 32 - 14)
  const labelHeight = measured.type?.height ?? Math.ceil(16 * fontScale)
  const pillHeight = layout.stacked
    ? Math.max(52, symbol + 3 + labelHeight + 12)
    : Math.max(52, Math.max(symbol, labelHeight) + 12)
  const stop = useSharedValue(speaking ? 1 : 0)

  // Speaking: Repeat cross-fades to Stop in 150 ms, or switches at once under Reduce Motion.
  useEffect(() => {
    stop.value = reduceMotion
      ? speaking
        ? 1
        : 0
      : withTiming(speaking ? 1 : 0, { duration: 150, reduceMotion: ReduceMotion.Never })
  }, [speaking, reduceMotion, stop])
  const stopStyle = useAnimatedStyle(() => ({ opacity: stop.value }))

  const pill = (item: ToolbarItem): ReactNode => {
    const repeat = item === 'repeat'
    const disabled =
      item === 'repeat' ? !speaking && !canRepeat : item === 'up' ? !canPageUp : item === 'down' ? !canPageDown : false
    const label = repeat && speaking ? 'Stop' : labels[item]
    const action =
      item === 'type'
        ? onType
        : item === 'repeat'
          ? speaking
            ? onStop
            : onRepeat
          : item === 'up'
            ? onPageUp
            : onPageDown
    return (
      <Pressable
        key={item}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={action}
        style={{
          width: layout.stacked ? layout.pillWidth : undefined,
          flexGrow: layout.stacked ? 0 : 1,
          minWidth: 44,
          height: pillHeight
        }}
      >
        {({ pressed }) => (
          <>
            <PillFace
              icon={icons[item]}
              label={labels[item]}
              stacked={layout.stacked}
              symbol={symbol}
              fill={
                item === 'type'
                  ? pressed
                    ? colors['accent-pressed']
                    : colors.accent
                  : pressed
                    ? colors['surface-pressed']
                    : colors.surface
              }
              ink={item === 'type' ? colors['on-accent'] : disabled ? colors['ink-secondary'] : colors.ink}
              edge={item === 'type' ? null : colors.edge}
              pressed={pressed}
              boldText={boldText}
            />
            {repeat && (
              <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, stopStyle]}>
                <PillFace
                  icon="stop.fill"
                  label="Stop"
                  stacked={layout.stacked}
                  symbol={symbol}
                  fill={colors.ink}
                  ink={colors.surface}
                  edge={null}
                  pressed={false}
                  boldText={boldText}
                />
              </Animated.View>
            )}
          </>
        )}
      </Pressable>
    )
  }

  const rows = layout.rows.map((row) => (
    <View
      key={row.join('-')}
      style={{ flexDirection: 'row', gap: 6, justifyContent: layout.stacked ? 'space-between' : 'flex-start' }}
    >
      {row.map(pill)}
    </View>
  ))
  const glass = isLiquidGlassAvailable() && !reduceTransparency
  const capsule = { borderRadius: 32, paddingHorizontal: 7, paddingVertical: 6, gap: 6 }

  return (
    <View style={{ marginHorizontal: 16, marginTop: 8, marginBottom: 2, borderRadius: 32, boxShadow: depth.raised }}>
      {/* Measures each label at its natural width, so the bar takes one row, or splits, without cutting a label. */}
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ position: 'absolute', top: 0, left: 0, width: 4000, flexDirection: 'row', opacity: 0 }}
      >
        {(Object.keys(labels) as ToolbarItem[]).map((item) => (
          <TurnText
            key={item}
            kind="caption"
            boldText={boldText}
            onLayout={({ nativeEvent }) => {
              const next = { width: Math.ceil(nativeEvent.layout.width), height: Math.ceil(nativeEvent.layout.height) }
              setMeasured((current) =>
                current[item]?.width === next.width && current[item]?.height === next.height
                  ? current
                  : { ...current, [item]: next }
              )
            }}
          >
            {labels[item]}
          </TurnText>
        ))}
      </View>
      {glass ? (
        <GlassView glassEffectStyle="regular" style={capsule}>
          {rows}
        </GlassView>
      ) : (
        <View style={[capsule, { backgroundColor: colors.surface }]}>{rows}</View>
      )}
    </View>
  )
}
