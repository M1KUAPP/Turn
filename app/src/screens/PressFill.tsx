import { useEffect, useRef } from 'react'
import { Animated, type ColorValue, type ViewStyle } from 'react-native'

// Plan 0044's press: the pressed fill shows at once on touch-down and fades back in 120 ms; nothing moves or scales,
// and Reduce Motion keeps it the same, since only the fill changes. `style` reshapes the fill, as a gradient that
// reaches past its view.
export default function PressFill({
  pressed,
  color,
  radius,
  style
}: {
  pressed: boolean
  color?: ColorValue
  radius?: number
  style?: ViewStyle
}) {
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    opacity.stopAnimation()
    if (pressed) opacity.setValue(1)
    else Animated.timing(opacity, { toValue: 0, duration: 120, useNativeDriver: true }).start()
  }, [pressed, opacity])

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          borderRadius: radius,
          backgroundColor: color,
          opacity
        },
        style
      ]}
    />
  )
}
