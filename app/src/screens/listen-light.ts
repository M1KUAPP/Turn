import { useEffect } from 'react'
import {
  Easing,
  ReduceMotion,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated'

const RING_MS = 1600
// Three 1.6-second rings take 4.8 seconds, inside the five seconds a line (DESIGN, motion).
const RINGS_PER_LINE = 3

// DESIGN's light: while the partner's words arrive, a ring grows from the light, scale 1 to 1.8, and fades from 60% to
// nothing, once every 1.6 seconds for at most five seconds a line. Reduce Motion, from the TRD's accessibility store,
// shows the light alone.
export function useListenLight(wordsArriving: boolean, reduceMotion: boolean) {
  const progress = useSharedValue(1)
  useEffect(() => {
    cancelAnimation(progress)
    progress.value = 1
    if (reduceMotion || !wordsArriving) return
    progress.value = 0
    progress.value = withRepeat(
      withTiming(1, { duration: RING_MS, easing: Easing.out(Easing.quad), reduceMotion: ReduceMotion.System }),
      RINGS_PER_LINE,
      false,
      undefined,
      ReduceMotion.System
    )
  }, [wordsArriving, reduceMotion, progress])

  return useAnimatedStyle(() => ({
    opacity: 0.6 * (1 - progress.value),
    transform: [{ scale: 1 + 0.8 * progress.value }]
  }))
}
