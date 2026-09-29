import { useEffect, useState } from 'react'
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect'
import { SymbolView } from 'expo-symbols'
import { Pressable, StyleSheet, View, type ColorValue } from 'react-native'
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { colors } from '../constants/theme'
import { useDepth } from './home-depth'
import { toolbarLayout, type ToolbarItem } from './home-layout'
import { Layer, usePress } from './home-press'
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

// A pill's symbol above or beside its label.
function PillFace({
  icon,
  label,
  stacked,
  symbol,
  ink,
  boldText
}: {
  icon: (typeof icons)[ToolbarItem] | 'stop.fill'
  label: string
  stacked: boolean
  symbol: number
  ink: ColorValue
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
          gap: stacked ? 3 : 6
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

// One toolbar item on its pill. Pressed, Type's `accent` turns `accent-pressed`, Stop's `ink` turns `ink-secondary`,
// and the others turn `surface-pressed` with a 2.5 edge; each fades back over 120 ms.
function Pill({
  item,
  speaking,
  disabled,
  stacked,
  width,
  height,
  symbol,
  boldText,
  stopStyle,
  onPress
}: {
  item: ToolbarItem
  speaking: boolean
  disabled: boolean
  stacked: boolean
  width: number | undefined
  height: number
  symbol: number
  boldText: boolean
  stopStyle: ReturnType<typeof useAnimatedStyle>
  onPress: () => void
}) {
  const press = usePress()
  const type = item === 'type'
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item === 'repeat' && speaking ? 'Stop' : labels[item]}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onPress={onPress}
      style={{ width, flexGrow: stacked ? 0 : 1, minWidth: 44, height }}
    >
      <Layer
        fill={type ? colors.accent : colors.surface}
        edge={type ? undefined : colors.edge}
        edgeWidth={1.5}
        radius={999}
      />
      <Layer
        fill={type ? colors['accent-pressed'] : colors['surface-pressed']}
        edge={type ? undefined : colors.edge}
        edgeWidth={2.5}
        radius={999}
        style={press.style}
      />
      <PillFace
        icon={icons[item]}
        label={labels[item]}
        stacked={stacked}
        symbol={symbol}
        ink={type ? colors['on-accent'] : disabled ? colors['ink-secondary'] : colors.ink}
        boldText={boldText}
      />
      {item === 'repeat' && (
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, stopStyle]}>
          <Layer fill={colors.ink} radius={999} />
          <Layer fill={colors['ink-secondary']} radius={999} style={press.style} />
          <PillFace
            icon="stop.fill"
            label="Stop"
            stacked={stacked}
            symbol={symbol}
            ink={colors.surface}
            boldText={boldText}
          />
        </Animated.View>
      )}
    </Pressable>
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

  const pill = (item: ToolbarItem) => (
    <Pill
      key={item}
      item={item}
      speaking={speaking}
      disabled={
        item === 'repeat'
          ? !speaking && !canRepeat
          : item === 'up'
            ? !canPageUp
            : item === 'down'
              ? !canPageDown
              : false
      }
      stacked={layout.stacked}
      width={layout.stacked ? layout.pillWidth : undefined}
      height={pillHeight}
      symbol={symbol}
      boldText={boldText}
      stopStyle={stopStyle}
      onPress={
        item === 'type'
          ? onType
          : item === 'repeat'
            ? speaking
              ? onStop
              : onRepeat
            : item === 'up'
              ? onPageUp
              : onPageDown
      }
    />
  )

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
