import * as Application from 'expo-application'
import { useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { useEffect, useState } from 'react'
import { Alert, ScrollView, useWindowDimensions, View } from 'react-native'
import { categoryColors, colors } from '../constants/theme'
import { consentWords } from '../consent/strings'
import { purchaseNotes } from '../purchases/store'
import { rebuildGazetteer } from '../listen/gazetteer'
import { runTagChecks } from '../listen/tag-checks'
import { companionName } from '../companion/settings'
import { SPEECH_RATE_STEPS } from '../speech/voice-settings'
import { useCompanion, useConsent, usePurchases, useTurn } from '../turn-context'
import { GroupHeader, ListGroup, ListRow, ScreenTitle, tileTones, useScreenTitle } from './ListGroup'
import TurnText from './TurnText'

/** The date Listen mode was allowed, in the phone's short form: "9/29/2026". */
export function permissionDateText(permissionDate: string | null): string | undefined {
  const parts = permissionDate?.split('-').map(Number)
  return parts ? new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString() : undefined
}

// PAY-1's free partner lines for each app user ID.
const freeLineAllowance = 20

// Plan 0044's line under "Listen mode is unlocked." (frame 28).
const unlockedDetail = 'Turn Listen is yours on this phone. Speaking stays free, as always.'

// A purchase or restore outcome, as a calm note with no alarm color (PAY-4 to PAY-6). Each line stays its own text,
// so VoiceOver and the flows read the outcome's words as they are.
function PurchaseNote({ note, boldText }: { note: string; boldText: boolean }) {
  const { fontScale } = useWindowDimensions()
  const unlocked = note === purchaseNotes.unlocked
  return (
    <View
      style={{
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        borderCurve: 'continuous',
        backgroundColor: colors['surface-sunken']
      }}
    >
      <SymbolView
        name={unlocked ? 'checkmark.circle' : 'info.circle'}
        size={Math.round(15 * Math.min(fontScale, 2.6))}
        weight="semibold"
        tintColor={unlocked ? colors.ink : colors['ink-secondary']}
        accessible={false}
        style={{ marginTop: 1 }}
      />
      <View style={{ flex: 1, gap: 2 }}>
        <TurnText
          kind="footnote"
          boldText={boldText}
          style={{ color: unlocked ? colors.ink : colors['ink-secondary'] }}
        >
          {note}
        </TurnText>
        {unlocked && (
          <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
            {unlockedDetail}
          </TurnText>
        )}
      </View>
    </View>
  )
}

export default function SettingsScreen() {
  const router = useRouter()
  const { ready, boldText, eraseAll } = useTurn()
  const { state: consentState } = useConsent()
  const { purchases, state: purchasesState } = usePurchases()
  const { state: companionState } = useCompanion()
  const [counts, setCounts] = useState<{ phrases: number; places: number } | null>(null)
  const { onTitleLayout, scrollProps } = useScreenTitle('Settings')
  const [, setVoiceRevision] = useState(0)
  const [, setRelayRevision] = useState(0)

  useEffect(() => {
    const voiceSettings = ready?.voiceSettings
    if (!voiceSettings) return
    return voiceSettings.subscribe(() => setVoiceRevision((revision) => revision + 1))
  }, [ready?.voiceSettings])

  useEffect(() => {
    const unsubscribe = ready?.config.subscribe(() => setRelayRevision((revision) => revision + 1))
    return () => {
      unsubscribe?.()
    }
  }, [ready?.config])

  useEffect(() => {
    const bank = ready?.bank
    if (!bank) return
    let active = true
    const read = () => {
      void Promise.all([bank.phrases('all'), bank.places()]).then(([phrases, places]) => {
        if (active) setCounts({ phrases: phrases.length, places: places.length })
      })
    }
    read()
    const unsubscribe = bank.subscribe(read)
    return () => {
      active = false
      unsubscribe()
    }
  }, [ready?.bank])

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

  const eraseEverything = () =>
    Alert.alert(
      'Erase all data?',
      'This deletes your phrases, places, tap counts, and settings, and brings back the starter phrases.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Erase',
          style: 'destructive',
          onPress: async () => {
            await eraseAll()
            router.dismissTo('/')
          }
        }
      ]
    )

  const voiceName = ready?.voiceSettings.selected().name ?? 'Loading…'
  const rateStep = ready?.voiceSettings.rateStep() ?? null
  const rateLabel = SPEECH_RATE_STEPS.find(({ step }) => step === rateStep)?.label
  const relayStatus = ready?.config.status() ?? 'unreachable'
  const relayWords = relayStatus === 'working' ? 'working' : relayStatus === 'off' ? 'off for now' : "can't be reached"
  const permissionDate = permissionDateText(consentState.permissionDate)
  const busy = !purchases || purchasesState.busy

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      {...scrollProps}
      style={{ flex: 1, backgroundColor: colors.board }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40, gap: 22 }}
    >
      <ScreenTitle title="Settings" boldText={boldText} onLayout={onTitleLayout} />
      <View>
        <GroupHeader title="Voice" boldText={boldText} />
        <ListGroup>
          <ListRow
            label="Voice"
            boldText={boldText}
            symbol="speaker.wave.2.fill"
            value={voiceName}
            chevron
            accessibilityHint={
              ready ? `Current voice: ${voiceName}. Open the voice list.` : 'Voice settings are loading'
            }
            onPress={() => router.push('/settings/voice')}
          />
          <ListRow
            label="Speech rate"
            boldText={boldText}
            symbol="slider.horizontal.3"
            value={rateLabel}
            chevron
            accessibilityHint="Open the voice list and the speech rate"
            onPress={() => router.push('/settings/voice')}
          />
          <ListRow
            label="Companion"
            boldText={boldText}
            symbol="person.wave.2.fill"
            value={companionName(companionState.model)}
            chevron
            onPress={() => router.push('/settings/companion')}
          />
        </ListGroup>
      </View>

      <View>
        <GroupHeader title="Listen mode" boldText={boldText} />
        <ListGroup>
          <ListRow
            label={consentState.permissionAllowed ? consentWords.allowedOn : consentWords.notAllowed}
            boldText={boldText}
            symbol="ear"
            tone={tileTones.listen}
            value={permissionDate}
            chevron
            onPress={() => router.push('/settings/listen')}
          />
          <ListRow
            label="Listen service"
            boldText={boldText}
            symbol="globe"
            tone={tileTones.listen}
            value={relayWords[0].toUpperCase() + relayWords.slice(1)}
            accessibilityLabel={`Listen service: ${relayWords}`}
          />
        </ListGroup>
      </View>

      <View>
        <GroupHeader title="Your words" boldText={boldText} />
        <ListGroup>
          <ListRow
            label="Places"
            boldText={boldText}
            symbol="mappin.and.ellipse"
            tone={{ fill: categoryColors['out-and-about'].fill, ink: categoryColors['out-and-about'].edge }}
            value={counts ? String(counts.places) : undefined}
            accessibilityLabel="Places"
            accessibilityValue={counts ? `${counts.places} places` : undefined}
            chevron
            onPress={() => router.push('/settings/places')}
          />
          <ListRow
            label="Phrase bank"
            boldText={boldText}
            symbol="text.book.closed"
            tone={{ fill: categoryColors.feelings.fill, ink: categoryColors.feelings.edge }}
            value={counts ? String(counts.phrases) : undefined}
            accessibilityLabel="Phrase bank"
            accessibilityValue={counts ? `${counts.phrases} phrases` : undefined}
            chevron
            onPress={() => router.push('/bank')}
          />
        </ListGroup>
      </View>

      <View>
        <GroupHeader title="Turn Listen" boldText={boldText} />
        <ListGroup>
          {purchasesState.listen === true ? (
            <ListRow label="Unlocked" boldText={boldText} symbol="lock.open.fill" />
          ) : (
            <ListRow
              label="Unlock Listen mode"
              boldText={boldText}
              symbol="lock.fill"
              subtitle={
                typeof purchasesState.freeLinesLeft === 'number'
                  ? `${purchasesState.freeLinesLeft} of ${freeLineAllowance} free lines left`
                  : undefined
              }
              chevron
              disabled={busy}
              accessibilityHint="Opens Turn Listen"
              onPress={purchases ? () => void purchases.openPaywall('settings') : undefined}
            />
          )}
          <ListRow
            label="Restore Purchases"
            boldText={boldText}
            symbol="arrow.counterclockwise"
            disabled={busy}
            accessibilityHint="Checks whether Listen mode is unlocked"
            onPress={purchases ? () => void purchases.restore() : undefined}
          />
        </ListGroup>
        {purchasesState.note && <PurchaseNote note={purchasesState.note} boldText={boldText} />}
      </View>

      <View>
        <GroupHeader title="About" boldText={boldText} />
        <ListGroup>
          <ListRow
            label="Privacy notice"
            boldText={boldText}
            symbol="hand.raised"
            tone={tileTones.neutral}
            chevron
            onPress={() => router.push('/settings/privacy')}
          />
          <ListRow
            label="Open-source licenses"
            boldText={boldText}
            symbol="doc.text"
            tone={tileTones.neutral}
            chevron
            onPress={() => router.push('/settings/licenses')}
          />
          <ListRow
            label="Version"
            boldText={boldText}
            symbol="info.circle"
            tone={tileTones.neutral}
            value={Application.nativeApplicationVersion ?? '—'}
          />
          {__DEV__ && ready?.nameTagger ? (
            <ListRow
              label="Check name tags"
              boldText={boldText}
              symbol="checkmark.shield"
              tone={tileTones.neutral}
              onPress={() => void checkNameTags()}
            />
          ) : null}
        </ListGroup>
      </View>

      <View>
        <GroupHeader title="More" boldText={boldText} />
        <ListGroup>
          <ListRow
            label="Stats on this phone"
            boldText={boldText}
            symbol="chart.bar.fill"
            chevron
            onPress={() => router.push('/settings/stats')}
          />
          <ListRow
            label="Erase all data"
            boldText={boldText}
            symbol="trash"
            tone={tileTones.neutral}
            onPress={eraseEverything}
          />
        </ListGroup>
      </View>
    </ScrollView>
  )
}
