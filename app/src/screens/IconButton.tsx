import { SymbolView } from 'expo-symbols'
import { Pressable, useWindowDimensions } from 'react-native'
import { colors } from '../constants/theme'
import type { SymbolName } from './category-style'
import PressFill from './PressFill'

// A 44-point round symbol button, named for VoiceOver and Voice Control (DESIGN, symbol buttons), with a 1.5 edge so
// its outline reaches 3 to 1.
export default function IconButton({
  symbol,
  label,
  onPress,
  disabled = false
}: {
  symbol: SymbolName
  label: string
  onPress: () => void
  disabled?: boolean
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
        borderWidth: 1.5,
        borderColor: colors.edge,
        backgroundColor: colors['surface-sunken']
      }}
    >
      {({ pressed }) => (
        <>
          <PressFill pressed={pressed} color={colors['surface-pressed']} radius={size / 2 - 1.5} />
          <SymbolView
            name={symbol}
            size={Math.round(size * 0.42)}
            weight="semibold"
            tintColor={disabled ? colors['ink-secondary'] : colors.ink}
            accessible={false}
          />
        </>
      )}
    </Pressable>
  )
}
