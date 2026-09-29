import { SymbolView } from 'expo-symbols'
import { Pressable, useWindowDimensions, type ColorValue } from 'react-native'
import { colors } from '../constants/theme'
import type { SymbolName } from './category-style'
import PressFill from './PressFill'

// A 44-point round symbol button, named for VoiceOver and Voice Control (DESIGN, symbol buttons).
export default function IconButton({
  symbol,
  label,
  onPress,
  disabled = false,
  tint = colors.ink
}: {
  symbol: SymbolName
  label: string
  onPress: () => void
  disabled?: boolean
  tint?: ColorValue
}) {
  const { fontScale } = useWindowDimensions()
  const size = Math.round(44 * Math.min(fontScale, 1.5))
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors['surface-sunken']
      }}
    >
      {({ pressed }) => (
        <>
          <PressFill pressed={pressed} color={colors['surface-pressed']} radius={size / 2} />
          <SymbolView
            name={symbol}
            size={Math.round(size * 0.42)}
            weight="semibold"
            tintColor={disabled ? colors['ink-secondary'] : tint}
            accessible={false}
          />
        </>
      )}
    </Pressable>
  )
}
