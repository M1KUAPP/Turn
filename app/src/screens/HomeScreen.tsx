import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import {
  ActionSheetIOS,
  AccessibilityInfo,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { Category, Phrase, Place, createBankStore } from '../bank/store'
import { colors } from '../constants/theme'
import { consentWords } from '../consent/strings'
import type { createLiveListenSession } from '../listen/live-session'
import { listenStrings } from '../listen/strings'
import type { TypedListenState } from '../listen/typed-session'
import type { createSpeechController } from '../speech/controller'
import { useConsent } from '../turn-context'
import { homeLayout, pageOffset } from './home-layout'
import ReplyRow, { phraseColorTokensForId } from './ReplyRow'
import PartnerLineComposer from './PartnerLineComposer'
import TurnText from './TurnText'
import TypedComposer from './TypedComposer'

type Props = {
  bank: ReturnType<typeof createBankStore>
  speech: ReturnType<typeof createSpeechController>
  listen: ReturnType<typeof createLiveListenSession>
  boldText: boolean
}

function CaptionWords({ text, boldText, measure }: { text: string; boldText: boolean; measure: boolean }) {
  const [tail, setTail] = useState<{ text: string; first: string; second: string } | null>(null)
  const visibleTail = tail?.text === text ? tail : null

  return (
    <View>
      {visibleTail ? (
        <>
          <TurnText
            kind="title3"
            boldText={boldText}
            numberOfLines={1}
            ellipsizeMode="head"
            style={{ color: colors.ink }}
          >
            …{visibleTail.first}
          </TurnText>
          <TurnText kind="title3" boldText={boldText} numberOfLines={1} style={{ color: colors.ink }}>
            {visibleTail.second}
          </TurnText>
        </>
      ) : (
        <TurnText kind="title3" boldText={boldText} numberOfLines={2} style={{ color: colors.ink }}>
          {text}
        </TurnText>
      )}
      {measure && (
        <View
          pointerEvents="none"
          importantForAccessibility="no-hide-descendants"
          style={{ position: 'absolute', left: 0, right: 0, top: 0, opacity: 0 }}
        >
          <TurnText
            kind="title3"
            boldText={boldText}
            onTextLayout={({ nativeEvent }) => {
              const lines = nativeEvent.lines
              if (lines.length <= 2) {
                setTail(null)
                return
              }
              const first = lines[lines.length - 2].text.trim()
              const second = lines[lines.length - 1].text.trim()
              setTail((previous) =>
                previous?.text === text && previous.first === first && previous.second === second
                  ? previous
                  : { text, first, second }
              )
            }}
          >
            {text}
          </TurnText>
        </View>
      )}
    </View>
  )
}

export default function HomeScreen({ bank, speech, listen, boldText }: Props) {
  const router = useRouter()
  const { consent, state: consentState } = useConsent()
  const [categories, setCategories] = useState<Category[]>([])
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [strip, setStrip] = useState<Phrase[]>([])
  const [places, setPlaces] = useState<Place[]>([])
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [categoryId, setCategoryId] = useState('quick')
  const [offset, setOffset] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(1)
  const [contentHeight, setContentHeight] = useState(1)
  const [headerHeight, setHeaderHeight] = useState(0)
  const [replyPreview, setReplyPreview] = useState(0)
  const [composerMode, setComposerMode] = useState<'speak' | 'partner' | null>(null)
  const [draft, setDraft] = useState('')
  const [typeMatches, setTypeMatches] = useState<Phrase[]>([])
  const [touchedRow, setTouchedRow] = useState<TypedListenState | null>(null)
  const [startingListen, setStartingListen] = useState(false)
  const list = useRef<FlatList<Phrase>>(null)
  const composerContent = useRef<ScrollView>(null)
  const { width, height, fontScale } = useWindowDimensions()
  const layout = homeLayout(width, height, fontScale)
  const minPhraseHeight = layout.short ? 64 : 78
  const tabHeight = Math.max(44, 20 * Math.min(fontScale, 2.9) + 24)
  const controlHeight = Math.max(44, 22 * Math.min(fontScale, 2.82) + 16)
  const captionHeight = Math.max(layout.short ? 56 : 86, 24 + 70 * fontScale)
  const twoControlRows = width < 352 || fontScale >= 1.786
  const oneControlColumn = fontScale >= 2.5
  // SF Symbols grow with the words beside them, as they do in iOS's own labels.
  const symbolSize = (base: number) => Math.round(base * Math.min(fontScale, 2.6))
  const [barWidths, setBarWidths] = useState<Record<string, number>>({})
  const topBarHeight = useRef(0)
  const rowTop = useRef(0)
  const speaking = useSyncExternalStore(speech.subscribe, speech.getSnapshot)
  const listening = useSyncExternalStore(listen.subscribe, listen.getSnapshot)
  const composerOpen = composerMode !== null
  const shownListening = touchedRow ?? listening
  const rowAnnouncement = useRef<{ signature: string; pending: string | null }>({ signature: '', pending: null })
  const under18Active = listening.active && consentState.under18
  // The design's Listen mode states: the session's caption, with the under-18 note over it.
  const caption = listening.caption
  const micUnavailable = listening.active && (under18Active || listening.phase === 'unavailable')
  const paused = listening.active && !micUnavailable && listening.phase === 'paused'
  const micOn = listening.active && !micUnavailable && !paused
  const lineOpen = micOn && caption.label === listenStrings.saying
  const unavailableNote = !under18Active && caption.note === listenStrings.unavailable
  const captionLabel = under18Active
    ? consentWords.under18Note
    : unavailableNote
      ? listenStrings.unavailableLabel
      : caption.label === listenStrings.saying || caption.label === listenStrings.said
        ? caption.label
        : null
  const captionNote = under18Active || unavailableNote ? null : caption.note
  const captionText = !listening.active
    ? listenStrings.off
    : paused
      ? 'Paused'
      : caption.words || (micUnavailable ? consentWords.typedLinePrompt : listenStrings.listening)
  // "Listening" is large until the first words, since a small light goes unnoticed.
  const captionOpening = micOn && !caption.words
  const noteSymbol =
    captionNote === listenStrings.rankedOnPhone
      ? 'iphone'
      : captionNote === listenStrings.gettingModel
        ? 'arrow.down.circle'
        : 'hourglass'
  const listenControlDisabled = listening.active || !consent || startingListen
  // Listening shows while the microphone is on; Pause is #57's, so End stays beside it until then.
  const listenWord = micOn ? 'Listening' : paused ? 'Paused' : listening.active ? consentWords.micOff : 'Listen'
  const listenInk = micOn ? colors['on-listen'] : listenControlDisabled ? colors['ink-secondary'] : colors.ink

  useEffect(() => {
    const current = rowAnnouncement.current
    if (!shownListening.active) {
      current.signature = ''
      current.pending = null
      return
    }
    if (touchedRow) return
    const signature = `${shownListening.row.big ?? ''}|${shownListening.row.slots.join('|')}`
    if (signature !== current.signature) {
      current.signature = signature
      const count = shownListening.row.big ? 1 : shownListening.row.slots.filter(Boolean).length
      current.pending =
        shownListening.row.answers > 0 && count > 0 ? `${count} ${count === 1 ? 'reply' : 'replies'}` : null
    }
    if (current.pending && !speaking.speaking) {
      const timer = setTimeout(() => {
        if (current.pending) AccessibilityInfo.announceForAccessibilityWithOptions(current.pending, { queue: true })
        current.pending = null
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [shownListening, touchedRow, speaking.speaking])

  useEffect(() => {
    let alive = true
    const read = () => {
      void Promise.all([
        bank.categories(),
        bank.phrases(categoryId),
        bank.phrases('strip'),
        bank.places(),
        bank.selectedPlace()
      ]).then(([nextCategories, nextPhrases, nextStrip, nextPlaces, nextPlace]) => {
        if (!alive) return
        setCategories(nextCategories)
        if (!nextCategories.some((category) => category.id === categoryId)) setCategoryId('quick')
        setPhrases(nextPhrases)
        setStrip(nextStrip)
        setPlaces(nextPlaces)
        setSelectedPlace(nextPlace)
      })
    }
    read()
    const unsubscribe = bank.subscribe(read)
    return () => {
      alive = false
      unsubscribe()
    }
  }, [bank, categoryId])

  useEffect(() => {
    if (composerMode !== 'speak') return
    let alive = true
    const read = () => {
      void bank.typeMatches(draft, selectedPlace?.id).then((next) => {
        if (alive) setTypeMatches(next)
      })
    }
    read()
    const unsubscribe = bank.subscribe(read)
    return () => {
      alive = false
      unsubscribe()
    }
  }, [bank, composerMode, draft, selectedPlace?.id])

  // With the keyboard up, the row comes first: its first slots, where matches land, stay in view.
  const scrollToRow = () =>
    composerContent.current?.scrollTo({ y: Math.max(0, topBarHeight.current + rowTop.current - 8), animated: false })

  const closeComposer = () => {
    Keyboard.dismiss()
    setComposerMode(null)
    setDraft('')
    setTypeMatches([])
  }

  const speakDraft = async () => {
    const text = draft.trim()
    if (!text) return
    let phrase: Phrase | null = null
    try {
      phrase = await bank.saveTypedPhrase(text)
    } catch {
      // Speech still works when the local bank cannot save the sentence.
    }
    await speech.speak(text, phrase?.id)
  }

  const sendPartnerLine = () => {
    const line = draft.trim()
    if (!line) return
    closeComposer()
    void listen.send(line, selectedPlace?.id ?? '')
  }

  const chooseCategory = (id: string) => {
    setCategoryId(id)
    setOffset(layout.wholeMiddleScroll ? headerHeight : 0)
    list.current?.scrollToOffset({ offset: layout.wholeMiddleScroll ? headerHeight : 0, animated: false })
  }

  const choosePlace = () => {
    if (!places.length) {
      router.push('/settings/places')
      return
    }
    ActionSheetIOS.showActionSheetWithOptions(
      { options: [...places.map((place) => place.name), 'Cancel'], cancelButtonIndex: places.length },
      (index) => {
        if (index < places.length) void bank.choosePlace(places[index].id)
      }
    )
  }

  const page = (direction: -1 | 1) => {
    list.current?.scrollToOffset({
      offset: pageOffset(offset, viewportHeight, contentHeight, direction),
      animated: false
    })
  }

  const renderPhrase = ({ item }: { item: Phrase }) => {
    const tokens = phraseColorTokensForId(item.id)
    return (
      <View style={{ flex: 1, maxWidth: layout.gridColumns === 2 ? (width - 44) / 2 : undefined }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={item.text}
          accessibilityActions={[
            { name: 'edit', label: 'Edit' },
            { name: 'move', label: 'Move' }
          ]}
          onAccessibilityAction={(event) => {
            if (event.nativeEvent.actionName === 'edit' || event.nativeEvent.actionName === 'move') {
              router.push({
                pathname: '/bank/[category]',
                params: { category: item.category_id, editPhraseId: item.id }
              })
            }
          }}
          onPress={() => {
            void speech.speak(item.text, item.id)
          }}
          style={({ pressed }) => ({
            flex: 1,
            minHeight: minPhraseHeight,
            borderWidth: tokens ? 3 : 2,
            borderColor: tokens ? colors[tokens.edge] : colors.edge,
            borderRadius: 12,
            padding: 12,
            backgroundColor: pressed ? colors['surface-pressed'] : tokens ? colors[tokens.fill] : colors.surface,
            justifyContent: 'center'
          })}
        >
          <TurnText
            kind={layout.short ? 'headline' : 'title3-emphasized'}
            boldText={boldText}
            style={{ color: colors.ink, paddingRight: 24 }}
          >
            {item.text}
          </TurnText>
          {speaking.activePhraseId === item.id && (
            <SymbolView
              name="speaker.wave.2"
              size={18}
              tintColor={colors.ink}
              accessible={false}
              style={{ position: 'absolute', top: 12, right: 12 }}
            />
          )}
        </Pressable>
      </View>
    )
  }

  const renderStripPhrase = (phrase: Phrase, cardWidth: number) => (
    <View key={phrase.id} style={{ width: cardWidth }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={phrase.text}
        accessibilityActions={[{ name: 'edit', label: 'Edit' }]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'edit') {
            router.push({
              pathname: '/bank/[category]',
              params: { category: phrase.category_id, editPhraseId: phrase.id }
            })
          }
        }}
        onPress={() => {
          void speech.speak(phrase.text, phrase.id)
        }}
        style={({ pressed }) => ({
          flexGrow: 1,
          minHeight: 48,
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: colors.edge,
          borderRadius: 12,
          padding: phrase.id === 'somethings-wrong' && layout.stripColumns === 3 ? 4 : 8,
          backgroundColor: pressed ? colors['surface-pressed'] : colors.surface
        })}
      >
        {phrase.id === 'somethings-wrong' && (
          <SymbolView
            name="exclamationmark.triangle"
            size={symbolSize(16)}
            tintColor={colors.ink}
            accessible={false}
            style={{
              position: 'absolute',
              left: layout.stripColumns === 3 ? 4 : 8,
              top: layout.stripColumns === 3 ? 4 : 12
            }}
          />
        )}
        <TurnText
          kind="subheadline-emphasized"
          boldText={boldText}
          style={{
            color: colors.ink,
            width: cardWidth - (phrase.id === 'somethings-wrong' && layout.stripColumns === 3 ? 12 : 20),
            paddingTop: phrase.id === 'somethings-wrong' && layout.stripColumns === 3 ? symbolSize(16) + 2 : 0,
            paddingLeft: phrase.id === 'somethings-wrong' && layout.stripColumns === 1 ? symbolSize(16) + 6 : 0
          }}
        >
          {phrase.text}
        </TurnText>
      </Pressable>
    </View>
  )

  const stripContent =
    layout.stripColumns === 1 ? (
      <View style={{ gap: 8 }}>{strip.map((phrase) => renderStripPhrase(phrase, width - 32))}</View>
    ) : (
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {strip.slice(0, 3).map((phrase) => renderStripPhrase(phrase, (width - 48) / 3))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {strip[3] && renderStripPhrase(strip[3], ((width - 48) / 3) * 2 + 8)}
          {strip[4] && renderStripPhrase(strip[4], (width - 48) / 3)}
        </View>
      </View>
    )

  const middleHeader = (
    <View
      onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
      style={{ marginHorizontal: !composerOpen && layout.wholeMiddleScroll ? -16 : 0 }}
    >
      {!composerOpen && (
        <View
          style={{
            height: captionHeight,
            marginHorizontal: 16,
            marginTop: 4,
            marginBottom: 8,
            padding: 12,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.edge,
            backgroundColor: colors.surface,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Pressable
            accessibilityRole={listening.active ? 'button' : undefined}
            accessibilityLabel={[captionLabel, captionNote, captionText].filter(Boolean).join(', ')}
            accessibilityHint={listening.active ? 'Type the partner line.' : undefined}
            disabled={!listening.active}
            onPress={() => setComposerMode('partner')}
            style={{ flex: 1, minHeight: 44, justifyContent: 'center' }}
          >
            {(captionLabel || captionNote) && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {captionLabel && (
                  <TurnText
                    kind="subheadline"
                    boldText={boldText}
                    numberOfLines={1}
                    style={{ color: colors['ink-secondary'], flexShrink: 1 }}
                  >
                    {captionLabel}
                  </TurnText>
                )}
                {captionNote && (
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 1, marginLeft: 'auto' }}
                  >
                    <SymbolView
                      name={noteSymbol}
                      size={Math.round(13 * Math.min(fontScale, 2))}
                      tintColor={colors['ink-secondary']}
                      accessible={false}
                    />
                    <TurnText
                      kind="subheadline"
                      boldText={boldText}
                      numberOfLines={1}
                      style={{ color: colors['ink-secondary'], flexShrink: 1 }}
                    >
                      {captionNote}
                    </TurnText>
                  </View>
                )}
              </View>
            )}
            {!listening.active ? (
              <TurnText kind="title3" boldText={boldText} numberOfLines={2} style={{ color: colors['ink-secondary'] }}>
                {captionText}
              </TurnText>
            ) : captionOpening ? (
              <TurnText kind="title2" boldText={boldText} numberOfLines={1} style={{ color: colors.ink }}>
                {captionText}
              </TurnText>
            ) : (
              <CaptionWords text={captionText} boldText={boldText} measure={Boolean(caption.words)} />
            )}
            {listening.assetProgress !== null && (
              <View
                style={{ height: 4, marginTop: 6, borderRadius: 2, overflow: 'hidden', backgroundColor: colors.edge }}
              >
                <View
                  style={{
                    width: `${Math.round(listening.assetProgress * 100)}%`,
                    height: 4,
                    backgroundColor: colors.accent
                  }}
                />
              </View>
            )}
          </Pressable>
          {lineOpen ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Done"
              accessibilityHint="Ends the partner's line now."
              onPress={() => void listen.endLine()}
              style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
            >
              <TurnText kind="subheadline-emphasized" boldText={boldText} style={{ color: colors.ink }}>
                Done
              </TurnText>
            </Pressable>
          ) : (
            listening.active &&
            listening.row.answers > 0 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear"
                onPress={() => listen.clear()}
                style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
              >
                <TurnText kind="subheadline-emphasized" boldText={boldText} style={{ color: colors.ink }}>
                  Clear
                </TurnText>
              </Pressable>
            )
          )}
        </View>
      )}
      <View style={{ marginHorizontal: 16, marginBottom: 8 }}>{stripContent}</View>
      <View
        onLayout={(event) => {
          rowTop.current = event.nativeEvent.layout.y
        }}
        style={{ marginBottom: 4 }}
      >
        <ReplyRow
          layout={layout}
          width={width}
          boldText={boldText}
          emptyNote={
            composerMode === 'speak'
              ? 'Matching phrases appear here.'
              : consentState.under18
                ? consentWords.under18RowNote
                : undefined
          }
          slots={
            composerMode === 'speak'
              ? typeMatches
              : listening.active
                ? shownListening.slots
                : __DEV__ && replyPreview === 1
                  ? [
                      { id: 'yes', text: 'Yes' },
                      { id: 'no', text: 'No' },
                      { id: 'not-sure', text: 'Not sure' },
                      { id: 'dont-know', text: "I don't know" },
                      { id: 'please-wait', text: 'Please wait' },
                      { id: 'help-me', text: 'Help me' }
                    ]
                  : undefined
          }
          bigButton={
            composerMode !== 'speak' && listening.active
              ? shownListening.bigButton
              : !composerOpen && __DEV__ && replyPreview === 2
                ? { id: 'have-something-to-say', text: 'I have something to say' }
                : null
          }
          activePhraseId={speaking.activePhraseId}
          onInteractionChange={(pressed) => setTouchedRow(pressed ? listening : null)}
          onSpeak={(reply) => {
            void speech.speak(reply.text, reply.id)
          }}
        />
      </View>
      {!composerOpen && (
        <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: tabHeight + 8 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            style={{ flexGrow: 1, height: tabHeight + 8 }}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 12, paddingVertical: 4, gap: 8 }}
          >
            {categories.map((category) => {
              const selected = categoryId === category.id
              return (
                <Pressable
                  key={category.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => chooseCategory(category.id)}
                  style={{
                    minHeight: tabHeight,
                    minWidth: 44,
                    justifyContent: 'center',
                    paddingHorizontal: 16,
                    borderRadius: 22,
                    borderWidth: selected ? 0 : 2,
                    borderColor: colors.edge,
                    backgroundColor: selected ? colors.ink : colors.surface
                  }}
                >
                  <TurnText
                    kind="subheadline-emphasized"
                    boldText={boldText}
                    style={{ color: selected ? colors.surface : colors.ink }}
                  >
                    {category.name}
                  </TurnText>
                </Pressable>
              )
            })}
          </ScrollView>
          <View
            style={{
              width: StyleSheet.hairlineWidth,
              alignSelf: 'stretch',
              marginVertical: 10,
              backgroundColor: colors.edge
            }}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: categoryId === 'all' }}
            onPress={() => chooseCategory('all')}
            style={{
              minHeight: tabHeight,
              minWidth: 44,
              justifyContent: 'center',
              paddingHorizontal: 16,
              marginLeft: 12,
              marginRight: 16,
              borderRadius: 22,
              borderWidth: categoryId === 'all' ? 0 : 2,
              borderColor: colors.edge,
              backgroundColor: categoryId === 'all' ? colors.ink : colors.surface
            }}
          >
            <TurnText
              kind="subheadline-emphasized"
              boldText={boldText}
              style={{ color: categoryId === 'all' ? colors.surface : colors.ink }}
            >
              All
            </TurnText>
          </Pressable>
        </View>
      )}
    </View>
  )

  const bottomControls = [
    { label: 'Type', icon: 'keyboard', action: () => setComposerMode('speak'), disabled: false },
    {
      label: speaking.speaking ? 'Stop' : 'Repeat',
      icon: speaking.speaking ? 'stop.fill' : 'arrow.counterclockwise',
      action: () => {
        void (speaking.speaking ? speech.stop() : speech.repeat())
      },
      disabled: !speaking.speaking && !speaking.lastText
    },
    { label: 'Up', icon: 'chevron.up', action: () => page(-1), disabled: offset <= 0 },
    { label: 'Down', icon: 'chevron.down', action: () => page(1), disabled: offset >= contentHeight - viewportHeight }
  ] as const

  // The bar's four buttons share one row when their words fit, then two rows, then one column (DESIGN, the bottom bar).
  // Measured with 6-point sides, the four fit one row at the default size on a 6.1-inch iPhone, and a row shares
  // what's left, so two rows never push Yes and No under the bar there.
  const barIcon = symbolSize(18)
  const barSpace = width - 32
  const barMeasures = [
    { label: 'Type', icon: 'keyboard' },
    { label: 'Repeat', icon: 'arrow.counterclockwise' },
    { label: 'Up', icon: 'chevron.up' },
    { label: 'Down', icon: 'chevron.down' }
  ] as const
  const natural = barMeasures.map(({ label }) => barWidths[label] ?? 0)
  const barLayout: 'row' | 'grid' | 'column' = natural.some((measured) => measured === 0)
    ? oneControlColumn
      ? 'column'
      : twoControlRows
        ? 'grid'
        : 'row'
    : natural.reduce((sum, measured) => sum + measured, 0) + 8 * 3 <= barSpace
      ? 'row'
      : Math.max(...natural) <= (barSpace - 8) / 2
        ? 'grid'
        : 'column'

  const topBar = (
    <View
      onLayout={(event) => {
        topBarHeight.current = event.nativeEvent.layout.height
      }}
      style={{
        minHeight: 52,
        flexDirection: 'row',
        flexWrap: oneControlColumn ? 'wrap' : 'nowrap',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderBottomWidth: layout.wholeMiddleScroll && !composerOpen ? StyleSheet.hairlineWidth : 0,
        borderBottomColor: colors.edge
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Settings"
        onPress={() => router.push('/settings')}
        style={{
          width: 44,
          height: oneControlColumn ? controlHeight : 44,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <SymbolView
          name="gearshape"
          size={Math.round(22 * Math.min(fontScale, 1.6))}
          tintColor={colors.ink}
          accessible={false}
        />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={selectedPlace?.name ?? 'Place'}
        onPress={choosePlace}
        style={({ pressed }) => ({
          minHeight: oneControlColumn ? controlHeight : 44,
          minWidth: 44,
          flex: oneControlColumn ? undefined : 1,
          width: oneControlColumn ? width - 84 : undefined,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          borderRadius: 22,
          borderWidth: 2,
          borderColor: colors.edge,
          backgroundColor: pressed ? colors['surface-pressed'] : colors.surface
        })}
      >
        <SymbolView name="mappin.and.ellipse" size={symbolSize(18)} tintColor={colors.ink} accessible={false} />
        <TurnText kind="headline" boldText={boldText} style={{ color: colors.ink, flexShrink: 1 }}>
          {selectedPlace?.name ?? 'Place'}
        </TurnText>
      </Pressable>
      {/* In one column, End takes its own row, so neither label is cut beside the other. */}
      <View
        style={{
          flexDirection: oneControlColumn ? 'column' : 'row',
          width: oneControlColumn ? width - 32 : undefined,
          gap: oneControlColumn ? 8 : 6,
          alignItems: oneControlColumn ? 'stretch' : 'center'
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={listenWord}
          accessibilityHint={listening.active ? 'Type partner lines from the caption.' : undefined}
          accessibilityState={{ disabled: listenControlDisabled }}
          disabled={listenControlDisabled}
          onPress={() => {
            if (!consent) return
            setStartingListen(true)
            void consent
              .startListen()
              .then((route) => router.push(route === 'permission' ? '/permission' : '/consent'))
              .finally(() => setStartingListen(false))
          }}
          style={({ pressed }) => ({
            minHeight: oneControlColumn ? controlHeight : 44,
            minWidth: 44,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingHorizontal: 12,
            borderRadius: 22,
            borderWidth: 2,
            borderColor: micOn ? colors.listen : colors.edge,
            backgroundColor: micOn
              ? colors.listen
              : listening.active
                ? colors.surface
                : pressed
                  ? colors['surface-pressed']
                  : colors.surface
          })}
        >
          <SymbolView
            name={micOn ? 'mic.fill' : listening.active ? 'mic.slash' : 'ear'}
            size={symbolSize(18)}
            tintColor={listenInk}
            accessible={false}
          />
          <TurnText kind="headline" boldText={boldText} style={{ color: listenInk }}>
            {listenWord}
          </TurnText>
        </Pressable>
        {listening.active && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="End"
            accessibilityHint="Ends Listen mode."
            onPress={() => {
              closeComposer()
              listen.end()
            }}
            style={({ pressed }) => ({
              minHeight: oneControlColumn ? controlHeight : 44,
              minWidth: 52,
              paddingHorizontal: 12,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 22,
              borderWidth: 2,
              borderColor: colors.edge,
              backgroundColor: pressed ? colors['surface-pressed'] : colors.surface
            })}
          >
            <TurnText kind="headline" boldText={boldText} style={{ color: colors.ink }}>
              End
            </TurnText>
          </Pressable>
        )}
      </View>
    </View>
  )

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={composerOpen ? 'padding' : undefined}>
      <SafeAreaView
        edges={composerOpen ? ['top', 'left', 'right'] : undefined}
        style={{ flex: 1, backgroundColor: colors.board }}
      >
        {composerOpen ? (
          <ScrollView
            ref={composerContent}
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{ paddingBottom: 16 }}
            onLayout={scrollToRow}
            onContentSizeChange={scrollToRow}
          >
            {topBar}
            {middleHeader}
          </ScrollView>
        ) : (
          <>
            {topBar}
            {!layout.wholeMiddleScroll && middleHeader}
            <FlatList
              key={`${layout.gridColumns}-${layout.wholeMiddleScroll}`}
              ref={list}
              data={phrases}
              keyExtractor={(item) => item.id}
              renderItem={renderPhrase}
              numColumns={layout.gridColumns}
              columnWrapperStyle={layout.gridColumns === 2 ? { gap: 12, alignItems: 'stretch' } : undefined}
              ListHeaderComponent={layout.wholeMiddleScroll ? middleHeader : null}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: layout.wholeMiddleScroll ? 8 : 4,
                paddingBottom: 16,
                gap: 12
              }}
              onScroll={(event) => setOffset(event.nativeEvent.contentOffset.y)}
              scrollEventThrottle={100}
              onLayout={(event) => setViewportHeight(event.nativeEvent.layout.height)}
              onContentSizeChange={(_, content) => setContentHeight(content)}
              showsVerticalScrollIndicator
              ListFooterComponent={
                __DEV__ ? (
                  <View style={{ alignItems: 'center' }}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => setReplyPreview((current) => (current + 1) % 3)}
                      style={{ minHeight: 44, justifyContent: 'center', paddingVertical: 8 }}
                    >
                      <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                        Preview row: {['empty', 'six replies', 'big button'][replyPreview]}
                      </TurnText>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        void bank.seedDebugPhrases()
                      }}
                      style={{ minHeight: 44, justifyContent: 'center', paddingVertical: 8 }}
                    >
                      <TurnText kind="footnote" boldText={boldText} style={{ color: colors['ink-secondary'] }}>
                        Seed 2,000 test phrases
                      </TurnText>
                    </Pressable>
                  </View>
                ) : null
              }
            />
            <View
              style={{
                flexDirection: 'row',
                flexWrap: barLayout === 'row' ? 'nowrap' : 'wrap',
                gap: 8,
                paddingHorizontal: 16,
                paddingVertical: 4,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: colors.edge
              }}
            >
              {/* Measures each button at its natural width, so the bar picks one row, two, or four without cutting a label. */}
              <View
                pointerEvents="none"
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={{ position: 'absolute', top: 0, left: 0, width: 4000, flexDirection: 'row', opacity: 0 }}
              >
                {barMeasures.map(({ label, icon }) => (
                  <View
                    key={label}
                    onLayout={(event) => {
                      const measured = Math.ceil(event.nativeEvent.layout.width)
                      setBarWidths((current) =>
                        current[label] === measured ? current : { ...current, [label]: measured }
                      )
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      paddingHorizontal: 6,
                      borderWidth: 2
                    }}
                  >
                    <SymbolView name={icon} size={barIcon} tintColor={colors.ink} accessible={false} />
                    <TurnText kind="headline" boldText={boldText}>
                      {label}
                    </TurnText>
                  </View>
                ))}
              </View>
              {bottomControls.map(({ label, icon, action, disabled }) => (
                <Pressable
                  key={label}
                  accessibilityRole="button"
                  accessibilityLabel={label}
                  accessibilityState={{ disabled }}
                  disabled={disabled}
                  onPress={action}
                  style={({ pressed }) => ({
                    flexGrow: barLayout === 'row' ? 1 : 0,
                    width: barLayout === 'column' ? barSpace : barLayout === 'grid' ? (barSpace - 8) / 2 : undefined,
                    minHeight: controlHeight,
                    minWidth: 44,
                    paddingHorizontal: 6,
                    borderRadius: 22,
                    borderWidth: 2,
                    borderColor: colors.edge,
                    backgroundColor: disabled ? colors.surface : pressed ? colors['surface-pressed'] : colors.surface,
                    alignItems: 'center',
                    justifyContent: 'center'
                  })}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <SymbolView
                      name={icon}
                      size={barIcon}
                      tintColor={disabled ? colors['ink-secondary'] : colors.ink}
                      accessible={false}
                    />
                    <TurnText
                      kind="headline"
                      boldText={boldText}
                      style={{ color: disabled ? colors['ink-secondary'] : colors.ink }}
                    >
                      {label}
                    </TurnText>
                  </View>
                </Pressable>
              ))}
            </View>
          </>
        )}
        {composerMode === 'speak' && (
          <TypedComposer
            text={draft}
            onChangeText={setDraft}
            onSpeak={() => {
              void speakDraft()
            }}
            onStop={() => {
              void speech.stop()
            }}
            onClose={closeComposer}
            speaking={speaking.speaking}
            boldText={boldText}
            fontScale={fontScale}
          />
        )}
        {composerMode === 'partner' && (
          <PartnerLineComposer
            text={draft}
            onChangeText={setDraft}
            onSend={sendPartnerLine}
            onClose={closeComposer}
            boldText={boldText}
            fontScale={fontScale}
          />
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
