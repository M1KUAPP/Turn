import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { SymbolView } from 'expo-symbols'
import {
  AccessibilityInfo,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  View
} from 'react-native'
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { Category, Phrase, Place, createBankStore } from '../bank/store'
import CompanionFace from '../companion/CompanionFace'
import { companionState } from '../companion/state'
import { colorValues, colors } from '../constants/theme'
import { consentWords } from '../consent/strings'
import type { createLiveListenSession } from '../listen/live-session'
import type { TypedListenState } from '../listen/typed-session'
import type { createSpeechController } from '../speech/controller'
import { useCompanion, useConsent, usePurchases, useTurn } from '../turn-context'
import Caption from './Caption'
import { captionView } from './caption-view'
import { categoryHue, placeSymbol } from './category-style'
import CategoryTabs from './CategoryTabs'
import EdgeFade from './EdgeFade'
import { useDepth } from './home-depth'
import { homeLayout, modelSecondsLeft, pageOffset, replyStat, selectedTab, starterCardShown } from './home-layout'
import { homePreview } from './home-preview'
import { Layer, usePress } from './home-press'
import { listenControl } from './listen-control'
import ListenButton from './ListenButton'
import PartnerLineComposer from './PartnerLineComposer'
import PhraseCard from './PhraseCard'
import PlaceMenu from './PlaceMenu'
import ReplyRow, { type Reply } from './ReplyRow'
import Toolbar from './Toolbar'
import TurnText from './TurnText'
import TypedComposer from './TypedComposer'

type Props = {
  bank: ReturnType<typeof createBankStore>
  speech: ReturnType<typeof createSpeechController>
  listen: ReturnType<typeof createLiveListenSession>
  boldText: boolean
  reduceMotion: boolean
  increaseContrast: boolean
  reduceTransparency: boolean
}

/** The lamp's glow (DESIGN, elevation): while the microphone is on, a radial `listen-glow` at 30%, 560 by 420 points
 * near the Listen control, washes the top of the board behind everything, fading in over 400 ms, or at once under
 * Reduce Motion. */
function BoardGlow({ on, width, reduceMotion }: { on: boolean; width: number; reduceMotion: boolean }) {
  const glow = colorValues['listen-glow'][useColorScheme() === 'dark' ? 'dark' : 'light']
  const opacity = useSharedValue(on ? 1 : 0)
  useEffect(() => {
    opacity.value = reduceMotion
      ? on
        ? 1
        : 0
      : withTiming(on ? 1 : 0, { duration: 400, reduceMotion: ReduceMotion.Never })
  }, [on, reduceMotion, opacity])
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }))
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 260,
          experimental_backgroundImage: `radial-gradient(280px 210px at ${width - 102}px 40px, ${glow}4D 0%, ${glow}00 100%)`
        },
        style
      ]}
    />
  )
}

/** A strip phrase (DESIGN, the strip): a `surface` chip on an `edge`, or `no-fill` on `no-edge` when urgent, pressed on
 * `surface-pressed` with a 2.5 edge that fades back over 120 ms. */
function StripChip({
  phrase,
  width,
  boldText,
  onEdit,
  onSpeak
}: {
  phrase: Phrase
  width: number
  boldText: boolean
  onEdit: () => void
  onSpeak: () => void
}) {
  const depth = useDepth()
  const press = usePress()
  const urgent = phrase.id === 'somethings-wrong'
  const edge = urgent ? colors['no-edge'] : colors.edge
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={phrase.text}
      accessibilityActions={[{ name: 'edit', label: 'Edit' }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'edit') onEdit()
      }}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      onPress={onSpeak}
      style={{
        width,
        minHeight: 48,
        justifyContent: 'center',
        paddingHorizontal: 12.5,
        paddingVertical: 7.5,
        borderRadius: 14,
        boxShadow: depth.card
      }}
    >
      <Layer fill={urgent ? colors['no-fill'] : colors.surface} edge={edge} edgeWidth={1.5} radius={14} />
      <Layer fill={colors['surface-pressed']} edge={edge} edgeWidth={2.5} radius={14} style={press.style} />
      <TurnText kind="phrase-strip" boldText={boldText} style={{ color: colors.ink, width: width - 25 }}>
        {phrase.text}
      </TurnText>
    </Pressable>
  )
}

export default function HomeScreen({
  bank,
  speech,
  listen,
  boldText,
  reduceMotion,
  increaseContrast,
  reduceTransparency
}: Props) {
  const router = useRouter()
  const settingsPress = usePress()
  const placePress = usePress()
  const { consent, state: consentState } = useConsent()
  const { purchases, state: purchasesLive } = usePurchases()
  const { state: companion } = useCompanion()
  const { ready } = useTurn()
  const params = useLocalSearchParams<{ preview?: string }>()
  const [categories, setCategories] = useState<Category[]>([])
  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [phraseCategories, setPhraseCategories] = useState<Map<string, string>>(new Map())
  const [strip, setStrip] = useState<Phrase[]>([])
  const [places, setPlaces] = useState<Place[]>([])
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [placeMenu, setPlaceMenu] = useState<{ x: number; y: number; height: number } | null>(null)
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
  const [review, setReview] = useState({ pending: false, dismissed: false })
  const list = useRef<FlatList<Phrase>>(null)
  const composerContent = useRef<ScrollView>(null)
  const placeChip = useRef<View>(null)
  const { width, height, fontScale } = useWindowDimensions()
  const layout = homeLayout(width, height, fontScale)
  const minPhraseHeight = layout.short ? 64 : 78
  const tabHeight = Math.max(44, 20 * Math.min(fontScale, 2.9) + 24)
  const controlHeight = Math.max(44, 22 * Math.min(fontScale, 2.82) + 16)
  // From AX1 the column scrolls, so the caption grows to fit its label, note, and prompt rather than cutting them;
  // only the partner's words keep their lines (DESIGN, A11Y-4).
  const captionGrows = fontScale >= 1.786
  const oneControlColumn = fontScale >= 2.5
  // SF Symbols grow with the words beside them, as they do in iOS's own labels.
  const symbolSize = (base: number) => Math.round(base * Math.min(fontScale, 2.6))
  const topBarHeight = useRef(0)
  const rowTop = useRef(0)
  const modelStart = useRef<{ at: number; progress: number } | null>(null)
  const wasSpeaking = useRef(false)
  const speakingLive = useSyncExternalStore(speech.subscribe, speech.getSnapshot)
  const listeningLive = useSyncExternalStore(listen.subscribe, listen.getSnapshot)
  // Dev bundles show the design's states on request (home-preview.ts); release builds never do.
  const preview = __DEV__ ? homePreview(params.preview, listeningLive) : null
  const listening = preview?.listening ?? listeningLive
  const purchasesState = preview?.purchases ? { ...purchasesLive, ...preview.purchases } : purchasesLive
  const under18 = preview?.under18 ?? consentState.under18
  const speaking = preview?.speakingId
    ? { speaking: true, lastText: 'It was hard', activePhraseId: preview.speakingId }
    : speakingLive
  const composerOpen = composerMode !== null
  const shownListening = touchedRow ?? listening
  const rowAnnouncement = useRef<{ signature: string; pending: string | null }>({ signature: '', pending: null })
  const caption = listening.caption
  const view = captionView({
    active: listening.active,
    phase: listening.phase,
    caption,
    assetProgress: listening.assetProgress,
    under18,
    purchaseNote: purchasesState.note,
    rowAnswers: listening.row.answers
  })
  const micUnavailable = listening.active && (under18 || listening.phase === 'unavailable')
  const control = listenControl({
    active: listening.active,
    micUnavailable,
    paused: listening.active && !micUnavailable && listening.phase === 'paused',
    locked: purchasesState.locked,
    countLabel: purchasesState.countLabel
  })
  const listenControlDisabled =
    control.action === null ||
    (control.action === 'start' && (!consent || startingListen)) ||
    (control.action === 'unlock' && (!purchases || purchasesState.busy || startingListen))
  const model =
    listening.assetProgress === null
      ? null
      : {
          progress: listening.assetProgress,
          secondsLeft: modelStart.current
            ? modelSecondsLeft(modelStart.current, { at: Date.now(), progress: listening.assetProgress })
            : null
        }
  const categoryIds = categories.map((category) => category.id)
  const paletteFor = (id: string) => categoryHue(id, categoryIds)
  // The companion's face, once one is chosen in Settings, except at a place where it's hidden (frames 02 to 16, 22).
  const faceModel = selectedPlace?.show_companion === 0 ? null : companion.model
  const face = (typing: boolean) =>
    faceModel ? (
      <CompanionFace
        model={faceModel}
        state={companionState({ speaking: speaking.speaking, typing, listening: view.lineOpen })}
        animate={companion.moves && !reduceMotion}
        reduceTransparency={reduceTransparency}
        onPress={() => {
          Keyboard.dismiss()
          router.push('/partner')
        }}
      />
    ) : null

  useEffect(() => {
    if (listening.assetProgress === null) modelStart.current = null
    else modelStart.current ??= { at: Date.now(), progress: listening.assetProgress }
  }, [listening.assetProgress])

  // One selection tap as speech starts (DESIGN, sound and haptics); iOS mutes it while the microphone records, so
  // nothing depends on it.
  useEffect(() => {
    if (speaking.speaking && !wasSpeaking.current) void Haptics.selectionAsync().catch(() => {})
    wasSpeaking.current = speaking.speaking
  }, [speaking.speaking])

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
        bank.selectedPlace(),
        bank.starterReviewState(),
        bank.phrases('all')
      ]).then(([nextCategories, nextPhrases, nextStrip, nextPlaces, nextPlace, nextReview, allPhrases]) => {
        if (!alive) return
        setCategories(nextCategories)
        setCategoryId(selectedTab(categoryId, nextCategories))
        setPhrases(nextPhrases)
        setStrip(nextStrip)
        setPlaces(nextPlaces)
        setSelectedPlace(nextPlace)
        setReview(nextReview)
        // A reply's category colors its card and names the big reply's tag.
        setPhraseCategories(new Map(allPhrases.map((phrase) => [phrase.id, phrase.category_id])))
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

  const recordReply = (tapped: 'row' | 'grid') => {
    const event = replyStat(tapped, {
      listening: listening.active,
      composerMatching: composerMode === 'speak',
      newest: listening.row.seq,
      answered: shownListening.row.answers
    })
    if (event) ready?.stats.record(event)
  }

  const speakDraft = async () => {
    const text = draft.trim()
    if (!text) return
    recordReply('grid')
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
    placeChip.current?.measureInWindow((x, y, _, chipHeight) => setPlaceMenu({ x, y, height: chipHeight }))
  }

  const page = (direction: -1 | 1) => {
    list.current?.scrollToOffset({
      offset: pageOffset(offset, viewportHeight, contentHeight, direction),
      animated: false
    })
  }

  const startReview = () => {
    void bank.nextReviewCategoryId().then((next) => {
      if (next) router.push({ pathname: '/bank/[category]', params: { category: next } })
    })
  }
  const dismissReview = () => {
    void bank.dismissStarterReview()
  }

  const withCategory = (reply: { id: string; text: string } | null): Reply | null =>
    reply ? { id: reply.id, text: reply.text, categoryId: phraseCategories.get(reply.id) } : null
  const rowSlots = useMemo(
    () =>
      composerMode === 'speak'
        ? typeMatches.map((phrase) => ({ id: phrase.id, text: phrase.text, categoryId: phrase.category_id }))
        : listening.active
          ? shownListening.slots.map(withCategory)
          : __DEV__ && replyPreview === 1
            ? ['yes', 'no', 'not-sure', 'i-dont-know', 'please-wait', 'im-thirsty'].map((id, index) =>
                withCategory({
                  id,
                  text: ['Yes', 'No', 'Not sure', "I don't know", 'Please wait', "I'm thirsty"][index]
                })
              )
            : undefined,
    // withCategory reads phraseCategories, listed here.
    [composerMode, typeMatches, listening.active, shownListening.slots, replyPreview, phraseCategories]
  )
  const rowBig =
    composerMode !== 'speak' && listening.active
      ? withCategory(shownListening.bigButton)
      : !composerOpen && __DEV__ && replyPreview === 2
        ? withCategory({ id: 'i-have-something-to-say', text: 'I have something to say' })
        : null

  const renderPhrase = ({ item }: { item: Phrase }) => (
    <View style={{ flex: 1, maxWidth: layout.gridColumns === 2 ? (width - 44) / 2 : undefined }}>
      <PhraseCard
        id={item.id}
        text={item.text}
        palette={paletteFor(item.category_id)}
        speaking={speaking.activePhraseId === item.id}
        kind={layout.short ? 'button' : 'phrase'}
        short={layout.short}
        boldText={boldText}
        fontScale={fontScale}
        reduceMotion={reduceMotion}
        minHeight={minPhraseHeight}
        grow
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
          recordReply('grid')
          void speech.speak(item.text, item.id)
        }}
      />
    </View>
  )

  const renderStripPhrase = (phrase: Phrase, cardWidth: number) => (
    <StripChip
      key={phrase.id}
      phrase={phrase}
      width={cardWidth}
      boldText={boldText}
      onEdit={() =>
        router.push({ pathname: '/bank/[category]', params: { category: phrase.category_id, editPhraseId: phrase.id } })
      }
      onSpeak={() => {
        void speech.speak(phrase.text, phrase.id)
      }}
    />
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
        <View style={{ marginTop: layout.oneLineCaption ? 0 : 8, marginBottom: 8 }}>
          <Caption
            view={view}
            height={layout.captionHeight}
            grows={captionGrows}
            oneLine={layout.oneLineCaption}
            fontScale={fontScale}
            boldText={boldText}
            reduceMotion={reduceMotion}
            increaseContrast={increaseContrast}
            level={listening.inputLevel}
            model={model}
            onType={listening.active ? () => setComposerMode('partner') : null}
            onDone={() => void listen.endLine()}
            onClear={() => listen.clear()}
          />
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
          fontScale={fontScale}
          boldText={boldText}
          reduceMotion={reduceMotion}
          increaseContrast={increaseContrast}
          categories={categories}
          tinted={composerMode !== 'speak'}
          starterCard={
            starterCardShown({
              listening: listening.active,
              composerOpen: composerMode === 'speak',
              under18,
              reviewPending: review.pending,
              reviewDismissed: review.dismissed
            })
              ? { onReview: startReview, onDismiss: dismissReview }
              : null
          }
          emptyNote={
            composerMode === 'speak'
              ? 'Matching phrases appear here.'
              : under18
                ? consentWords.under18RowNote
                : undefined
          }
          slots={rowSlots}
          bigButton={rowBig}
          activePhraseId={speaking.activePhraseId}
          onInteractionChange={(pressed) => setTouchedRow(pressed ? listening : null)}
          onSpeak={(reply) => {
            recordReply('row')
            void speech.speak(reply.text, reply.id)
          }}
        />
      </View>
      {!composerOpen && (
        <CategoryTabs
          categories={categories}
          selectedId={categoryId}
          suggestedId={listening.active ? listening.row.tab : null}
          paletteFor={paletteFor}
          tabHeight={tabHeight}
          tabMargin={layout.tabMargin}
          fontScale={fontScale}
          boldText={boldText}
          increaseContrast={increaseContrast}
          onChoose={chooseCategory}
        />
      )}
    </View>
  )

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
        borderBottomColor: colors.hairline
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Settings"
        onPressIn={settingsPress.onPressIn}
        onPressOut={settingsPress.onPressOut}
        onPress={() => router.push('/settings')}
        style={{
          width: 44,
          height: oneControlColumn ? controlHeight : 44,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 22
        }}
      >
        <Layer fill={colors.surface} edge={colors.edge} edgeWidth={1.5} radius={22} />
        <Layer
          fill={colors['surface-pressed']}
          edge={colors.edge}
          edgeWidth={2.5}
          radius={22}
          style={settingsPress.style}
        />
        <SymbolView
          name="gearshape.fill"
          size={Math.round(20 * Math.min(fontScale, 1.6))}
          weight="semibold"
          tintColor={colors.ink}
          accessible={false}
        />
      </Pressable>
      <Pressable
        ref={placeChip}
        accessibilityRole="button"
        accessibilityLabel={selectedPlace?.name ?? 'Place'}
        onPressIn={placePress.onPressIn}
        onPressOut={placePress.onPressOut}
        onPress={choosePlace}
        style={{
          flexShrink: 1,
          width: oneControlColumn ? width - 84 : undefined,
          minHeight: oneControlColumn ? controlHeight : 44,
          minWidth: 44,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          paddingHorizontal: 13.5,
          borderRadius: 999
        }}
      >
        <Layer fill={colors.surface} edge={colors.edge} edgeWidth={1.5} radius={999} />
        <Layer
          fill={colors['surface-pressed']}
          edge={colors.edge}
          edgeWidth={2.5}
          radius={999}
          style={placePress.style}
        />
        <SymbolView
          name={placeSymbol(selectedPlace?.id ?? '')}
          size={symbolSize(18)}
          weight="semibold"
          tintColor={colors.ink}
          accessible={false}
        />
        <TurnText kind="button" boldText={boldText} style={{ color: colors.ink, flexShrink: 1 }}>
          {selectedPlace?.name ?? 'Place'}
        </TurnText>
        <SymbolView
          name="chevron.down"
          size={symbolSize(12)}
          weight="semibold"
          tintColor={colors.ink}
          accessible={false}
        />
      </Pressable>
      {!oneControlColumn && <View style={{ flex: 1 }} />}
      {/* From AX3 the controls fill their row and share it only when both words fit, so neither label is cut. */}
      <View style={{ width: oneControlColumn ? width - 32 : undefined }}>
        <ListenButton
          control={control}
          micOn={view.micOn}
          disabled={listenControlDisabled}
          boldText={boldText}
          fontScale={fontScale}
          reduceMotion={reduceMotion}
          fill={oneControlColumn}
          height={oneControlColumn ? controlHeight : 44}
          onPress={() => {
            if (control.action === 'pause') return void listen.pause()
            if (control.action === 'resume') return void listen.resume()
            const startListen = () => {
              if (!consent) return
              purchases?.clearNote()
              setStartingListen(true)
              void consent
                .startListen()
                .then((route) => router.push(route === 'permission' ? '/permission' : '/consent'))
                .finally(() => setStartingListen(false))
            }
            // Locked opens the paywall; a purchase goes on to start Listen mode, as the tap meant (PAY-4).
            if (control.action === 'unlock') {
              return void purchases?.openPaywall('control').then((result) => {
                if (result === 'unlocked') startListen()
              })
            }
            startListen()
          }}
          onEnd={() => {
            closeComposer()
            listen.end()
          }}
        />
      </View>
    </View>
  )

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={composerOpen ? 'padding' : undefined}>
      <SafeAreaView
        edges={composerOpen ? ['top', 'left', 'right'] : undefined}
        style={{ flex: 1, backgroundColor: colors.board }}
      >
        <BoardGlow on={view.micOn} width={width} reduceMotion={reduceMotion} />
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
            {/* The grid's edges fade into the board while it scrolls on past them, so a card cut by the tabs or the
                toolbar fades out rather than stopping at a hard line. */}
            <View style={{ flex: 1 }}>
              <FlatList
                key={`${layout.gridColumns}-${layout.wholeMiddleScroll}`}
                ref={list}
                data={phrases}
                keyExtractor={(item) => item.id}
                renderItem={renderPhrase}
                numColumns={layout.gridColumns}
                columnWrapperStyle={
                  layout.gridColumns === 2 ? { gap: layout.gridGap, alignItems: 'stretch' } : undefined
                }
                ListHeaderComponent={layout.wholeMiddleScroll ? middleHeader : null}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingTop: layout.wholeMiddleScroll ? 8 : 4,
                  paddingBottom: 4,
                  gap: layout.gridGap
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
              {offset > 1 && <EdgeFade side="top" size={16} token="board" increaseContrast={increaseContrast} />}
              {offset < contentHeight - viewportHeight - 1 && (
                <EdgeFade side="bottom" size={16} token="board" increaseContrast={increaseContrast} />
              )}
            </View>
            <Toolbar
              width={width}
              fontScale={fontScale}
              boldText={boldText}
              reduceMotion={reduceMotion}
              reduceTransparency={reduceTransparency}
              speaking={speaking.speaking}
              canRepeat={Boolean(speaking.lastText)}
              canPageUp={offset > 0}
              canPageDown={offset < contentHeight - viewportHeight}
              onType={() => setComposerMode('speak')}
              onRepeat={() => void speech.repeat()}
              onStop={() => void speech.stop()}
              onPageUp={() => page(-1)}
              onPageDown={() => page(1)}
              face={face(false)}
            />
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
            replyingTo={listening.active && caption.words ? caption.words : null}
            face={faceModel ? face : undefined}
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
        <PlaceMenu
          anchor={placeMenu}
          places={places}
          selectedId={selectedPlace?.id ?? null}
          boldText={boldText}
          fontScale={fontScale}
          onChoose={(id) => {
            setPlaceMenu(null)
            void bank.choosePlace(id)
          }}
          onEdit={() => {
            setPlaceMenu(null)
            router.push('/settings/places')
          }}
          onClose={() => setPlaceMenu(null)}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}
