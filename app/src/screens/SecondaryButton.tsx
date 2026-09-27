import { Pressable } from 'react-native'
import { colors } from '../constants/theme'
import TurnText from './TurnText'

export default function SecondaryButton({
  label,
  boldText,
  disabled = false,
  onPress,
  equalPair
}: {
  label: string
  boldText: boolean
  disabled?: boolean
  onPress: () => void
  equalPair: boolean
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minWidth: 44,
        minHeight: 52,
        flex: equalPair ? 1 : undefined,
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.edge,
        backgroundColor: pressed && !disabled ? colors['surface-pressed'] : colors.surface,
        paddingHorizontal: 16,
        paddingVertical: 10
      })}
    >
      <TurnText
        kind="body"
        boldText={boldText}
        style={{ color: disabled ? colors['ink-secondary'] : colors.ink, textAlign: 'center' }}
      >
        {label}
      </TurnText>
    </Pressable>
  )
}
