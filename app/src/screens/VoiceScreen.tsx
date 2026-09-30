import { SymbolView } from 'expo-symbols'
import { useEffect, useState } from 'react'
import { Modal, Pressable, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SPEECH_RATE_STEPS, type SpeechRateStep, type VoiceOption } from '../speech/voice-settings'
import { colors } from '../constants/theme'
import { useTurn } from '../turn-context'
import Button from './Button'
import {
  GroupHeader,
  GroupNote,
  ListGroup,
  ListRow,
  ScreenTitle,
  useScreenTitle,
  SymbolTile,
  tileTones,
  useListMetrics
} from './ListGroup'
import SegmentedControl from './SegmentedControl'
import SheetHeader, { SheetActions } from './SheetHeader'
import PressFill from './PressFill'
import TurnText from './TurnText'

export const previewText = 'Hello. This is how I sound.'

export default function VoiceScreen() {
  const { ready, boldText } = useTurn()
  const { tile, mark } = useListMetrics()
  const voiceSettings = ready?.voiceSettings
  const [voices, setVoices] = useState<readonly VoiceOption[]>([])
  const [selected, setSelected] = useState<VoiceOption | null>(null)
  const [rateStep, setRateStep] = useState<SpeechRateStep | null>(null)
  const [note, setNote] = useState<string | null>(null)
  const [personalNote, setPersonalNote] = useState<string | null>(null)
  const { onTitleLayout, scrollProps } = useScreenTitle('Voice')

  useEffect(() => {
    if (!voiceSettings) return
    const read = () => {
      setVoices(voiceSettings.voices())
      setSelected(voiceSettings.selected())
      setRateStep(voiceSettings.rateStep())
    }
    read()
    return voiceSettings.subscribe(read)
  }, [voiceSettings])

  if (!ready || !voiceSettings) {
    return (
      <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.board, padding: 16 }}>
        <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
          Loading voice settings…
        </TurnText>
      </SafeAreaView>
    )
  }

  const choosePersonalVoice = async () => {
    setNote(null)
    try {
      setPersonalNote(await voiceSettings.choosePersonalVoice())
    } catch (cause) {
      setNote(cause instanceof Error ? cause.message : String(cause))
    }
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      {...scrollProps}
      style={{ flex: 1, backgroundColor: colors.board }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40, gap: 22 }}
    >
      <ScreenTitle title="Voice" boldText={boldText} onLayout={onTitleLayout} />
      <View>
        <GroupHeader title="Voice" boldText={boldText} />
        <ListGroup>
          <ListRow
            label="Personal Voice"
            boldText={boldText}
            symbol="person.wave.2.fill"
            subtitle="Your own voice, made in iOS"
            checked={selected?.personal === true}
            accessibilityHint="Ask iOS to let Turn use your Personal Voice"
            onPress={() => void choosePersonalVoice()}
          />
          {voices
            .filter((voice) => !voice.personal)
            .map((voice) => {
              const on = selected?.personal !== true && voice.identifier === (selected?.identifier ?? null)
              return (
                <View
                  key={voice.identifier ?? 'system-default'}
                  style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}
                >
                  {/* The voice's tile is its Preview button, so a tap on the name only chooses it. */}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Preview"
                    accessibilityHint={`Preview ${voice.name}`}
                    onPress={() => {
                      setNote(null)
                      void ready.speech.preview(previewText, voice.identifier).catch((cause) => setNote(String(cause)))
                    }}
                    style={{
                      width: Math.max(44, tile),
                      height: Math.max(44, tile),
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 14
                    }}
                  >
                    {({ pressed }) => (
                      <>
                        <PressFill pressed={pressed} color={colors['surface-pressed']} radius={14} />
                        <SymbolTile symbol="speaker.wave.2.fill" tone={tileTones.accent} />
                      </>
                    )}
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={voice.name}
                    accessibilityState={{ selected: on }}
                    onPress={() => {
                      setNote(null)
                      void voiceSettings.chooseVoice(voice.identifier).catch((cause) => setNote(String(cause)))
                    }}
                    style={{
                      flex: 1,
                      minHeight: 56,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      paddingLeft: 6,
                      paddingRight: 16,
                      paddingVertical: 10
                    }}
                  >
                    {({ pressed }) => (
                      <>
                        <PressFill pressed={pressed} color={colors['surface-pressed']} />
                        <TurnText kind="body" boldText={boldText} style={{ flex: 1, color: colors.ink }}>
                          {voice.name}
                        </TurnText>
                        {on && (
                          <SymbolView
                            name="checkmark"
                            size={mark + 3}
                            weight="semibold"
                            tintColor={colors.accent}
                            accessible={false}
                          />
                        )}
                      </>
                    )}
                  </Pressable>
                </View>
              )
            })}
        </ListGroup>
        <GroupNote boldText={boldText}>Choose a voice or preview how it sounds.</GroupNote>
        {note && <GroupNote boldText={boldText}>{note}</GroupNote>}
      </View>

      <View>
        <GroupHeader title="Speech rate" boldText={boldText} />
        <SegmentedControl
          options={SPEECH_RATE_STEPS.map(({ label, step }) => ({ label, value: step }))}
          selected={rateStep}
          onSelect={(step) => void voiceSettings.chooseRate(step).catch((cause) => setNote(String(cause)))}
          boldText={boldText}
        />
      </View>

      <Modal
        visible={personalNote !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPersonalNote(null)}
      >
        <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.board }}>
          <SheetHeader
            title="Personal Voice"
            boldText={boldText}
            closeLabel="Close"
            onClose={() => setPersonalNote(null)}
          />
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16, gap: 16 }}>
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors['accent-soft']
              }}
            >
              <SymbolView
                name="person.wave.2.fill"
                size={28}
                weight="semibold"
                tintColor={colors.accent}
                accessible={false}
              />
            </View>
            <TurnText kind="body" boldText={boldText} style={{ color: colors.ink }}>
              {personalNote}
            </TurnText>
          </ScrollView>
          <SheetActions>
            <Button variant="primary" label="OK" boldText={boldText} onPress={() => setPersonalNote(null)} />
          </SheetActions>
        </SafeAreaView>
      </Modal>
    </ScrollView>
  )
}
