import { SymbolView } from 'expo-symbols'
import { Pressable, useWindowDimensions, type ColorValue, type StyleProp, type ViewStyle } from 'react-native'
import { colors } from '../constants/theme'
import type { SymbolName } from './category-style'
import PressFill from './PressFill'
import TurnText from './TurnText'

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'listen' | 'plain'

type Look = { fill: ColorValue; pressedFill: ColorValue; ink: ColorValue; edge?: ColorValue; pressedEdge?: ColorValue }

// Plan 0044's Button: 56-point capsules. A press changes the fill and thickens the edge, never the size.
const looks: Record<ButtonVariant, Look> = {
  primary: { fill: colors.accent, pressedFill: colors['accent-pressed'], ink: colors['on-accent'] },
  secondary: {
    fill: colors.surface,
    pressedFill: colors['surface-pressed'],
    ink: colors.ink,
    edge: colors.edge,
    pressedEdge: colors.edge
  },
  destructive: {
    fill: colors.surface,
    pressedFill: colors['surface-pressed'],
    ink: colors['no-edge'],
    edge: colors['no-edge'],
    pressedEdge: colors['no-edge']
  },
  listen: { fill: colors.listen, pressedFill: colors.listen, ink: colors['on-listen'], pressedEdge: colors.ink },
  plain: { fill: 'transparent', pressedFill: colors['surface-pressed'], ink: colors.accent }
}

export default function Button({
  label,
  boldText,
  onPress,
  variant = 'secondary',
  disabled = false,
  symbol,
  accessibilityHint,
  style
}: {
  label: string
  boldText: boolean
  onPress: () => void
  variant?: ButtonVariant
  disabled?: boolean
  symbol?: SymbolName
  accessibilityHint?: string
  style?: StyleProp<ViewStyle>
}) {
  const { fontScale } = useWindowDimensions()
  const look = looks[variant]
  const ink = disabled ? colors['ink-secondary'] : look.ink
  const edgeWidth = (pressed: boolean) => (disabled ? 0 : pressed ? (look.pressedEdge ? 2.5 : 0) : look.edge ? 1.5 : 0)

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: 56,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 28,
          borderCurve: 'continuous',
          backgroundColor: disabled ? colors['surface-sunken'] : look.fill,
          borderWidth: edgeWidth(pressed),
          borderColor: pressed ? look.pressedEdge : look.edge
        },
        style
      ]}
    >
      {({ pressed }) => (
        <>
          {!disabled && <PressFill pressed={pressed} color={look.pressedFill} radius={28 - edgeWidth(pressed)} />}
          {symbol && (
            <SymbolView
              name={symbol}
              size={Math.round(18 * Math.min(fontScale, 2.6))}
              weight="semibold"
              tintColor={ink}
              accessible={false}
            />
          )}
          <TurnText kind="button" boldText={boldText} style={{ color: ink, textAlign: 'center', flexShrink: 1 }}>
            {label}
          </TurnText>
        </>
      )}
    </Pressable>
  )
}
