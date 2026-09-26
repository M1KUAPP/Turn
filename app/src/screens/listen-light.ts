import { useEffect } from 'react'
import {
  ReduceMotion,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated'

const HALF_CYCLE_MS = 600
// Four 1.2-second cycles take 4.8 seconds and end back at 100%, inside the five seconds a line.
const CYCLES_PER_LINE = 4

// Reduce Motion comes from the TRD's accessibility store alone, so Reanimated must not also apply the setting it
// read at launch, as its animations do by default.
const fadeTo = (opacity: number) => withTiming(opacity, { duration: HALF_CYCLE_MS, reduceMotion: ReduceMotion.Never })

// DESIGN's light: while the partner's words arrive, the symbol fades from 100% to 35% and back every 1.2 seconds,
// for at most five seconds a line, and holds at 100% otherwise and under Reduce Motion.
export function useListenLight(wordsArriving: boolean, reduceMotion: boolean) {
  const opacity = useSharedValue(1)
  useEffect(() => {
    cancelAnimation(opacity)
    if (reduceMotion) opacity.value = 1
    else if (wordsArriving)
      opacity.value = withRepeat(
        withSequence(ReduceMotion.Never, fadeTo(0.35), fadeTo(1)),
        CYCLES_PER_LINE,
        false,
        undefined,
        ReduceMotion.Never
      )
    // A line that ends mid-fade returns to 100% at the fade's pace instead of jumping there.
    else opacity.value = fadeTo(1)
  }, [wordsArriving, reduceMotion, opacity])

  return useAnimatedStyle(() => ({ opacity: opacity.value }))
}
