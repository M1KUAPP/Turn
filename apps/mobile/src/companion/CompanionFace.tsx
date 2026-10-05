import { useEffect, useState } from 'react'
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import { colors } from '../constants/theme'
import { useDepth } from '../screens/home-depth'
import { Layer, usePress } from '../screens/home-press'
import { companionFrames, FACE_FRAMES } from './frames'
import Live2DView, { useLive } from './Live2DView'
import type { CompanionModel } from './settings'
import { faceMotion, playFace, type CompanionState, type FaceFrame } from './state'

/** The frame a face shows now, stepping through its state's motion; `animate` is Let it move without Reduce Motion. */
export function useFaceFrame(state: CompanionState, animate: boolean): FaceFrame {
  const [frame, setFrame] = useState<FaceFrame>('rest')
  useEffect(() => playFace(faceMotion(state, animate), setFrame), [state, animate])
  return frame
}

// The ring inside the circle says the state as well as the frame does: `accent` while Turn speaks, `listen` while the
// partner talks, and the plain 1.5 `edge` otherwise.
function ring(state: CompanionState) {
  if (state === 'speaking') return { color: colors.accent, width: 2.5 }
  if (state === 'listening') return { color: colors.listen, width: 2.5 }
  return { color: colors.edge, width: 1.5 }
}

/** The companion face (frames 02 to 16 and 22): a 64-point circle, glass like the toolbar beside it, holding the
 * 52-point face. It never moves on screen; a tap turns the screen to the partner. */
export default function CompanionFace({
  model,
  state,
  animate,
  reduceTransparency,
  onPress
}: {
  model: CompanionModel
  state: CompanionState
  animate: boolean
  reduceTransparency: boolean
  onPress: () => void
}) {
  const depth = useDepth()
  const press = usePress()
  const frame = useFaceFrame(state, animate)
  const { live, onLive } = useLive(model)
  const edge = ring(state)
  const glass = isLiquidGlassAvailable() && !reduceTransparency
  const circle = { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' } as const

  const face = (
    <>
      <Layer fill={colors['surface-pressed']} radius={32} style={press.style} />
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          overflow: 'hidden',
          backgroundColor: colors['surface-sunken']
        }}
      >
        {/* Every frame stays mounted, so a frame change never waits on an image to load, and they give way to the
            live model once it has drawn. */}
        {FACE_FRAMES.map((name) => (
          <Image
            key={name}
            source={companionFrames[model].face[name]}
            accessibilityIgnoresInvertColors
            style={{ position: 'absolute', width: 52, height: 52, opacity: name === frame && !live ? 1 : 0 }}
          />
        ))}
        <Live2DView key={model} model={model} fit="face" frame={frame} animate={animate} onLive={onLive} />
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { borderRadius: 26, borderWidth: edge.width, borderColor: edge.color }]}
        />
      </View>
    </>
  )

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Turn to partner"
      accessibilityHint="Shows your words to the person you're talking to."
      testID={`companion-face-${state}`}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onPress={onPress}
      style={{ width: 64, height: 64, borderRadius: 32, boxShadow: depth.raised }}
    >
      {glass ? (
        <GlassView glassEffectStyle="regular" style={circle}>
          {face}
        </GlassView>
      ) : (
        <View style={[circle, { backgroundColor: colors.surface }]}>{face}</View>
      )}
    </Pressable>
  )
}
