import { SymbolView } from 'expo-symbols'
import { Children, Fragment, isValidElement, type ReactNode } from 'react'
import { Pressable, Switch, useWindowDimensions, View, type ColorValue } from 'react-native'
import { colors } from '../constants/theme'
import type { SymbolName } from './category-style'
import PressFill from './PressFill'
import TurnText from './TurnText'

/** A tile's fill and symbol color, by what its row means (DESIGN, buttons and lists). */
export type TileTone = { fill: ColorValue; ink: ColorValue }

export const tileTones = {
  accent: { fill: colors['accent-soft'], ink: colors.accent },
  listen: { fill: colors['listen-soft'], ink: colors.ink },
  neutral: { fill: colors['surface-sunken'], ink: colors.ink },
  danger: { fill: colors['no-fill'], ink: colors['no-edge'] }
} satisfies Record<string, TileTone>

// Tiles and symbols grow with the text only so far, so a large label keeps its room; labels wrap under values
// from AX1, as in iOS Settings.
export function useListMetrics() {
  const { fontScale } = useWindowDimensions()
  const grow = Math.min(fontScale, 1.5)
  return {
    stacked: fontScale >= 1.786,
    tile: Math.round(32 * grow),
    tileSymbol: Math.round(18 * grow),
    mark: Math.round(15 * Math.min(fontScale, 1.6))
  }
}

export function SymbolTile({ symbol, tone, size }: { symbol: SymbolName; tone: TileTone; size?: number }) {
  const metrics = useListMetrics()
  const tile = size ?? metrics.tile
  return (
    <View
      style={{
        width: tile,
        height: tile,
        borderRadius: Math.round(tile * 0.31),
        borderCurve: 'continuous',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tone.fill
      }}
    >
      <SymbolView
        name={symbol}
        size={Math.round(tile * 0.56)}
        weight="semibold"
        tintColor={tone.ink}
        accessible={false}
      />
    </View>
  )
}

/** A screen's title in `large-title`, in the content under iOS's bar, since the bar's own title can't take the
 * rounded face. */
export function ScreenTitle({ title, boldText }: { title: string; boldText: boolean }) {
  return (
    <TurnText
      kind="large-title"
      boldText={boldText}
      accessibilityRole="header"
      style={{ color: colors.ink, marginHorizontal: 4, marginBottom: -6 }}
    >
      {title}
    </TurnText>
  )
}

export function GroupHeader({ title, boldText }: { title: string; boldText: boolean }) {
  return (
    <TurnText
      kind="label"
      boldText={boldText}
      accessibilityRole="header"
      style={{ color: colors['ink-secondary'], marginHorizontal: 16, marginBottom: 8 }}
    >
      {title}
    </TurnText>
  )
}

export function GroupNote({ children, boldText }: { children: ReactNode; boldText: boolean }) {
  return (
    <TurnText
      kind="footnote"
      boldText={boldText}
      style={{ color: colors['ink-secondary'], marginHorizontal: 16, marginTop: 8 }}
    >
      {children}
    </TurnText>
  )
}

/** A row's tile and words: side by side, or from AX1 the tile above, so a long word keeps the row's width and
 * never breaks. */
export function TileLead({ symbol, tone, children }: { symbol?: SymbolName; tone: TileTone; children: ReactNode }) {
  const { stacked } = useListMetrics()
  if (!symbol) return <View style={{ flex: 1 }}>{children}</View>
  return (
    <View
      style={{
        flex: 1,
        flexDirection: stacked ? 'column' : 'row',
        alignItems: stacked ? 'stretch' : 'center',
        gap: stacked ? 8 : 12
      }}
    >
      <View style={{ alignSelf: stacked ? 'flex-start' : undefined }}>
        <SymbolTile symbol={symbol} tone={tone} />
      </View>
      <View style={{ flex: stacked ? undefined : 1 }}>{children}</View>
    </View>
  )
}

/** An inset group: a `surface` panel with a 1.5 `edge` and hairline dividers that start where the text does. */
export function ListGroup({ children, tiles = true }: { children: ReactNode; tiles?: boolean }) {
  const { tile, stacked } = useListMetrics()
  const rows = Children.toArray(children).filter(isValidElement)
  return (
    <View
      style={{
        borderRadius: 24,
        borderCurve: 'continuous',
        borderWidth: 1.5,
        borderColor: colors.edge,
        backgroundColor: colors.surface,
        overflow: 'hidden'
      }}
    >
      {rows.map((row, index) => (
        <Fragment key={row.key ?? index}>
          {index > 0 && (
            <View
              style={{
                height: 1,
                marginLeft: tiles && !stacked ? 16 + tile + 12 : 16,
                backgroundColor: colors.hairline
              }}
            />
          )}
          {row}
        </Fragment>
      ))}
    </View>
  )
}

type ListRowProps = {
  label: string
  boldText: boolean
  symbol?: SymbolName
  tone?: TileTone
  subtitle?: string
  value?: string
  onPress?: () => void
  chevron?: boolean
  checked?: boolean
  destructive?: boolean
  disabled?: boolean
  toggle?: { value: boolean; onValueChange: (value: boolean) => void; disabled?: boolean }
  accessibilityLabel?: string
  accessibilityValue?: string
  accessibilityHint?: string
}

/** Plan 0044's List row: Chevron, Toggle, Value, or None, at least 56 points tall, with a 32-point symbol tile. */
export function ListRow({
  label,
  boldText,
  symbol,
  tone = tileTones.accent,
  subtitle,
  value,
  onPress,
  chevron = false,
  checked,
  destructive = false,
  disabled = false,
  toggle,
  accessibilityLabel,
  accessibilityValue,
  accessibilityHint
}: ListRowProps) {
  const { stacked, mark } = useListMetrics()
  const enabled = !!onPress && !disabled
  const labelColor = destructive ? colors['no-edge'] : enabled || !onPress ? colors.ink : colors['ink-secondary']

  const text = (
    <View
      style={{
        flex: 1,
        flexDirection: stacked ? 'column' : 'row',
        alignItems: stacked ? 'flex-start' : 'center',
        gap: stacked ? 2 : 12
      }}
    >
      <View style={{ flex: stacked ? undefined : 1, gap: 2 }}>
        <TurnText kind="body" boldText={boldText} style={{ color: labelColor }}>
          {label}
        </TurnText>
        {subtitle && (
          <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
            {subtitle}
          </TurnText>
        )}
      </View>
      {value !== undefined && (
        <TurnText
          kind="body"
          boldText={boldText}
          style={{ color: colors['ink-secondary'], flexShrink: 1, textAlign: stacked ? 'left' : 'right' }}
        >
          {value}
        </TurnText>
      )}
    </View>
  )
  const rowStyle = {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10
  } as const

  if (toggle) {
    return (
      <View style={rowStyle}>
        {/* The switch carries the label, so VoiceOver and Voice Control find one element, as in iOS. */}
        <View style={{ flex: 1 }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <TileLead symbol={symbol} tone={tone}>
            {text}
          </TileLead>
        </View>
        <Switch
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={accessibilityHint}
          accessibilityState={{ disabled: !!toggle.disabled, checked: toggle.value }}
          value={toggle.value}
          onValueChange={toggle.onValueChange}
          disabled={toggle.disabled}
          trackColor={{ false: colors.edge, true: colors.accent }}
          thumbColor={colors.surface}
        />
      </View>
    )
  }

  const staticText = !onPress
  return (
    <Pressable
      accessibilityRole={staticText ? 'text' : 'button'}
      // Named explicitly: left to iOS, a trailing symbol adds its own name, such as "Forward".
      accessibilityLabel={accessibilityLabel ?? (value ? `${label}, ${value}` : label)}
      accessibilityValue={accessibilityValue ? { text: accessibilityValue } : undefined}
      accessibilityHint={accessibilityHint}
      accessibilityState={staticText ? undefined : { disabled: !enabled, selected: !!checked }}
      disabled={!enabled}
      onPress={onPress}
      style={rowStyle}
    >
      {({ pressed }) => (
        <>
          <PressFill pressed={pressed && enabled} color={colors['surface-pressed']} />
          <TileLead symbol={symbol} tone={tone}>
            {text}
          </TileLead>
          {checked && (
            <SymbolView
              name="checkmark"
              size={mark + 3}
              weight="semibold"
              tintColor={colors.accent}
              accessible={false}
            />
          )}
          {/* A chevron marks a row that opens a screen, not one that acts in place, as iOS does. */}
          {chevron && enabled && (
            <SymbolView
              name="chevron.right"
              size={mark}
              weight="semibold"
              tintColor={colors['ink-secondary']}
              accessible={false}
            />
          )}
        </>
      )}
    </Pressable>
  )
}
