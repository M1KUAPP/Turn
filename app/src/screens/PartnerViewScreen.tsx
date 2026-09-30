import { useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { useState, useSyncExternalStore } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, useColorScheme, useWindowDimensions, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFaceFrame } from '../companion/CompanionFace'
import { companionFrames, PORTRAIT_FRAMES, type PortraitFrame } from '../companion/frames'
import Live2DView, { useLive } from '../companion/Live2DView'
import { colorValues, colors } from '../constants/theme'
import { useCompanion, useTurn } from '../turn-context'
import Button from './Button'
import { useShadow } from './depth'
import { Layer, usePress } from './home-press'
import TurnText from './TurnText'

const noSpeech = { speaking: false, lastText: null as string | null, activePhraseId: null as string | null }
const noSpeechSubscription = (_listener: () => void) => () => {}
const noSpeechSnapshot = () => noSpeech

/** The partner view (frames 62 to 66), opened by a tap on the companion's face: the face, big, mouthing what Turn
 * says, the last line in big text, and Say it again. The flip turns everything 180° for someone across a table. */
export default function PartnerViewScreen() {
  const router = useRouter()
  const { ready, boldText, reduceMotion } = useTurn()
  const { state: companion } = useCompanion()
  const { width, height, fontScale } = useWindowDimensions()
  const scheme = useColorScheme()
  const card = useShadow('card')
  const flipPress = usePress()
  const [flipped, setFlipped] = useState(false)
  const speech = ready?.speech ?? null
  const spoken = useSyncExternalStore(
    speech?.subscribe ?? noSpeechSubscription,
    speech?.getSnapshot ?? noSpeechSnapshot,
    speech?.getSnapshot ?? noSpeechSnapshot
  )
  const animate = companion.moves && !reduceMotion
  const frame = useFaceFrame(spoken.speaking ? 'speaking' : 'rest', animate)
  const portraitFrame = PORTRAIT_FRAMES.find((name) => name === frame) ?? 'rest'
  const line = spoken.lastText
  const model = companion.model
  const { live, onLive } = useLive(model)
  // The frame's 370 by 440 portrait, shorter on a shorter screen, so the line and Say it again keep the 434 points the
  // frame leaves them; a large text size scrolls the line instead.
  const portraitHeight = Math.min(440, Math.max(200, height - 434))
  const portraitWidth = Math.min(width - 32, (portraitHeight * 370) / 440)
  const glow = colorValues['listen-glow'][scheme === 'dark' ? 'dark' : 'light']

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.board }}>
      <View style={{ flex: 1, transform: [{ rotate: flipped ? '180deg' : '0deg' }] }}>
        {/* The frame's warm glow: `listen-glow` at 22%, 560 by 420 points, behind the portrait. */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 520,
            experimental_backgroundImage: `radial-gradient(280px 210px at ${width / 2}px 238px, ${glow}38 0%, ${glow}00 100%)`
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingHorizontal: 16,
            paddingTop: 4
          }}
        >
          <Button
            label="Done"
            boldText={boldText}
            onPress={() => router.back()}
            style={{ minHeight: 44, paddingVertical: 10 }}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Flip screen"
            accessibilityHint="Turns the screen upside down for someone across from you"
            onPressIn={flipPress.onPressIn}
            onPressOut={flipPress.onPressOut}
            onPress={() => setFlipped((current) => !current)}
            style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
          >
            <Layer fill={colors.surface} edge={colors.edge} edgeWidth={1.5} radius={22} />
            <Layer
              fill={colors['surface-pressed']}
              edge={colors.edge}
              edgeWidth={2.5}
              radius={22}
              style={flipPress.style}
            />
            <SymbolView
              name="arrow.up.arrow.down"
              size={Math.round(20 * Math.min(fontScale, 1.6))}
              weight="semibold"
              tintColor={colors.ink}
              accessible={false}
            />
          </Pressable>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, gap: 16 }}
        >
          {model && (
            <View
              style={{
                alignSelf: 'center',
                width: portraitWidth,
                height: portraitHeight,
                borderRadius: 28,
                borderCurve: 'continuous',
                boxShadow: card
              }}
            >
              <View
                style={{
                  flex: 1,
                  borderRadius: 28,
                  borderCurve: 'continuous',
                  overflow: 'hidden',
                  backgroundColor: colors['surface-sunken']
                }}
              >
                {/* Every frame stays mounted, so a frame change never waits on an image to load, and they give way to
                    the live model once it has drawn; the picture is decoration, and the line below is the words. */}
                {PORTRAIT_FRAMES.map((name: PortraitFrame) => (
                  <Image
                    key={name}
                    source={companionFrames[model].portrait[name]}
                    resizeMode="cover"
                    accessibilityIgnoresInvertColors
                    style={[
                      StyleSheet.absoluteFill,
                      { width: '100%', height: '100%', opacity: name === portraitFrame && !live ? 1 : 0 }
                    ]}
                  />
                ))}
                <Live2DView key={model} model={model} fit="portrait" frame={frame} animate={animate} onLive={onLive} />
                {spoken.speaking && (
                  <View
                    style={{
                      position: 'absolute',
                      left: 16,
                      bottom: 18,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      paddingLeft: 12,
                      paddingRight: 14,
                      paddingVertical: 8,
                      borderRadius: 999,
                      backgroundColor: colors['accent-soft']
                    }}
                  >
                    <SymbolView
                      name="waveform"
                      size={Math.round(18 * Math.min(fontScale, 1.6))}
                      weight="semibold"
                      tintColor={colors.ink}
                      accessible={false}
                      animationSpec={
                        reduceMotion ? undefined : { repeating: true, variableAnimationSpec: { iterative: true } }
                      }
                    />
                    <TurnText kind="label" boldText={boldText} style={{ color: colors.ink }}>
                      Speaking
                    </TurnText>
                  </View>
                )}
                <View
                  pointerEvents="none"
                  style={[
                    StyleSheet.absoluteFill,
                    { borderRadius: 28, borderCurve: 'continuous', borderWidth: 1.5, borderColor: colors.edge }
                  ]}
                />
              </View>
            </View>
          )}
          {line && (
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 18,
                borderRadius: 20,
                borderCurve: 'continuous',
                borderWidth: 1.5,
                borderColor: colors.edge,
                backgroundColor: colors.surface,
                boxShadow: card
              }}
            >
              <TurnText kind="phrase-big" boldText={boldText} style={{ color: colors.ink }}>
                {line}
              </TurnText>
            </View>
          )}
        </ScrollView>
        <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14 }}>
          <Button
            variant="primary"
            label="Say it again"
            boldText={boldText}
            disabled={!line}
            onPress={() => void speech?.repeat()}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
