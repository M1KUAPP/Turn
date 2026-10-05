import { StyleSheet, type ColorValue } from 'react-native'
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

/** A press (DESIGN, motion): the pressed look shows at once on touch-down and fades back over 120 ms on release. A fill
 * that changes isn't motion, so the release keeps its 120 ms under Reduce Motion (plan 0044's table). */
export function usePress() {
  const pressed = useSharedValue(0)
  const style = useAnimatedStyle(() => ({ opacity: pressed.value }))
  return {
    style,
    onPressIn: () => {
      pressed.value = 1
    },
    onPressOut: () => {
      pressed.value = withTiming(0, { duration: 120, reduceMotion: ReduceMotion.Never })
    }
  }
}

/** A control's fill and edge, drawn behind its content, so an edge that thickens never moves the words. */
export function Layer({
  fill,
  edge,
  edgeWidth = 0,
  radius,
  style
}: {
  fill?: ColorValue
  edge?: ColorValue
  edgeWidth?: number
  radius: number
  style?: ReturnType<typeof useAnimatedStyle>
}) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        { borderRadius: radius, backgroundColor: fill, borderWidth: edge ? edgeWidth : 0, borderColor: edge },
        style
      ]}
    />
  )
}
