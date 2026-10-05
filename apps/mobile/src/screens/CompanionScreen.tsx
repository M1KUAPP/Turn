import { useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { companionFrames } from '../companion/frames'
import { COMPANION_MODELS, type CompanionModel } from '../companion/settings'
import { colors } from '../constants/theme'
import { useCompanion, useTurn } from '../turn-context'
import { useShadow } from './depth'
import EdgeFade, { fadeToward, useTokenHex } from './EdgeFade'
import { GroupNote, ListGroup, ListRow, ScreenTitle, useScreenTitle } from './ListGroup'
import PressFill from './PressFill'
import TurnText from './TurnText'
import { previewText } from './VoiceScreen'

// A face's tile (frame 67): its portrait over its name, with a 2.5 `accent` edge and a check once chosen. The portrait
// shows the head and shoulders and fades into the name's bar, so the picture never stops at a hard line. Pressed, the
// bar and its fade turn `surface-pressed` and the edge 2.5, as other cards do.
function Choice({
  model,
  name,
  width,
  selected,
  boldText,
  increaseContrast,
  onPress
}: {
  model: CompanionModel
  name: string
  width: number
  selected: boolean
  boldText: boolean
  increaseContrast: boolean
  onPress: () => void
}) {
  const card = useShadow('card')
  const pressedHex = useTokenHex('surface-pressed', increaseContrast)
  // The 370 by 440 portrait at the tile's width, up to 200 points, cut at 70% of its height; the fade takes the last
  // 17%, which starts below every face's chin.
  const portraitWidth = Math.min(width, 200)
  const portraitHeight = (portraitWidth * 440) / 370
  const pictureHeight = Math.round(portraitHeight * 0.7)
  const fade = Math.round(portraitHeight * 0.17)
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name}
      accessibilityHint="Chooses this face and previews it in your voice"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{ flex: 1, borderRadius: 24, borderCurve: 'continuous', boxShadow: card }}
    >
      {({ pressed }) => (
        <View
          style={{ borderRadius: 24, borderCurve: 'continuous', overflow: 'hidden', backgroundColor: colors.surface }}
        >
          <View
            style={{
              height: pictureHeight,
              alignItems: 'center',
              overflow: 'hidden',
              backgroundColor: colors['surface-sunken']
            }}
          >
            <Image
              source={companionFrames[model].portrait.rest}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
              style={{ width: portraitWidth, height: portraitHeight }}
            />
            <EdgeFade side="bottom" size={fade} token="surface" increaseContrast={increaseContrast} />
          </View>
          <View
            style={{
              minHeight: 50,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 14,
              paddingVertical: 8
            }}
          >
            <PressFill
              pressed={pressed}
              style={{ top: -fade, experimental_backgroundImage: fadeToward('bottom', pressedHex, fade) }}
            />
            <TurnText kind="title" boldText={boldText} style={{ flex: 1, color: colors.ink }}>
              {name}
            </TurnText>
            {selected && (
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.accent
                }}
              >
                <SymbolView
                  name="checkmark"
                  size={16}
                  weight="semibold"
                  tintColor={colors['on-accent']}
                  accessible={false}
                />
              </View>
            )}
          </View>
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                borderRadius: 24,
                borderCurve: 'continuous',
                borderWidth: selected || pressed ? 2.5 : 1.5,
                borderColor: selected ? colors.accent : colors.edge
              }
            ]}
          />
        </View>
      )}
    </Pressable>
  )
}

/** Settings › Companion (frame 67): four faces to choose from, each previewed in the chosen voice, No companion, and
 * the voice and Let it move beside them. */
export default function CompanionScreen() {
  const router = useRouter()
  const { ready, boldText, increaseContrast } = useTurn()
  const { companion, state } = useCompanion()
  const { width, fontScale } = useWindowDimensions()
  const { onTitleLayout, scrollProps } = useScreenTitle('Companion')
  const [note, setNote] = useState<string | null>(null)
  const [, setVoiceRevision] = useState(0)
  // One column from AX1, so a face's name keeps its tile's width.
  const oneColumn = fontScale >= 1.786
  const tileWidth = oneColumn ? width - 32 : (width - 44) / 2

  useEffect(() => {
    const voiceSettings = ready?.voiceSettings
    if (!voiceSettings) return
    return voiceSettings.subscribe(() => setVoiceRevision((revision) => revision + 1))
  }, [ready?.voiceSettings])

  if (!ready || !companion) {
    return (
      <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.board, padding: 16 }}>
        <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
          Loading companion settings…
        </TurnText>
      </SafeAreaView>
    )
  }

  const choose = (model: CompanionModel | null) => {
    setNote(null)
    void companion.chooseModel(model).catch((cause) => setNote(String(cause)))
    if (model) {
      void ready.speech
        .preview(previewText, ready.voiceSettings.selected().identifier)
        .catch((cause) => setNote(String(cause)))
    }
  }

  const choices = COMPANION_MODELS.map(({ model, name }) => (
    <Choice
      key={model}
      model={model}
      name={name}
      width={tileWidth}
      selected={state.model === model}
      boldText={boldText}
      increaseContrast={increaseContrast}
      onPress={() => choose(model)}
    />
  ))
  const rows = oneColumn ? choices.map((choice) => [choice]) : [choices.slice(0, 2), choices.slice(2)]

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      {...scrollProps}
      style={{ flex: 1, backgroundColor: colors.board }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40, gap: 16 }}
    >
      <View style={{ gap: 14 }}>
        <ScreenTitle title="Companion" boldText={boldText} onLayout={onTitleLayout} />
        {/* The subheadline ramp at its regular weight, as frame 67 sets it. */}
        <TurnText
          kind="label"
          boldText={boldText}
          style={{ color: colors['ink-secondary'], fontWeight: boldText ? '600' : '400', marginHorizontal: 4 }}
        >
          A face for your voice: it mouths what Turn says in the voice you chose. Tap a face to preview it.
        </TurnText>
      </View>
      <View style={{ gap: 12 }}>
        {rows.map((row, index) => (
          <View key={index} style={{ flexDirection: 'row', gap: 12 }}>
            {row}
          </View>
        ))}
      </View>
      <ListGroup>
        <ListRow
          label="No companion"
          boldText={boldText}
          symbol="person.crop.circle.badge.xmark"
          subtitle="Home looks as it does today"
          checked={state.model === null}
          onPress={() => choose(null)}
        />
      </ListGroup>
      <View>
        <ListGroup>
          <ListRow
            label="Voice"
            boldText={boldText}
            symbol="speaker.wave.2.fill"
            value={ready.voiceSettings.selected().name}
            chevron
            onPress={() => router.push('/settings/voice')}
          />
          <ListRow
            label="Let it move"
            boldText={boldText}
            symbol="person.wave.2.fill"
            subtitle="Blinks and breathes; still when Reduce Motion is on"
            toggle={{
              value: state.moves,
              onValueChange: (moves) => void companion.chooseMoves(moves).catch((cause) => setNote(String(cause)))
            }}
          />
        </ListGroup>
        {note && <GroupNote boldText={boldText}>{note}</GroupNote>}
      </View>
    </ScrollView>
  )
}
