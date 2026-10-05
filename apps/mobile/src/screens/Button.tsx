import { SymbolView } from 'expo-symbols'
import { Pressable, useWindowDimensions, View, type ColorValue, type StyleProp, type ViewStyle } from 'react-native'
import { colors } from '../constants/theme'
import type { SymbolName } from './category-style'
import PressFill from './PressFill'
import TurnText from './TurnText'

export type ButtonVariant = 'primary' | 'secondary'

type Look = { fill: ColorValue; pressedFill: ColorValue; ink: ColorValue; edge?: ColorValue }

const looks: Record<ButtonVariant, Look> = {
  primary: { fill: colors.accent, pressedFill: colors['accent-pressed'], ink: colors['on-accent'] },
  secondary: { fill: colors.surface, pressedFill: colors['surface-pressed'], ink: colors.ink, edge: colors.edge }
}

// Plan 0044's Button: 56-point capsules. A press changes the fill and draws the 2.5 edge over the laid-out 1.5, so
// the capsule and its words never move or grow under a finger.
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
  const edgeWidth = look.edge ? 1.5 : 0

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
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
          borderWidth: edgeWidth,
          borderColor: look.edge
        },
        style
      ]}
    >
      {({ pressed }) => (
        <>
          {!disabled && <PressFill pressed={pressed} color={look.pressedFill} radius={28 - edgeWidth} />}
          {pressed && !disabled && look.edge && (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: -edgeWidth,
                right: -edgeWidth,
                bottom: -edgeWidth,
                left: -edgeWidth,
                borderRadius: 28,
                borderCurve: 'continuous',
                borderWidth: 2.5,
                borderColor: look.edge
              }}
            />
          )}
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
