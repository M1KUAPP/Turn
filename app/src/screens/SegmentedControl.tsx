import { Pressable, useWindowDimensions, View } from 'react-native'
import { colors } from '../constants/theme'
import { useShadow } from './depth'
import TurnText from './TurnText'

type Option<T> = { label: string; value: T }

// Plan 0044's Segmented control: each step one tap, never a drag (A11Y-5). From AX1 the steps stack, so no label
// breaks mid-word.
export default function SegmentedControl<T>({
  options,
  selected,
  onSelect,
  boldText,
  disabled = false
}: {
  options: readonly Option<T>[]
  selected: T | null
  onSelect: (value: T) => void
  boldText: boolean
  disabled?: boolean
}) {
  const stacked = useWindowDimensions().fontScale >= 1.786
  const pillShadow = useShadow('card')

  return (
    <View
      style={{
        flexDirection: stacked ? 'column' : 'row',
        padding: 5,
        gap: stacked ? 4 : 0,
        borderRadius: 26,
        borderCurve: 'continuous',
        borderWidth: 1.5,
        borderColor: colors.edge,
        backgroundColor: colors['surface-sunken']
      }}
    >
      {options.map((option) => {
        const on = option.value === selected
        return (
          <Pressable
            key={option.label}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: on, disabled }}
            disabled={disabled}
            onPress={() => onSelect(option.value)}
            style={({ pressed }) => ({
              flex: stacked ? undefined : 1,
              minHeight: 44,
              alignItems: stacked ? 'flex-start' : 'center',
              justifyContent: 'center',
              paddingHorizontal: stacked ? 16 : 2,
              paddingVertical: 6,
              borderRadius: 20,
              borderCurve: 'continuous',
              backgroundColor: on ? colors.surface : pressed ? colors['surface-pressed'] : undefined,
              boxShadow: on ? pillShadow : undefined
            })}
          >
            <TurnText
              kind="label"
              boldText={boldText}
              style={{ color: on ? colors.ink : colors['ink-secondary'], textAlign: stacked ? 'left' : 'center' }}
            >
              {option.label}
            </TurnText>
          </Pressable>
        )
      })}
    </View>
  )
}
