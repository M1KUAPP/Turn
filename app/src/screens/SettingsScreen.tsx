import * as Application from 'expo-application'
import { useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../constants/theme'
import { rebuildGazetteer } from '../listen/gazetteer'
import { runTagChecks } from '../listen/tag-checks'
import { SPEECH_RATE_STEPS } from '../speech/voice-settings'
import { useTurn } from '../turn-context'
import TurnText from './TurnText'

type Row = {
  label: string
  value?: string
  hint?: string
  open?: () => void
  action?: () => void
  disabled?: boolean
  selected?: boolean
}
type Section = { title: string; rows: Row[]; note?: string }

export default function SettingsScreen() {
  const router = useRouter()
  const { ready, boldText } = useTurn()
  const [voiceNote, setVoiceNote] = useState<string | null>(null)
  const [, setVoiceRevision] = useState(0)

  useEffect(() => {
    const voiceSettings = ready?.voiceSettings
    if (!voiceSettings) return
    return voiceSettings.subscribe(() => setVoiceRevision((revision) => revision + 1))
  }, [ready?.voiceSettings])

  const checkNameTags = async () => {
    const finder = ready?.nameTagger
    if (!ready || !finder) return
    try {
      const results = await runTagChecks(finder)
      Alert.alert(
        'Check name tags',
        results
          .map(({ name, passed, taggedText }) => `${passed ? 'PASS' : 'FAIL'}: ${name}\n${taggedText}`)
          .join('\n\n')
      )
    } catch (cause) {
      Alert.alert('Check name tags', `The checks could not finish. ${String(cause)}`)
    } finally {
      try {
        const [phrases, places] = await Promise.all([ready.bank.phrases('all'), ready.bank.places()])
        await rebuildGazetteer({ phrases, places }, finder)
      } catch {
        // A later bank edit retries the local gazetteer rebuild.
      }
    }
  }

  const debugRows: Row[] =
    __DEV__ && ready?.nameTagger ? [{ label: 'Check name tags', open: () => void checkNameTags() }] : []

  const choosePersonalVoice = async () => {
    if (!ready) return
    setVoiceNote(null)
    try {
      setVoiceNote(await ready.voiceSettings.choosePersonalVoice())
    } catch (cause) {
      setVoiceNote(cause instanceof Error ? cause.message : String(cause))
    }
  }

  const rateStep = ready?.voiceSettings.rateStep() ?? null
  const voiceRows: Row[] = [
    {
      label: 'Voice',
      value: ready?.voiceSettings.selected().name ?? 'Loading…',
      hint: ready
        ? `Current voice: ${ready.voiceSettings.selected().name}. Open the voice list.`
        : 'Voice settings are loading',
      open: () => router.push('/settings/voice')
    },
    ...SPEECH_RATE_STEPS.map(({ label, step }) => ({
      label,
      hint: rateStep === step ? 'Selected speech rate' : 'Set speech rate',
      disabled: !ready,
      selected: rateStep === step,
      action: ready
        ? () => void ready.voiceSettings.chooseRate(step).catch((cause) => setVoiceNote(String(cause)))
        : undefined
    })),
    {
      label: 'Personal Voice',
      hint: 'Ask iOS to let Turn use your Personal Voice',
      disabled: !ready,
      action: ready ? () => void choosePersonalVoice() : undefined
    }
  ]

  const sections: Section[] = [
    { title: 'Voice', rows: voiceRows, note: voiceNote ?? undefined },
    { title: 'Listen mode', rows: [{ label: 'Permission' }, { label: 'Under-18 mode' }] },
    {
      title: 'Your words',
      rows: [{ label: 'Places', open: () => router.push('/settings/places') }, { label: 'Phrase bank' }]
    },
    { title: 'Turn Listen', rows: [{ label: 'Unlock Listen mode' }, { label: 'Restore Purchases' }] },
    {
      title: 'About',
      rows: [
        { label: 'Privacy notice', open: () => router.push('/settings/privacy') },
        { label: 'Open-source licenses', open: () => router.push('/settings/licenses') },
        { label: 'Version', value: Application.nativeApplicationVersion ?? '—' },
        { label: 'Relay status' },
        ...debugRows
      ]
    },
    { title: 'More', rows: [{ label: 'Stats on this phone' }, { label: 'Erase all data' }] }
  ]

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colors.board }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 24 }}>
        {sections.map((section) => (
          <View key={section.title} style={{ gap: 8 }}>
            <TurnText
              kind="subheadline-emphasized"
              boldText={boldText}
              style={{ color: colors['ink-secondary'], marginLeft: 12 }}
            >
              {section.title}
            </TurnText>
            <View style={{ borderRadius: 12, backgroundColor: colors.surface, overflow: 'hidden' }}>
              {section.rows.map((row, index) => {
                const action = row.open ?? row.action
                const enabled = !!action && !row.disabled
                const selected = row.selected === true
                const staticText = row.value !== undefined && !action
                return (
                  <Pressable
                    key={row.label}
                    accessibilityRole={staticText ? 'text' : 'button'}
                    // Named explicitly: left to iOS, the chevron's symbol adds "Forward" to the name.
                    accessibilityLabel={row.value ? `${row.label}, ${row.value}` : row.label}
                    accessibilityHint={row.hint}
                    accessibilityState={staticText ? undefined : { disabled: !enabled, selected }}
                    disabled={!enabled}
                    onPress={action}
                    style={({ pressed }) => ({
                      minHeight: 52,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderTopWidth: index === 0 ? 0 : 1,
                      borderTopColor: colors.edge,
                      backgroundColor: pressed && enabled ? colors['surface-pressed'] : colors.surface
                    })}
                  >
                    <TurnText
                      kind="body"
                      boldText={boldText}
                      style={{ color: enabled || staticText ? colors.ink : colors['ink-secondary'], flex: 1 }}
                    >
                      {row.label}
                    </TurnText>
                    {row.value && (
                      <TurnText kind="subheadline" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                        {row.value}
                      </TurnText>
                    )}
                    {selected && <SymbolView name="checkmark" size={18} tintColor={colors.accent} accessible={false} />}
                    {enabled && (
                      <SymbolView
                        name="chevron.right"
                        size={15}
                        tintColor={colors['ink-secondary']}
                        accessible={false}
                      />
                    )}
                  </Pressable>
                )
              })}
            </View>
            {section.note && (
              <TurnText
                kind="subheadline"
                boldText={boldText}
                style={{ color: colors['ink-secondary'], marginLeft: 12 }}
              >
                {section.note}
              </TurnText>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
