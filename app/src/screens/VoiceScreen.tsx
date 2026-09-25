import { Fragment, useEffect, useState } from 'react'
import { SymbolView } from 'expo-symbols'
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { VoiceOption } from '../speech/voice-settings'
import { colors } from '../constants/theme'
import { useTurn } from '../turn-context'
import TurnText from './TurnText'

const previewText = 'Hello. This is how I sound.'

export default function VoiceScreen() {
  const { ready, boldText } = useTurn()
  // From AX1 a voice's name takes its own line, with Preview under it, so no name breaks mid-word.
  const stacked = useWindowDimensions().fontScale >= 1.786
  const voiceSettings = ready?.voiceSettings
  const [voices, setVoices] = useState<readonly VoiceOption[]>([])
  const [selectedIdentifier, setSelectedIdentifier] = useState<string | null>(null)
  const [note, setNote] = useState<string | null>(null)

  useEffect(() => {
    if (!voiceSettings) return
    const read = () => {
      setVoices(voiceSettings.voices())
      setSelectedIdentifier(voiceSettings.selected().identifier)
    }
    read()
    return voiceSettings.subscribe(read)
  }, [voiceSettings])

  if (!ready) {
    return (
      <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.board, padding: 16 }}>
        <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
          Loading voice settings…
        </TurnText>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.board }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}>
        <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
          Choose a voice or preview how it sounds.
        </TurnText>
        <View style={{ borderRadius: 12, backgroundColor: colors.surface, overflow: 'hidden' }}>
          {voices.map((voice, index) => {
            const selected = voice.identifier === selectedIdentifier
            return (
              <Fragment key={voice.identifier ?? 'system-default'}>
                {index > 0 && (
                  <View style={{ height: StyleSheet.hairlineWidth, marginLeft: 12, backgroundColor: colors.edge }} />
                )}
                <View
                  style={{
                    minHeight: 60,
                    flexDirection: stacked ? 'column' : 'row',
                    alignItems: stacked ? 'stretch' : 'center',
                    gap: 8,
                    paddingHorizontal: 12,
                    paddingBottom: stacked ? 12 : 0
                  }}
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={voice.name}
                    accessibilityState={{ selected }}
                    onPress={() => {
                      setNote(null)
                      void voiceSettings?.chooseVoice(voice.identifier).catch((cause) => setNote(String(cause)))
                    }}
                    style={({ pressed }) => ({
                      flex: stacked ? undefined : 1,
                      minHeight: 52,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      paddingVertical: 8,
                      paddingRight: 4,
                      backgroundColor: pressed ? colors['surface-pressed'] : colors.surface
                    })}
                  >
                    <TurnText kind="body" boldText={boldText} style={{ color: colors.ink, flex: 1 }}>
                      {voice.name}
                    </TurnText>
                    {selected && <SymbolView name="checkmark" size={18} tintColor={colors.accent} accessible={false} />}
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Preview"
                    accessibilityHint={`Preview ${voice.name}`}
                    onPress={() => {
                      setNote(null)
                      void ready.speech.preview(previewText, voice.identifier).catch((cause) => setNote(String(cause)))
                    }}
                    style={({ pressed }) => ({
                      alignSelf: stacked ? 'flex-start' : undefined,
                      minWidth: 84,
                      minHeight: 44,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 12,
                      borderWidth: 2,
                      borderColor: colors.edge,
                      borderRadius: 22,
                      backgroundColor: pressed ? colors['surface-pressed'] : colors.surface
                    })}
                  >
                    <TurnText kind="subheadline-emphasized" boldText={boldText} style={{ color: colors.accent }}>
                      Preview
                    </TurnText>
                  </Pressable>
                </View>
              </Fragment>
            )
          })}
        </View>
        {note && (
          <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
            {note}
          </TurnText>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
