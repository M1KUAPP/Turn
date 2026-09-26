import { useEffect, useState } from 'react'
import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated'

const CYCLE_MS = 1_200
const LINE_CAP_MS = 5_000

// DESIGN's light: while the partner's words arrive, the symbol fades from 100% to 35% and back every 1.2 seconds,
// for at most five seconds a line, and holds at 100% otherwise. Reduce Motion comes from the TRD's accessibility
// store, since Reanimated's own flag reads the setting only at launch.
export function useListenLight(wordsArriving: boolean, reduceMotion: boolean) {
  const [fading, setFading] = useState(false)
  useEffect(() => {
    if (!wordsArriving || reduceMotion) {
      setFading(false)
      return
    }
    setFading(true)
    const cap = setTimeout(() => setFading(false), LINE_CAP_MS)
    return () => clearTimeout(cap)
  }, [wordsArriving, reduceMotion])

  const opacity = useSharedValue(1)
  useEffect(() => {
    cancelAnimation(opacity)
    opacity.value = fading
      ? withRepeat(
          withSequence(withTiming(0.35, { duration: CYCLE_MS / 2 }), withTiming(1, { duration: CYCLE_MS / 2 })),
          -1
        )
      : 1
  }, [fading, opacity])

  return useAnimatedStyle(() => ({ opacity: opacity.value }))
}
